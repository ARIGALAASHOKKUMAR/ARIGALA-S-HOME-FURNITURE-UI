import { useState, useEffect } from 'react';
import { apiRequest } from '../api';

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem("woodhaven-token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("woodhaven-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleAuth = async (values) => {
    setSubmitting(true);
    setError("");
    try {
      const endpoint = authMode === "login" ? "/login" : "/register";
      const body = authMode === "login"
        ? { email: values.email, password: values.password }
        : values;
      const data = await apiRequest(endpoint, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("woodhaven-token", data.token);
      localStorage.setItem("woodhaven-user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setNotice(`Welcome${data.user.name ? `, ${data.user.name}` : ""}!`);
      return data;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("woodhaven-token");
    localStorage.removeItem("woodhaven-user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  return { 
    token, setToken, 
    user, setUser, 
    authMode, setAuthMode, 
    authForm, setAuthForm,
    submitting, setSubmitting,
    error, setError,
    notice, setNotice,
    handleAuth,
    logout,
    isAdmin
  };
};