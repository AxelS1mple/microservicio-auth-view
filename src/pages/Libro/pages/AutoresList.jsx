import React, { useMemo, useState, useEffect } from "react";
import { useAutores } from "../hooks/useAutor";
import { FaPlus, FaTimes } from "react-icons/fa";

// Validar GUID
const isValidGuid = (str) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str);
};

const AutorList = () => {
  const {
    autores = [],
    loading,
    servidor,
    error,
    insertarAutor,
    obtenerAutorPorId,
  } = useAutores();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });
  const [autorPorGuid, setAutorPorGuid] = useState(null);

  useEffect(() => {
    if (servidor) {
      console.log("Servidor conectado:", servidor);
    }
  }, [servidor]);

  useEffect(() => {
    const buscarPorGuid = async () => {
      if (isValidGuid(searchTerm)) {
        const autor = await obtenerAutorPorId(searchTerm);
        setAutorPorGuid(autor || null);
      } else {
        setAutorPorGuid(null);
      }
    };
    buscarPorGuid();
  }, [searchTerm, obtenerAutorPorId]);

  const filteredAutores = useMemo(() => {
    if (autorPorGuid) return [autorPorGuid];
    if (!Array.isArray(autores)) return [];
    if (!searchTerm.trim()) return autores;
    const term = searchTerm.toLowerCase();
    return autores.filter((a) =>
      a.nombre.toLowerCase().includes(term) ||
      a.apellido.toLowerCase().includes(term) ||
      a.autorLibroId.toString().includes(term)
    );
  }, [autores, searchTerm, autorPorGuid]);

  const abrirModalAgregar = () => {
    setFormData({ nombre: "", apellido: "", fechaNacimiento: "" });
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertarAutor(formData);
      cerrarModal();
      setSearchTerm("");
    } catch (error) {
      console.error("Error al insertar autor:", error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 md:px-6 py-8 md:py-10 font-sans text-white">
    <div className="max-w-7xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-black drop-shadow tracking-wide">👤 Gestión de Autores</h1>
        <p className="text-base md:text-lg text-white/80 mt-3">Consulta y registra autores fácilmente</p>
        {servidor && (
          <p className="text-sm text-white/60 mt-2 italic">
            Servidor conectado: <span className="font-mono">{servidor}</span>
          </p>
        )}
      </header>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, apellido, ID o GUID…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-md border border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-3xl px-5 py-3 text-sm placeholder-white
            focus:ring-2 focus:ring-white focus:outline-none transition duration-200"
        />
        <button
          onClick={abrirModalAgregar}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold rounded-full shadow-lg transition-transform duration-200"
        >
          <FaPlus /> Agregar Autor
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 text-red-100 px-5 py-3 rounded-lg mb-6 md:mb-8 shadow">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 md:py-20">
          <div className="animate-spin h-10 w-10 md:h-12 md:w-12 border-4 border-white border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAutores.length === 0 ? (
            <div className="col-span-full text-center text-white/70 italic">
              No hay autores disponibles.
            </div>
          ) : (
            filteredAutores.map((autor) => (
              <div
                key={autor.autorLibroGuid}
                className="bg-white/10 backdrop-blur-sm text-white rounded-2xl shadow-xl hover:shadow-2xl
                  transition-all border border-white/10 p-5 flex flex-col justify-between"
              >
                <h3 className="text-lg md:text-2xl font-bold truncate drop-shadow">{autor.nombre} {autor.apellido}</h3>
                <p className="text-xs md:text-sm text-white/70 truncate mt-1">
                  ID: {autor.autorLibroId}
                </p>
                <p className="text-xs md:text-sm text-white/70 truncate mt-1 font-mono">
                  GUID: {autor.autorLibroGuid}
                </p>
                <p className="mt-2 text-xs md:text-sm">
                  Nacimiento:{" "}
                  <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-xs">
                    {new Date(autor.fechaNacimiento).toLocaleDateString()}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm text-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg">
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center drop-shadow">
              Agregar Autor
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full bg-white/20 placeholder-white text-white border border-white/30 rounded-xl
                  px-4 py-3 text-sm focus:ring-2 focus:ring-white focus:outline-none transition duration-200"
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="w-full bg-white/20 placeholder-white text-white border border-white/30 rounded-xl
                  px-4 py-3 text-sm focus:ring-2 focus:ring-white focus:outline-none transition duration-200"
                required
              />
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                className="w-full bg-white/20 text-white border border-white/30 rounded-xl
                  px-4 py-3 text-sm focus:ring-2 focus:ring-white focus:outline-none transition duration-200"
                required
              />
              <div className="flex justify-end gap-3 md:gap-4 pt-4">
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default AutorList;
