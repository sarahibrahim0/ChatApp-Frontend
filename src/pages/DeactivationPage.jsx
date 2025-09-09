import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { activateUser, loginUser } from "../redux/apiCalls/authApiCalls";
import { useEffect } from "react";

const DeactivationPage = () => {
   
  const { error,  loading  , userId , isActive

  }
 = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {  email, password } = location.state || {};


  useEffect(()=>{
  if(isActive){
    navigate('/')
  }
  } , [
    isActive
  ])
     const handleReactivate = ()=>{
  dispatch(activateUser(userId ,email , password));
   }
   return (<>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white dark:text-white-smoke dark:bg-licorice p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-royal-purple mb-6">
          Account Deactivated
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Your account is currently deactivated. You cannot use the chat or send messages until you reactivate it.
        </p>

        <button
          onClick={handleReactivate}
          disabled={loading}
          className="w-full py-2 bg-royal-purple dark:text-white-smoke dark:bg-licorice text-white font-medium rounded-md hover:bg-english-violet transition-all duration-200"
        >
          {loading ? "Reactivating..." : "Reactivate Account"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-center text-gray-700">{error}</p>
        )}

        <div className="text-sm text-blue-black text-center mt-4">
          Changed your mind?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-very-blue hover:text-blue-black underline ml-1"
          >
            Go back to Login
          </button>
        </div>
      </div>
    </div>
    </>  );
}
 
export default DeactivationPage;