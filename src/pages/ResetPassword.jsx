import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Field, Form, Formik , ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { setNewPassword } from "../redux/apiCalls/passwordApiCalls";
import { authActions } from "../redux/slices/authSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.password);
  const { userId, token } = useParams();

  const navigate = useNavigate();


  useEffect(()=>{
    dispatch(authActions.register(null));
  },[]);

  


  // From Submit Handler
  const formSubmitHandler = (values) => {
    dispatch(setNewPassword( values['password'], userId, token ));
    navigate('/password-reseted');
  };



  // From Submit Handler
  // const formSubmitHandler = (values) => {
  //   return dispatch(forgotPassword(values['email']));
  // };

  const initialValues = {
    password: ""
  }

  const schema = Yup.object().shape({
    password: Yup.string().required('Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#\\$%\\^&\\*])(?=.{8,})/, 'Must contain 8 characters, one uppercase, one lowercase, one number and one special character'),
  });

  return (


    <section className="w-full min-h-screen flex flex-col items-center justify-start  p-10 ">

    <div className="formShadow min-w-[60vh] min-h-[50vh] flex flex-col justify-center items-center rounded-2xl mt-10 lg:w-auto sm:w-full   h-full py-8 px-5">
    {/* <span className=" font-semibold md:text-2xl sm:text-base text-blue-black mb-5 mt-1 pt-5">Forgot Password? </span> */}
<Formik onSubmit={formSubmitHandler} initialValues={initialValues} validationSchema={schema}>
  {(formik)=>{
    return (
<Form  className=" w-full flex flex-col justify-center items-center  text-center ">
        <div className="w-full flex flex-row justify-between items-center space-x-2 p-5">
        <label htmlFor="email" className="  text-sm font-[500]  text-blue-black ">
          Password
        </label>
        <Field
        name="password"
          type="password"
          id="password"
          placeholder="Enter new password"
          className=" w-full rounded-lg md:text-base sm:text-sm p-2  border-[1px]"
          />
      </div>


     <ErrorMessage name="password" component="div" className="  text-red-500 text-xs italic"/>


      <button disabled={formik.isSubmitting}  type='submit' className="relative z-10 !bg-gradient-to-r from-sky-500 to-indigo-500 my-5 text-white min-h-[41.6px] box-border  hover:!bg-custom-color  transition-all duration-500 ease-in-out  border-[1px] rounded-full py-2 px-7 mr-2" >
    <span className="text-inherit text-sm inline-block mr-1  ">
       Update Password
    </span>
    </button>
    </Form>
    )
  }}
</Formik>
</div>
    </section>

  );
};

export default ResetPassword;
