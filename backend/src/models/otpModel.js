import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})



export const Otp = mongoose.model("Otp",otpSchema)