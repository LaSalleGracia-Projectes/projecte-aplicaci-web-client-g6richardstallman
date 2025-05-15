"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiPhone,
  FiCalendar,
  FiArrowLeft,
  FiAlertTriangle,
  FiUser,
  FiInfo,
  FiMail,
  FiHeart,
  FiGlobe,
  FiMapPin,
} from "react-icons/fi";
import { organizersService } from "../../../services/organizers.service";
import { organizerFavoritesService } from "../../../services/organizerFavorites.service";
import { storage } from "../../../utils/storage";
import EventoCard from "../../events/components/EventoCard";
import "./organizer-details.css";

const getInitials = (name) => {
  if (!name) return "O";
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

const OrganizerAvatar = ({ organizer, size = 120 }) => {
  const [imgError, setImgError] = useState(false);
  const initial = getInitials(organizer?.nombre_organizacion);
  if (imgError || !organizer?.avatar_url) {
    return (
      <div
        className="organizer-avatar-placeholder"
        style={{ width: size, height: size }}
        aria-label={`Inicial ${initial}`}
      >
        {initial}
      </div>
    );
  }
  return (
    <div className="organizer-avatar-image-container" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={organizer.avatar_url}
        alt={organizer.nombre_organizacion || "Organizador"}
        width={size}
        height={size}
        className="organizer-avatar-image"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export default function OrganizerDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  const isMounted = useRef(true);

  const LoadingSpinner = () => (
    <div className="organizer-loading">
      <div className="loading-spinner" />
      <div style={{ marginTop: 16, color: "#666" }}>Cargando organizador...</div>
    </div>
  );

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);
    setEventsLoading(true);
    setError(null);

    Promise.all([
      organizersService.getOrganizerById(id),
      organizersService.getOrganizerEvents(id),
    ])
      .then(([orgRes, evRes]) => {
        if (isMounted.current) {
          if (orgRes && orgRes.success && orgRes.data) {
            setOrganizer(orgRes.data);
            document.title = `${orgRes.data.nombre_organizacion || "Organizador"} | Eventflix`;
          } else {
            setError("No se encontró información sobre este organizador");
          }
          if (evRes && evRes.success && Array.isArray(evRes.data)) {
            setEvents(evRes.data);
          } else {
            setEvents([]);
          }
        }
      })
      .catch(() => {
        if (isMounted.current) setError("Error al cargar los detalles del organizador");
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
          setEventsLoading(false);
        }
      });

    const token = storage.getToken(false) || storage.getToken(true);
    const userInfo =
      token
        ? storage.get("user_info", null, false) || storage.get("user_info", null, true)
        : null;
    setIsLoggedIn(!!token);
    setIsParticipant(userInfo?.role === "participante");
    if (token && userInfo?.role === "participante" && id) {
      organizerFavoritesService
        .checkIsFavorite(id)
        .then((favRes) => {
          if (isMounted.current) setIsFavorite(favRes.is_favorite || false);
        })
        .catch(() => {
          if (isMounted.current) setIsFavorite(false);
        });
    } else {
      setIsFavorite(false);
    }

    return () => {
      isMounted.current = false;
      document.title = "Eventflix";
    };
  }, [id]);

  const handleFavorite = async () => {
    if (favoriteLoading) return;
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/organizers/${id}`)}`);
      return;
    }
    if (!isParticipant) {
      alert("Solo los participantes pueden añadir organizadores a favoritos");
      return;
    }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await organizerFavoritesService.removeFromFavorites(id);
        setIsFavorite(false);
      } else {
        await organizerFavoritesService.addToFavorites(id);
        setIsFavorite(true);
      }
    } catch {
      setIsFavorite((prev) => !prev);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formattedCreationDate = useMemo(() => {
    if (!organizer?.created_at) return null;
    const d = new Date(organizer.created_at);
    return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  }, [organizer]);

  const OrganizerSkeleton = () => (
    <div className="organizer-profile-header">
      <div className="organizer-avatar">
        <div className="organizer-avatar-placeholder skeleton" />
      </div>
      <div className="organizer-info">
        <div className="skeleton skeleton-title" style={{ width: 220, height: 32, marginBottom: 16 }} />
        <div className="skeleton skeleton-text" style={{ width: 140, height: 20, marginBottom: 24 }} />
        <div className="skeleton skeleton-btn" style={{ width: 180, height: 36 }} />
      </div>
    </div>
  );
  const EventsSkeleton = () => (
    <div className="organizer-events-grid">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="organizer-event-card">
          <div className="skeleton" style={{ width: "100%", height: 220, borderRadius: 12 }} />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="organizer-detail-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizer-error">
        <div className="error-icon">
          <FiAlertTriangle />
        </div>
        <h2 className="error-title">Error al cargar el organizador</h2>
        <p className="error-message">{error}</p>
        <Link href="/organizers" className="btn-primary">
          <FiArrowLeft />
          Volver a organizadores
        </Link>
      </div>
    );
  }

  if (!organizer) return null;

  return (
    <div className="organizer-detail-container">
      <div className="organizer-detail-header">
        <Link href="/organizers" className="organizer-detail-back">
          <FiArrowLeft /> Volver a organizadores
        </Link>
      </div>
      <section className="organizer-profile">
        <div className="organizer-profile-header">
          <div className="organizer-avatar">
            <OrganizerAvatar organizer={organizer} size={120} />
          </div>
          <div className="organizer-info">
            <h1 className="organizer-name">{organizer.nombre_organizacion || "Organizador"}</h1>
            {(organizer.user || organizer.nombre_usuario) && (
              <p className="organizer-owner">
                <FiUser className="organizer-info-icon" />
                {organizer.user
                  ? `${organizer.user.nombre} ${organizer.user.apellido1} ${organizer.user.apellido2 || ""}`
                  : organizer.nombre_usuario}
              </p>
            )}
            {isLoggedIn && isParticipant && (
              <div className="organizer-actions">
                <button
                  onClick={handleFavorite}
                  disabled={favoriteLoading}
                  className={`btn-favorite ${isFavorite ? "btn-favorite-active" : ""} ${
                    favoriteLoading ? "btn-favorite-loading" : ""
                  }`}
                  aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <FiHeart className={isFavorite ? "btn-icon fill-heart" : "btn-icon"} />
                  {favoriteLoading
                    ? "Procesando..."
                    : isFavorite
                    ? "Quitar de favoritos"
                    : "Añadir a favoritos"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="organizer-detail-content">
          <div className="organizer-detail-main">
            {organizer.descripcion && (
              <div className="organizer-section">
                <h2 className="organizer-section-title">
                  Acerca de {organizer.nombre_organizacion}
                </h2>
                <div className="organizer-description">{organizer.descripcion}</div>
              </div>
            )}
            <div className="organizer-section">
              <h2 className="organizer-section-title">
                Eventos de {organizer.nombre_organizacion || "este organizador"}
              </h2>
              {eventsLoading ? (
                <EventsSkeleton />
              ) : events.length > 0 ? (
                <div className="organizer-events-grid">
                  {events.map((evento) => (
                    <div key={evento.id} className="organizer-event-card">
                      <EventoCard
                        evento={evento}
                        showBuyButton={isLoggedIn && isParticipant}
                        showFavoriteButton={false}
                        onBuy={() => {
                          if (!isLoggedIn) {
                            router.push(`/auth/login?redirect=${encodeURIComponent(`/events/${evento.id}`)}`);
                          } else if (!isParticipant) {
                            alert("Solo los participantes pueden comprar entradas.");
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="organizer-no-events">
                  <FiCalendar className="organizer-no-events-icon" />
                  <p>Este organizador no tiene eventos próximos</p>
                </div>
              )}
            </div>
          </div>
          <div className="organizer-detail-sidebar">
            <div className="organizer-sidebar-card">
              <h3 className="organizer-sidebar-title">Información de contacto</h3>
              <ul className="organizer-contact-list">
                {organizer.telefono_contacto && (
                  <li className="organizer-contact-item">
                    <FiPhone className="organizer-contact-icon" />
                    <a href={`tel:${organizer.telefono_contacto}`} className="organizer-contact-link">
                      {organizer.telefono_contacto}
                    </a>
                  </li>
                )}
                {(organizer.user?.email || organizer.email) && (
                  <li className="organizer-contact-item">
                    <FiMail className="organizer-contact-icon" />
                    <a
                      href={`mailto:${organizer.user?.email || organizer.email}`}
                      className="organizer-contact-link"
                    >
                      {organizer.user?.email || organizer.email}
                    </a>
                  </li>
                )}
                {organizer.sitio_web && (
                  <li className="organizer-contact-item">
                    <FiGlobe className="organizer-contact-icon" />
                    <a
                      href={
                        organizer.sitio_web.startsWith("http")
                          ? organizer.sitio_web
                          : `https://${organizer.sitio_web}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="organizer-contact-link"
                    >
                      {organizer.sitio_web}
                    </a>
                  </li>
                )}
                {(organizer.direccion || organizer.ubicacion) && (
                  <li className="organizer-contact-item">
                    <FiMapPin className="organizer-contact-icon" />
                    <span className="organizer-contact-text">
                      {organizer.direccion || organizer.ubicacion}
                    </span>
                  </li>
                )}
              </ul>
              {!organizer.telefono_contacto &&
                !(organizer.user?.email || organizer.email) &&
                !organizer.sitio_web &&
                !(organizer.direccion || organizer.ubicacion) && (
                  <div className="organizer-no-contact">
                    <FiInfo className="organizer-no-contact-icon" />
                    <p>No hay información de contacto disponible</p>
                  </div>
                )}
            </div>
            <div className="organizer-sidebar-card">
              <h3 className="organizer-sidebar-title">Estadísticas</h3>
              <ul className="organizer-stats-list">
                <li className="organizer-stats-item">
                  <span className="organizer-stats-label">Total de eventos:</span>
                  <span className="organizer-stats-value">{events.length}</span>
                </li>
                {formattedCreationDate && (
                  <li className="organizer-stats-item">
                    <span className="organizer-stats-label">Miembro desde:</span>
                    <span className="organizer-stats-value">{formattedCreationDate}</span>
                  </li>
                )}
              </ul>
              {!isLoggedIn ? (
                <div className="organizer-login-prompt">
                  <Link
                    href={`/auth/login?redirect=${encodeURIComponent(`/organizers/${id}`)}`}
                    className="login-link"
                  >
                    Inicia sesión para guardar este organizador en favoritos o comprar entradas
                  </Link>
                </div>
              ) : !isParticipant ? (
                <div className="organizer-participant-note">
                  <p>Solo los participantes pueden añadir organizadores a favoritos o comprar entradas</p>
                </div>
              ) : null}
            </div>
            {organizer.especialidad && (
              <div className="organizer-sidebar-card">
                <h3 className="organizer-sidebar-title">Especialidad</h3>
                <p className="organizer-specialty">{organizer.especialidad}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
