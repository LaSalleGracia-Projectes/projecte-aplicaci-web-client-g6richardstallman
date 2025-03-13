"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaSearch,
  FaHeart,
  FaTicketAlt,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import SearchBar from "./SearchBar";

export default function Header() {
  // Estados
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Datos de ejemplo del usuario
  const userProfile = {
    name: "Usuario Ejemplo",
    image: "/img1.webp",
  };

  // Manejadores de eventos
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    console.log("Buscando:", { searchQuery, locationQuery });
    // Añade aquí tu lógica de búsqueda
  }, [searchQuery, locationQuery]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleLocationChange = useCallback((value) => {
    setLocationQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClearLocation = useCallback(() => {
    setLocationQuery("");
  }, []);

  return (
    <header className="sticky top-0 z-[60] bg-gray-50/95 backdrop-blur-sm shadow-md">
      {/* Header Desktop y Tablet */}
      <div className="hidden md:block">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between p-4 xl:px-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={250}
              height={70}
              className="w-[180px] lg:w-[250px] h-[50px] lg:h-[70px] object-contain"
              priority
            />
          </Link>

          {/* Barra de búsqueda */}
          <div className="flex-grow max-w-3xl mx-4 xl:mx-8">
            <SearchBar
              searchQuery={searchQuery}
              locationQuery={locationQuery}
              onSearchChange={handleSearchChange}
              onLocationChange={handleLocationChange}
              onClearSearch={handleClearSearch}
              onClearLocation={handleClearLocation}
              onSearch={handleSearch}
            />
          </div>

          {/* Menú de navegación */}
          <nav className="flex items-center">
            <div className="flex items-center gap-6 mr-8">
              <Link
                href="/favoritos"
                className="flex flex-col items-center gap-1 text-sm hover:text-gray-600 transition-colors group"
              >
                <FaHeart className="text-xl text-red-500 group-hover:scale-110 transition-transform" />
                <span>Favoritos</span>
              </Link>

              <Link
                href="/tickets"
                className="flex flex-col items-center gap-1 text-sm hover:text-gray-600 transition-colors group"
              >
                <FaTicketAlt className="text-xl group-hover:scale-110 transition-transform" />
                <span>Tickets</span>
              </Link>
            </div>

            {/* Perfil de usuario o botones de autenticación */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 hover:bg-gray-100 rounded-full transition-all duration-200 p-2"
              >
                <Image
                  src={userProfile.image}
                  alt={userProfile.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-gray-200"
                />
                <span className="text-sm font-medium hidden xl:block">
                  {userProfile.name}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Header Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={140}
              height={40}
              className="w-[140px] h-[40px] object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Abrir búsqueda"
            >
              <FaSearch className="text-xl" />
            </button>
            <button
              type="button"
              onClick={toggleMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Abrir menú"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        {isSearchOpen && (
          <div className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-4">
            <SearchBar
              searchQuery={searchQuery}
              locationQuery={locationQuery}
              onSearchChange={handleSearchChange}
              onLocationChange={handleLocationChange}
              onClearSearch={handleClearSearch}
              onClearLocation={handleClearLocation}
              onSearch={handleSearch}
              isMobile
            />
          </div>
        )}

        {/* Menú móvil */}
        {isMenuOpen && (
          <nav className="bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Link
                href="/favoritos"
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaHeart className="text-red-500" />
                <span>Favoritos</span>
              </Link>
              <Link
                href="/tickets"
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTicketAlt />
                <span>Tickets</span>
              </Link>

              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Image
                    src={userProfile.image}
                    alt={userProfile.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span>{userProfile.name}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaUser />
                    <span>Iniciar sesión</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 p-3 bg-black text-white rounded-lg transition-colors mt-2"
                  >
                    <FaUser />
                    <span>Registrarse</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
