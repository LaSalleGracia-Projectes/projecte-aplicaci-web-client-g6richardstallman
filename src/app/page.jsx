"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import { storage } from "../utils/storage";
import "../app/home.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'participante' o 'organizador'
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const searchRef = useRef(null);
  const carouselInterval = useRef(null);
  const router = useRouter();

  const carouselImages = [
    { url: "/images/img1.webp", title: "Descubre eventos", subtitle: "Encuentra y reserva los mejores eventos en tu ciudad" },
    { url: "/images/img2.webp", title: "Experiencias únicas", subtitle: "Vive momentos especiales con tus artistas favoritos" },
    { url: "/images/img3.webp", title: "Eventos para todos", subtitle: "Desde conciertos hasta exposiciones y eventos deportivos" },
    { url: "/images/img4.webp", title: "Conecta con tu pasión", subtitle: "Descubre eventos que te apasionan cerca de ti" },
  ];

  useEffect(() => {
    // Check both session and local storage for token
    const token = storage.getToken(false) || storage.getToken(true);
    
    if (token) {
      setIsLoggedIn(true);
      
      // Get user info from storage utility
      const userInfo = storage.get("user_info", null, false) || storage.get("user_info", null, true);
      if (userInfo && userInfo.rol) {
        setUserRole(userInfo.rol); // 'participante' o 'organizador'
      }
    }
  }, []);

  useEffect(() => {
    carouselInterval.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselImages.length);
    }, 6000);
    
    return () => {
      if (carouselInterval.current) {
        clearInterval(carouselInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === "") {
      setSuggestedEvents([]);
      setShowSuggestions(false);
    } else {
      // Aquí se conectará con la API para buscar eventos
      // Por ahora, dejamos un array vacío
      setSuggestedEvents([]);
      setShowSuggestions(true);
    }
  };

  const goToEventDetails = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
    if (carouselInterval.current) {
      clearInterval(carouselInterval.current);
    }
    carouselInterval.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % carouselImages.length);
    }, 6000);
  };

  const handleExploreEvents = () => {
    router.push('/events');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  const handleViewMore = () => {
    router.push('/events?page=1');
  };

  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="hero-carousel">
          <div className="carousel-container">
            {carouselImages.map((slide, index) => (
              <div 
                key={index} 
                className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.url})` }}
              >
                <div className="hero-content-wrapper">
                  <div className="hero-content">
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <div className="hero-cta">
                      <button 
                        className="btn-primary" 
                        onClick={handleExploreEvents}
                        aria-label="Explorar todos los eventos"
                      >
                        Explorar eventos
                      </button>
                      {!isLoggedIn ? (
                        <button 
                          className="btn-secondary" 
                          onClick={handleLogin}
                          aria-label="Iniciar sesión en la plataforma"
                        >
                          Iniciar sesión
                        </button>
                      ) : userRole === 'organizador' ? (
                        <button 
                          className="btn-secondary" 
                          onClick={handleCreateEvent}
                          aria-label="Crear nuevo evento"
                        >
                          Crear evento
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="carousel-dots">
              {carouselImages.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === activeSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  role="button"
                  aria-label={`Ver diapositiva ${index + 1}`}
                  tabIndex={0}
                ></span>
              ))}
            </div>
          </div>
        </section>

        <section className="search-section">
          <div className="container">
            <div className="search-container" ref={searchRef}>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => searchTerm.trim() !== "" && setShowSuggestions(true)}
                className="search-input"
              />
              {showSuggestions && suggestedEvents.length > 0 && (
                <div className="search-suggestions">
                  {suggestedEvents.map(event => (
                    <div 
                      key={event.id} 
                      className="suggestion-item"
                      onClick={() => goToEventDetails(event.id)}
                    >
                      <div className="suggestion-name">{event.name}</div>
                      <div className="suggestion-details">
                        <span>{event.location}</span>
                        <span>{event.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {isLoggedIn && (
          <section className="welcome-section">
            <div className="container">
              <div className="welcome-card">
                <h2>¡Bienvenido de vuelta!</h2>
                {userRole === 'participante' ? (
                  <p>Explora eventos que podrían interesarte.</p>
                ) : userRole === 'organizador' ? (
                  <p>Administra tus eventos y crea nuevas experiencias.</p>
                ) : (
                  <p>Descubre todas las funciones disponibles en nuestra plataforma.</p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="featured-events">
          <div className="container">
            <h2 className="section-title">Eventos Destacados</h2>
            <div className="events-grid">
              {/* Espacio para eventos que serán cargados desde el backend */}
              <div className="event-placeholder">
                <p>Cargando eventos destacados...</p>
              </div>
            </div>
            <div className="view-more">
              <button 
                className="btn-outline" 
                onClick={handleViewMore}
                aria-label="Ver más eventos disponibles"
              >
                Ver más eventos
              </button>
            </div>
          </div>
        </section>

        <section className="upcoming-events">
          <div className="container">
            <h2 className="section-title">Próximamente</h2>
            <div className="events-timeline">
              {/* Espacio para eventos próximos que serán cargados desde el backend */}
              <div className="event-placeholder">
                <p>Cargando próximos eventos...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
