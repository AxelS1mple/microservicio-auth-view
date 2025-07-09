// src/App.jsx
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import UserList from "./pages/Libro/pages/UserList";
import AutorList from "./pages/Libro/pages/AutoresList";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import NavBar from "./components/NavBar";
import { AuthContext } from "./context/AuthContext";
import './App.css';

function App() {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      {/* NavBar fijo arriba sin fondo degradado */}
      {token && <NavBar />}

      {/* Fondo degradado solo al contenido, debajo del navbar */}
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          {/* Rutas privadas */}
          <Route
            path="/inicio"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/autores"
            element={
              <PrivateRoute>
                <AutorList />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
