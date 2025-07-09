import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/30 shadow-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Links de navegación */}
          <div className="flex items-center space-x-2">
            <Link 
              to="/inicio" 
              className="text-sm font-semibold text-white hover:text-cyan-100 transition-colors duration-200 px-3 py-2 rounded-md"
            >
              📚 Libros
            </Link>
            <Link 
              to="/autores" 
              className="text-sm font-semibold text-white hover:text-cyan-100 transition-colors duration-200 px-3 py-2 rounded-md"
            >
              👤 Autores
            </Link>
          </div>

          {/* Usuario y Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <span className="hidden md:inline-block text-white text-sm font-medium">
                👋 Bienvenido, {user.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 shadow-md"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
