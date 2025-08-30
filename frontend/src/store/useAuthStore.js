import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../libs/axios.js";
import { toast } from "react-toastify";

export const useAuthStore = create(
  persist(
    (set) => ({
      isCheckingAuth: false,
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      sendingOtp: false,
      isOtp: false,

      checkAuth: async () => {
        try {
          set({ isCheckingAuth: true });
          const res = await axiosInstance.get("/auth/check", {
            withCredentials: true,
          });
          set({ authUser: res.data.user, isOtp: false });
        } catch (error) {
          console.log("Error in checking auth", error);
          set({ authUser: null, isOtp: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      registerSendOtp: async (data) => {
        try {
          set({ sendingOtp: true });
          const res = await axiosInstance.post("/auth/register/send", data);
          set({ isOtp: true });
          toast("OTP Sent Successfully", {
            position: "bottom-left",
          });
        } catch (error) {
          console.error("Error Sending OTP", error);
          set({ isOtp: false });
        } finally {
          set({ sendingOtp: false });
        }
      },

      registerUser: async (data) => {
        try {
          set({ isSigningUp: true });
          const res = await axiosInstance.post("/auth/register/verify", data);
          set({ authUser: res.data.user, isOtp: false });
        } catch (error) {
          console.error("Error Signing Up", error);
        } finally {
          set({ isSigningUp: false });
        }
      },

      loginSendOtp: async (data) => {
        try {
          set({ sendingOtp: true });
          const res = await axiosInstance.post("/auth/login/send", data);
          set({ isOtp: true });
          if(!res)
          toast("OTP Sent Successfully", {
            position: "bottom-left",
          });
        } catch (error) {
          console.log("Error in Sending Login OTP", error);
          toast("Please Register Yourself First",{
            position: "bottom-left"
          });
        } finally {
          set({ sendingOtp: false });
        }
      },

      loginUser: async (data) => {
        try {
          set({ isLoggingIn: true });
          const res = await axiosInstance.post("/auth/login/verify", data);
          set({ authUser: res.data.user, isOtp: false });
        } catch (error) {
          console.error("Error Logging In", error);
        } finally {
          set({ isLoggingIn: false });
        }
      },

      resendOtp: async (data) => {
        try {
          set({sendingOtp: true});
          const res = await axiosInstance.post("/auth/resend-otp",data);
          
        } catch (error) {
          
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null, isOtp: false });
        } catch (error) {
          console.log("Error in Logging out", error);
          set({ authUser: null, isOtp: false });
        }
      },

      resetOtpState: () => {
        set({ isOtp: false });
      },

      clearAuth: () => {
        set({ authUser: null, isOtp: false });
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      partialize: (state) => ({
        authUser: state.authUser,
        isOtp: state.isOtp,
      }), // only persist these fields
    }
  )
);
