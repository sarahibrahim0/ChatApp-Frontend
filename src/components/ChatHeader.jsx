import { useState } from "react";
import { UserPlusIcon , PhoneIcon , VideoCameraIcon } from "@heroicons/react/24/solid";
import VideoCall from "./VideoCall";
import VoiceCall from "./VoiceCall";

const ChatHeader = ({ receiver, currentUserId }) => {
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const defaultPhoto =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <div>
      <div className="flex items-center gap-4 px-3 pb-3 border-b border-gray-200 bg-white">
        <img
          src={receiver?.profilePhoto?.url || defaultPhoto}
          alt={receiver?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{receiver?.name}</h2>
        </div>
        <ul className="flex flex-row space-x-5 ml-auto">
          <li>
            <UserPlusIcon className="text-french-gray h-4 w-4 hover:text-english-violet cursor-pointer"/>
          </li>
          <li>
            <PhoneIcon
              className="text-french-gray h-4 w-4 hover:text-english-violet cursor-pointer"
              onClick={() => setIsVoiceCall(true)}
            />
          </li>
          <li>
            <VideoCameraIcon
              className="text-french-gray h-4 w-4 hover:text-english-violet cursor-pointer"
              onClick={() => setIsVideoCall(true)}
            />
          </li>
        </ul>
      </div>

      {isVoiceCall && (
        <VoiceCall
          currentUserId={currentUserId}
          receiverId={receiver?.socketId}
          onClose={() => setIsVoiceCall(false)}
        />
      )}

      {isVideoCall && (
        <VideoCall
          currentUserId={currentUserId}
          receiverId={receiver?.socketId}
          onClose={() => setIsVideoCall(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;
