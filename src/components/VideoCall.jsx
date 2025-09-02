import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

const VideoCall = ({ currentUserId, receiverId, onClose }) => {
  const [isCalling, setIsCalling] = useState(false);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      try {
        // get mic + cam
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        // create peer connection
        peerConnection.current = new RTCPeerConnection();

        // add tracks immediately
        localStream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, localStream.current);
        });

        // ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: receiverId,
              candidate: event.candidate,
            });
          }
        };

        // remote stream
        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // socket listeners
        socket.on("call-made", async (data) => {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.emit("make-answer", { to: data.from, answer });
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
            console.error("Error adding received ICE candidate", e);
          }
        });
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    };

    setup();

    return () => {
      // cleanup
      socket.off("call-made");
      socket.off("answer-made");
      socket.off("ice-candidate");

      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }

      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [receiverId]);

  const startCall = async () => {
    setIsCalling(true);
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("call-user", { to: receiverId, offer });
  };

  const endCall = () => {
    setIsCalling(false);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-48 h-36 bg-gray-900 rounded-lg"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-96 h-72 bg-gray-900 rounded-lg"
        />
      </div>
      <div className="mt-6 flex gap-4">
        {!isCalling ? (
          <button
            onClick={startCall}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            🎥 Start Video Call
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

export default VideoCall;
