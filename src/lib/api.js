"use client";

import axios from "axios";


// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "http://localhost:8000/"
const api = axios.create({
  baseURL: API_BASE,
});
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        ("refresh token",refreshToken);
        
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(`${API_BASE}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        (res);
        
        const newAccessToken = res?.data.access_token;
        ("new access token",newAccessToken);
        
        // ✅ save new token
        localStorage.setItem("token", newAccessToken);

        // ✅ retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        // ❌ refresh failed → logout
        (err);
        
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");

        // window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  },
);
export default api;
