import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

const VoiceCall = ({ currentUserId, receiverId, onClose }) => {
  const [isCalling, setIsCalling] = useState(false);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudioRef = useRef(null);

  useEffect(() => {

    
    const setupMedia = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        peerConnection.current = new RTCPeerConnection();

        // Add local tracks to peer connection
        localStream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, localStream.current);
        });

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: receiverId,
              candidate: event.candidate,
            });
          }
        };

        // Handle remote stream
        peerConnection.current.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
          }
        };
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    setupMedia();

    return () => {
      // cleanup listeners
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [receiverId]);

  useEffect(() => {
    socket.on("call-made", async (data) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("make-answer", { to: data.from, answer });
      setIsCalling(true);
    });

    socket.on("answer-made", async (data) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    });

    socket.on("ice-candidate", async (data) => {
      try {
        await peerConnection.current.addIceCandidate(data.candidate);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    });
  }, []);

  const startCall = async () => {
    setIsCalling(true);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("call-user", { to: receiverId, offer, from: currentUserId });
  };

  const endCall = () => {
    setIsCalling(false);
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
      <p className="text-white mb-4">🎧 Voice Call with {receiverId}</p>
      <audio ref={remoteAudioRef} autoPlay />

      <div className="mt-6 flex gap-4">
        {!isCalling ? (
          <button
            onClick={startCall}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            📞 Start Voice Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            ❌ End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceCall;
