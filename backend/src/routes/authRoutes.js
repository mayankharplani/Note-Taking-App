import express from "express"
import { loginSend, loginVerify, registerSend, registerVerify } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/register/send",registerSend);

authRoutes.post("/register/verify",registerVerify)

authRoutes.post("/login/send", loginSend)


authRoutes.post("/login/verify", loginVerify)


export default authRoutes