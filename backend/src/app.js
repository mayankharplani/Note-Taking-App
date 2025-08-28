import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js";

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/",(req,res) => {
    res.send("Hello note taking app")
})


app.use("/api/v1/auth",authRoutes)



export default app;
