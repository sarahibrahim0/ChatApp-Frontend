import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { passwordActions } from "../redux/slices/passwordSlice";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link } from "react-router-dom";

// ❗️لو عندك أنيميشن خاصة، غيري المسار هنا
import successAnimation from "../assets/verified.json";

const PasswordReseted = () => {
  const { errorPassword, reseted } = useSelector((state) => state.password);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(passwordActions.clearError());
    };
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-smoke px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center">
        {reseted && (
          <>
            <Player
              autoplay
              loop={false}
              src={successAnimation}
              style={{ height: "200px", width: "200px", margin: "0 auto" }}
            />
            <h2 className="text-2xl font-bold text-green-600 mb-3 mt-4">
              Password Reset Successful ✅
            </h2>
            <p className="text-gray-700 mb-6">
              Your password has been reset. You can now log in with the new one.
            </p>
            <Link
              to="/login"
              className="inline-block bg-royal-purple text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition duration-200"
            >
              Go to Login
            </Link>
          </>
        )}

        {errorPassword && (
          <p className="text-red-600 font-medium text-lg mt-4">
            Error: {errorPassword}
          </p>
        )}
      </div>
    </div>
  );
};

export default PasswordReseted;
