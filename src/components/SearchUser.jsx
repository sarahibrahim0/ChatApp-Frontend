import { useDispatch, useSelector } from "react-redux";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import {
  getUserByEmail,
  getUserById,
  clearSearchedUser,
} from "../redux/apiCalls/usersApiCalls";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchedUser, loading, error } = useSelector((state) => state.users);
  const [searchedEmail, setSearchedEmail] = useState("");

  const handleSearch = () => {
    if (searchedEmail.trim() !== "") {
      dispatch(getUserByEmail(searchedEmail.trim()));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUserClick = (user) => {
    dispatch(clearSearchedUser());
    dispatch(getUserById(user._id));
    setSearchedEmail("");
    navigate(`/${user._id}`);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchedEmail}
          placeholder="Search By Email"
          onChange={(e) => setSearchedEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-9 pl-4 pr-10 rounded-full bg-white-smoke text-english-violet text-xs placeholder:text-royal-violet outline-none shadow-sm focus:ring-2 focus:ring-royal-purple transition-all"
        />
        <MagnifyingGlassIcon
          onClick={handleSearch}
          className="absolute right-3 top-2.5 h-4 w-4 text-royal-purple cursor-pointer hover:scale-110 transition"
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-royal-purple"></div>
        </div>
      )}

      {/* Search Result */}
      {!loading && searchedUser && (
        <div
          onClick={() => handleUserClick(searchedUser)}
          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer bg-gradient-to-r from-russian-violet to-royal-purple hover:brightness-110 transition-all shadow-md hover:shadow-lg text-white"
        >
          <UserCircleIcon className="h-9 w-9 text-white-smoke" />
          <div className="text-sm leading-tight">
            <p className="font-semibold">{searchedUser.name}</p>
            <p className="text-xs text-white-smoke">{searchedUser.email}</p>
          </div>
        </div>
      )}

      {/* No User Found */}
      {!loading && error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white-smoke text-royal-purple shadow-sm">
          <ExclamationCircleIcon className="h-5 w-5 text-royal-purple" />
          <p className="text-xs font-medium">لا يوجد مستخدم بهذا الإيميل</p>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
