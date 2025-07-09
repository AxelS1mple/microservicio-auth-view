import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiUser, FiLock, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { message, login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(form);
    setIsLoading(false);

    if (success) {
      navigate("/inicio");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
            <p className="text-blue-100 mt-1">Accede a tu cuenta</p>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5"
            autoComplete="off"
            spellCheck="false"
          >
            {/* Usuario */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  placeholder="Ingresa tu usuario"
                  value={form.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                {message}
              </motion.div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Footer con enlaces */}
          <div className="bg-gray-50 px-6 py-4 text-center space-y-2">
            <Link
              to="/forgot"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <br />
            <Link
              to="/register"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              <FiArrowLeft className="mr-1" />
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </div>

        {/* Términos y condiciones (versión móvil) */}
        <div className="mt-6 md:hidden">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-xs text-center text-gray-500">
              Al iniciar sesión, aceptas nuestros{" "}
              <Link to="/terms" className="text-indigo-600 hover:underline">
                Términos de servicio
              </Link>{" "}
              y{" "}
              <Link to="/privacy" className="text-indigo-600 hover:underline">
                Política de privacidad
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
