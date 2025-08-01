import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/apiCalls/authApiCalls";
import { authActions } from "../redux/slices/authSlice";
import socket from "../utils/socket";

const Login = () => {

  const {error , user , token} = useSelector(state=>state.auth);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    email: "",
  };
  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Invalid email address"
      ),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#\\$%\\^&\\*])(?=.{8,})/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special character"
      ),
  });

  useEffect(() => {
    // Cleanup function to reset the error when the component unmounts
    return () => {
        dispatch(authActions.clearError());
    };
  }, []);
  // From Submit Handler
  const formSubmitHandler = async (values) => { 
    await dispatch(loginUser(values));
 }
useEffect(() => {
  if (user) {
  

    navigate('/');
  }

}, [user, navigate]);

  return (
    <>
      <Formik
        onSubmit={formSubmitHandler}
        initialValues={initialValues}
        validationSchema={loginSchema}
      >
        {(formik) => {
          return (
            <Form className="pt-5">
              <div
                className="flex flex-col items-start mb-4 w-full "
              >
                <Field
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className=" w-full rounded-lg md:text-base sm:text-sm p-2  border-[1px]"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger text-xs italic"
                />
              </div>

              <div
                className="flex flex-col items-start mb-4 w-full"
              >
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className=" w-full rounded-lg md:text-base sm:text-sm p-2  border-[1px]"
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger text-xs italic"
                />
              </div>

              <button
                type="submit"
                disabled={formik.isSubmitting}
                className=" m-auto "
              >
                Login
              </button>

              <div className=" margin-auto lg:whitespace-nowrap sm:whitespace-wrap self-start mt-4 text-blue-black lg:text-base sm:text-sm">
                Forgot Password?{" "}
                <Link
                  to="/forget-password"
                  className="text-very-blue lg:text-base sm:text-sm whitespace-nowrap hover:text-blue-black transition-all duration-300"
                >
                  Reset Password
                </Link>
              </div>
            </Form>
          );
        }}
      </Formik>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default Login;
