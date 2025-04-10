"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUser,
  FaCog,
  FaHistory,
  FaTrash,
  FaSignOutAlt,
  FaBars,
  FaTimes
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
  const menuRef = useRef(null);

  useEffect(() => {
    const currentItem = menuItems.find((item) => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.title);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    // Cerrar el menú al hacer clic fuera
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    
    // Bloquear scroll cuando el menú está abierto en móvil
    if (isMenuOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* Overlay para el menú móvil */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <div className="md:w-64 w-0 transition-all duration-300">
        {/* Botón móvil para abrir menú - solo visible cuando está cerrado */}
        {!isMenuOpen && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden fixed top-6 left-6 z-50 bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            aria-label="Abrir menú"
          >
            <FaBars className="text-[#e53c3d]" size={20} />
          </button>
        )}

        {/* Menú lateral */}
        <nav 
          ref={menuRef}
          className={`fixed md:sticky top-0 left-0 h-full md:h-screen bg-white shadow-lg transition-all duration-300 ${
            isMenuOpen ? "w-[80%] max-w-[300px] opacity-100" : "w-0 md:w-64 opacity-0 md:opacity-100 -translate-x-full md:translate-x-0"
          } overflow-hidden z-40`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              {/* Contenedor flex para logo y botón de cerrar */}
              <div className="flex items-center justify-center relative">
                {/* Logo adaptable según dispositivo */}
                <Link 
                  href="/"
                  className="transition-transform duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div 
                    className="md:w-48 md:h-12 w-32 h-8 mx-auto"
                    style={{
                      backgroundImage: 'url("/logo.jpg")',
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                </Link>
                
                {/* Botón para cerrar el menú - solo visible en móvil cuando el menú está abierto */}
                {isMenuOpen && (
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                    aria-label="Cerrar menú"
                  >
                    <FaTimes className="text-red-500" size={18} />
                  </button>
                )}
              </div>
            </div>
            
            <ul className="flex-grow overflow-y-auto py-2">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link 
                    href={item.href}
                    className={`flex items-center px-4 py-3 my-1 mx-2 rounded-lg transition-all ${
                      activeItem === item.title 
                        ? "bg-red-50 text-[#e53c3d]" 
                        : item.danger 
                          ? "text-red-600 hover:bg-red-50" 
                          : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className={`mr-3 ${activeItem === item.title ? "text-[#e53c3d]" : ""}`} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-all"
              >
                <FaSignOutAlt className="mr-3" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
