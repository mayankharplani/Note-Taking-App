import { User } from "../models/userModel.js";
import { Otp } from "../models/otpModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/generateOtp.js";

export const registerSend = async (req, res) => {
  const { email, dob } = req.body;
  try {
    if (!email || !dob) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    const otp = generateOtp();
    console.log(otp);
    await Otp.deleteMany({ email });
    await new Otp({ email, otp }).save();

    await sendEmail(email, otp);
    res.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
    });
  } catch (error) {
    console.log("Error in sending otp: ", error);
    return res.status(500).json({
      success: false,
      message: "Otp sent failed",
      error,
    });
  }
};

export const registerVerify = async (req, res) => {
  const { email, dob, otp,name } = req.body;
  try {
    const userOtp = await Otp.findOne({ email, otp });
    if (!userOtp)
      return res.status(404).json({
        success: false,
        message: "Invalid or expired OTP",
      });

    const user = new User({ email, dob: new Date(dob),name });
    await user.save();
    await Otp.deleteMany({ email });

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60,
    });
    res.status(201).json({
      success: true,
      message: "Signup Successfully",
      user
    });
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({
      success: false,
      message: "Signup Failed",
      error,
    });
  }
};

export const loginSend = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not Exist, Please Signup Yourself",
      });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email });
    await new Otp({ email, otp }).save();
    await sendEmail(email, otp);
    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
    });
  } catch (error) {
    console.log("Error sending otp in login: ", error);
    res.status(500).json({
      success: false,
      message: "Error sending otp in login",
      error,
    });
  }
};

export const loginVerify = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const userOtp = await Otp.findOne({ email, otp });

    if (!userOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP",
      });
    }

    await Otp.deleteMany({ email });
    const user = await User.findOne({ email });

    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60,
    });
    res.status(200).json({
        success: true,
        message: "Login Successfully",
        user
    })
  } catch (error) {
    console.log("Error in Verify logging",error)
    res.status(500).json({
        success: false,
        message: "Error verification login",
        error
    })
  }
};



export const logout = async (req,res) => {
  try {
    res.clearCookie("jwt",{
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    })
    res.status(200).json({
      success: true,
      message: "Loggedout Successfully"
    })
  } catch (error) {
    console.log("Error in logout: ",error);
    res.status(500).json({
      success: false,
      message: "Logout Failed",
      error
    })
  }
}



export const check = async (req,res) => {
  try {
    res.status(200).json({
      success: true,
      message: "user Authenticated Succesfuly",
      user: req.user,
    });
  } catch (error) {
    console.log("Error authentication error", error);
    res.status(500).json({
      error: "Error Authenticating User",
    });
  }
}