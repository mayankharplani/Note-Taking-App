import { Loader, Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { is } from "zod/v4/locales";

const LoginSchema = z.object({
  email: z.string().trim().email("Enter a Valid Email"),
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits").optional(),
});

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisable, setIsResendDisable] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const { isOtp, sendingOtp, loginSendOtp, loginUser } = useAuthStore();

  useEffect(() => {
    if (!isResendDisable) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisable(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResendDisable]);

  const onSubmit = async (data) => {
    try {
      if (!isOtp) {
        await loginSendOtp(data);
      } else {
        await loginUser(data);
        navigate("/");
      }
    } catch (error) {
      console.log("Login Failed", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const email = getValues("email");
      if (email) {
        await loginSendOtp({ email });
        setIsResendDisable(true);
        setTimer(30);
      }
    } catch (error) {
      console.log("Error in resending otp", error);
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
              <span className="text-xl md:text-2xl font-bold text-black">
                HD
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left text-black mb-2 md:mb-3">
            Sign in
          </h1>
          <p className="text-gray-500 text-center md:text-left mb-6 md:mb-8">
            Please Login to continue to your account
          </p>

          {/* Inputs */}
          <div className="space-y-4 md:space-y-5">
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
                <div className="flex flex-col items-start gap-4">
                  <button
                    onClick={handleResendOtp}
                    disabled={isResendDisable}
                    className={`text-blue-500 text-sm font-medium hover:underline mt-5 underline ${
                      isResendDisable ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Resend OTP {isResendDisable && `(${timer}s)`}
                  </button>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="keepLoggedIn"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="keepLoggedIn"
                      className="text-sm text-gray-700"
                    >
                      Keep me logged in
                    </label>
                  </div>
                </div>
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
                "Sign In"
              ) : (
                "Get OTP"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pb-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/register"
              className="text-blue-500 font-medium hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Right Column - Image (only desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center p-[12px]">
          <img
            src="/container.jpg"
            alt="signup"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
