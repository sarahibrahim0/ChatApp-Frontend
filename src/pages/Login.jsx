import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/apiCalls/authApiCalls";
import { authActions } from "../redux/slices/authSlice";

const Login = () => {
  const { error, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[email,setEmail] = useState('');
  const[pass, setPass] = useState('');

const resetFormRef = useRef(null);

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
    return () => {
      dispatch(authActions.clearError());
    };
  }, []);

 const formSubmitHandler = (values , { resetForm }) => {
    dispatch(loginUser(values)); 
    setEmail(values.email);
    setPass(values.password);
    resetFormRef.current = resetForm; 

};
  useEffect(()=>{
    if(error?.includes("deactivated")){
     navigate("/account-deactivated", { state: { email: email,
      password: pass } })
    }
  },[error]);

  useEffect(() => {
    if (user) {
          if (resetFormRef.current) {
          resetFormRef.current(); 
      navigate("/");

    }
  }}, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-royal-purple mb-6">
          Welcome Back
        </h2>

        <Formik
          onSubmit={formSubmitHandler}
          initialValues={initialValues}
          validationSchema={loginSchema}
        >
          {(formik) => (
            <Form className="space-y-5">
              {/* Email Field */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-royal-purple"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger text-xs italic mt-1"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-royal-purple"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger text-xs italic mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting && !error}
                className="w-full py-2 bg-royal-purple text-white font-medium rounded-md hover:bg-english-violet transition-all duration-200"
              >
                {(formik.isSubmitting && !error) ? "Logging in..." : "Login"}
              </button>

              {/* Forgot Password */}
              <div className="text-sm text-blue-black text-center">
                Forgot Password?{" "}
                <Link
                  to="/forget-password"
                  className="text-very-blue hover:text-blue-black underline ml-1"
                >
                  Reset Password
                </Link>
              </div>
            </Form>
          )}
        </Formik>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
