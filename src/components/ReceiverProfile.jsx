import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../redux/apiCalls/usersApiCalls";
import img from "../assets/default-profile.png";
import { useParams } from "react-router-dom";
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UserIcon,
  PencilIcon 
} from "@heroicons/react/24/solid";


const ReceiverProfile = () => {
  const { receiverId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserById(receiverId));
  }, [receiverId]);

  const { receiverProfile } = useSelector((state) => state.users);
  

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col gap-6 text-xs">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
          <img
            src={receiverProfile?.profilePhoto?.url || img}
            alt={receiverProfile?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-base font-semibold text-gray-900">
          {receiverProfile?.name}
        </h3>
<p className="text-xs text-gray-500">{receiverProfile?.title || "Not Provided"}</p>
 
      </div>
            

      {/* Info Section */}
      <div className="space-y-4">
        <InfoItem label="Mobile" value={receiverProfile?.phone} Icon={PhoneIcon} />
        <InfoItem label="Email" value={receiverProfile?.email} Icon={EnvelopeIcon} />
        <InfoItem
          label="Date of Birth"
          value={
            receiverProfile?.birthDate
              ? new Date(receiverProfile.birthDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Not provided"
          }
          Icon={CalendarDaysIcon}
        />
        <InfoItem label="Gender" value={receiverProfile?.gender} Icon={UserIcon} />
      </div>

      {/* Shared Media */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-semibold text-gray-900">Shared Media</h3>
          <button className="text-xxs text-royal-purple hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {receiverProfile?.media?.length > 0 ? (
            receiverProfile.media.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt=""
                className="w-full h-16 object-cover rounded-md"
              />
            ))
          ) : (
            <p className="text-xxs text-gray-400 col-span-3">No media</p>
          )}
        </div>
      </div>
    </aside>
  );
};

// ✅ Info Item Component — Adjusted font & icon sizes
const InfoItem = ({ label, value, Icon }) => (
  <div className="flex items-start gap-3 text-gray-600">
    <Icon className="w-5 h-5 text-royal-purple mt-0.5" />
    <div className="flex-1">
      <p className="text-xxs text-gray-400">{label}</p>
      <p className="text-xs font-medium text-gray-800 break-words">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

export default ReceiverProfile;
