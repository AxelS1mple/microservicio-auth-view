import { useState, useEffect } from "react";

const API_URL = "https://miapilibroautor.somee.com/api/LibroAutor";

export const useAutores = () => {
  const [autores, setAutores] = useState([]);
  const [servidor, setServidor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Obtener todos los autores
  const obtenerAutores = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener autores");
        return res.json();
      })
      .then((data) => {
        setAutores(Array.isArray(data) ? data : []);
        setServidor("Servidor 1"); // Personalizable
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message || "Error desconocido");
        setAutores([]);
      })
      .finally(() => setLoading(false));
  };

  // ✅ Insertar autor
  const insertarAutor = async (formData) => {
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        // Convertimos fecha a ISO string
        fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
        // Si tu API requiere un GUID aquí, agrégalo, sino omite:
        // autorLibroGuid: formData.autorLibroGuid || generateGuidSomehow(),
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al insertar autor");

      // Refresca la lista completa desde la API para mantener sincronía
      await obtenerAutores();

    } catch (err) {
      console.error("Error al insertar:", err);
      setError(err.message);
    }
  };


  // ✅ Consultar por ID
  const obtenerAutorPorId = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error("Autor no encontrado");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error al buscar por ID:", err);
      setError(err.message);
      return null;
    }
  };


  // ✅ Consultar por nombre
  const obtenerAutorPorNombre = async (nombre) => {
    try {
      const response = await fetch(`${API_URL}/nombre/${encodeURIComponent(nombre)}`);
      if (!response.ok) throw new Error("Autor no encontrado");
      return await response.json();
    } catch (err) {
      console.error("Error al buscar por nombre:", err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    obtenerAutores();
  }, []);

  return {
    autores,
    loading,
    servidor,
    error,
    obtenerAutores,
    insertarAutor,
    obtenerAutorPorId,
    obtenerAutorPorNombre,
  };
};
