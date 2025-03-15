"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUser,
  FaCog,
  FaKey,
  FaHistory,
  FaTrash,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCaretRight,
  FaHome
} from "react-icons/fa";
import { useAuth } from '../../contexts/AuthContext';

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
];

export default function ProfileNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const { logout } = useAuth();
  
  // Determinar el ítem activo basado en la ruta actual
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.title);
    }
  }, [pathname]);

  // Cerrar menú al cambiar el tamaño de la ventana a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cerrar menú cuando se hace clic fuera del menú en móvil
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.profile-nav') && !e.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      {/* Botón de menú móvil con diseño mejorado */}
      <button
        onClick={toggleMenu}
        className="menu-toggle md:hidden fixed top-4 left-4 z-50 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 hover:scale-[1.05]"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay para móvil con transición suave */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Navbar lateral con animación mejorada - sin shadow inferior */}
      <nav
        className={`profile-nav fixed md:relative top-0 left-0 h-screen w-72 bg-white z-40
          transform transition-transform duration-300 ease-in-out 
          border-r border-gray-100
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 overflow-y-auto
          md:min-h-screen md:sticky md:top-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Encabezado del menú solo con logo */}
          <div className="p-6 border-b border-gray-100 flex justify-center">
            <Link 
              href="/"
              className="relative w-32 h-14 transform hover:scale-110 transition-all duration-300"
              aria-label="Ir a la página de inicio"
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: 'url("/logo.jpg")',
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            </Link>
          </div>

          {/* Menú de navegación */}
          <div className="flex-grow py-6">
            <ul className="space-y-1 px-4">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
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
                    <div className="flex items-center justify-center w-6">
                      <item.icon
                        className={`text-lg ${
                          activeItem === item.title ? "text-[#e53c3d]" : ""
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium flex-grow">{item.title}</span>
                    {activeItem === item.title && (
                      <FaCaretRight className="text-[#e53c3d] opacity-0 md:opacity-100" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="p-4 mt-auto border-t border-gray-100">
            <button 
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="text-lg" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
