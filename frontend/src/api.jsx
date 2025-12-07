import axios from "axios";
// make sure you have refreshToken function
import { refreshToken as fetchNewToken } from "./pages/Authentication/Authfunc.jsx";
const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach access token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors (token expired)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the token
        const data = await fetchNewToken();
        // Update headers with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        // Retry original request
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, log out user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // optional redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
