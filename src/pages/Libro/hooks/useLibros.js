import { useState, useEffect } from "react";

const API_URL = "http://localhost:5005/api/LibroMaterial";

export const useLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servidor, setServidor] = useState(null);

  const obtenerLibros = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener libros");
        return res.json();
      })
      .then((data) => {
        // ✅ Extraemos solo el arreglo "libros" del JSON de respuesta
        const lista = Array.isArray(data.libros) ? data.libros : [];
        setServidor(data.servidor || null);
        setLibros(lista);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLibros([]); // ❗Evitar que libros quede en null u objeto
      })
      .finally(() => setLoading(false));
  };

  const obtenerLibroPorId = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Error al obtener el libro");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const insertarLibro = async (formData) => {
    const payload = {
      titulo: formData.titulo,
      fechaPublicacion: new Date(formData.fechaPublicacion).toISOString(),
      autorLibro: formData.autorLibro,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al insertar libro");
    obtenerLibros();
  };

  const actualizarLibro = async (id, formData) => {
    const payload = {
      libreriaMaterialId: id,
      titulo: formData.titulo,
      fechaPublicacion: new Date(formData.fechaPublicacion).toISOString(),
      autorLibro: formData.autorLibro,
    };

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al actualizar libro");
    obtenerLibros();
  };

  const eliminarLibro = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar libro");
    obtenerLibros();
  };

  useEffect(() => {
    obtenerLibros();
  }, []);

  return {
    libros,
    loading,
    servidor,
    obtenerLibros,
    obtenerLibroPorId,
    insertarLibro,
    actualizarLibro,
    eliminarLibro,
  };
};
