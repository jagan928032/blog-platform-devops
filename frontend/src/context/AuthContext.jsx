import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

const getErrorMessage = (error, fallbackMessage) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.request) {
    return "Cannot reach the server right now. Please make sure the backend is running on port 5001.";
  }

  return fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("blogUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("blogUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("blogUser");
    }
  }, [user]);

  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Login failed") };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Registration failed") };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
