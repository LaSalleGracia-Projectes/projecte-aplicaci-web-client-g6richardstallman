"use client";

import { FaSearch, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

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
    <div className="w-full max-w-full px-3 py-2 md:p-0">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-colors duration-200 rounded-full overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-1">
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

          {/* Separador horizontal en móvil, vertical en desktop */}
          <div className="hidden md:block h-6 w-px bg-gray-200 mx-1"></div>
          <div className="md:hidden h-px w-full bg-gray-200 my-1"></div>

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

          {/* Botón de búsqueda - adaptado para móvil */}
          <button
            onClick={onSearch}
            className="w-full md:w-auto mt-1 md:mt-0 md:ml-1 h-9 bg-black text-white rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all flex items-center justify-center md:flex-shrink-0"
            aria-label="Buscar"
          >
            <FaSearch className="text-sm mr-2 md:mr-0" />
            <span className="md:hidden">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
