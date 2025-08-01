import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  getChatMessages, getSingleChat, sendMessage } from "../redux/apiCalls/chatApiCalls";
import { chatActions } from "../redux/slices/chatSlice";
import socket from "../utils/socket";
import { useRef } from "react";
import { formatDistanceToNow } from 'date-fns';
import { PaperAirplaneIcon} from '@heroicons/react/24/solid';
import ReceiverProfile from "./ReceiverProfile";
import TextareaAutosize from 'react-textarea-autosize';
import { useParams } from "react-router-dom";
import ChatHeader from "./ChatHeader";

const ChatDialogue = () => {

    const { receiverId } = useParams();

  const { currentChat, currentChatMessages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
const { receiverProfile} = useSelector((state) => state.users);


  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getSingleChat(user._id, receiverId));
  }, [receiverId]);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [currentChatMessages]);

  useEffect(() => {
    if(currentChat)
{
     dispatch(getChatMessages(currentChat?._id));
}
else{
  dispatch(chatActions.clearChatMsgs());
}
  }, [currentChat]);


    const sendNewMessage = () => { // Send message to the server 
      if (message.trim() !== '') 
        { 
          const messageData = {receiverId: receiverId, senderId : user._id, text: message };
       socket.emit('sendMessage', messageData); // Emit message in real-time
      setMessage(''); // Clear the input field
  }}

  return (
    <div className="flex h-screen overflow-hidden">
    <div className="flex flex-col h-full max-h-full w-full justify-between bg-white py-3   border-b border-gray-200">
      <ChatHeader receiver = {receiverProfile}/>
<div className="flex-1 overflow-y-auto px-2 space-y-3 pb-4">
        {currentChatMessages.length > 0 ? (
          currentChatMessages.map((msg) => {
              const isSender = msg.senderId === user._id || msg.senderId._id === user._id;
          return(
             <div
              key={msg._id}
  className={`w-full flex  ${isSender ? "justify-end" : "justify-start"}`}
    >
             <div
    className={`max-w-[60%] flex items-center gap-1
      ${isSender ?  "flex-row" : "flex-row-reverse" }`}
  >
                            <p className="text-[10px] mt-1 text-gray-400 text-right">
                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
              </p>
            <p className={`text-sm px-4 py-2 rounded-2xl shadow-sm max-w-full break-words ${
  isSender
    ? "bg-royal-purple text-white rounded-br-none"
    : "bg-gray-200 text-gray-800 rounded-bl-none"
}`}>{msg.text}</p>

                {/* <img src={msg.senderId.profilePhoto?.url } alt={msg.senderId.name}
                className="h-8 w-8 rounded-full object-cover" /> */}
            </div>
            </div>
          )
           
})
        ) : (
          <p className="text-gray-400 text-center mt-10">No messages</p>
)}
        <div ref={messagesEndRef} />
      </div>
<div className="border-t  border-gray-200 ">
      <div className="mt-4 flex items-center px-3 ">

<TextareaAutosize
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendNewMessage();  
    }
  }}
  minRows={1}
  maxRows={6}
  placeholder="Type a message"
className="w-full py-2 px-4 border-none border-t border-gray-200 focus:outline-none text-sm placeholder:text-gray-400"
/>

      
          <PaperAirplaneIcon  onClick={sendNewMessage}
 className="text-royal-purple h-5 w-5 cursor-pointer hover:text-english-violet "/>
      </div>
      </div>
    </div>
  <div className="w-80 border-l border-gray-200 bg-white">
              <ReceiverProfile/>

    </div>

    </div>
  );
};

export default ChatDialogue;
