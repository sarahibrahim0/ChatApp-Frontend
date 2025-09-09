import { useDispatch, useSelector  } from "react-redux";
import {  getSingleChat } from "../redux/apiCalls/chatApiCalls";
import { useEffect , useState } from "react";

const User = ({currentUser , onClick}) => {

    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.auth);
    const[lastMessage , setLast] = useState('')


          const fetchUserChat = (userId)=>{
        dispatch(getSingleChat(user._id, userId));
        if(onClick) onClick();
    };

  
  
   

    return ( 
    <div>
        <span className="cursor-pointer bg-slate-400" onClick={()=>fetchUserChat(currentUser?._id)}>{currentUser.name}</span>  
        <span>{currentUser.lastMsg?.text} '_____'</span>   
        <span>{currentUser._id}</span>        
    </div>
    );
}
 
export default User;