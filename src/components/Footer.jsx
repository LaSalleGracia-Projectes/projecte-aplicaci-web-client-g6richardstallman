"use client";

import { Typography } from "@/components/ui";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from 'next/image';

const LINKS = [
  {
    title: "Eventos",
    items: [
      { name: "Próximos eventos", href: "#" },
      { name: "Categorías de eventos", href: "#" },
      { name: "Organizar un evento", href: "#" },
      { name: "Preguntas frecuentes", href: "#" },
    ],
  },
  {
    title: "Servicios",
    items: [
      { name: "Venta de entradas", href: "#" },
      { name: "Gestión de eventos", href: "#" },
      { name: "Marketing de eventos", href: "#" },
    ],
  },
  {
    title: "Compañía",
    items: [
      { name: "Sobre nosotros", href: "#" },
      { name: "Contacto", href: "#" },
      { name: "Centro de ayuda", href: "#" },
      { name: "Nuestro equipo", href: "#" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contenedor principal del footer */}
        <div className="grid grid-cols-1 gap-12 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sección del logo y descripción */}
          <div className="flex flex-col items-center sm:items-start space-y-6">
            <Link
              href="/"
              className="transform hover:scale-[1.05] transition-transform duration-300"
            >
              <Image src="/logo.jpg" alt="Eventclix Logo" width={176} height={44} className="w-36 md:w-44" />
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 text-center sm:text-left max-w-sm">
              Tu plataforma de confianza para descubrir, organizar y disfrutar
              de los mejores eventos. Únete a nuestra comunidad y vive
              experiencias inolvidables.
            </p>
          </div>

          {/* Sección de enlaces de navegación */}
          {LINKS.map(({ title, items }) => (
            <div key={title} className="text-center sm:text-left">
              <Typography
                variant="small"
                className="mb-4 font-semibold text-gray-900 uppercase tracking-wider"
              >
                {title}
              </Typography>
              <ul className="space-y-3">
                {items.map(({ name, href }) => (
                  <li key={name}>
                    <Typography
                      as="a"
                      href={href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {name}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separador visual */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Sección inferior del footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-6">
          {/* Información de copyright */}
          <Typography className="text-sm text-gray-600 text-center sm:text-left">
            &copy; {currentYear} Eventclix. Todos los derechos reservados.
          </Typography>

          {/* Enlaces a redes sociales */}
          <div className="flex gap-6">
            <Link
              href="#"
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md hover:scale-[1.05] transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebookF className="h-5 w-5 text-blue-600" />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md hover:scale-[1.05] transition-all duration-300"
              aria-label="Instagram"
            >
              <FaInstagram className="h-5 w-5 text-pink-600" />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-white shadow-sm hover:shadow-md hover:scale-[1.05] transition-all duration-300"
              aria-label="Twitter"
            >
              <FaTwitter className="h-5 w-5 text-blue-400" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
