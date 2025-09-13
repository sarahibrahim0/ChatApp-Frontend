// components/GlobalErrorToast.js
import { useSelector, useDispatch } from "react-redux";
import { removeGlobalError } from "../redux/slices/globalErrorSlice";
import { useEffect } from "react";

const GlobalErrorToast = () => {
  const errors = useSelector(state => state.globalError);
  const dispatch = useDispatch();

  useEffect(() => {
    errors.forEach(err => {
      setTimeout(() => {
        dispatch(removeGlobalError(err.id));
      }, 3000); // toast يختفي بعد 5 ثواني
    });
  }, [errors, dispatch]);

  if (!errors.length) return null;

  return (
<div className="fixed top-0 left-0 w-full flex justify-center z-50">
      {errors.map(err => (
        <div
          key={err.id}
          className="bg-red-600 text-white px-4 py-3 rounded shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
        >
          <div className="flex justify-between items-center">
            <span>{err.message}</span>
            <button
              onClick={() => dispatch(removeGlobalError(err.id))}
              className="ml-4 text-white font-bold hover:text-gray-200"
            >
              ✖
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GlobalErrorToast;