"use client";

import { Typography } from "@/components/ui";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

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
    <footer className="relative w-full bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Contenedor principal */}
        <div className="grid grid-cols-1 justify-between gap-8 py-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo y descripción */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/">
              <img src="/logo.webp" alt="Logo" className="w-32 md:w-40 mb-4" />
            </Link>
            <p className="text-sm text-gray-600 text-center md:text-left max-w-sm">
              Tu plataforma de confianza para descubrir, organizar y disfrutar
              de los mejores eventos.
            </p>
          </div>

          {/* Enlaces - Grid responsive */}
          {LINKS.map(({ title, items }) => (
            <div key={title} className="text-center md:text-left">
              <Typography
                variant="small"
                className="mb-3 font-medium text-gray-900"
              >
                {title}
              </Typography>
              <ul className="space-y-2">
                {items.map(({ name, href }) => (
                  <li key={name}>
                    <Typography
                      as="a"
                      href={href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {name}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separador */}
        <div className="h-px w-full bg-gray-200" />

        {/* Footer inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          {/* Copyright */}
          <Typography className="text-sm text-gray-600 text-center md:text-left">
            &copy; {currentYear} Eventclix. Todos los derechos reservados.
          </Typography>

          {/* Redes sociales */}
          <div className="flex gap-4">
            <Link
              href="#"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <FaFacebookF className="h-5 w-5 text-gray-700" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <FaInstagram className="h-5 w-5 text-gray-700" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <FaTwitter className="h-5 w-5 text-gray-700" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
