import { useState, useContext  } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:4040/api/auth"; // Ajusta según tu API

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
        return true;
      } else {
        setMessage("Token no recibido");
        return false;
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error al iniciar sesión");
      return false;
    }
  };

  const register = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/register`, data);
      setMessage(res.data.message || "Registro exitoso");
    } catch (error) {
      console.error("Error en register:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error al registrar");
    }
  };


  const forgotPassword = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/forgot-password`, data);
      setMessage(res.data.message || "Solicitud enviada correctamente");
    } catch (error) {
      console.error("Error en forgotPassword:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error al cambiar contraseña");
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setMessage("Sesión cerrada");
  };

  return {
    message,
    token,
    login,
    register,
    forgotPassword,
    logout,
  };
};
