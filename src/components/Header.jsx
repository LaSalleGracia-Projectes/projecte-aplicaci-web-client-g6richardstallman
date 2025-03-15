"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { useAuth } from '../contexts/AuthContext';

// Componente principal del header con navegación responsive
export default function Header() {
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [userProfile, setUserProfile] = useState(user?.userData || {});

  // Estados del componente
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Manejadores de eventos y efectos
  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar el componente
    const userInfo = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem('user') || '{}') : {};
      
    if (userInfo.isLoggedIn && userInfo.token) {
      setIsLoggedIn(true);
      setUserProfile(userInfo.userData || {});
    } else {
      setIsLoggedIn(false);
      setUserProfile({});
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    if (isSearchOpen) setIsSearchOpen(false);
  }, [isSearchOpen]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
  }, [isMenuOpen]);

  const handleSearch = useCallback(() => {
    console.log("Searching:", { searchQuery, locationQuery });
    setIsSearchOpen(false);
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
    <header
      className={`sticky top-0 z-[60] transition-all duration-200 
      ${isScrolled ? "bg-white/95 shadow-md" : "bg-white/90"}
      backdrop-blur-sm`}
    >
      {/* Versión Desktop y Tablet */}
      <div className="hidden md:block">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between p-4 xl:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.05]"
          >
            <Image
              src="/logo.jpg"
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
            <div className="flex items-center gap-6 mr-10">
              <Link
                href="/favoritos"
                className="group flex flex-col items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaHeart className="text-xl text-red-500 group-hover:scale-110 transition-transform" />
                <span>Favoritos</span>
              </Link>

              <Link
                href="/tickets"
                className="group flex flex-col items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaTicketAlt className="text-xl group-hover:scale-110 transition-transform" />
                <span>Tickets</span>
              </Link>
            </div>

            {/* Perfil de usuario / Botones de autenticación */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 hover:bg-gray-100 rounded-full transition-all duration-200 p-2 hover:scale-[1.03]"
              >
                {/* Foto de perfil circular */}
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow">
                  <img
                    src={userProfile?.profileImage || "/img1.webp"}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Nombre del usuario - visible en pantallas más grandes */}
                <span className="hidden md:block text-sm font-medium truncate max-w-[120px]">
                  {userProfile?.nombre || userProfile?.name || 'Usuario'}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-3 py-1.5 border border-gray-300 hover:border-gray-400 rounded-full text-sm hover:bg-gray-50 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Versión Mobile */}
      <div className="md:hidden">
        {/* Header móvil */}
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.05]"
          >
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={140}
              height={40}
              className="w-[140px] h-[40px] object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSearch}
              className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all duration-300 hover:scale-[1.05]"
              aria-label="Buscar"
            >
              <FaSearch className="text-xl text-gray-700" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-all duration-300 hover:scale-[1.05]"
              aria-label="Menú"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl text-gray-700" />
              ) : (
                <FaBars className="text-xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        {isSearchOpen && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-4 bg-white/95 backdrop-blur-sm">
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
          <nav className="bg-white/95 backdrop-blur-sm border-t border-gray-100">
            <div className="p-4 space-y-2">
              <Link
                href="/favoritos"
                className="flex items-center gap-4 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all hover:scale-[1.01]"
              >
                <FaHeart className="text-xl text-red-500" />
                <span className="font-medium">Favoritos</span>
              </Link>
              <Link
                href="/tickets"
                className="flex items-center gap-4 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all hover:scale-[1.01]"
              >
                <FaTicketAlt className="text-xl" />
                <span className="font-medium">Tickets</span>
              </Link>

              {isLoggedIn ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all hover:scale-[1.02]"
                >
                  <Image
                    src={userProfile?.profileImage || "/img1.webp"}
                    alt={userProfile?.nombre || "Usuario"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover border-2 border-gray-200"
                  />
                  <span className="font-medium">{userProfile?.nombre || "Usuario"}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all hover:scale-[1.02]"
                  >
                    <FaUser className="text-xl" />
                    <span className="font-medium">Iniciar sesión</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-4 p-3 bg-black text-white rounded-xl transition-all hover:scale-[1.02] mt-2 hover:bg-gray-800 active:bg-gray-900"
                  >
                    <FaUser className="text-xl" />
                    <span className="font-medium">Registrarse</span>
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
