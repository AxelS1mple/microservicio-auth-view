import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://microservicio-auth-xn3l.onrender.com";

export const useAuth = () => {
  const { token, login: setTokenContext, logout: logoutContext } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : "";

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/login")
        ) {
          originalRequest._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          } else {
            await logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${API_URL}/login`, credentials, {
        withCredentials: true,
      });

      const receivedToken = res.data?.token;
      if (!receivedToken) throw new Error("Token no recibido");

      setTokenContext(receivedToken);
      setMessage("Inicio de sesión exitoso");
      return { success: true };
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error al iniciar sesión");
      return { success: false };
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post(`${API_URL}/refresh-token`, {}, {
        withCredentials: true,
      });

      const newToken = res.data?.token;
      if (newToken) {
        setTokenContext(newToken);
        return newToken;
      }
    } catch (error) {
      console.warn("Refresh token falló:", error.response?.data || error.message);
      return null;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.warn("Error al cerrar sesión:", error.response?.data || error.message);
    }

    localStorage.removeItem("token");
    logoutContext();
    setMessage("Sesión cerrada");
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
      return res.data?.securityQuestion || null;
    } catch (error) {
      console.error("Error obteniendo pregunta de seguridad:", error.message);
      return null;
    }
  };

  const deleteAccount = async (data) => {
    try {
      const res = await axios.delete(`${API_URL}/delete-account`, { data });
      setMessage(res.data.message || "Cuenta eliminada");
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar cuenta:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error al eliminar cuenta");
      return { success: false };
    }
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
