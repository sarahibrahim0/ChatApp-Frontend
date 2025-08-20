import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../redux/apiCalls/authApiCalls";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const registerSchema = yup.object().shape({
    name: yup.string().required("Username is required"),
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

  const formSubmitHandler = async (values, { setSubmitting }) => {
    await dispatch(registerUser(values, navigate));
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-royal-purple mb-6">
          Create Your Account
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={formSubmitHandler}
        >
          {(formik) => (
            <Form className="space-y-5">
              {/* Username */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Field
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-royal-purple"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger text-xs italic mt-1"
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  id="password"
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
                disabled={formik.isSubmitting}
                className="w-full py-2 bg-royal-purple text-white font-medium rounded-md hover:bg-english-violet transition-all duration-200"
              >
                {formik.isSubmitting ? "Registering..." : "Register"}
              </button>

              {/* Link to Login */}
              <div className="text-sm text-blue-black text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-very-blue hover:text-blue-black underline ml-1"
                >
                  Login
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

export default Register;
