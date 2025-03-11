"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHeart,
  FaTicketAlt,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const userProfile = {
    name: "Usuario Ejemplo",
    image: "/img1.webp",
  };

  return (
    <header className="sticky top-0 z-[60] bg-gray-50 shadow-md">
      {/* Desktop y Tablet Header */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link
            href="/"
            className="block w-[180px] lg:w-[250px] h-[50px] lg:h-[70px] bg-[url('/logo.webp')] bg-contain bg-no-repeat"
          />

          {/* Barra de búsqueda */}
          <div className="flex-grow max-w-2xl mx-4">
            <div className="bg-white flex items-center border border-gray-300 rounded-full p-2">
              <div className="flex items-center flex-1 gap-2">
                <FaSearch className="text-gray-500" />
                <input
                  type="search"
                  placeholder="Buscar eventos"
                  className="w-full focus:outline-none text-sm"
                />
              </div>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <div className="flex items-center flex-1 gap-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <input
                  type="search"
                  placeholder="Ciudad"
                  className="w-full focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Menú de navegación */}
          <nav className="flex items-center">
            <div className="flex items-center gap-6 mr-8">
              <Link
                href="/favoritos"
                className="flex flex-col items-center gap-1 text-sm hover:text-gray-600 transition-colors"
              >
                <FaHeart className="text-xl text-red-500" />
                <span>Favoritos</span>
              </Link>

              <Link
                href="/tickets"
                className="flex flex-col items-center gap-1 text-sm hover:text-gray-600 transition-colors"
              >
                <FaTicketAlt className="text-xl" />
                <span>Tickets</span>
              </Link>
            </div>

            {/* Botones de autenticación / Perfil de usuario */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 hover:bg-gray-100 rounded-full transition-all duration-200 p-2"
              >
                <img
                  src={userProfile.image}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <span className="text-sm font-medium hidden lg:block">
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

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <Link
            href="/"
            className="block w-[140px] h-[40px] bg-[url('/logo.webp')] bg-contain bg-no-repeat"
          />

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaSearch className="text-xl" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2">
              <FaSearch className="text-gray-500" />
              <input
                type="search"
                placeholder="Buscar eventos"
                className="w-full focus:outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <input
                type="search"
                placeholder="Ciudad"
                className="w-full focus:outline-none text-sm"
              />
            </div>
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
                  <img
                    src={userProfile.image}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full object-cover"
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
