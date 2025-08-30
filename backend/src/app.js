import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";


const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
}));

app.get("/",(req,res) => {
    res.send("Hello note taking app")
})


app.use("/api/v1/auth",authRoutes)

app.use("/api/v1/note",noteRoutes)



export default app;
