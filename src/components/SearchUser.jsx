import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/apiCalls/authApiCalls";
import { useState } from "react";
import { getUserByEmail } from "../redux/apiCalls/usersApiCalls";
import { chatActions } from "../redux/slices/chatSlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchUser = () => {
      const { user} = useSelector((state) => state.auth);
    const { searchedUser} = useSelector((state) => state.users);
  const[searchedEmail , setSearchedEmail] = useState("");
  const dispatch = useDispatch();

   const onClickingOnUser = (user)=>{
  dispatch(chatActions.setSelectedUser(user._id));
 }

  const searchUserByEmail =()=>{
  dispatch(getUserByEmail(searchedEmail));
  }
    return ( <>
       <div className="flex items-center">
          <input type="text" value={searchedEmail || ''} placeholder="search users by email"
          onChange={(e)=>{setSearchedEmail(e.target.value)}} 
          className=" outline-none !text-xs text-english-violet bg-russian-violet rounded-full h-8 text-center 
          placeholder:text-english-violet"/>

          <MagnifyingGlassIcon onClick={searchUserByEmail} 
            className="text-english-violet h-5 w-5 ml-2 text-sm cursor-pointer"/>
          </div>
          {
            searchedUser?  <span onClick={()=>onClickingOnUser(searchedUser)}>{searchedUser.name}</span> : "" }

     </> );
}
 
export default SearchUser;