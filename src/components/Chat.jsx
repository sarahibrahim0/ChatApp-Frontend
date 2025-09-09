import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../redux/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../utils/timeFormatter";

// Heroicons
import { PhotoIcon, VideoCameraIcon, MicrophoneIcon, DocumentIcon } from "@heroicons/react/24/outline";

const Chat = ({ chat }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const receiverId = chat.members.find((member) => member._id !== user._id);
    setReceiver(receiverId);
  }, [user, chat]);

  const handleSelectChat = (receiverId) => {
    if (!receiverId) return;
    dispatch(chatActions.setSelectedUser(receiverId));
    navigate(`/${receiverId}`);
  };

  const renderLastMsg = (lastMsg) => {
    if (!lastMsg) return "no messages";
    if (lastMsg.media && lastMsg.media.length > 0) {
      const type = lastMsg.media[0].type;
      switch (type) {
        case "image": return <><PhotoIcon className="h-4 w-4 inline mr-1 text-gray-400 dark:text-gray-300"/> picture</>;
        case "video": return <><VideoCameraIcon className="h-4 w-4 inline mr-1 text-gray-400 dark:text-gray-300"/> video</>;
        case "voice": return <><MicrophoneIcon className="h-4 w-4 inline mr-1 text-gray-400 dark:text-gray-300"/> voice note</>;
        case "file": return <><DocumentIcon className="h-4 w-4 inline mr-1 text-gray-400 dark:text-gray-300"/> file</>;
        default: return lastMsg.text || "رسالة";
      }
    }
    return lastMsg.text || "no messages";
  };

  return (
    <>
      {receiver && (
        <div
          onClick={() => handleSelectChat(receiver._id)}
          className="grid grid-cols-[3rem_1fr_auto] gap-1.5 p-2 rounded-md cursor-pointer
                     hover:bg-white-smoke dark:hover:bg-english-violet-2"
        >
          {/* الصورة */}
          <div className="w-10 h-10">
            <img
              src={receiver.profilePhoto.url}
              alt={receiver.name}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* الاسم والرسالة */}
          <div className="flex flex-col justify-between overflow-hidden">
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
              {receiver.name}
            </span>
            <span className="text-xxs text-english-violet dark:text-gray-300 truncate">
              {chat.lastMsg ? renderLastMsg(chat.lastMsg) : "no messages"}
            </span>
          </div>

          {/* الوقت */}
          <div className="text-xxs text-english-violet dark:text-gray-300 text-right self-end">
            {chat.lastMsg && formatTimeAgo(chat.lastMsg.createdAt)}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
