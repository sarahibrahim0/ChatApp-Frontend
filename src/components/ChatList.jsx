import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats } from "../redux/apiCalls/chatApiCalls";
import Chat from "../components/Chat";
import SearchUser from "../components/SearchUser";


const ChatList = () => {
    const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [sortedChats, setSortedChats] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getUserChats(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const sorted = chats.slice().sort((a, b) => {
      const dateA = new Date(a.lastMsg?.createdAt || 0);
      const dateB = new Date(b.lastMsg?.createdAt || 0);
      return dateB - dateA;
    });
    setSortedChats(sorted);
  }, [chats]);

    return ( 
        
    <div className="flex flex-col space-y-3 p-3 
        bg-english-violet-2 dark:bg-licorice text-gray-100 dark:text-gray-100 z-10">
        <div className="mb-4 self-center">
          <SearchUser />
        </div>
        <div className="my-2 flex-1 overflow-y-auto space-y-2">
          {sortedChats.map((chat, index) => (
            <Chat key={index} chat={chat} />
          ))}
        </div>







        
      </div> 
    
     );
}
 
export default ChatList;