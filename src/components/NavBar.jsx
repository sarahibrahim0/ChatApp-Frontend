import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/apiCalls/authApiCalls";
import {ChatBubbleOvalLeftEllipsisIcon , UserIcon , Cog6ToothIcon,
   ArrowLeftEndOnRectangleIcon,
   ArrowLeftStartOnRectangleIcon,
   UserPlusIcon
 } from '@heroicons/react/24/solid';
import img from "../assets/default-profile.png"



const NavBar = () => {
  const { user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = async ()=>{

   await dispatch(logoutUser());

  } 

  return (
    <>
   
<ul className="flex flex-col h-full text-sm  w-16 text-center items-center bg-russian-violet ">

    {/* {user && (
    <li className="p-3"> {user.username}</li>
  )} */}

{user &&  (<li className="p-3">
    <img
              src={user?.profilePhoto}
              alt={user?.username}
              className="w-10 h-10 object-cover rounded-full "
            />  {/* Name and message (in a column) */}
</li>)}

  <li className="p-3">
    <Link to="/" className="">
    <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5  text-english-violet hover:text-white-smoke" />

    </Link>
  </li>
  <li className="p-3">
<UserIcon className="h-5 w-5 text-english-violet hover:text-white-smoke cursor-pointer"/>  
</li>
<li className="p-3">
  <Cog6ToothIcon className="h-5 w-5 text-english-violet hover:text-white-smoke cursor-pointer"/>
</li>


    {user ? (
      <li className="mt-auto p-3">
      <Link onClick={() => logOut()} className="">
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-english-violet rotate-180 hover:text-white-smoke"/>

      </Link>
      </li>
    ) : (
      <>
      <ul className="mt-auto flex flex-col space-y-3 p-3">
         <li className="">
          <Link to="/login" className="">
                  <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-english-violet hover:text-white-smoke"/>
        </Link>
      </li>
      <li className="">

           <Link to="/register" className="">
          <UserPlusIcon className="h-5 w-5 text-english-violet hover:text-white-smoke "/>
        </Link>
        </li>
      </ul>
     
      {/* <li className="mt-auto p-3">
         
      </li> */}
    
      </>
    )}
</ul>
         
    
    </>
  );
};

export default NavBar;
