"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header/Header";
import { FaArrowUp } from 'react-icons/fa';

export default function EventosLayout({ children }) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Mostrar el botón solo cuando se ha desplazado hacia abajo
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    
    // Añadir listener con throttling para mejor rendimiento
    let timeout;
    const throttledScroll = () => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleScroll();
          timeout = null;
        }, 100);
      }
    };
    
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">{children}</div>
      
      {/* Botón de scroll to top - solo visible al desplazar */}
      {showScrollButton && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
          aria-label="Volver arriba"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
}
