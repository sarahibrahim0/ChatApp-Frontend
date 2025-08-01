import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailSent from "./pages/EmailSent";
import VerifyEmail from "./pages/VerifyEmail";
import {useSelector } from "react-redux";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import PasswordReseted from "./pages/PasswordReseted";
import { useEffect } from "react";
import NavBar from "./components/NavBar";
import Chats from "./pages/Chats";
import socket from "./utils/socket";

function App() {
  const { user, registerMessage } = useSelector((state) => state.auth);


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
  
        <div className="flex flex-row h-screen ">
        <div className="">
                    <NavBar />
        </div>
          <div className="flex-1 overflow-y-auto">
                   <Routes>
              <Route
                path="/"
                element={user ? <Chats /> : <Navigate to="/login" />}
              />
                            <Route
                path="/:receiverId"
                element={user ? <Chats /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/api/users/:userId/verify/:token"
                element={ <VerifyEmail /> }
              />
              <Route
                path="/api/reset-password/:userId/:token"
                element={<ResetPassword />}
              />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/password-reseted" element={<PasswordReseted />} />

              <Route
                path="/email-sent"
                element={registerMessage ? <EmailSent /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Login/>} />
            </Routes>
          </div>
     
            
        
    </div>
  );
}

export default App;
