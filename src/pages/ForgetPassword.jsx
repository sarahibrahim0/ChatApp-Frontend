import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { forgotPassword } from "../redux/apiCalls/passwordApiCalls";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const { registerMessage } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.password);

  const navigate = useNavigate();

  const formSubmitHandler = (values) => {
    dispatch(forgotPassword(values["email"]));
  };
  useEffect(() => {
    if (registerMessage) {
      navigate("/email-sent");
    }
  }, [registerMessage]);

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
    <section className="w-full min-h-screen flex flex-col items-center justify-start  p-10 ">
      <div className="formShadow min-w-[60vh] min-h-[50vh] flex flex-col justify-center items-center rounded-2xl mt-10 lg:w-auto sm:w-full   h-full py-8 px-5">
        {/* <span className=" font-semibold md:text-2xl sm:text-base text-blue-black mb-5 mt-1 pt-5">Forgot Password? </span> */}
        <Formik
          onSubmit={formSubmitHandler}
          initialValues={initialValues}
          validationSchema={schema}
        >
          {(formik) => {
            return (
              <Form className=" w-full flex flex-col justify-center items-center text-center p-3">
                <div className="w-full flex flex-row justify-between items-center space-x-2 p-5">
                  <label
                    htmlFor="email"
                    className="  text-sm font-[500]  text-blue-black "
                  >
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className=" w-full rounded-lg md:text-base sm:text-sm p-2  border-[1px]"
                  />
                </div>

                <ErrorMessage
                  name="email"
                  component="div"
                  className="relative z-10  text-red-500 text-xs italic"
                />

                <button
                  disabled={formik.isSubmitting}
                  type="submit"
                  className="relative z-10 !bg-gradient-to-r from-sky-500 to-indigo-500 my-5 text-white min-h-[41.6px] box-border  hover:!bg-custom-color  transition-all duration-500 ease-in-out  border-[1px] rounded-full py-2 px-7 mr-2"
                >
                    Reset Password
                </button>
              </Form>
            );
          }}
        </Formik>
        {error && <p>{error}</p>}
      </div>
    </section>
  );
};

export default ForgetPassword;
