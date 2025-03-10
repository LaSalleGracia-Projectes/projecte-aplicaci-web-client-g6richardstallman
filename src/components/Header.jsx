"use client";

import Link from "next/link";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaHeart,
  FaTicketAlt,
  FaUser,
} from "react-icons/fa";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-50 shadow-md flex items-center justify-between p-4">
      {/* Logo */}
      <div className="flex items-center">
        <Link
          href="/"
          className="block w-[250px] h-[70px] bg-[url('../../public/logo.webp')] bg-contain bg-no-repeat"
        />
      </div>

      {/* Barra de búsqueda */}
      <div className="w-[700px]">
        <div className="bg-white flex items-center border border-gray-300 rounded-full p-2 max-w-[800px]">
          <div className="flex items-center flex-1 gap-2">
            <FaSearch className="text-base" />
            <input
              type="search"
              placeholder="Buscar eventos"
              autoComplete="off"
              className="w-full focus:outline-none"
            />
          </div>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <div className="flex items-center flex-1 gap-2">
            <FaMapMarkerAlt className="text-base" />
            <input
              type="search"
              placeholder="Ciudad"
              autoComplete="off"
              className="w-full focus:outline-none"
            />
          </div>
          <button className="ml-2 flex items-center justify-center text-base hover:text-gray-600 transition-colors">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Menú de navegación - Dividido en dos partes */}
      <div className="flex items-center gap-14">
        {/* Favoritos y Tickets */}
        <div className="flex items-center gap-5">
          <Link
            href="/favoritos"
            className="flex flex-col items-center gap-1 text-[18px] text-black no-underline hover:text-gray-600 transition-colors"
          >
            <FaHeart className="text-red-500" />
            <span>Favoritos</span>
          </Link>

          <Link
            href="/tickets"
            className="flex flex-col items-center gap-1 text-[18px] text-black no-underline hover:text-gray-600 transition-colors"
          >
            <FaTicketAlt />
            <span>Tickets</span>
          </Link>
        </div>

        {/* Perfil - Separado */}
        <Link
          href="/register"
          className="flex flex-col items-center gap-1 text-[18px] text-black no-underline hover:text-gray-600 transition-colors"
        >
          <FaUser />
          <span>Perfil</span>
        </Link>
      </div>
    </header>
  );
}
