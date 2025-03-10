"use client";

import { useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function PopUpPasswordReset({ message, isOpen, onClose }) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push("/login");
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(handleClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 transition-opacity">
      {/* Botón de inicio */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
      >
        <FaHome className="text-xl" />
        <span className="text-sm font-medium">Inicio</span>
      </Link>

      <div className="bg-white w-full max-w-md md:w-3/5 lg:w-2/5 mx-4 p-6 md:p-8 rounded-lg shadow-xl transform transition-all">
        <div className="flex flex-col items-center text-center">
          <AiFillCheckCircle className="w-16 h-16 text-[#e53c3d] mb-4" />
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            ¡Correo enviado!
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">{message}</p>
          <button
            onClick={handleClose}
            className="w-fit px-8 md:px-12 py-2.5 md:py-3 bg-black text-white rounded cursor-pointer hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 text-sm md:text-base"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
