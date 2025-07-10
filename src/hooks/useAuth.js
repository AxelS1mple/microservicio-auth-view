import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://microservicio-auth-8574.onrender.com/api/auth"; // Ajusta según tu API

export const useAuth = () => {
  const { token, login: setTokenContext, logout: logoutContext } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      const receivedToken = res.data.token;
      if (receivedToken) {
        setTokenContext(receivedToken);
        setMessage("Inicio de sesión exitoso");
        return { success: true };
      } else {
        setMessage("Token no recibido");
        return { success: false };
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al iniciar sesión");
      return { success: false };
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/register`, data);
      setMessage(res.data.message || "Registro exitoso");
      return { success: true };
    } catch (error) {
      console.error("Error en register:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error al registrar");
      return { success: false };
    }
  };

  const forgotPassword = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, data);
      setMessage(res.data.message || "Solicitud enviada correctamente");
      return { success: true };
    } catch (error) {
      console.error("Error en forgotPassword:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error al cambiar contraseña");
      return { success: false };
    }
  };

  const getSecurityQuestion = async (username) => {
    try {
      const res = await axios.get(`${API_URL}/security-question/${username}`);
      if (res.status === 200) {
        return res.data.securityQuestion;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const deleteAccount = async (data) => {
    try {
      const res = await axios.delete(`${API_URL}/delete-account`, { data });
      setMessage(res.data.message || "Cuenta eliminada");
      return { success: true };
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al eliminar cuenta");
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    logoutContext();
    setMessage("Sesión cerrada");
  };

  return {
    message,
    token,
    login,
    register,
    forgotPassword,
    getSecurityQuestion,
    deleteAccount,
    logout,
  };
};
