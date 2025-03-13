"use client";

import { FaSearch, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

// Componente de barra de búsqueda que maneja eventos y ubicaciones
export default function SearchBar({
  searchQuery,
  locationQuery,
  onSearchChange,
  onLocationChange,
  onClearSearch,
  onClearLocation,
  onSearch,
  isMobile = false,
}) {
  return (
    <div className="w-full max-w-full">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-colors duration-200 rounded-full overflow-hidden">
        <div className="flex flex-row items-center p-1">
          {/* Sección de búsqueda de eventos */}
          <div className="flex-1 w-full flex items-center gap-2 px-3 h-10">
            <FaSearch className="text-sm text-black flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar eventos"
              className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm h-full"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <FaTimes className="text-gray-500 hover:text-gray-700 text-sm" />
              </button>
            )}
          </div>

          {/* Separador vertical */}
          <div className="h-6 w-px bg-gray-200 mx-1" />

          {/* Sección de búsqueda por ubicación */}
          <div className="flex-1 w-full flex items-center gap-2 px-3 h-10">
            <FaMapMarkerAlt className="text-sm text-black flex-shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Ciudad o ubicación"
              className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm h-full"
            />
            {locationQuery && (
              <button
                onClick={onClearLocation}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Limpiar ubicación"
              >
                <FaTimes className="text-gray-500 hover:text-gray-700 text-sm" />
              </button>
            )}
          </div>

          {/* Botón de búsqueda */}
          <button
            onClick={onSearch}
            className="ml-1 w-9 h-9 bg-black text-white rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all flex items-center justify-center flex-shrink-0"
            aria-label="Buscar"
          >
            <FaSearch className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
