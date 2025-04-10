"use client";

import React, { useState, useEffect } from "react";

export default function Carousel({ 
  children, 
  className = "", 
  navigation,
  autoplay = true,
  autoplayDelay = 5000
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = React.Children.toArray(children);
  const length = slides.length;

  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === length - 1 ? 0 : current + 1));
    }, autoplayDelay);
    
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, length]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 70) {
      setActiveIndex((current) => (current === length - 1 ? 0 : current + 1));
    }

    if (touchStart - touchEnd < -70) {
      setActiveIndex((current) => (current === 0 ? length - 1 : current - 1));
    }
  };

  const handleNext = () => {
    setActiveIndex((current) => (current === length - 1 ? 0 : current + 1));
  };

  const handlePrev = () => {
    setActiveIndex((current) => (current === 0 ? length - 1 : current - 1));
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {React.Children.map(children, (child) => (
          <div className="min-w-full">{child}</div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        onClick={handlePrev}
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        onClick={handleNext}
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Custom navigation */}
      {navigation && navigation({ setActiveIndex, activeIndex, length })}
    </div>
  );
} 