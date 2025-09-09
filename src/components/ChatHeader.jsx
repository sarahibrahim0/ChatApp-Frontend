import { useState } from "react";
import { useSelector } from "react-redux";
import { UserPlusIcon, PhoneIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import VideoCall from "./VideoCall";
import VoiceCall from "./VoiceCall";

const ChatHeader = ({ receiver }) => {
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const { theme } = useSelector(state => state.theme);

  const disabled = !receiver?._id || receiver?.isDeleted;

  return (
    <div className={`flex items-center gap-4 px-3 pb-3 border-b ${
      theme === "dark" ? "bg-licorice border-gray-700" : "bg-white border-gray-200"
    }`}>
      <img
        src={receiver?.profilePhoto?.url}
        alt={receiver?.name}
        className="w-10 h-10 rounded-full object-cover"
      />

      <div className="min-w-0">
        <h2 className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-sm font-semibold truncate`}>
          {receiver?.name}{" "}
          {receiver?.isDeleted && (
            <span className="text-red-500 text-xs ml-2">(Deleted)</span>
          )}
        </h2>
      </div>

      <ul className="flex flex-row space-x-5 ml-auto">
        <li title="Add user">
          <UserPlusIcon className={`h-4 w-4 cursor-pointer ${
              theme === "dark" ? "text-white-smoke hover:text-royal-purple" : "text-white-smoke hover:text-english-violet"
          }`} />
        </li>

        <li title={disabled ? "User not available" : "Voice call"}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsVoiceCallOpen(true)}
            className={`${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} p-0 m-0`}
          >
            <PhoneIcon className={`h-4 w-4 ${
              theme === "dark" ? "text-white-smoke hover:text-royal-purple" : "text-white-smoke hover:text-english-violet"
            }`} />
          </button>
        </li>

        <li title={disabled ? "User not available" : "Video call"}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsVideoCallOpen(true)}
            className={`${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} p-0 m-0`}
          >
            <VideoCameraIcon className={`h-4 w-4 ${
              theme === "dark" ? "text-white-smoke hover:text-royal-purple" : "text-white-smoke hover:text-english-violet"
            }`} />
          </button>
        </li>
      </ul>

      {isVoiceCallOpen && !disabled && (
        <VoiceCall
          receiverId={receiver._id}
          receiverName={receiver.name}
          onClose={() => setIsVoiceCallOpen(false)}
        />
      )}

      {isVideoCallOpen && !disabled && (
        <VideoCall
          receiverId={receiver._id}
          receiverName={receiver.name}
          onClose={() => setIsVideoCallOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;
