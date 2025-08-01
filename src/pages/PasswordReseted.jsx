import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { passwordActions } from "../redux/slices/passwordSlice";


const PasswordReseted = () => {
  const { errorPassword , reseted} = useSelector(state=>state.password);

  const dispatch = useDispatch();
  

  useEffect(() => {
    // Cleanup function to reset the error when the component unmounts
    return () => {
        dispatch(passwordActions.clearError());
    };
  }, []);



  return (
   <>
   {reseted&&  <p>{reseted}</p> }
  {errorPassword && <p>
    {errorPassword}
  </p> }
  
   </>
  );
};

export default PasswordReseted;
