import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../redux/apiCalls/passwordApiCalls";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { resetedMsg } = useSelector((state) => state.password);
  const { errorPassword } = useSelector((state) => state.password);
  const navigate = useNavigate();

  useEffect(() => {
    if (resetedMsg) {
      navigate("/email-sent");
    }
  }, [resetedMsg]);

  const initialValues = {
    email: "",
  };

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Invalid email address"
      ),
  });

  return (
    <div className="flex justify-center items-center min-h-screen 
    dark:bg-licorice
     bg-white-smoke px-4">
      <div className="bg-white
      dark:bg-licorice
       shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-royal-purple mb-4">Forgot Password?</h2>
        <p className="text-gray-600 mb-6">Enter your email to reset your password</p>

        <Formik
          onSubmit={(values) => dispatch(forgotPassword(values.email))}
          initialValues={initialValues}
          validationSchema={schema}
        >
          {(formik) => (
            <Form className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-russian-violet mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-[#D1B3E0] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A55EEA] focus:border-[#A55EEA] transition duration-200"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                disabled={formik.isSubmitting}
                type="submit"
                className="w-full bg-royal-purple text-white py-2 rounded-full hover:bg-russian-violet transition duration-300"
              >
                Reset Password
              </button>
            </Form>
          )}
        </Formik>

        {errorPassword && (
          <p className="text-red-600 font-medium text-sm mt-4">Error: {errorPassword}</p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
