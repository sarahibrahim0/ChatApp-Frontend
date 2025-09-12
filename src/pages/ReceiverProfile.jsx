import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/apiCalls/usersApiCalls";
import img from "../assets/default-profile.png";
import { useParams } from "react-router-dom";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  CalendarDaysIcon, 
  UserIcon,
  DocumentIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/solid";

const ReceiverProfile = () => {
  const { receiverId } = useParams();
  const dispatch = useDispatch();
  const { receiverProfile } = useSelector((state) => state.users);
  const { currentChatMessages } = useSelector((state) => state.chat);

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [voiceAndVideos, setVoiceAndVideos] = useState([]);

  // Toggle state لكل Section
  const [showImages, setShowImages] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  useEffect(() => {
    dispatch(getUserById(receiverId));
  }, [receiverId]);

  useEffect(() => {
    const imgs = [];
    const fls = [];
    const vv = [];
    currentChatMessages.forEach(msg => {
      msg.media?.forEach(m => {
        if (m.type === "image") imgs.push(m);
        else if (m.type === "voice" || m.type === "video") vv.push(m);
        else fls.push(m);
      });
    });
    setImages(imgs);
    setFiles(fls);
    setVoiceAndVideos(vv);
  }, [currentChatMessages]);

  const hasMedia = images.length > 0 || files.length > 0 || voiceAndVideos.length > 0;

  return (
    <aside 
  className="
    w-full 
    bg-white dark:bg-licorice  
    p-6 flex flex-col gap-6 text-xs border-0 
    h-full overflow-y-auto
  "
>      {/* Profile Section */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-24 h-24 rounded-full overflow-hidden border  border-gray-300">
          <img
            src={receiverProfile?.profilePhoto?.url || img}
            alt={receiverProfile?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white-smoke dark:bg-licorice">{receiverProfile?.name}</h3>
        <p className="text-xs text-gray-500 dark:text-white-smoke dark:bg-licorice">{receiverProfile?.title || "Not provided"}</p>
      </div>

      {/* Info Section */}
      <div className="space-y-4 ">
        <InfoItem label="Mobile" value={receiverProfile?.phone} Icon={PhoneIcon} />
        <InfoItem label="Email" value={receiverProfile?.isDeleted?"Not provided": receiverProfile?.email} Icon={EnvelopeIcon} />
        <InfoItem
          label="Date of Birth"
          value={
            receiverProfile?.birthDate
              ? new Date(receiverProfile.birthDate).toLocaleDateString("en-GB")
              : "Not provided"
          }
          Icon={CalendarDaysIcon}
        />
        <InfoItem label="Gender" value={receiverProfile?.gender} Icon={UserIcon} />
      </div>

      {/* Shared Media */}
      <div>
        <h3 className="text-xs font-semibold text-gray-900 dark:text-white-smoke dark:bg-licorice mb-2">Shared Media</h3>

        {!hasMedia && <p className="text-xxs text-gray-400">No media</p>}

        {hasMedia && (
          <div className="border rounded-md p-2 max-h-64 overflow-y-auto">
            {/* Images Section */}
            {images.length > 0 && (
              <div className="mb-3">
                <button
                  className="flex items-center justify-between w-full text-xxs font-semibold text-gray-700"
                  onClick={() => setShowImages(prev => !prev)}
                >
                  Images
                  {showImages ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                </button>
                {showImages && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {images.map((imgItem, idx) => (
                      <div key={idx} className="relative cursor-pointer" onClick={() => window.open(imgItem.url, "_blank")}>
                        <PhotoIcon className="w-4 h-4 absolute top-1 left-1 text-white" />
                        <img src={imgItem.url} alt="" className="w-full h-20 object-cover rounded-md" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Files Section */}
            {files.length > 0 && (
              <div className="mb-3">
                <button
                  className="flex items-center justify-between w-full text-xxs font-semibold text-gray-700"
                  onClick={() => setShowFiles(prev => !prev)}
                >
                  Files
                  {showFiles ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                </button>
                {showFiles && (
                  <ul className="space-y-1 mt-2">
                    {files.map((f, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1 text-xxs text-gray-700 cursor-pointer hover:text-royal-purple"
                        onClick={() => window.open(f.url, "_blank")}
                      >
                        <DocumentIcon className="w-4 h-4 text-gray-500" />
                        {f.url.endsWith(".pdf") ? "PDF File" : "File"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Voice & Video Section */}
            {voiceAndVideos.length > 0 && (
              <div className="mb-3">
                <button
                  className="flex items-center justify-between w-full text-xxs font-semibold text-gray-700"
                  onClick={() => setShowVoice(prev => !prev)}
                >
                  Voice & Video
                  {showVoice ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                </button>
                {showVoice && (
                  <div className="flex flex-col gap-2 mt-2">
                    {voiceAndVideos.map((v, idx) =>
                      v.type === "voice" ? (
                        <div key={idx} className="flex items-center gap-2">
                          <SpeakerWaveIcon className="w-5 h-5 text-royal-purple" />
                          <audio controls src={v.url} className="w-64" />
                        </div>
                      ) : (
                        <div key={idx} className="relative">
                          <VideoCameraIcon className="w-5 h-5 text-royal-purple absolute top-1 left-1" />
                          <video controls src={v.url} className="w-full rounded-md" />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

const InfoItem = ({ label, value, Icon }) => (
  <div className="flex items-start gap-3 text-gray-600">
    <Icon className="w-5 h-5 text-royal-purple mt-0.5" />
    <div className="flex-1">
      <p className="text-xxs text-gray-400">{label}</p>
      <p className="text-xs font-medium text-gray-800 dark:text-white-smoke dark:bg-licorice break-words">{value || "Not provided"}</p>
    </div>
  </div>
);

export default ReceiverProfile;
