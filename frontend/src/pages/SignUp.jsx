import { Loader, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuthStore } from "../store/useAuthStore.js";

// ✅ Schema with trim
const SignUpSchema = z.object({
  email: z.string().trim().email("Enter a Valid Email"),
  dob: z
    .string()
    .trim()
    .regex(/^\d{2} \d{2} \d{4}$/, "Date must be in format DD MM YYYY"),
  name: z.string().trim().min(4, "Name should be at least 4 characters"),
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits").optional(),
});

const SignUp = () => {
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const { sendingOtp, registerSendOtp,registerUser,isOtp } = useAuthStore();

  const onSubmit = async (data) => {
    const [date, month, year] = data.dob.split(" ");
    data.dob = `${year}-${month}-${date}`;

    try {
      if (!isOtp) {
        await registerSendOtp(data);
      } else {
        await registerUser(data)
        navigate("/")
      }
    } catch (error) {
      console.log("Sign Up Failed ❌", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      {/* ✅ Single Form for Both Layouts */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col md:flex-row"
      >
        {/* Left Column (Mobile full / Desktop half) */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 py-6">
          {/* Header */}
          <div className="flex items-center justify-center md:justify-start mb-6">
            <div className="flex items-center space-x-2">
              <Loader className="w-8 h-8 text-blue-500" />
              <span className="text-xl md:text-2xl font-bold text-black">HD</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left text-black mb-2 md:mb-3">
            Sign up
          </h1>
          <p className="text-gray-500 text-center md:text-left mb-6 md:mb-8">
            Sign up to enjoy the feature of HD
          </p>

          {/* Inputs */}
          <div className="space-y-4 md:space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="Jonas Khanwald"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("dob")}
                  placeholder="11 02 1997"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="jonas_kahnwald@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* OTP */}
            {isOtp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type={showOtp ? "text" : "password"}
                    {...register("otp")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowOtp(!showOtp)}
                  >
                    {showOtp ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors mt-2 flex justify-center items-center"
              disabled={sendingOtp}
            >
              {sendingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : isOtp ? (
                "Sign Up"
              ) : (
                "Get OTP"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pb-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-500 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Right Column - Image (only desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center p-[12px]">
          <img src="/container.jpg" alt="signup" className="w-full h-full object-cover rounded-lg" />
        </div>
      </form>
    </div>
  );
};

export default SignUp;