import React, { useMemo, useState, useEffect } from "react";
import { useLibros } from "../hooks/useLibros";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const UserList = () => {
  const {
    libros = [],
    loading,
    servidor,
    error,
    insertarLibro,
    actualizarLibro,
    eliminarLibro,
  } = useLibros();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    titulo: "",
    fechaPublicacion: "",
    autorLibro: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  });

  useEffect(() => {
    if (servidor) {
      console.log("Servidor conectado:", servidor);
    }
  }, [servidor]);

  const filteredLibros = useMemo(() => {
    if (!Array.isArray(libros)) return [];
    if (!searchTerm.trim()) return libros;
    const term = searchTerm.toLowerCase();
    return libros.filter((libro) =>
      libro.titulo.toLowerCase().includes(term) ||
      libro.libreriaMaterialId.toLowerCase().includes(term)
    );
  }, [libros, searchTerm]);

  const abrirModalAgregar = () => {
    setFormData({
      titulo: "",
      fechaPublicacion: "",
      autorLibro: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const abrirModalEditar = (libro) => {
    setFormData({
      titulo: libro.titulo,
      fechaPublicacion: libro.fechaPublicacion.slice(0, 10),
      autorLibro: libro.autorLibro || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    });
    setEditId(libro.libreriaMaterialId);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = (id) => setDeleteConfirm(id);

  const confirmDelete = async () => {
    try {
      await eliminarLibro(deleteConfirm);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error al eliminar libro:", error);
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await actualizarLibro(editId, formData);
      } else {
        await insertarLibro(formData);
      }
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar libro:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 md:px-6 py-8 md:py-10 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black drop-shadow tracking-wide">📚 Biblioteca Digital</h1>
          <p className="text-base md:text-lg text-white/80 mt-3">Administra tus libros con estilo moderno</p>
          {servidor && (
            <p className="text-sm text-white/60 mt-2 italic">Servidor conectado: <span className="font-mono">{servidor}</span></p>
          )}
        </header>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
          <input
            type="text"
            placeholder="🔍 Buscar por título o ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-md border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-3xl px-5 py-3 text-sm placeholder-white focus:ring-2 focus:ring-white focus:outline-none"
          />
          <button
            onClick={abrirModalAgregar}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg transition-transform duration-200"
          >
            <FaPlus /> Agregar Libro
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400 text-red-100 px-5 py-3 rounded-lg mb-6 md:mb-8 shadow">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16 md:py-20">
            <div className="animate-spin h-10 w-10 md:h-12 md:w-12 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLibros.length === 0 ? (
              <div className="col-span-full text-center text-white/70">No hay libros disponibles.</div>
            ) : (
              filteredLibros.map((libro) => (
                <div
                  key={libro.libreriaMaterialId}
                  className="bg-white/10 backdrop-blur-sm text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-white/10 p-5 flex flex-col justify-between"
                >
                  <img
                    src="https://i.blogs.es/aa76de/libro/1366_2000.jpg"
                    alt="Imagen del libro"
                    className="w-full h-36 sm:h-40 object-cover rounded-xl mb-4"
                  />
                  <div>
                    <h3 className="text-lg md:text-2xl font-bold truncate">{libro.titulo}</h3>
                    <p className="text-xs md:text-sm text-white/60 truncate mt-1">ID: {libro.libreriaMaterialId}</p>
                    <p className="mt-2 text-xs md:text-sm">Fecha de publicación:
                      <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-xs">
                        {new Date(libro.fechaPublicacion).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="mt-5 flex justify-end gap-4">
                    <button
                      onClick={() => abrirModalEditar(libro)}
                      className="text-cyan-300 hover:text-white text-xs md:text-sm flex items-center gap-1"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(libro.libreriaMaterialId)}
                      className="text-red-300 hover:text-white text-xs md:text-sm flex items-center gap-1"
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm text-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg">
              <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
                {isEditMode ? "Editar Libro" : "Agregar Libro"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <input
                  type="text"
                  name="titulo"
                  placeholder="Título del libro"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 placeholder-white text-white border border-white/30 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-white focus:outline-none"
                  required
                />
                <input
                  type="date"
                  name="fechaPublicacion"
                  value={formData.fechaPublicacion}
                  onChange={handleInputChange}
                  className="w-full bg-white/20 text-white border border-white/30 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-white focus:outline-none"
                  required
                />
                <div className="flex justify-end gap-3 md:gap-4 pt-3 md:pt-4">
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="px-4 py-2 rounded-md text-white/70 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 md:px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                  >
                    {isEditMode ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-sm text-white p-5 md:p-6 rounded-2xl shadow-2xl w-full max-w-sm">
              <h3 className="text-md md:text-lg font-semibold mb-4 text-center">
                ¿Estás seguro de eliminar este libro?
              </h3>
              <div className="flex justify-center gap-4 md:gap-5">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-md text-white/70 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
