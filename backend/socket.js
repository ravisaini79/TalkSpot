import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ All frontend origins allowed (local + Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://talk-spot-three.vercel.app",
];

// ✅ Initialize Socket.IO with flexible CORS
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests without origin (like server-to-server)
      if (!origin) return callback(null, true);

      // ✅ Allow known and preview Vercel domains
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
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

// ✅ Store userId -> socketId mapping
const userSocketMap = {};

// ✅ Helper to find receiver's socket ID
export const getSocketId = (receiverId) => userSocketMap[receiverId];

// ✅ Handle socket connections
io.on("connection", (socket) => {
  try {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`🟢 User connected: ${userId}`);
    }

    // Send all online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // ✅ Handle disconnect
    socket.on("disconnect", () => {
      if (userId) {
        delete userSocketMap[userId];
        console.log(`🔴 User disconnected: ${userId}`);
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  } catch (error) {
    console.error("Socket error:", error);
  }
});

export { app, server };
