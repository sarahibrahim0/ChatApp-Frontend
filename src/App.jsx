import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import socket from "./utils/socket";
import NavBar from "./components/NavBar";
import Chats from "./pages/Chats";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailSent from "./pages/EmailSent";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import PasswordReseted from "./pages/PasswordReseted";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import DeactivationPage from "./pages/DeactivationPage";
import VoiceCall from "./components/VoiceCall";
import VideoCall from "./components/VideoCall";
import ReceiverProfile from "./pages/ReceiverProfile";

function App() {
  const { user, token, registerMessage } = useSelector((state) => state.auth);
  const { resetedMsg } = useSelector((state) => state.password);

  const [incomingCall, setIncomingCall] = useState(null);
const theme = useSelector((state) => state.theme.theme);

useEffect(() => {
  document.documentElement.className = theme;
}, [theme]);

  useEffect(() => {
    if (user && user._id) {
      socket.connect();

      socket.on("connect", () => {
        socket.emit("addNewUser", user._id);
      });

      // 📞 استقبل المكالمة هنا
   socket.on("incoming-call", ({ from, offer, type, name }) => {
    console.log(
      { from, offer, type, name }
    )
  setIncomingCall({ from, offer, type , name});
});
      return () => {
        socket.off("connect");
        socket.off("incoming-call");
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
          <Route path="/" element={token && user ? <Chats /> : <Login />} /> 
          <Route
            path="/:receiverId"
            element={token ? <Chats /> : <Login />}
          />
          <Route path="/login" element={!token ? <Login /> : <Chats />} />
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
            element={registerMessage || resetedMsg ? <EmailSent /> : <Login />}
          />
          <Route path="/account-deactivated" element={<DeactivationPage />} />
          <Route
            path="/profile"
            element={token ? <UserProfile /> : <Login />}
          />
                    <Route
            path="/receiver/:id"
            element={token ? <ReceiverProfile /> : <Login />}
          />
          <Route
            path="/settings"
            element={token ? <Settings /> : <Login />}
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>

      {/* ✅ Show incoming call modal anywhere */}
      {incomingCall?.type === "voice" && (
  <VoiceCall
    receiverId={incomingCall.from}
    receiverName={incomingCall.name}
    incomingCall={incomingCall}
    onClose={() => setIncomingCall(null)}
  />
)}

{incomingCall?.type === "video" && (
  <VideoCall
    receiverId={incomingCall.from}
    receiverName={incomingCall.name}
    incomingCall={incomingCall}
    onClose={() => setIncomingCall(null)}
  />
)}

    </div>
  );
}

export default App;
