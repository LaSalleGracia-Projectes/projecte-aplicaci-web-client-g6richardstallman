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
  // Versión completamente diferente para móvil
  if (isMobile) {
    return (
      <div className="w-full">
        {/* Campo de búsqueda de eventos */}
        <div className="mb-4 relative">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar eventos"
              className="w-full h-14 px-12 py-2 rounded-full border-2 border-gray-200 focus:border-gray-400 outline-none text-base focus:placeholder-transparent"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Limpiar búsqueda"
              >
                <FaTimes className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Campo de ubicación */}
        <div className="mb-6 relative">
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Ciudad o ubicación"
              className="w-full h-14 px-12 py-2 rounded-full border-2 border-gray-200 focus:border-gray-400 outline-none text-base focus:placeholder-transparent"
            />
            {locationQuery && (
              <button
                onClick={onClearLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Limpiar ubicación"
              >
                <FaTimes className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          onClick={onSearch}
          className="w-auto min-w-[120px] mx-auto h-14 px-8 bg-black text-white rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all flex items-center justify-center hover:scale-105 duration-300 text-base"
        >
          <FaSearch className="mr-2" />
          <span>Buscar</span>
        </button>
      </div>
    );
  }

  // Versión desktop original
  return (
    <div className="w-full max-w-full px-3 py-2 md:p-0">
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-colors duration-200 rounded-full overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-1">
          {/* Sección de búsqueda de eventos */}
          <div className="flex-1 w-full flex items-center gap-2 px-4 h-12">
            <FaSearch className="text-base text-black flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar eventos"
              className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-[15px] h-full focus:placeholder-transparent"
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
          <div className="hidden md:block h-8 w-px bg-gray-200 mx-2"></div>
          <div className="md:hidden h-px w-full bg-gray-200 my-1 mx-auto"></div>

          {/* Sección de búsqueda por ubicación */}
          <div className="flex-1 w-full flex items-center gap-2 px-4 h-12">
            <FaMapMarkerAlt className="text-base text-black flex-shrink-0" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Ciudad o ubicación"
              className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-[15px] h-full focus:placeholder-transparent"
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
            className="w-full md:w-12 md:h-12 mt-2 md:mt-0 md:ml-2 h-12 px-4 bg-black text-white rounded-full hover:bg-gray-800 active:bg-gray-900 transition-all flex items-center justify-center md:justify-center md:flex-shrink-0 hover:scale-105 duration-300"
            aria-label="Buscar"
          >
            <FaSearch className="text-base mr-2 md:mr-0" />
            <span className="md:hidden text-[15px]">Buscar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
