import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailSent from "./pages/EmailSent";
import VerifyEmail from "./pages/VerifyEmail";
import { useSelector } from "react-redux";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import PasswordReseted from "./pages/PasswordReseted";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Chats from "./pages/Chats";
import socket from "./utils/socket";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import DeactivationPage from "./pages/DeactivationPage";

// 👇 PrivateRoute Component

function App() {


  const { user, token, registerMessage } = useSelector((state) => state.auth);
  const { resetedMsg } = useSelector((state) => state.password);
  const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  return user && token ? children : <Login />;
};
  useEffect(() => {
    if (user && user._id) {
      socket.connect();
      socket.on("connect", () => {
        socket.emit("addNewUser", user._id);
      });

      return () => {
        socket.off("connect");
        socket.disconnect();
      };
    }
  }, [user]);

  return (
    <div className="flex flex-row h-screen">
      <div>
        <NavBar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <Routes>
          {/* لو فيه user & token يدخل على Chats مباشرة */}
          <Route path="/" element={token ? <Chats /> : <Login />} />

          <Route
            path="/:receiverId"
            element={
              <PrivateRoute>
                <Chats />
              </PrivateRoute>
            }
          />

          <Route
            path="/login"
            element={token ? <Chats /> : <Login />}
          />

          <Route path="/register" element={<Register />} />

          <Route
            path="/api/users/:userId/verify/:token"
            element={<VerifyEmail />}
          />

          <Route
            path="/api/reset-password/:userId/:token"
            element={<ResetPassword />}
          />

          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/password-reseted" element={<PasswordReseted />} />

          <Route
            path="/email-sent"
            element={
              registerMessage || resetedMsg ? <EmailSent /> : <Login />
            }
          />

          <Route path="/account-deactivated" element={<DeactivationPage />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* أي route مش معروف → Login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
 