import { create } from "zustand";
import { axiosInstance } from "../libs/axios.js";
import { toast } from "react-toastify";

export const useAuthStore = create((set) => ({
  isCheckingAuth: false,
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  sendingOtp: false,
  isOtp: false,


  checkAuth: async () => {
    try {
      set({isCheckingAuth: true});
      const res = await axiosInstance.get("/auth/check");
      set({authUser: res.data.user})
    } catch (error) {
      console.log("Error in checking auth",error);
      set({authUser:null})
    }finally{
      set({isCheckingAuth: false})
    }
  },

  registerSendOtp: async (data) => {
    console.log("Send otp store",data);
    try {
      set({ sendingOtp: true });
      const res = await axiosInstance.post("/auth/register/send", data);
      set({isOtp: res.data.success});
      toast("Otp Sent Successfully",{
        position: "bottom-left"
      });
    } catch (error) {
      console.error("Error Sending Otp", error);
      toast("Otp Sent Failed");
    } finally {
      set({ sendingOtp: false });
    }
  },


  registerUser: async (data) => {
    try {
        set({isSigningUp: true});
        const res = await axiosInstance.post("/auth/register/verify", data);
        set({authUser: res.data.user})
    } catch (error) {
        console.error("Error Signing Up", error);
    }
    finally{
        set({isSigningUp: false});
    }
  },


  loginSendOtp: async (data) => {
    try {
        set({sendingOtp: true});
        const res = await axiosInstance.post("/auth/login/send",data)
        set({isOtp: res.data.success})
        toast("Otp Send Successfully",{
            position: "bottom-left"
        })
    } catch (error) {
        console.log("Error in Sending Login Otp", error);
        toast("Otp Sent Failed")
    }
    finally{
        set({sendingOtp: false})
    }
  },

  loginUser: async (data) => {
    try {
        set({isLoggingIn: true});
        const res = await axiosInstance.post("/auth/login/verify",data);
        set({authUser: res.data.user})
    } catch (error) {
        console.error("Error Logging In", error);
    }
    finally{
        set({isLoggingIn: false})
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({authUser: null})
    } catch (error) {
      console.log("Error in Logging out", error)
    }
  }

}));
