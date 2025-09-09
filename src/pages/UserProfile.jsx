import { useState} from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { editUserProfile } from "../redux/apiCalls/usersApiCalls";
import EditProfileForm from "../components/EditProfileForm";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const onClose = () => {
    setIsEditing(false);
  };

  const handleSubmit = (formDataValues) => {
    const formData = new FormData();
    Object.entries(formDataValues).forEach(([key, value]) => {
    if (key === "profilePhoto") {
      if (value instanceof File) {
        formData.append("profilePhoto", value);
      } else if (typeof value === "string") {
        formData.append("profilePhoto", value);
      }
    } else {
      formData.append(key, value);
    }
  });
  dispatch(editUserProfile(user._id, formData));
  onClose();
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-white  dark:bg-licorice px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-royal-purple">Your Profile</h1>
        <button
          onClick={handleEditClick}
          className="flex items-center gap-1 text-sm text-english-violet hover:text-royal-purple"
        >
          <PencilSquareIcon className="w-5 h-5" />
          Edit
        </button>
      </div>

      {/* Profile Container */}
      <div className="w-full max-w-3xl bg-gray-50 dark:text-white-smoke dark:bg-licorice border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Profile Photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <img
            src={user
            ?.profilePhoto.url || "/default-avatar.png"}
            alt="User Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-royal-purple"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-medium text-royal-purple">{user
          ?.username
          }</h2>
            <p className="text-sm text-gray-500 dark:text-white-smoke dark:bg-licorice">{user
          ?.email}</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700 dark:text-white-smoke dark:bg-licorice">
          <div>
            <span className="font-medium text-royal-purple ">Gender:</span>{" "}
            {user
          ?.gender || "—"}
          </div>
          <div>
            <span className="font-medium text-royal-purple">Birth Date:</span>{" "}
            {user
            ?.birthDate &&
              new Date(user
              .birthDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
          </div>
          <div>
            <span className="font-medium text-royal-purple">Phone:</span>{" "}
            {user?.phone || "—"}
          </div>
          <div>
            <span className="font-medium text-royal-purple">Title:</span>{" "}
            {user?.title || "—"}
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
           <EditProfileForm onSubmit={handleSubmit} onClose={onClose} />
        </div>
      )}


    </div>
  );
};

export default UserProfile;
