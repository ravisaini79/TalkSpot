// src/lib/axios.js
import axios from "axios";

// ✅ Create Axios instance
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000"
      : "https://talkspot-d7lb.onrender.comi",
  withCredentials: true, // Send cookies (for web)
});

// ✅ Automatically attach token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // Read token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

