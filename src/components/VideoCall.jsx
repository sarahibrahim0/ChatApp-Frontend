import { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import IncomingCallModal from "./IncomingCallModal";

const VideoCall = ({ receiverId, receiverName, incomingCall, onClose }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [ready, setReady] = useState(false);

  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pendingCandidates = useRef([]);
  const { user } = useSelector((state) => state.auth);

  // setup media + peer connection
  useEffect(() => {
    const setup = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current;
        }

        peerConnection.current = new RTCPeerConnection();

        localStream.current.getTracks().forEach((track) =>
          peerConnection.current.addTrack(track, localStream.current)
        );

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
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        setReady(true);
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

  // socket listeners
  useEffect(() => {
    socket.on("answer-made", async ({ answer }) => {
      if (!peerConnection.current) return;

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

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
      console.log(candidate + 'candid')
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
      type: "video",
      name: user.username,
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {incomingCall && (
        <IncomingCallModal
          caller={{ name: incomingCall.name, _id: incomingCall.from, type: "video" }}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Call Box */}
      <div className="rounded-xl shadow-xl p-4 w-72 sm:w-96 flex flex-col items-center text-sm">
        <p className="text-white mb-2 text-sm text-center">📹 {receiverName}</p>

        {/* Videos */}
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-24 h-20 sm:w-32 sm:h-24 bg-black rounded-md"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-40 h-32 sm:w-64 sm:h-48 bg-black rounded-md"
          />
        </div>

        {/* Controls */}
        <div className="mt-3 flex gap-2">
          {!isCalling ? (
            <button
              onClick={startCall}
              disabled={!ready}
              className={`px-3 py-1 rounded-lg text-xs sm:text-sm ${
                ready ? "bg-green-500 text-white" : "bg-gray-500 text-gray-300"
              }`}
            >
              🎥 Start
            </button>
          ) : (
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm"
            >
              ❌ End
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
