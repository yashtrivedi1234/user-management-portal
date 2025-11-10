import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegisterUserMutation } from "../redux/api";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/^[A-Za-z ]+$/, "Name must contain only letters and spaces")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", email: "", password: "" },
  });

  const [registerUser] = useRegisterUserMutation();
  const [message, setMessage] = React.useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Logo upload state
  const [logoFile, setLogoFile] = React.useState(null);
  const [logoPreview, setLogoPreview] = React.useState(null);

  const onSubmit = async (formData) => {
    try {
      setMessage({ type: "info", text: "Processing registration..." });

      // Prepare registration data with all required fields
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        avatar: "https://i.imgur.com/6VBx3io.png", // Always provide a default avatar URL that's publicly accessible
      };

      // Attempt registration with complete data
      await registerUser(registrationData).unwrap();

      // Update Redux store with user details
      const userData = {
        name: formData.name,
        email: formData.email,
        avatar: logoPreview,
      };
      console.log("Saving user data:", userData);
      dispatch(setUserDetails(userData));

      // Show success message
      setMessage({
        type: "success",
        text: "Registration successful! Redirecting to dashboard...",
      });

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      // Handle specific error cases
      const errorMessage = error.data?.message
        ? `Registration failed: ${error.data.message}`
        : "Registration failed. Please check your details and try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });

      console.error("[Registration Error]:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6 transition-all duration-300"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Join us and start your journey!
        </p>

        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm font-medium shadow-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* INPUTS */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              className={`w-full p-3 rounded-lg border transition-all duration-200 outline-none bg-gray-50 focus:bg-white ${
                errors.name
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-300"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`w-full p-3 rounded-lg border transition-all duration-200 outline-none bg-gray-50 focus:bg-white ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className={`w-full p-3 rounded-lg border transition-all duration-200 outline-none bg-gray-50 focus:bg-white pr-14 ${
                  errors.password
                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* logo  */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Logo
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  setLogoFile(file);
                  setLogoPreview(URL.createObjectURL(file));
                } else {
                  setLogoFile(null);
                  setLogoPreview(null);
                }
              }}
              className="sr-only"
            />

            <label
              htmlFor="logo"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm"
            >
              Choose file
            </label>

            <div className="flex items-center space-x-3">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="logo preview"
                  className="w-12 h-12 rounded-full object-cover border"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border">
                  {/* placeholder */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m8 4H8"
                    />
                  </svg>
                </div>
              )}

              <div className="flex flex-col">
                <span className="text-sm text-gray-700">
                  {logoFile ? logoFile.name : "No file chosen"}
                </span>
                {logoFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                      // also clear the file input element
                      const el = document.getElementById("logo");
                      if (el) el.value = null;
                    }}
                    className="text-sm text-red-600 hover:underline mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* BUTTON */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 shadow-md ${
            !isValid || isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          {isSubmitting ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
