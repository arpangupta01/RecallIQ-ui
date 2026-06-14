"use client";

import axios from "axios";


const API_BASE = "http://127.0.0.1:8000";
const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        console.log("refresh token",refreshToken);
        
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(`${API_BASE}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        console.log(res);
        
        const newAccessToken = res?.data.access_token;
        console.log("new access token",newAccessToken);
        
        // ✅ save new token
        localStorage.setItem("token", newAccessToken);

        // ✅ retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        // ❌ refresh failed → logout
        console.log(err);
        
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");

        // window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  },
);
export default api;
