import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../redux/apiCalls/authApiCalls";
import { authActions } from "../redux/slices/authSlice.js";
import { Player } from "@lottiefiles/react-lottie-player";
import verifiedAnimation from "../assets/verified.json"; // make sure the path is correct

const VerifyEmail = () => {
  const { error, isEmailVerified, isVerifying } = useSelector(
    (state) => state.auth
  );

  const { userId, token } = useParams();
  const dispatch = useDispatch();

useEffect(() => {

  if (!isEmailVerified && !isVerifying) {
    dispatch(verifyEmail(userId, token));
  }
}, [dispatch, userId, token, isEmailVerified, isVerifying]);

  useEffect(() => {

    return () => {
      dispatch(authActions.clearError());
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100 px-4  dark:bg-licorice">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center  dark:bg-licorice">
        {(isVerifying && !error) && (
          <p className="text-lg font-medium text-gray-600 animate-pulse">
            Verifying your email...
          </p>
        )}

        {isEmailVerified && (
          <>
            <Player
              autoplay
              loop={false}
              src={verifiedAnimation}
              style={{ height: "200px", width: "200px", margin: "0 auto" }}
            />
            <h2 className="text-2xl font-bold text-primary mb-3 mt-4">
              Email Verified 🎉
            </h2>
            <p className="text-gray-700 mb-6">
              Your email has been verified successfully. You can now log in.
            </p>
            <Link
              to="/login"
              className="inline-block bg-royal-purple text-white px-6 py-2 rounded-lg hover:bg-russian-violet transition duration-200"
            >
              Go to Login
            </Link>
          </>
        )}

        {error && (
          <p className="text-red-600 font-medium mt-4">Error: {error}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
