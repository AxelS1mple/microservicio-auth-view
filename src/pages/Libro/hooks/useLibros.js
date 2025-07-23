import { useState, useEffect } from "react";

const API_URL = "https://localhost:7103/api/LibroMaterial";

export const useLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servidor, setServidor] = useState(null);
  const token = localStorage.getItem("token"); // ⬅️ Leer el token guardado

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const obtenerLibros = () => {
    setLoading(true);
    fetch(API_URL, { headers }) // ⬅️ Usar token aquí
      .then((res) => {
        if (res.status === 401) throw new Error("No autorizado");
        if (!res.ok) throw new Error("Error al obtener libros");
        return res.json();
      })
      .then((data) => {
        const lista = Array.isArray(data.libros) ? data.libros : [];
        setServidor(data.servidor || null);
        setLibros(lista);
      })
      .catch((err) => {
        alert(err.message); // ⬅️ Mostrar alerta
        setLibros([]);
      })
      .finally(() => setLoading(false));
  };

  const insertarLibro = async (formData) => {
    const payload = {
      titulo: formData.titulo,
      fechaPublicacion: new Date(formData.fechaPublicacion).toISOString(),
      autorLibro: formData.autorLibro,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.status === 401) return alert("No autorizado");
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
      headers,
      body: JSON.stringify(payload),
    });

    if (res.status === 401) return alert("No autorizado");
    if (!res.ok) throw new Error("Error al actualizar libro");
    obtenerLibros();
  };

  const eliminarLibro = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });

    if (res.status === 401) return alert("No autorizado");
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
    insertarLibro,
    actualizarLibro,
    eliminarLibro,
  };
};
