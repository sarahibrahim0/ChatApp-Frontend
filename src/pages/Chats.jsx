import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats } from "../redux/apiCalls/chatApiCalls";
import Chat from "../components/Chat";
import ChatDialogue from "../components/ChatDialogue";
import SearchUser from "../components/SearchUser";

const Chats = () => {
  const dispatch = useDispatch();
  const { chats} = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
 const [sortedChats, setSortedChats] = useState([])
  useEffect(() => {
    if(user && user._id )
{    dispatch(getUserChats(user._id));
}  }, [user]);

useEffect(() => {
  const sorted = chats.slice().sort((a, b) => {
    const dateA = new Date(a.lastMsg?.createdAt || 0);
    const dateB = new Date(b.lastMsg?.createdAt || 0);
    return dateB - dateA;
  });
  setSortedChats(sorted);
}, [chats]);


  return ( <div className="grid grid-flow-col grid-cols-5 h-full  bg-english-violet-2">
    <div className=" col-span-1 flex flex-col space-y-3 p-3 ">
      <div className="mb-4 self-center">
              <SearchUser/>
      </div>
      <div className="my-2">
          {
       sortedChats.map((chat, index) => (
        <Chat key={index} chat={chat} />
      ))
      }
      </div>
    
    </div>
    <div className="bg-white-smoke  col-span-4">
          <ChatDialogue/>
    </div>
  </div>
 
  );
};

export default Chats;
