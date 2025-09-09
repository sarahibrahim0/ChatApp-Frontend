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
  Bars3Icon,
  XMarkIcon,
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
      {/* زر الفتح - يظهر بس في الموبايل */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-3 text-white bg-russian-violet dark:bg-licorice"
      >
        <Bars3Icon className="h-6 w-6" />
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
        className={`fixed top-0 left-0 h-full w-64 bg-russian-violet dark:bg-licorice text-white transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 md:hidden`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <ul className="flex flex-col space-y-4 p-4">
          {/* Profile */}
          {user && (
            <li>
              <img
                src={user?.profilePhoto?.url || img}
                alt={user?.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            </li>
          )}

          {/* Links */}
          {user && (
            <>
              <li>
                <NavLink to="/" onClick={() => setOpen(false)}>
                  <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 hover:text-royal-purple" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" onClick={() => setOpen(false)}>
                  <UserIcon className="h-6 w-6 hover:text-royal-purple" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/settings" onClick={() => setOpen(false)}>
                  <Cog6ToothIcon className="h-6 w-6 hover:text-royal-purple" />
                </NavLink>
              </li>
            </>
          )}

          {/* Theme Toggle */}
          <li>
            <ThemeToggle />
          </li>

          {/* Logout / Login & Register */}
          {user ? (
            <li>
              <button onClick={logOut}>
                <ArrowLeftStartOnRectangleIcon className="h-6 w-6 hover:text-royal-purple" />
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={() => setOpen(false)}>
                  <ArrowLeftEndOnRectangleIcon className="h-6 w-6 hover:text-royal-purple" />
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" onClick={() => setOpen(false)}>
                  <UserPlusIcon className="h-6 w-6 hover:text-royal-purple" />
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
