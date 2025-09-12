
import ChatDialogue from "./ChatDialogue";
import {  Outlet, useParams } from "react-router-dom";
import ChatList from "../components/ChatList";
import bgImg from "../assets/c15.jpg";
import { useMediaQuery } from "react-responsive";

const Chats = () => {

  const { receiverId } = useParams();
  const isDesktop = useMediaQuery({ minWidth: 768 });

  return (

    <div className="relative grid grid-cols-5 h-screen bg-white dark:bg-licorice">
      {/* 📨 Chats list */}
{
  ((!receiverId && isDesktop ) ||  (receiverId && isDesktop) || (!receiverId && !isDesktop) ) &&

        <div className="col-span-5 md:col-span-2 lg:col-span-1 md:flex
        bg-english-violet-2 dark:bg-licorice text-gray-100 dark:text-gray-100 z-10">

<ChatList/>
      </div> 
}



        {( !receiverId && isDesktop)  &&
                       <div className="md:col-span-3 lg:col-span-4 bg-white dark:bg-licorice z-10">

      <div
        className="relative h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="absolute inset-0 dark:bg-black/60"></div>
        <h2 className="relative z-10 text-white text-sm sm:text-xl font-semibold bg-black bg-opacity-30 p-4 rounded-xl">
          Select a chat to start messaging 💬
        </h2>
      </div>
      </div>
  
  }
      {/* 💬 Chat Dialogue */}
      {
        receiverId && 
           <div className=" col-span-5 md:col-span-3 lg:col-span-4 bg-white dark:bg-licorice z-10">
        <ChatDialogue/>
      </div>
      }
      
            
         
   
      

            




     
    </div>

  );
};

export default Chats;
