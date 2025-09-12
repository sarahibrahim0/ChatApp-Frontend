import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import IncomingCallModal from "./IncomingCallModal";

const VoiceCall = ({ receiverId, receiverName, incomingCall, onClose }) => {
  const [isCalling, setIsCalling] = useState(false);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const remoteAudioRef = useRef(null);
  const pendingCandidates = useRef([]);
  const { user } = useSelector((state) => state.auth);

  // Setup mic + RTCPeerConnection
  useEffect(() => {
    const setupConnection = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        peerConnection.current = new RTCPeerConnection();

        localStream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, localStream.current);
        });

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("📞 ICE sending to:", receiverId, "from:", user._id);

            socket.emit("ice-candidate", {
              to: receiverId,
              candidate: event.candidate,
              from: user._id,
            });
          }
        };

        peerConnection.current.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
          }
        };
      } catch (err) {
        console.error("Error accessing mic:", err);
      }
    };

    setupConnection();

    return () => {
      socket.off("answer-made");
      socket.off("ice-candidate");
      socket.off("end-call");

      if (peerConnection.current) peerConnection.current.close();
      if (localStream.current) {
        localStream.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [receiverId, user._id]);

  // Socket events
  useEffect(() => {
    socket.on("answer-made", async (data) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      for (const candidate of pendingCandidates.current) {
        await peerConnection.current.addIceCandidate(candidate);
      }
      pendingCandidates.current = [];
    });

    socket.on("ice-candidate", async (data) => {
      if (peerConnection.current?.remoteDescription) {
        await peerConnection.current.addIceCandidate(data.candidate);
      } else {
        pendingCandidates.current.push(data.candidate);
      }
    });

    socket.on("end-call", () => {
      endCall();
    });
  }, []);

  // Start Call
  const startCall = async () => {
    setIsCalling(true);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("call-user", {
      to: receiverId,
      offer,
      from: user._id,
      type: "voice" // أو "video", 
      ,
      name: user.username

    });
  };
  

  // Accept Call
  const acceptCall = async () => {
    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );

    for (const candidate of pendingCandidates.current) {
      await peerConnection.current.addIceCandidate(candidate);
    }
    pendingCandidates.current = [];

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("make-answer", {
      to: incomingCall.from,
      answer,
      from: user._id,
    });

    setIsCalling(true);
  };

  const rejectCall = () => {
    socket.emit("reject-call", { to: incomingCall.from });
    onClose();
  };

// ✅ End Call
const endCall = () => {
  setIsCalling(false);

  if (peerConnection.current) {
    peerConnection.current.close();
    peerConnection.current = null;
  }
  if (localStream.current) {
    localStream.current.getTracks().forEach((track) => track.stop());
    localStream.current = null;
  }

  // ابعتي للسيرفر إن الكول خلص
  socket.emit("end-call", {
    to: receiverId,
    from: user._id,
  });

  onClose();
};


  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center text-sm justify-center z-50 p-4">
      {incomingCall && !isCalling && (
        <IncomingCallModal
          caller={{ name: incomingCall.name, _id: incomingCall.from, type : "voice"}}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      <p className="text-white mb-4">🎧 Voice Call with {receiverName}</p>
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
