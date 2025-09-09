import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../redux/apiCalls/authApiCalls";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import ThemeToggle from "./ThemeToggle";
import img from "../assets/default-profile.png";
import SideBar from "./SideBar"; // ⭐ استوردي الكمبوننت الجديد

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logOut = () => dispatch(logoutUser());

  return (
    <div className="relative h-full">
      {/* Desktop NavBar */}
      <ul className="hidden md:flex flex-col h-full w-16 text-center items-center bg-russian-violet dark:bg-licorice text-white">
        {/* Profile */}
        {user && (
          <li className="p-3">
            <img
              src={user?.profilePhoto?.url || img}
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          </li>
        )}

        {/* Chats */}
        {user && (
          <li className="p-3">
            <NavLink to="/">
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-white hover:text-royal-purple" />
            </NavLink>
          </li>
        )}

        {/* Profile link */}
        {user && (
          <li className="p-3">
            <NavLink to="/profile">
              <UserIcon className="h-5 w-5 text-white hover:text-royal-purple" />
            </NavLink>
          </li>
        )}

        {/* Settings */}
        {user && (
          <li className="p-3">
            <NavLink to="/settings">
              <Cog6ToothIcon className="h-5 w-5 text-white hover:text-royal-purple" />
            </NavLink>
          </li>
        )}

        <div className="flex-1"></div>

        {/* Theme Toggle */}
        <li className="p-3">
          <ThemeToggle />
        </li>

        {/* Logout / Login & Register */}
        {user ? (
          <li className="p-3">
            <button onClick={logOut}>
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-white hover:text-royal-purple" />
            </button>
          </li>
        ) : (
          <>
            <li className="p-3">
              <NavLink to="/login">
                <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-white hover:text-royal-purple" />
              </NavLink>
            </li>
            <li className="p-3">
              <NavLink to="/register">
                <UserPlusIcon className="h-5 w-5 text-white hover:text-royal-purple" />
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Mobile Sidebar */}
<div className="md:hidden absolute top-4 left-4 z-50">
        <SideBar />
      </div>
    </div>
  );
};

export default NavBar;
