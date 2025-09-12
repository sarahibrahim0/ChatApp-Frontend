import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

const SideBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logOut = () => dispatch(logoutUser());

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* زر الفتح - زرار بارز من الطرف */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-1/2 left-0 -translate-y-1/2 
          bg-royal-purple dark:bg-white-smoke text-white
          w-1.5 h-12 flex items-center justify-center
          rounded-r-full shadow z-50 border-2 border-royal-purple dark:border-white-smoke"
      >
      </button>

      {/* Overlay لما المنيو مفتوحة */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-20 bg-russian-violet dark:bg-licorice text-white transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 md:hidden`}
      >
        <ul className="flex flex-col items-center h-full py-7">
          {/* Profile */}
          {user && (
            <li className="mb-4">
              <img
                src={user?.profilePhoto?.url || img}
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            </li>
          )}

          {/* Links */}
          {user && (
            <>
              <li className="mb-4">
                <NavLink to="/" onClick={() => setOpen(false)}>
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 hover:text-royal-purple" />
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink to="/profile" onClick={() => setOpen(false)}>
                  <UserIcon className="h-5 w-5 hover:text-royal-purple" />
                </NavLink>
              </li>
              <li className="mb-4">
                <NavLink to="/settings" onClick={() => setOpen(false)}>
                  <Cog6ToothIcon className="h-5 w-5 hover:text-royal-purple" />
                </NavLink>
              </li>
            </>
          )}

          {/* Spacer عشان يدفع باقي الآيكونات تحت */}
          <div className="flex-1"></div>

          {/* Theme Toggle */}
          <li className="mb-4">
            <ThemeToggle />
          </li>

          {/* Logout / Login & Register */}
          {user ? (
            <li>
              <button onClick={logOut}>
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5 hover:text-royal-purple" />
              </button>
            </li>
          ) : (
            <>
              <li className="mb-4">
                <NavLink to="/login" onClick={() => setOpen(false)}>
                  <ArrowLeftEndOnRectangleIcon className="h-5 w-5 hover:text-royal-purple" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={() => setOpen(false)}>
                  <UserPlusIcon className="h-5 w-5 hover:text-royal-purple" />
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default SideBar;
