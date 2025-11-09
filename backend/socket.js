import http from "http"
import express from "express"
import { Server } from "socket.io"
const app=express()
const server=http.createServer(app)

// const io=new Server(server,{
//     cors:{
//         origin:"http://localhost:5174",
//         methods:["GET","POST"]
//     }
// })

const allowedOrigins = [
  "http://localhost:5173",             // Local frontend (Vite)
  "http://localhost:5174",  
  "https://talk-spot-three.vercel.app", // Main production frontend
];

// ✅ Initialize Socket.IO with flexible CORS handling
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow server-to-server/internal
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // Allow all vercel preview domains
      ) {
        return callback(null, true);
      }
      console.log("❌ Socket blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const userSocketMap={}

export const getSocketId=(receiverId)=>{
return userSocketMap[receiverId]
}

io.on("connection",(socket)=>{
   const userId=socket.handshake.query.userId
   if(userId!=undefined){
    userSocketMap[userId]=socket.id
   }

 io.emit('getOnlineUsers',Object.keys(userSocketMap))  


socket.on('disconnect',()=>{
    delete userSocketMap[userId]
     io.emit('getOnlineUsers',Object.keys(userSocketMap))  
})

})


export {app,io, server}