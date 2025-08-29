import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    }
})



export const User =  mongoose.model("User", userSchema)