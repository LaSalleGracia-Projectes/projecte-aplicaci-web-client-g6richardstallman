"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiStar, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import { storage } from "../utils/storage";
import { eventsService } from "../services/events.service";
import { organizersService } from "../services/organizers.service";
import "../app/home.css";

function EventCard({ event, onClick }) {
  return (
    <div className="event-card" onClick={() => onClick(event.id)} tabIndex={0} role="button" aria-label={event.titulo}>
      <div
        className="event-image"
        style={{
          backgroundImage: `url(${event.imagen_url || "/images/event-placeholder.webp"})`,
        }}
      ></div>
      <div className="event-details">
        <h3>{event.titulo}</h3>
        <div className="event-meta">
          <span>{event.ubicacion}</span>
          <span>{event.categoria}</span>
        </div>
      </div>
    </div>
  );
}

const getInitials = (name) => {
  if (!name) return "O";
  return name.split(' ').map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('');
};

const OrganizerAvatar = ({ organizer, size = 90 }) => {
  const [imgError, setImgError] = useState(false);
  const initial = getInitials(organizer.nombre_organizacion);
  if (imgError || !organizer.avatar_url) {
    return (
      <div
        className="organizer-card-initial"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.45,
          fontWeight: 700,
          color: "#ff5a5f",
          margin: "0 auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
        }}
        aria-label={`Inicial ${initial}`}
      >
        {initial}
      </div>
    );
  }
  return (
    <div
      className="organizer-image-container"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        margin: "0 auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
      }}
    >
      <img
        src={organizer.avatar_url}
        alt={organizer.nombre_organizacion || "Organizador"}
        width={size}
        height={size}
        className="organizer-card-image"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        onError={() => setImgError(true)}
      />
    </div>
  );
};

