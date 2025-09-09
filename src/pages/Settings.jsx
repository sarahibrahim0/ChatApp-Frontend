import { ExclamationTriangleIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { deactivateUser, deleteUserProfile } from "../redux/apiCalls/authApiCalls";

const Settings = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state=>state.auth)
  const handleDeactivate = () => {
 const confirmDelete = window.confirm(
      "Are you sure you want to deactivate your account? This action is irreversible."
    );
    if (confirmDelete) {
      alert("Account deactivation initiated.");
      if(user)
{      
dispatch(deactivateUser(user._id));  
}    }    
  };
 
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (confirmDelete) {
      alert("Account deletion initiated.");
      if(user)
{      
  dispatch(deleteUserProfile(user._id));  
}    }
  };

  return (
    <div className="flex flex-col h-screen bg-white  dark:bg-licorice">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-5 bg-gray-50 dark:text-white-smoke dark:bg-licorice">
        <h1 className="text-2xl font-semibold text-royal-violet tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account options</p>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6 bg-white dark:text-white-smoke dark:bg-licorice">
        {/* Deactivate Account */}
        <section className="p-5 bg-gray-50 border border-gray-200 dark:text-white-smoke dark:bg-licorice rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <PowerIcon className="h-6 w-6 text-english-violet mt-1" />
              <div>
                <h2 className="text-base font-medium text-royal-violet">Deactivate Account</h2>
                <p className="text-sm text-gray-500">
                  Temporarily deactivate your account. You can reactivate it anytime.
                </p>
              </div>
            </div>
            <button
              onClick={handleDeactivate}
              className="text-sm text-white bg-royal-purple  hover:bg-russian-violet px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              Deactivate
            </button>
          </div>
        </section>

        {/* Delete Account */}
        <section className="p-5 bg-gray-50 border dark:text-white-smoke dark:bg-licorice border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h2 className="text-base font-medium text-red-600">Delete Account</h2>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-sm transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
