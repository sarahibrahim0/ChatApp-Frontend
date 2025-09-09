import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { themeActions } from "../redux/slices/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme); // نجيب التيم من ريدكس

  const handleToggle = () => {
    dispatch(themeActions.toggleTheme()); // نبعث action لتغيير التيم
  };

  return (
    <button
      onClick={handleToggle}
      title={
        theme === "light"
          ? "الوضع الفاتح — اضغطي للتغيير"
          : "الوضع الداكن — اضغطي للتغيير"
      }
      className="p-2"
    >
      {theme === "light" ? (
        <SunIcon className="w-5 h-5 text-white" />
      ) : (
        <MoonIcon className="w-5 h-5 text-black" />
      )}
    </button>
  );
};

export default ThemeToggle;
