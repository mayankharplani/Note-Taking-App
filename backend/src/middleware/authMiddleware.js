import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"


export const authMiddleware = async (req,res,next) => {
    try {
        let token = req.cookies.jwt;
        if(!token){
            return res.status(404).json({
                success: false,
                message: "Unauthorized to Perform"
            })
        }
        let decoded;
        decoded = jwt.verify(token,process.env.JWT_SECRET)


        const user = await User.findOne({_id: decoded.userId})
        console.log(user);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error authenticating User:", error);
        res.status(500).json({message: "Error authenticating user"});
    }
}