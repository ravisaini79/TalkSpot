import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import loopRouter from "./routes/loop.routes.js"
import storyRouter from "./routes/story.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket.js"
dotenv.config()

const port=process.env.PORT || 5000
const allowedOrigins = [
  "http://localhost:5173",             // Local frontend (Vite)
  "http://localhost:5174",  
  "https://talk-spot-three.vercel.app", // Main production frontend
];

// ✅ Use dynamic origin handling
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow tools like Postman
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // ✅ Allow all Vercel preview domains
      ) {
        return callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Required for cookies (JWT in cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow all relevant methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow custom headers
  })
);

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/post",postRouter)
app.use("/api/loop",loopRouter)
app.use("/api/story",storyRouter)
app.use("/api/message",messageRouter)


server.listen(port , ()=>{
    connectDb()
    console.log("server started")
})

