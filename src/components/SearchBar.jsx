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
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full bg-white rounded-full p-2 border border-gray-300 relative">
        {/* Campo de búsqueda */}
        <div className="flex items-center flex-1 gap-2 px-3 relative">
          <FaSearch className="text-gray-500 min-w-[16px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar eventos"
            className="w-full focus:outline-none text-sm py-2"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
              onClick={onClearSearch}
              aria-label="Limpiar búsqueda"
            >
              <FaTimes className="text-gray-500 text-sm" />
            </button>
          )}
        </div>

        {/* Separador vertical */}
        <div className="hidden sm:block w-px h-6 bg-gray-300 self-center" />

        {/* Campo de ubicación */}
        <div className="flex items-center flex-1 gap-2 px-3 relative">
          <FaMapMarkerAlt className="text-gray-500 min-w-[16px]" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Ciudad"
            className="w-full focus:outline-none text-sm py-2"
          />
          {locationQuery && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
              onClick={onClearLocation}
              aria-label="Limpiar ubicación"
            >
              <FaTimes className="text-gray-500 text-sm" />
            </button>
          )}
        </div>

        {/* Botón de búsqueda (visible solo en desktop) */}
        {!isMobile && (
          <button
            type="button"
            onClick={onSearch}
            className="hidden sm:flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Buscar eventos"
          >
            <FaSearch className="text-xl" />
          </button>
        )}
      </div>

      {/* Botón de búsqueda para móvil */}
      {isMobile && (
        <button
          type="button"
          onClick={onSearch}
          className="w-full mt-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center"
          aria-label="Buscar eventos"
        >
          <FaSearch className="text-sm mr-2" />
          <span className="text-sm font-medium">Buscar</span>
        </button>
      )}
    </>
  );
}
