import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link , useLocation } from "react-router-dom";

import { logoutUser } from "../redux/apiCalls/authApiCalls";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  UserPlusIcon
} from "@heroicons/react/24/solid";
import img from "../assets/default-profile.png";

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = async () => {
    await dispatch(logoutUser());
  };
  
  const location = useLocation();
  const isChatSelected =
    location.pathname === "/" ||/^\/[^/]+$/.test(location.pathname) && // matches "/some-id"
  !["/profile", "/settings", "/login", "/register"].includes(location.pathname);
  return (
    <ul className="flex flex-col h-full text-sm w-16 text-center items-center bg-russian-violet">

      {/* صورة البروفايل */}
      {user && (
        <li className="p-3">
          <img
            src={user?.profilePhoto.url || img}
            alt={user?.username}
            className="w-10 h-10 object-cover rounded-full"
          />
        </li>
      )}

      {/* رابط المحادثات */}
      <li className="p-3">
      <NavLink
        to="/"
        className={`rounded-full text-english-violet ${
          isChatSelected
            ? "bg-russian-violet text-white"
            : "text-royal-violet hover:text-white-smoke"
        }`}
      >
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
        </NavLink>
      </li>

      {/* رابط البروفايل */}
      <li className="p-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "text-white-smoke"
              : "text-english-violet hover:text-white-smoke"
          }
        >
          <UserIcon className="h-5 w-5 cursor-pointer" />
        </NavLink>
      </li>

      {/* رابط الإعدادات */}
      <li className="p-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
              ? "text-white-smoke"
              : "text-english-violet hover:text-white-smoke"
          }
        >
          <Cog6ToothIcon className="h-5 w-5 cursor-pointer" />
        </NavLink>
      </li>

      {/* تسجيل الخروج أو تسجيل الدخول/التسجيل */}
      {user ? (
        <li className="mt-auto p-3">
          <Link onClick={logOut} className="">
            <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-english-violet rotate-180 hover:text-white-smoke" />
          </Link>
        </li>
      ) : (
        <ul className="mt-auto flex flex-col space-y-3 p-3">
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-white-smoke"
                  : "text-english-violet hover:text-white-smoke"
              }
            >
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive
                  ? "text-white-smoke"
                  : "text-english-violet hover:text-white-smoke"
              }
            >
              <UserPlusIcon className="h-5 w-5" />
            </NavLink>
          </li>
        </ul>
      )}
    </ul>
  );
};

export default NavBar;
