"use client";

import { FaMusic, FaTv, FaGamepad, FaFootballBall } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";

export default function NavbarCategorias() {
  return (
    <section className="mt-24 mb-24">
      <nav className="flex justify-center bg-gray-100 p-4 rounded-md">
        <ul className="flex items-center gap-16">

          {/* Categoría Música */}
          <li>
            <a
              href="#"
              className="flex flex-col items-center gap-2 text-center no-underline text-black"
            >
              <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <FaMusic className="text-3xl" />
              </div>
              <span className="text-sm font-medium">Música</span>
            </a>
          </li>

          {/* Categoría Espectáculos Visuales */}
          <li>
            <a
              href="#"
              className="flex flex-col items-center gap-2 text-center no-underline text-black"
            >
              <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <FaTv className="text-3xl" />
              </div>
              <span className="text-sm font-medium">Espectáculos</span>
            </a>
          </li>

          {/* Categoría Hobbies */}
          <li>
            <a
              href="#"
              className="flex flex-col items-center gap-2 text-center no-underline text-black"
            >
              <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <FaGamepad className="text-3xl" />
              </div>
              <span className="text-sm font-medium">Hobbies</span>
            </a>
          </li>

          {/* Categoría Deporte */}
          <li>
            <a
              href="#"
              className="flex flex-col items-center gap-2 text-center no-underline text-black"
            >
              <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <FaFootballBall className="text-3xl" />
              </div>
              <span className="text-sm font-medium">Deporte</span>
            </a>
          </li>

          {/* Categoría Negocios */}
          <li>
            <a
              href="#"
              className="flex flex-col items-center gap-2 text-center no-underline text-black"
            >
              <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <MdWork className="text-3xl" />
              </div>
              <span className="text-sm font-medium">Negocios</span>
            </a>
          </li>

          {/* Categoría Comida */}
          <li>
            <a
              href="#"
              className="flex flex-col items-center gap-2 text-center no-underline text-black"
            >
              <div className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                <IoFastFood className="text-3xl" />
              </div>
              <span className="text-sm font-medium">Comida</span>
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
}
