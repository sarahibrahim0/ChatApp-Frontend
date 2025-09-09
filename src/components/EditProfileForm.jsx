import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";


const EditProfileForm = ({ onClose, onSubmit }) => {
    const {user } = useSelector((state) => state.auth);
const initialValues = {
  name: user?.username|| "",
  email: user?.email || "",
  password: "",
  phone: user?.phone || "",
  gender: user?.gender || "",
  title: user?.title || "",
  birthDate: user?.birthDate?.slice(0, 10) || "", // Ensure it's yyyy-mm-dd
  profilePhoto: user?.profilePhoto.url || ""
};


  const validationSchema = Yup.object({
    name: Yup.string(),
    email: Yup.string().email("Invalid email"),
    password: Yup.string().min(6, "Too short"),
    phone: Yup.string(),
    gender: Yup.string(),
    title: Yup.string(),
    birthDate: Yup.date(),
    profilePhoto: null
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("profilePhoto", file);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
  <div className="bg-white dark:text-white-smoke dark:bg-licorice p-4 rounded-lg shadow-xl w-full max-w-md relative max-h-screen overflow-y-auto">
    <button
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
      onClick={onClose}
    >
      ×
    </button>

    <h2 className="text-base font-semibold text-russian-violet dark:text-white-smoke mb-3 text-center">
      Edit Profile
    </h2>

    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-3 text-xs text-russian-violet dark:text-white-smoke font-medium">

          {/* User Image */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-royal-violet shadow-sm">
              <img
                src={
                  typeof values.profilePhoto === "string"
                    ? values.profilePhoto
                    : URL.createObjectURL(values.profilePhoto)
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="mt-1 text-[10px] text-gray-500 dark:text-white-smoke">User Photo</label>
          </div>

          {/* Grid Fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block mb-1">Name</label>
              <Field name="name" className="w-full border  dark:bg-licorice border-royal-violet rounded px-2 py-1 outline-none" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-[10px]" />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <Field name="email" type="email" className="w-full  dark:bg-licorice border border-royal-violet rounded px-2 py-1 outline-none" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-[10px]" />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <Field name="password" type="password" className="w-full  dark:bg-licorice border border-royal-violet rounded px-2 py-1 outline-none" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-[10px]" />
            </div>

            <div>
              <label className="block mb-1">Phone</label>
              <Field name="phone" className="w-full  dark:bg-licorice border border-royal-violet rounded px-2 py-1 outline-none" />
            </div>

            <div>
              <label className="block mb-1">Gender</label>
              <Field as="select" name="gender" className="w-full  dark:bg-licorice border border-royal-violet rounded px-2 py-1 outline-none">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Field>
            </div>

            <div>
              <label className="block mb-1">Birth Date</label>
              <Field name="birthDate" type="date" className="w-full  dark:bg-licorice border border-royal-violet rounded px-2 py-1 outline-none" />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block mb-1">Title</label>
            <Field
              name="title"
              as="textarea"
              rows="2"
              className="w-full border border-royal-violet rounded px-2 py-1 outline-none dark:bg-licorice"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block mb-1">Change Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setFieldValue)}
              className="w-full border border-royal-violet rounded px-2 py-1 outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="bg-royal-purple dark:text-white-smoke dark:bg-licorice hover:bg-russian-violet text-white px-3 py-1.5 rounded text-xs transition"
            >
              Save Changes
            </button>
          </div>

        </Form>
      )}
    </Formik>
  </div>
</div>
  );
};

export default EditProfileForm;
