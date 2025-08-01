import { UserPlusIcon , PhoneIcon , VideoCameraIcon } from "@heroicons/react/24/solid"; 
const ChatHeader = ({ receiver }) => {
  const defaultPhoto =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <div className="flex items-center gap-4 px-3 pb-3 border-b border-gray-200 bg-white">
      <img
        src={receiver?.profilePhoto?.url || defaultPhoto}
        alt={receiver?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{receiver?.name}</h2>
        {/* You can add status or email if needed */}
        {/* <p className="text-xs text-gray-500">{receiver?.email}</p> */}
      </div>
      <ul className="flex flex-row space-x-5 ml-auto">
        <li>
            <UserPlusIcon className="text-french-gray h-4 w-4 hover:text-english-violet cursor-pointer"/>
        </li>
        <li>
            <PhoneIcon className="text-french-gray h-4 w-4 hover:text-english-violet cursor-pointer"/>
        </li>
        <li>
            <VideoCameraIcon className="text-french-gray h-4 w-4 hover:text-english-violet cursor-pointer"/>
        </li>
      </ul>
    </div>
  );
};

export default ChatHeader;

 
