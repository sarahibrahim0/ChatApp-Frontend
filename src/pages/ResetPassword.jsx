import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { setNewPassword } from "../redux/apiCalls/passwordApiCalls";
import { authActions } from "../redux/slices/authSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { errorPassword } = useSelector((state) => state.password);
  const { userId, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(authActions.register(null));
  }, []);

  const formSubmitHandler = (values) => {
    dispatch(setNewPassword(values.password, userId, token));
    navigate("/password-reseted");
  };

  const initialValues = {
    password: "",
  };

  const schema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!+@#\$%\^&\*])(?=.{8,})/,
        "Must contain 8 characters, one uppercase, one lowercase, one number and one special character"
      ),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-white-smoke dark:text-white-smoke dark:bg-licorice px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full text-center dark:text-white-smoke dark:bg-licorice">
        <h2 className="text-xl font-bold text-royal-purple mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-6">Enter a new strong password</p>

        <Formik
          onSubmit={formSubmitHandler}
          initialValues={initialValues}
          validationSchema={schema}
        >
          {(formik) => (
            <Form className="space-y-4">
              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  id="password"
                  placeholder="Enter your new password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-royal-purple"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                disabled={formik.isSubmitting}
                type="submit"
                className="w-full bg-royal-purple text-white py-2 rounded-lg hover:bg-russian-violet transition duration-200"
              >
                Update Password
              </button>
            </Form>
          )}
        </Formik>

        {errorPassword && (
          <p className="text-red-600 font-medium mt-4">Error: {errorPassword}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
