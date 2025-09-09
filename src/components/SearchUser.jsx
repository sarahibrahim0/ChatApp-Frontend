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
  const [hasSearched, setHasSearched] = useState(false); // 🆕 عشان نعرف المستخدم عمل سيرش فعلاً

  const handleSearch = () => {
    if (searchedEmail.trim() !== "") {
      dispatch(getUserByEmail(searchedEmail.trim()));
      setHasSearched(true); // 🆕 هنا نأكد إن في سيرش حصل
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
    setHasSearched(false); // 🆕 نرجعه false بعد ما ندخل على اليوزر
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
          className="flex items-center gap-2 p-2 rounded-lg cursor-pointer 
                     bg-gradient-to-r from-russian-violet to-royal-purple 
                     hover:brightness-110 transition-all shadow text-white 
                     w-full h-12"
        >
          <UserCircleIcon className="h-7 w-7 text-white-smoke flex-shrink-0" />
          <div className="text-xs leading-tight truncate w-[calc(100%-2rem)]">
            <p className="font-medium truncate">{searchedUser.name}</p>
            <p className="text-[10px] text-white-smoke truncate">
              {searchedUser.email}
            </p>
          </div>
        </div>
      )}

      {/* No User Found */}
      {!loading && error && hasSearched && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white-smoke text-royal-purple shadow-sm">
          <ExclamationCircleIcon className="h-5 w-5 text-royal-purple" />
          <p className="text-xs font-medium">
            Email not registered
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
