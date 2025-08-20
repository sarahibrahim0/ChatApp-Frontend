import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../redux/slices/chatSlice";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../utils/timeFormatter";

const Chat = ({chat}) => {

    const navigate = useNavigate();
//     const chatS = useSelector(state => 
//   state.chat.chats.find(c => c._id === chat._id)
// );
    const {user} = useSelector(state=>state.auth);
    // const {lastMsg} = useSelector(state=>state.chat);

    const [receiver , setReceiver] = useState(null);
    


    const dispatch = useDispatch();


    useEffect(()=>{
            const receiverId = chat.members.find(member => member._id !== user._id);
            setReceiver(receiverId);
    },[user, chat]);


    const handleSelectChat = async (receiverId) => {
        if (!receiverId) return;
        try {
            dispatch(chatActions.setSelectedUser(receiverId));
navigate(`/${receiverId}`);
        } catch (error) {
            console.error('Failed to fetch chat:', error);
        }
    };
    return (    
        <>
    {receiver && (
<div
  onClick={() => handleSelectChat(receiver?._id)}
  className="grid grid-cols-[3rem_1fr_auto]  gap-1.5 p-2 hover:bg-white-smoke rounded-md cursor-pointer"
>
  {/* الصورة */}
  <div className="w-10 h-10">
    <img
      src={receiver.profilePhoto.url}
      alt={receiver.name}
      className="w-full h-full object-cover rounded-full"
    />
  </div>

  {/* الاسم والرسالة */}
  <div className="flex flex-col justify-between  overflow-hidden">
    <span className="text-xs font-semibold text-gray-900 truncate">{receiver.name}</span>
    <span className="text-xxs text-english-violet truncate">{chat.lastMsg ? chat.lastMsg.text : "لا توجد رسائل بعد"}
</span>
  </div>

  {/* الوقت */}
  <div className="text-xxs text-english-violet text-right self-end">
    {formatTimeAgo(chat?.lastMsg?.createdAt)}
  </div>
</div>


    )}
    </>
 );
}
 
export default Chat;