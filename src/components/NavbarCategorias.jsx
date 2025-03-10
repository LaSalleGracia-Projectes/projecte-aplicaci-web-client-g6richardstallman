"use client";

import { FaMusic, FaTv, FaGamepad, FaFootballBall } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";

const CATEGORIES = [
  { icon: FaMusic, name: "Música" },
  { icon: FaTv, name: "Espectáculos" },
  { icon: FaGamepad, name: "Hobbies" },
  { icon: FaFootballBall, name: "Deporte" },
  { icon: MdWork, name: "Negocios" },
  { icon: IoFastFood, name: "Comida" },
];

export default function NavbarCategorias() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Título de sección */}
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
          Explora por categorías
        </h2>

        {/* Contenedor del nav con scroll horizontal en móvil */}
        <div className="relative">
          <nav className="bg-gray-100 p-4 rounded-lg overflow-x-auto scrollbar-hide">
            <ul className="flex items-center md:justify-center min-w-max md:min-w-0 gap-6 md:gap-8 lg:gap-16">
              {CATEGORIES.map((category) => (
                <li key={category.name}>
                  <a
                    href="#"
                    className="flex flex-col items-center gap-3 text-center no-underline text-black group"
                  >
                    <div className="p-3 md:p-4 rounded-full bg-gray-200 group-hover:bg-gray-300 group-hover:scale-110 transition-all duration-200">
                      <category.icon className="text-2xl md:text-3xl" />
                    </div>
                    <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                      {category.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Indicadores de scroll */}
          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white to-transparent w-8 md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white to-transparent w-8 md:hidden" />
        </div>
      </div>

      {/* Estilos para ocultar la scrollbar pero mantener la funcionalidad */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
