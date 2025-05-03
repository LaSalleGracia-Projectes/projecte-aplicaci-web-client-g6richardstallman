"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/layout/Header/Header";
import { FaArrowUp } from 'react-icons/fa';
import './layout.css';

export default function EventosLayout({ children }) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Handler optimizado con useCallback para evitar recreaciones en cada render
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      setShowScrollButton(window.scrollY > 300);
    }
  }, []);
  
  // Implementar throttling para el scroll con requestAnimationFrame
  useEffect(() => {
    let isScrolling = false;
    let rafId = null;
    
    const onScroll = () => {
      if (!isScrolling) {
        rafId = window.requestAnimationFrame(() => {
          handleScroll();
          isScrolling = false;
        });
        isScrolling = true;
      }
    };
    
    // Comprobar posición inicial
    handleScroll();
    
    // Añadir listener con opción passive para mejor rendimiento
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Limpiar listener y cancelar animationFrame pendiente al desmontar
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);
  
  // Scroll suave hacia arriba memoizado
  const scrollToTop = useCallback(() => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  }, []);

  return (
    <>
      <Header />
      <div className="events-layout-container">
        {children}
      </div>
      
      {/* Botón de volver arriba con transición suave y mejor accesibilidad */}
      <button 
        onClick={scrollToTop} 
        className={`scroll-top-button ${showScrollButton ? 'scroll-top-button-visible' : 'scroll-top-button-hidden'}`}
        aria-label="Volver arriba"
      >
        <FaArrowUp aria-hidden="true" />
      </button>
    </>
  );
}