const OrganizerCard = ({ organizer }) => (
  <Link href={`/organizers/${organizer.id}`} className="organizer-card" style={{
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
    padding: "2rem 1.2rem 1.2rem 1.2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    minHeight: 260,
    transition: "transform 0.18s",
    cursor: "pointer"
  }}>
    <div className="organizer-card-avatar" style={{ position: "relative", marginBottom: 18 }}>
      <OrganizerAvatar organizer={organizer} />
      {organizer.is_favorite && (
        <div className="organizer-favorite-badge" aria-label="Favorito" style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "#fff",
          borderRadius: "50%",
          padding: 4,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
        }}>
          <FiStar className="favorite-icon" style={{ color: "#ffb400", fontSize: 22 }} />
        </div>
      )}
    </div>
    <div className="organizer-card-content">
      <h3 className="organizer-card-name" style={{
        fontSize: "1.18rem",
        fontWeight: 700,
        marginBottom: 6,
        color: "#222"
      }}>{organizer.nombre_organizacion}</h3>
      {organizer.nombre_usuario && (
        <p className="organizer-card-owner" style={{
          color: "#888",
          fontSize: "0.98rem",
          marginBottom: 8
        }}>{organizer.nombre_usuario}</p>
      )}
      <div className="organizer-card-meta" style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "center"
      }}>
        {organizer.telefono_contacto && (
          <span className="organizer-card-stat" style={{ color: "#555", fontSize: "0.97rem", display: "flex", alignItems: "center", gap: 6 }}>
            <FiPhone className="organizer-card-icon" aria-hidden="true" style={{ color: "#ff5a5f" }} />
            {organizer.telefono_contacto}
          </span>
        )}
        {organizer.email && (
          <span className="organizer-card-stat" style={{ color: "#555", fontSize: "0.97rem", display: "flex", alignItems: "center", gap: 6 }}>
            <FiMail className="organizer-card-icon" aria-hidden="true" style={{ color: "#ff5a5f" }} />
            {organizer.email}
          </span>
        )}
        {organizer.ubicacion && (
          <span className="organizer-card-stat" style={{ color: "#555", fontSize: "0.97rem", display: "flex", alignItems: "center", gap: 6 }}>
            <FiMapPin className="organizer-card-icon" aria-hidden="true" style={{ color: "#ff5a5f" }} />
            {organizer.ubicacion}
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedEvents, setSuggestedEvents] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [featuredOrganizers, setFeaturedOrganizers] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingOrganizers, setLoadingOrganizers] = useState(true);
  const searchRef = useRef(null);
  const carouselInterval = useRef(null);
  const router = useRouter();

  const carouselImages = [
    {
      url: "/images/img1.webp",
      title: "Descubre eventos",
      subtitle: "Encuentra y reserva los mejores eventos en tu ciudad",
    },
    {
      url: "/images/img2.webp",
      title: "Experiencias únicas",
      subtitle: "Vive momentos especiales con tus artistas favoritos",
    },
    {
      url: "/images/img3.webp",
      title: "Eventos para todos",
      subtitle: "Desde conciertos hasta exposiciones y eventos deportivos",
    },
    {
      url: "/images/img4.webp",
      title: "Conecta con tu pasión",
      subtitle: "Descubre eventos que te apasionan cerca de ti",
    },
  ];

  useEffect(() => {
    const token = storage.getToken(false) || storage.getToken(true);

    if (token) {
      setIsLoggedIn(true);

      const userInfo =
        storage.get("user_info", null, false) ||
        storage.get("user_info", null, true);
      if (userInfo && userInfo.rol) {
        setUserRole(userInfo.rol);
      }
    }
    fetchRecommendedEvents();
    fetchFeaturedOrganizers();
  }, []);

  const fetchRecommendedEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await eventsService.getAllEvents({ page: 1, limit: 3 });
      setRecommendedEvents(res.eventos?.slice(0, 3) || []);
    } catch {
      setRecommendedEvents([]);
    }
    setLoadingEvents(false);
  };

  const fetchFeaturedOrganizers = async () => {
    setLoadingOrganizers(true);
    try {
      const res = await organizersService.getAllOrganizers();
      setFeaturedOrganizers((res.data || []).slice(0, 3));
    } catch {
      setFeaturedOrganizers([]);
    }
    setLoadingOrganizers(false);
  };

  useEffect(() => {
    carouselInterval.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
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

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestedEvents([]);
      setShowSuggestions(false);
    } else {
      try {
        const res = await eventsService.getAllEvents({ search: value, limit: 5 });
        setSuggestedEvents(res.eventos || []);
        setShowSuggestions(true);
      } catch {
        setSuggestedEvents([]);
        setShowSuggestions(false);
      }
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
      setActiveSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
  };

  const handleExploreEvents = () => {
    router.push("/events");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleCreateEvent = () => {
    router.push("/events/create");
  };

  const handleViewMore = () => {
    router.push("/events?page=1");
  };

  const handleViewMoreOrganizers = () => {
    router.push("/organizers");
  };

  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Carrusel */}
        <section className="hero-carousel">
          <div className="carousel-container">
            {carouselImages.map((slide, index) => (
              <div
                key={index}
                className={`carousel-slide ${
                  index === activeSlide ? "active" : ""
                }`}
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.url})`,
                }}
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
                      ) : userRole === "organizador" ? (
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
                  className={`dot ${index === activeSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                  role="button"
                  aria-label={`Ver diapositiva ${index + 1}`}
                  tabIndex={0}
                ></span>
              ))}
            </div>
          </div>
        </section>

        {/* Buscador de eventos */}
        <section className="search-section">
          <div className="container">
            <div className="search-container" ref={searchRef}>
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() =>
                  searchTerm.trim() !== "" && setShowSuggestions(true)
                }
                className="search-input"
              />
              {showSuggestions && suggestedEvents.length > 0 && (
                <div className="search-suggestions">
                  {suggestedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="suggestion-item"
                      onClick={() => goToEventDetails(event.id)}
                    >
                      <div className="suggestion-name">{event.titulo}</div>
                      <div className="suggestion-details">
                        <span>{event.ubicacion}</span>
                        <span>
                          {event.fecha
                            ? new Date(event.fecha).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bienvenida */}
        {isLoggedIn && (
          <section className="welcome-section">
            <div className="container">
              <div className="welcome-card">
                <h2>¡Bienvenido de vuelta!</h2>
                {userRole === "participante" ? (
                  <p>Explora eventos que podrían interesarte.</p>
                ) : userRole === "organizador" ? (
                  <p>Administra tus eventos y crea nuevas experiencias.</p>
                ) : (
                  <p>
                    Descubre todas las funciones disponibles en nuestra
                    plataforma.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Eventos recomendados */}
        <section className="featured-events">
          <div className="container">
            <h2 className="section-title">Eventos Recomendados</h2>
            <div className="events-grid">
              {loadingEvents ? (
                <div className="event-placeholder">
                  <p>Cargando eventos recomendados...</p>
                </div>
              ) : recommendedEvents.length === 0 ? (
                <div className="event-placeholder">
                  <p>No hay eventos recomendados en este momento.</p>
                </div>
              ) : (
                recommendedEvents.map((event) => (
                  <EventCard key={event.id} event={event} onClick={goToEventDetails} />
                ))
              )}
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

        {/* Organizadores destacados */}
        <section className="featured-events">
          <div className="container">
            <h2 className="section-title">Organizadores Destacados</h2>
            <div className="events-grid">
              {loadingOrganizers ? (
                <div className="event-placeholder">
                  <p>Cargando organizadores...</p>
                </div>
              ) : featuredOrganizers.length === 0 ? (
                <div className="event-placeholder">
                  <p>No hay organizadores destacados en este momento.</p>
                </div>
              ) : (
                featuredOrganizers.map((org) => (
                  <OrganizerCard key={org.id} organizer={org} />
                ))
              )}
            </div>
            <div className="view-more">
              <button
                className="btn-outline"
                onClick={handleViewMoreOrganizers}
                aria-label="Ver más organizadores"
              >
                Ver más organizadores
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
