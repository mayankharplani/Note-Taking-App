import express from "express"
import { check, loginSend, loginVerify, logout, registerSend, registerVerify } from "../controllers/authController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"

const authRoutes = express.Router();

authRoutes.post("/register/send",registerSend);

authRoutes.post("/register/verify",registerVerify)

authRoutes.post("/login/send", loginSend)


authRoutes.post("/login/verify", loginVerify)

authRoutes.get("/check",authMiddleware,check)


authRoutes.post("/logout",logout)



export default authRoutes