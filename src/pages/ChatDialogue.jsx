import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatMessages, getSingleChat, deleteSingleMessage } from "../redux/apiCalls/chatApiCalls";
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
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ReceiverProfile from "./ReceiverProfile";
import TextareaAutosize from "react-textarea-autosize";
import { useParams } from "react-router-dom";
import ChatHeader from "../components/ChatHeader";
import bgImg from "../assets/c15.jpg";

const ChatDialogue = ({ onEdit }) => {
  const { receiverId } = useParams();
  const dispatch = useDispatch();
  const [inputKey, setInputKey] = useState(Date.now());
  const { currentChat, currentChatMessages } = useSelector(state => state.chat);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user, token } = useSelector(state => state.auth);
  const { receiverProfile } = useSelector(state => state.users);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef();

  // 🎙️ Voice Record
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const [typingUsers, setTypingUsers] = useState([]); // array عشان ممكن يكون أكتر من يوزر بيكتب

  // 📡 Typing listeners
  useEffect(() => {
    socket.on("userTyping", ({ chatId, userId }) => {
      if (currentChat && chatId === currentChat._id && userId !== user._id) {
        setTypingUsers(prev => {
          if (!prev.includes(userId)) {
            return [...prev, userId];
          }
          return prev;
        });
      }
    });

    socket.on("userStopTyping", ({ chatId, userId }) => {
      if (currentChat && chatId === currentChat._id) {
        setTypingUsers(prev => prev.filter(id => id !== userId));
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [socket, currentChat, user._id]);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTypingRef.current && currentChat) {
      socket.emit("typing", { chatId: currentChat._id, userId: user._id });
      isTypingRef.current = true;
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (currentChat) {
        socket.emit("stopTyping", { chatId: currentChat._id, userId: user._id });
      }
      isTypingRef.current = false;
    }, 2000);
  };

  // 🎙️ Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let localChunks = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) localChunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "audio/webm" });
        if (blob.size > 0) setAudioBlob(blob);
        localChunks = [];
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) { console.error("Mic error:", err); }
  };

  const stopRecording = () => {
    if (mediaRecorder) { mediaRecorder.stop(); setRecording(false); }
  };

  const sendRecording = async () => {
    if (!audioBlob) return;
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "voice.webm");
      formData.append("upload_preset", "chatmedia");
      formData.append("cloud_name", "dl3mmkahl");
      const res = await fetch("https://api.cloudinary.com/v1_1/dl3mmkahl/video/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        const messageData = {
          receiverId,
          senderId: user._id,
          text: "",
          media: [{ url: data.secure_url, publicId: data.public_id, type: "voice" }],
        };
        socket.emit("sendMessage", messageData);
        setAudioBlob(null);
      }
    } catch (err) { console.error("Upload error:", err); }
  };

  // 📂 File Upload
  const handleFileChange = (e, inputType) => {
    const selected = e.target.files[0];
    if (!selected) return;
    let category = "file";
    if (inputType === "image") category = "image";
    else if (inputType === "fileOrAudio") category = selected.type.startsWith("audio/") ? "audio" : "file";
    setFile({ raw: selected, type: selected.type, category });
    if (category === "image" || category === "audio") setPreview(URL.createObjectURL(selected));
    else if (category === "file" && selected.type === "application/pdf") setPreview(URL.createObjectURL(selected));
    else setPreview(null);
    setInputKey(Date.now());
  };

  const onDeleteMessage = (msgId) => {
    if (!token || !currentChat) return;
    dispatch(chatActions.deleteMessageOptimistic({ chatId: currentChat._id, msgId }));
    dispatch(deleteSingleMessage(msgId, currentChat._id, token));
  };

  // 🎯 listener للطرف التاني
  useEffect(() => {
    const handleDeleteMessage = ({ chatId, msgId, lastMsg }) => {
      if (currentChat && currentChat._id === chatId) {
        dispatch(chatActions.deleteMessageOptimistic({ chatId, msgId }));
        dispatch(chatActions.updateLastMsgInChatList({ ...lastMsg, chatId }));
      }
    };
    socket.on("deleteMessage", handleDeleteMessage);
    return () => socket.off("deleteMessage", handleDeleteMessage);
  }, [currentChat, dispatch]);

  const sendNewMessage = async () => {
    if (!message.trim() && !file) return;
    if (receiverProfile?.isDeleted) return;

    let media = [];
    if (file) {
      const formData = new FormData();
      formData.append("file", file.raw);
      formData.append("upload_preset", "chatmedia");
      formData.append("cloud_name", "dl3mmkahl");
      let uploadUrl = file.type.startsWith("image/") ? "https://api.cloudinary.com/v1_1/dl3mmkahl/image/upload"
        : file.type.startsWith("audio/") || file.type.startsWith("video/") ? "https://api.cloudinary.com/v1_1/dl3mmkahl/video/upload"
        : "https://api.cloudinary.com/v1_1/dl3mmkahl/raw/upload";
      try {
        const res = await fetch(uploadUrl, { method: "POST", body: formData });
        const data = await res.json();
        if (data.secure_url) media.push({ url: data.secure_url, publicId: data.public_id, type: file.category });
      } catch (err) { console.error("Error uploading file:", err); }
    }

    const messageData = { receiverId, senderId: user._id, text: message || "", media };
    socket.emit("sendMessage", messageData);

    socket.emit("stopTyping", { chatId: currentChat._id, userId: user._id });
    isTypingRef.current = false;
    clearTimeout(typingTimeoutRef.current);

    setMessage("");
    setFile(null);
    setPreview(null);
    setShowEmojiPicker(false);
  };

  // ⚡ Socket listener
  useEffect(() => {
    if (receiverId) dispatch(getSingleChat(user._id, receiverId));
  }, [user, receiverId]);

  useEffect(() => {
    if (currentChat) {
      dispatch(getChatMessages(currentChat._id));
      socket.emit("joinChat", currentChat._id);
    }
  }, [currentChat]);

  useEffect(() => {
    requestAnimationFrame(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); });
  }, [currentChatMessages]);

  useEffect(() => {
    const handleReceiveMessage = (response) => {
      dispatch(chatActions.getSingleChat(response.chat));
      dispatch(chatActions.addOrUpdateChat(response.chat));
      dispatch(chatActions.addMessageToCurrentChat(response.message));
      dispatch(chatActions.updateLastMsgInChatList(response.message));
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, []);



  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden ">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-licorice
        py-3 border-b border-gray-200 lg:border-b-0 lg:border-r lg:border-gray-200">
        <ChatHeader receiver={receiverProfile} />

        <div className="flex-1 flex flex-col overflow-hidden px-3">
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 py-4">
            {currentChatMessages.length > 0 ? (
              currentChatMessages.map(msg => {
                const isSender = msg.senderId === user._id || msg.senderId._id === user._id;
                return (
                  <div key={msg._id} className={`w-full flex ${isSender ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start gap-2 max-w-[60%] sm:max-w-[70%] ${isSender ? "flex-row-reverse" : "flex-row"}`}>
                      <div className="flex flex-col gap-1">
                        {/* Media */}
                        {msg.media?.map((m, idx) => {
                          if (m.type === "image") return <img key={idx} src={m.url} className="w-full max-h-60 object-cover rounded-xl mb-1 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(m.url, "_blank")} />;
                          if (m.type === "voice") return <div key={idx} className="w-64 mb-1 bg-gray-100 rounded-lg p-2"><audio controls className="w-full"><source src={m.url} /></audio></div>;
                          if (m.type === "video") return <video key={idx} controls className="w-full rounded mb-1"><source src={m.url} /></video>;
                          if (m.type === "file") return m.url && m.url.endsWith(".pdf") ? <div key={idx} className="mb-1 w-64 bg-gray-100 rounded-lg p-2"><embed src={m.url} type="application/pdf" width="100%" height="120" /><p className="text-sm text-gray-700 mt-1">📄 PDF File</p></div> : <p key={idx} className="text-sm text-gray-700 cursor-pointer hover:text-royal-purple" onClick={() => window.open(m.url, "_blank")}>📂 File</p>;
                          return null;
                        })}
                        {msg.text && <div className={`w-full text-sm px-4 py-2 rounded-2xl shadow-sm break-words ${isSender ? "bg-royal-purple text-white rounded-br-none" : "bg-english-violet text-white rounded-bl-none"}`}>{msg.text}</div>}
                        <p className="text-[10px] text-gray-300 whitespace-nowrap">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</p>
                      </div>

                      {isSender && (
                        <div className="relative" ref={dropdownRef}>
                          <button onClick={() => setOpenDropdown(openDropdown === msg._id ? null : msg._id)} className="p-1 rounded-full hover:bg-gray-200 focus:outline-none">
                            <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                          </button>
                          {openDropdown === msg._id && (
                            <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 z-50">
                              <div className="py-1">
                                <button onClick={() => onDeleteMessage(msg._id)} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <TrashIcon className="h-4 w-4 mr-2 text-red-500" /> Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center mt-10">No messages</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ✍️ Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="px-2 py-1 text-xs italic text-gray-500">
              {typingUsers
                .filter(id => id !== user._id)
                .map(id =>
                  receiverProfile && receiverProfile._id === id
                    ? receiverProfile.name
                    : "Someone"
                )
                .join(", ")}{" "}
              is typing...
            </div>
          )}

          {/* 🎤 Audio Preview */}
          {audioBlob && (
            <div className="mb-2 flex items-center gap-3 p-2 bg-gray-100 rounded-lg w-full sm:w-64">
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
              <button onClick={sendRecording} className="bg-royal-purple text-white px-3 py-1 rounded text-sm hover:bg-english-violet">Send</button>
              <button onClick={() => setAudioBlob(null)} className="text-gray-500 hover:text-royal-purple p-1 rounded"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          )}

          {/* 📂 File Preview */}
          {preview && (
            <div className="mb-2 flex items-center gap-3 p-2 bg-gray-100 rounded-lg w-full sm:max-w-xs">
              {file.category === "image" && <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(preview, "_blank")} />}
              {file.category === "file" && file.type === "application/pdf" && <div className="w-32"><embed src={preview} type="application/pdf" width="100%" height="100%" /><p className="text-sm text-gray-700 mt-1 truncate">{file.raw.name}</p></div>}
              {(file.category === "audio" || file.category === "video") && <audio controls src={preview} className="w-full sm:w-64" />}
              <button onClick={() => { setFile(null); setPreview(null); }} className="text-gray-500 hover:text-royal-purple p-1 rounded"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          )}

          {/* ✍️ Input */}
          {receiverProfile?.isDeleted ? (
            <div className="text-center text-red-500 py-2">You can't send messages to this user</div>
          ) : (
            <div className="border-t border-gray-200 bg-white dark:bg-licorice relative mt-2 flex items-center gap-2 px-3 py-2">
              <label className="cursor-pointer p-1">
                <PhotoIcon className="h-4 w-4 text-royal-purple hover:text-english-violet" />
                <input key={inputKey} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "image")} />
              </label>
              <label className="cursor-pointer p-1">
                <PaperClipIcon className="h-4 w-4 text-royal-purple hover:text-english-violet" />
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, "fileOrAudio")} />
              </label>
              {!recording ? (
                <button onClick={startRecording} className="text-royal-purple p-1 rounded ">
                  <MicrophoneIcon className="h-4 w-4 text-royal-purple hover:text-english-violet" />
                </button>
              ) : (
                <button onClick={stopRecording} className="text-royal-purple p-1 rounded">⏹️</button>
              )}
              <TextareaAutosize
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendNewMessage(); } }}
                minRows={1} maxRows={6}
                placeholder="Type a message"
                className="flex-1 py-2 px-4 border border-gray-200 rounded-2xl focus:outline-none text-sm placeholder:text-gray-400"
              />
              <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className="absolute right-12 text-gray-500 hover:text-royal-purple">
                <FaceSmileIcon className="h-4 w-4" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-0 z-50 shadow-lg">
                  <EmojiPicker onEmojiClick={(emoji) => setMessage(prev => prev + emoji.emoji)} />
                </div>
              )}
              <PaperAirplaneIcon onClick={sendNewMessage} className="text-royal-purple h-5 w-5 cursor-pointer hover:text-english-violet" />
            </div>
          )}
        </div>
      </div>

      {/* 👤 Receiver Profile */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l dark:border-gray-900 border-gray-200 bg-white dark:bg-licorice overflow-y-auto overflow-x-hidden hidden lg:block ">
        <ReceiverProfile />
      </div>
    </div>
  );
};

export default ChatDialogue;
