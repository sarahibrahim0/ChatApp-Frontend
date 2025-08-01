import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats } from "../redux/apiCalls/chatApiCalls";
import Chat from "../components/Chat";
import ChatDialogue from "../components/ChatDialogue";
import socket from "../utils/socket";
import { chatActions } from "../redux/slices/chatSlice";
import SearchUser from "../components/SearchUser";

const Chats = () => {
  const dispatch = useDispatch();
  const { chats,error ,selectedUser } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const[receiver , setReceiver] = useState(null)

  useEffect(() => {
    if(user && user._id)
{    dispatch(getUserChats(user._id));
}  }, [user]);

// const handleChatClick = (receiverId)=>{
//   setReceiver(receiverId)
  
// }

useEffect(() => {
  const handleReceiveMessage = (response) => {
    dispatch(chatActions.addMessageToCurrentChat(response)); // لو الرسالة تخص الشات المفتوح
    dispatch(chatActions.updateLastMsgInChatList(response)); // تحديث الرسالة الأخيرة في الشاتس
  };

  socket.on('receiveMessage', handleReceiveMessage);

  return () => {
    socket.off('receiveMessage', handleReceiveMessage);
  };
}, []);


  return ( <div className="grid grid-flow-col grid-cols-5 h-full  bg-english-violet-2">
    <div className=" col-span-1 flex flex-col space-y-3 p-3 ">
      <div className="mb-4 self-center">
              <SearchUser/>
      </div>
      <div className="my-2">
          {chats.map((chat, index) => (
        <Chat key={index} chat={chat} />
      ))}
      </div>
    
    </div>
    <div className="bg-white-smoke  col-span-4">
          <ChatDialogue/>
    </div>
  </div>
 
  );
};

export default Chats;
