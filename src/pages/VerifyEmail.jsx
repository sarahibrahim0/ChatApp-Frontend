import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../redux/apiCalls/authApiCalls";
import { authActions } from "../redux/slices/AUTHsLICE.JS";


const VerifyEmail = () => {
  const { error , isEmailVerified , isVerifying } = useSelector(state=>state.auth);


    
  const { userId, token } = useParams();
  const dispatch = useDispatch();

  
  useEffect(()=>{
      dispatch(verifyEmail(userId, token));
  }, [userId, token])


  useEffect(() => {
    // Cleanup function to reset the error when the component unmounts
    return () => {
        dispatch(authActions.clearError());
    };
  }, []);


  return (
   <>
   {isVerifying &&  <p>loading</p> }
  {isEmailVerified && <p>
    Your email is verified successfully
  </p> }
  
   </>
  );
};

export default VerifyEmail;
