"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaUser,
  FaCog,
  FaKey,
  FaHistory,
  FaTrash,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Información Personal",
    icon: FaUser,
    href: "/profile",
  },
  {
    title: "Configuración de Cuenta",
    icon: FaCog,
    href: "/profile/settings",
  },
  {
    title: "Cambiar Contraseña",
    icon: FaKey,
    href: "/profile/password",
  },
  {
    title: "Historial de Compras",
    icon: FaHistory,
    href: "/profile/purchases",
  },
  {
    title: "Cerrar Cuenta",
    icon: FaTrash,
    href: "/profile/close-account",
    danger: true,
  },
  {
    title: "Cerrar Sesión",
    icon: FaSignOutAlt,
    href: "/logout",
    danger: true,
  },
];

export default function ProfileNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Información Personal");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Overlay para móvil */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Navbar lateral */}
      <nav
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Contenedor del menú */}
        <div className="flex flex-col h-full py-8">
          {/* Título */}
          <div className="px-6 mb-8">
            <h2 className="text-xl font-bold">Mi Perfil</h2>
          </div>

          {/* Lista de navegación */}
          <ul className="flex-1 px-3">
            {menuItems.map((item) => (
              <li key={item.title} className="mb-2">
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${
                      activeItem === item.title
                        ? "bg-gray-100 text-[#e53c3d]"
                        : "hover:bg-gray-50"
                    }
                    ${
                      item.danger
                        ? "text-red-600 hover:text-red-700"
                        : "text-gray-700 hover:text-gray-900"
                    }
                  `}
                  onClick={() => {
                    setActiveItem(item.title);
                    setIsMenuOpen(false);
                  }}
                >
                  <item.icon
                    className={`text-xl ${
                      activeItem === item.title ? "text-[#e53c3d]" : ""
                    }`}
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Versión */}
          <div className="px-6 py-4 border-t">
            <p className="text-xs text-gray-500">Versión 1.0.0</p>
          </div>
        </div>
      </nav>
    </>
  );
}
