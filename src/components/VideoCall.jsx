import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import IncomingCallModal from "./IncomingCallModal";

const VideoCall = ({ receiverId, receiverName , incomingCall, onClose }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [ready, setReady] = useState(false); // indicates peerConnection ready

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pendingCandidates = useRef([]);
  const { user } = useSelector((state) => state.auth);

  // Setup media and peer connection
  useEffect(() => {
    const setup = async () => {
      try {
        // Get local media
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        // Create peer connection
        peerConnection.current = new RTCPeerConnection();

        // Add local tracks
        localStream.current.getTracks().forEach((track) =>
          peerConnection.current.addTrack(track, localStream.current)
        );

        // ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              toUserId: receiverId,
              candidate: event.candidate,
              from: user._id,
            });
          }
        };

        // Remote video
        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        setReady(true); // peerConnection جاهز
      } catch (err) {
        console.error("Error accessing camera/mic:", err);
      }
    };

    setup();

    return () => {
      if (peerConnection.current) peerConnection.current.close();
      if (localStream.current)
        localStream.current.getTracks().forEach((track) => track.stop());

      socket.off("incoming-call");
      socket.off("answer-made");
      socket.off("ice-candidate");
      socket.off("end-call");
    };
  }, [receiverId, user._id]);

  // Socket listeners
  useEffect(() => {
 
    socket.on("answer-made", async ({ answer }) => {
      if (!peerConnection.current) return;

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      // Apply pending ICE candidates
      pendingCandidates.current.forEach(async (candidate) => {
        try {
          await peerConnection.current.addIceCandidate(candidate);
        } catch (e) {
          console.error("Error adding pending ICE candidate", e);
        }
      });
      pendingCandidates.current = [];
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        if (peerConnection.current?.remoteDescription) {
          await peerConnection.current.addIceCandidate(candidate);
        } else {
          pendingCandidates.current.push(candidate);
        }
      } catch (e) {
        console.error("Error adding ICE candidate", e);
      }
    });

    socket.on("end-call", endCall);
  }, []);

  const startCall = async () => {
    if (!peerConnection.current) {
      console.warn("Peer connection not ready yet!");
      return;
    }

    setIsCalling(true);
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket.emit("call-user", {
      to: receiverId,
      offer,
      from: user._id,
        type:"video",
        name: user.username

    });
  };

  const acceptCall = async () => {
    if (!incomingCall || !peerConnection.current) return;

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );

    pendingCandidates.current.forEach(async (candidate) => {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (e) {
        console.error("Error adding pending ICE candidate", e);
      }
    });
    pendingCandidates.current = [];

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket.emit("make-answer", {
      to: incomingCall.from,
      answer,
      from: user._id,
    });

    onClose();
    setIsCalling(true);
  };

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("reject-call", { to: incomingCall.from });
      onClose();
    }
  };

  const endCall = () => {
    setIsCalling(false);
    if (peerConnection.current) peerConnection.current.close();
    if (localStream.current)
      localStream.current.getTracks().forEach((track) => track.stop());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
{incomingCall && (
  <IncomingCallModal
    caller={{ name: incomingCall.name, _id: incomingCall.from , type : "video" }}
    onAccept={acceptCall}
    onReject={rejectCall}
  />
)}


      <p className="text-white mb-4">📹 Video Call with {receiverName}</p>

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
            disabled={!ready}
            className={`px-4 py-2 rounded-lg ${
              ready ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300"
            }`}
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
