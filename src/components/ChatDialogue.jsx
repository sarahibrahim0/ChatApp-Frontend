import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatMessages, getSingleChat } from "../redux/apiCalls/chatApiCalls";
import { chatActions } from "../redux/slices/chatSlice";
import socket from "../utils/socket";
import { formatDistanceToNow } from "date-fns";
import EmojiPicker from "emoji-picker-react";

import {
  PaperAirplaneIcon,
  PhotoIcon,
  PaperClipIcon,
  MicrophoneIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/solid";
import ReceiverProfile from "./ReceiverProfile";
import TextareaAutosize from "react-textarea-autosize";
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import bgImg from "../assets/c15.jpg";

const ChatDialogue = () => {
  const { receiverId } = useParams();
  const dispatch = useDispatch();
  const [inputKey, setInputKey] = useState(Date.now());

  const { currentChat, currentChatMessages } = useSelector(
    (state) => state.chat
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { receiverProfile } = useSelector((state) => state.users);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // ================= 🎙️ Voice Record =================
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      let localChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          localChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "audio/webm" });
        if (blob.size > 0) {
          setAudioBlob(blob);
        } else {
          console.error("⚠️ Blob is empty!");
        }
        localChunks = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const sendRecording = async () => {
    if (!audioBlob) return alert("No audio to send!");

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      formData.append("upload_preset", "chatmedia");
      formData.append("cloud_name", "dl3mmkahl");
      formData.append("folder", "chat-app");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dl3mmkahl/video/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (data.secure_url && data.public_id) {
        const messageData = {
          receiverId,
          senderId: user._id,
          text: "",
          media: [
            {
              url: data.secure_url,
              publicId: data.public_id,
              type: "voice",
            },
          ],
        };

        socket.emit("sendMessage", messageData);
        setAudioBlob(null);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // ================= 📂 File Upload =================
  const handleFileChange = (e, inputType) => {
    const selected = e.target.files[0];
    if (!selected) return;

    let category = "file";

    if (inputType === "image") {
      category = "image";
    } else if (inputType === "fileOrAudio") {
      if (selected.type.startsWith("audio/")) category = "audio";
      else category = "file";
    }

    setFile({
      raw: selected,
      type: selected.type,
      category,
    });

    if (category === "image" || category === "audio") {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }

    setInputKey(Date.now());
  };

  useEffect(() => {
    if (receiverId) {
      dispatch(getSingleChat(user._id, receiverId));
    }
  }, [user, receiverId]);

  useEffect(() => {
    if (currentChat) dispatch(getChatMessages(currentChat._id));
  }, [user, receiverId, currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChatMessages]);

  // ================= ✉️ Send Message =================
  const sendNewMessage = async () => {
    if (!message.trim() && !file) return;

    let media = [];

    if (file) {
      const formData = new FormData();
      formData.append("file", file.raw);

      formData.append("upload_preset", "chatmedia");
      formData.append("cloud_name", "dl3mmkahl");

      let uploadUrl = "";
      if (file.type.startsWith("image/")) {
        uploadUrl = "https://api.cloudinary.com/v1_1/dl3mmkahl/image/upload";
      } else if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        uploadUrl = "https://api.cloudinary.com/v1_1/dl3mmkahl/video/upload";
      } else {
        uploadUrl = "https://api.cloudinary.com/v1_1/dl3mmkahl/raw/upload";
      }

      try {
        const res = await fetch(uploadUrl, { method: "POST", body: formData });
        const data = await res.json();

        if (data.secure_url) {
          media.push({
            url: data.secure_url,
            publicId: data.public_id,
            type: file.category,
          });
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }

    const messageData = {
      receiverId,
      senderId: user._id,
      text: message || "",
      media,
    };

    socket.emit("sendMessage", messageData);

    setMessage("");
    setFile(null);
    setPreview(null);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleReceiveMessage = (response) => {
      dispatch(chatActions.getSingleChat(response.chat));
      dispatch(chatActions.addOrUpdateChat(response.chat));
      dispatch(chatActions.addMessageToCurrentChat(response.message));
      dispatch(chatActions.updateLastMsgInChatList(response.message));
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // ================= UI =================
  if (!receiverId) {
    return (
      <div
        className="h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <h2 className="text-white text-xl font-semibold bg-black bg-opacity-30 p-4 rounded-xl">
          Select a chat to start messaging 💬
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white py-3 border-b border-gray-200">
        <ChatHeader receiver={receiverProfile} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* الرسائل */}
          <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-4 pt-4">
            {currentChatMessages.length > 0 ? (
              currentChatMessages.map((msg) => {
                const isSender =
                  msg.senderId === user._id || msg.senderId._id === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`w-full flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[60%] flex flex-col gap-1 ${
                        isSender ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`w-full text-sm px-4 py-2 rounded-2xl shadow-sm break-words ${
                          isSender
                            ? "bg-royal-purple text-white rounded-br-none"
                            : "bg-english-violet text-white rounded-bl-none"
                        }`}
                      >
                        {msg.media && msg.media.length > 0 &&
                          msg.media.map((m, index) =>
                            m.url ? (
                              <img
                                key={index}
                                src={m.url}
                                alt="sent"
                                className="w-full max-h-60 object-cover rounded-xl mb-2"
                              />
                            ) : null
                          )}
                        {msg.text && <span>{msg.text}</span>}
                      </div>
                      <p className="text-[10px] text-gray-300 whitespace-nowrap">
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center mt-10">No messages</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* الإدخال */}
          <div className="border-t border-gray-200 bg-white relative">
            <div className="mt-3 flex items-center gap-3 px-3">
              {/* زرار الصور / فايل / فويس */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <PhotoIcon className="h-5 w-5 text-royal-purple hover:text-english-violet" />
                  <input
                    key={inputKey}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "image")}
                  />
                </label>
                <label className="cursor-pointer">
                  <PaperClipIcon className="h-5 w-5 text-royal-purple hover:text-english-violet" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "fileOrAudio")}
                  />
                </label>

                <div className="flex gap-2 items-center">
                  {!recording ? (
                    <button
                      onClick={startRecording}
                      className="bg-green-500 px-3 py-1 rounded text-white text-sm"
                    >
                      🎙️ Start
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-red-500 px-3 py-1 rounded text-white text-sm"
                    >
                      ⏹️ Stop
                    </button>
                  )}

                  {audioBlob && (
                    <>
                      <audio controls src={URL.createObjectURL(audioBlob)} />
                      <button
                        onClick={sendRecording}
                        className="bg-blue-500 px-3 py-1 rounded text-white text-sm"
                      >
                        📤 Send
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Textarea */}
              <div className="flex-1 relative">
                <TextareaAutosize
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendNewMessage();
                    }
                  }}
                  minRows={1}
                  maxRows={6}
                  placeholder="Type a message"
                  className="w-full py-2 px-4 border border-gray-200 rounded-2xl focus:outline-none text-sm placeholder:text-gray-400"
                />

                {/* زرار Emoji */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-royal-purple"
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 z-50 shadow-lg">
                    <EmojiPicker
                      onEmojiClick={(emoji) =>
                        setMessage((prev) => prev + emoji.emoji)
                      }
                    />
                  </div>
                )}
              </div>

              <PaperAirplaneIcon
                onClick={sendNewMessage}
                className="text-royal-purple h-5 w-5 cursor-pointer hover:text-english-violet"
              />
            </div>

            {/* Preview للميديا */}
            {preview && (
              <div className="absolute bottom-20 left-4 bg-white border rounded-xl p-2 shadow-md flex flex-col items-center gap-2">
                {file.category === "image" && (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
                {file.category === "audio" && (
                  <audio controls className="w-40">
                    <source src={preview} type="audio/mpeg" />
                  </audio>
                )}
                {file.category === "file" && (
                  <p className="text-sm text-gray-700">📂 {file.raw.name}</p>
                )}

                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* البروفايل */}
      <div className="w-80 border-l border-gray-200 bg-white">
        <ReceiverProfile />
      </div>
    </div>
  );
};

export default ChatDialogue;
