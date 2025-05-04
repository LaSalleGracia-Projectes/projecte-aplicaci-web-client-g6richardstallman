"use client";

import React, { useState, useEffect, useCallback } from "react";
import Header from "../../components/layout/Header/Header";
import { FaArrowUp } from 'react-icons/fa';
import './layout.css';
import Footer from "../../components/layout/Footer/Footer";

export default function EventosLayout({ children }) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined') {
      setShowScrollButton(window.scrollY > 300);
    }
  }, []);
  
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
    
    handleScroll();
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);
  
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
      
      <button 
        onClick={scrollToTop} 
        className={`scroll-top-button ${showScrollButton ? 'scroll-top-button-visible' : 'scroll-top-button-hidden'}`}
        aria-label="Volver arriba"
      >
        <FaArrowUp aria-hidden="true" />
      </button>
      <Footer />
    </>
  );
}
