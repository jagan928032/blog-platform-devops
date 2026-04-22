import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("blogUser");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }

  return config;
});

export default api;
