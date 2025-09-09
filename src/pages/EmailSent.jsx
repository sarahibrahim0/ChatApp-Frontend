import { useSelector } from "react-redux";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/emailSent.json"; // حطي هنا المسار الصحيح للملف
import { Link } from "react-router-dom";

const EmailSent = () => {
  const { registerMessage , error } = useSelector((state) => state.auth);
  const { resetedMsg  , errorPassword } = useSelector((state) => state.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:text-white-smoke dark:bg-licorice px-4">
      <div className="bg-white dark:text-white-smoke dark:bg-licorice p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "200px", width: "200px",  }}
        />

        <h2 className="text-2xl font-semibold text-royal-purple mt-4 mb-2">
          Email Sent!
        </h2>
        {(registerMessage || resetedMsg)  &&
<div>
         <p className="text-gray-700 text-sm mb-4">
          {registerMessage?
               <span>
            A verification email has been sent to:
           </span>
      
           :
                      <span>
            A reset email has been sent to:
           </span>
}

          <span className="font-semibold ml-1 text-blue-black dark:text-white-smoke ">
            {registerMessage? registerMessage : resetedMsg  }
            </span>
        </p>

        <p className="text-xs text-gray-500 dark:text-white-smoke  mb-6">
           {registerMessage && 
                <span>
                    Please check your inbox and click the link to verify your account.
                    </span> 
                      }
                      {
                        resetedMsg &&
                            <span>
                    Please check your inbox and click the link to reset your password.
                    </span> 
                      }
               
        </p>
        </div>
        }
        <Link
          to="/login"
          className="inline-block bg-royal-purple text-white px-4 py-2 rounded-md hover:bg-english-violet transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailSent;
