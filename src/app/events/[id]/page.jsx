"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { eventsService } from "../../../services/events.service";
import { favoritesService } from "../../../services/favorites.service";
import { ticketsService } from "../../../services/tickets.service";
import { storage } from "../../../utils/storage";
import { useNotification } from "../../../context/NotificationContext";
import { FiCalendar, FiMapPin, FiClock, FiTag, FiHeart, FiUser, FiAlertTriangle, FiChevronLeft, FiDollarSign, FiUsers } from "react-icons/fi";
import "./events-details.css";

// Obtén la API Key en tiempo de construcción
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isMyEvent, setIsMyEvent] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapShown, setMapShown] = useState(false);
  const { showSuccess, showError } = useNotification ? useNotification() : { showSuccess: () => {}, showError: () => {} };

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const fetchEventDetails = useCallback(async () => {
    if (!id) return;
    setFetching(true);
    try {
      setLoading(true);

      let storedUser = storage.get("user_info", null, false) || storage.get("user_info", null, true);
      let role = null;
      if (storedUser) {
        if (storedUser.tipo_usuario) {
          role = String(storedUser.tipo_usuario).toLowerCase();
        } else if (storedUser.rol) {
          role = String(storedUser.rol).toLowerCase();
        } else if (storedUser.user && storedUser.user.rol) {
          role = String(storedUser.user.rol).toLowerCase();
        } else if (storedUser.user && storedUser.user.tipo_usuario) {
          role = String(storedUser.user.tipo_usuario).toLowerCase();
        }
      }
      if (!role) {
        role = (storage.get("rol", null, false) || storage.get("rol", null, true) || "").toLowerCase();
      }
      setUserInfo(storedUser);
      setUserRole(role);

      const result = await eventsService.getEventById(id);

      if (result && result.evento) {
        setEvent(result.evento);
        document.title = `${result.evento.nombreEvento} | Eventflix`;

        try {
          const ticketTypesRes = await ticketsService.getEventTicketTypes(id);
          setTicketTypes(ticketTypesRes.data || ticketTypesRes.tiposEntrada || ticketTypesRes || []);
        } catch {
          setTicketTypes(result.evento.tiposEntrada || []);
        }

        if (role === "organizador") {
          setIsOrganizer(true);
          if (
            storedUser &&
            result.evento.organizador &&
            (
              storedUser.id === result.evento.organizador.user_id ||
              storedUser.id === result.evento.organizador.id ||
              (storedUser.user && storedUser.user.id === result.evento.organizador.user_id)
            )
          ) {
            setIsMyEvent(true);
          } else {
            setIsMyEvent(false);
          }
        } else {
          setIsOrganizer(false);
          setIsMyEvent(false);
        }

        if (role === "participante" && storage.getToken(false)) {
          try {
            const favResponse = await favoritesService.checkIsFavorite(id);
            setIsFavorite(favResponse.isFavorito || false);
          } catch (err) {
            console.error("Error checking favorite status:", err);
          }
        }
      } else {
        setError('No se encontró información sobre este evento');
      }
    } catch (err) {
      console.error("Error loading event:", err);
      setError('Error al cargar los detalles del evento');
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();

    return () => {
      document.title = "Eventflix";
    };
  }, [fetchEventDetails, id]);

  const toggleFavorite = async () => {
    const token = storage.getToken(false);
    if (!token) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(id);
        showSuccess("Evento eliminado de favoritos");
      } else {
        await favoritesService.addToFavorites(id);
        showSuccess("Evento añadido a favoritos");
      }

      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      showError("Error al actualizar favoritos");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatHour = (horaString) => {
    if (!horaString) return "";
    const [h, m] = horaString.split(":");
    return `${h}:${m}h`;
  };

  const handleBuyTickets = () => {
    const token = storage.getToken(false) || storage.getToken(true);
    if (!token && userRole !== "participante") {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/events/${id}/tickets`)}`);
      return;
    }
    
    router.push(`/events/${id}/tickets`);
  };

  // Mostrar mapa solo si la ubicación no es online ni URL
  const isOnlineEvent = event?.es_online || (event?.ubicacion && /^https?:\/\//i.test(event.ubicacion));

  useEffect(() => {
    if (!event || !event.ubicacion || isOnlineEvent) return;
    if (window.google && window.google.maps) {
      setMapLoaded(true);
    }
    // El Script se carga con el componente <Script> abajo
  }, [event, isOnlineEvent]);

  useEffect(() => {
    if (!mapLoaded || !event || !event.ubicacion || isOnlineEvent) return;
    if (!window.google || !window.google.maps) return;
    const mapDiv = document.getElementById("event-detail-map");
    if (!mapDiv || mapDiv.dataset.mapInitialized) return;
    mapDiv.dataset.mapInitialized = "true";

    const geocoder = new window.google.maps.Geocoder();
    const defaultLatLng = { lat: 41.3874, lng: 2.1686 };
    const map = new window.google.maps.Map(mapDiv, {
      center: defaultLatLng,
      zoom: 14,
    });
    const marker = new window.google.maps.Marker({
      map,
      position: defaultLatLng,
    });
    geocoder.geocode({ address: event.ubicacion }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        map.setCenter(loc);
        marker.setPosition(loc);
      }
    });
    setMapShown(true);

    return () => {
      marker.setMap(null);
      mapDiv.dataset.mapInitialized = "";
    };
    // eslint-disable-next-line
  }, [mapLoaded, event, isOnlineEvent]);

  if (loading || fetching) {
    return (
      <div className="event-loading">
        <div className="loading-spinner" aria-label="Cargando detalles del evento"></div>
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-error">
        <div className="error-icon">
          <FiAlertTriangle />
        </div>
        <h2 className="error-title">Error al cargar el evento</h2>
        <p className="error-message">{error}</p>
        <Link href="/events" className="btn-primary">
          <FiChevronLeft />
          Volver a eventos
        </Link>
      </div>
    );
  }

  if (!event) return null;

  const organizerAvatar =
    event.organizador?.avatar_url ||
    event.organizador?.avatar ||
    event.organizador?.user?.avatar_url ||
    event.organizador?.user?.avatar ||
    null;

  const organizerName =
    event.organizador?.nombre_organizacion ||
    event.organizador?.nombre ||
    (event.organizador?.user
      ? `${event.organizador.user.nombre} ${event.organizador.user.apellido1 || ""}`.trim()
      : "Organizador");

  const organizerId =
    event.organizador?.id ||
    event.organizador?.idOrganizador ||
    null;

  return (
    <>
      {/* Google Maps Script solo si la ubicación es física */}
      {!isOnlineEvent && GOOGLE_MAPS_API_KEY && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`}
          strategy="afterInteractive"
          onLoad={() => setMapLoaded(true)}
          onError={() => setMapLoaded(false)}
        />
      )}
      <div className="event-detail-container">
        <section className="event-hero">
          {!imageError ? (
            <img 
              src={event.imagen_url || '/img/default-event.jpg'} 
              alt={event.nombreEvento}
              className="event-hero-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="event-hero-image event-hero-image-fallback">
              <FiCalendar style={{ fontSize: "3rem", color: "#9ca3af" }} />
              <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Imagen no disponible</p>
            </div>
          )}
          <div className="event-hero-overlay">
            <div className="event-hero-content">
              {event.categoria && (
                <span className="event-category">
                  {event.categoria}
                </span>
              )}
              <h1 className="event-title">{event.nombreEvento}</h1>
              <div className="event-meta">
                <div className="event-meta-item">
                  <FiCalendar className="event-meta-icon" />
                  <span>{formatDate(event.fechaEvento)}</span>
                </div>
                {event.hora && (
                  <div className="event-meta-item">
                    <FiClock className="event-meta-icon" />
                    <span>{formatHour(event.hora)}</span>
                  </div>
                )}
                {event.ubicacion && (
                  <div className="event-meta-item">
                    <FiMapPin className="event-meta-icon" />
                    <span>{event.ubicacion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <div className="event-content">
          <div className="event-main-content">
            <section className="event-description-section">
              <h2 className="event-description-title">Acerca de este evento</h2>
              <div className="event-description-content">
                {event.descripcion || "No hay descripción disponible para este evento."}
              </div>
            </section>
            
            {(ticketTypes && ticketTypes.length > 0) && (
              <section className="event-tickets-section">
                <h2 className="event-tickets-title">Entradas disponibles</h2>
                <div className="event-tickets-grid">
                  {ticketTypes.map(ticket => {
                    const soldOut = !ticket.es_ilimitado && 
                      ((ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)) <= 0);
                    const lowStock = !ticket.es_ilimitado && 
                      ((ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)) <= 5) &&
                      ((ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)) > 0);
                    return (
                      <div key={ticket.id || ticket.idTipoEntrada} className="event-ticket-card">
                        <div className="event-ticket-header">
                          <span className="event-ticket-name">{ticket.nombre}</span>
                          <span className="event-ticket-price">€{ticket.precio}</span>
                        </div>
                        {ticket.descripcion && (
                          <p className="event-ticket-description">{ticket.descripcion}</p>
                        )}
                        <div className="event-ticket-status">
                          <span className={`event-ticket-stock ${lowStock ? 'event-ticket-low-stock' : ''} ${soldOut ? 'event-ticket-sold-out' : ''}`}>
                            {ticket.es_ilimitado ? (
                              'Disponibilidad ilimitada'
                            ) : soldOut ? (
                              'Agotado'
                            ) : lowStock ? (
                              `¡Solo ${ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)} disponibles!`
                            ) : (
                              `${ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)} disponibles`
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="event-tickets-actions">
                  <button onClick={handleBuyTickets} className="btn-buy-tickets">
                    <FiTag className="btn-icon" />
                    Comprar entradas
                  </button>
                </div>
              </section>
            )}
            
            {/* Mapa solo si la ubicación es física */}
            {!isOnlineEvent && event.ubicacion && (
              <section className="event-map-section" style={{ margin: "2rem 0" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  Ubicación en el mapa
                </h2>
                <div
                  id="event-detail-map"
                  style={{
                    width: "100%",
                    height: "300px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    minHeight: "200px"
                  }}
                >
                  {/* El mapa se renderiza aquí */}
                </div>
              </section>
            )}
          </div>
          
          <div className="event-sidebar">
            <div className="event-sidebar-card event-action-card">
              {userRole === "participante" ? (
                <div className="event-actions">
                  <button 
                    onClick={handleBuyTickets}
                    className="btn-primary btn-action"
                  >
                    <FiTag className="btn-icon" />
                    Comprar entradas
                  </button>
                  
                  <button
                    onClick={toggleFavorite}
                    className={`btn-secondary btn-action ${isFavorite ? 'btn-favorite-active' : 'btn-favorite'}`}
                  >
                    <FiHeart className={`btn-icon ${isFavorite ? 'heart-filled' : ''}`} />
                    {isFavorite ? "Guardado en favoritos" : "Añadir a favoritos"}
                  </button>
                </div>
              ) : (
                <div className="event-auth-message">
                  <FiUser className="auth-icon" />
                  <p>{isMyEvent
                    ? "Eres el organizador de este evento."
                    : isOrganizer
                      ? "Como organizador, solo puedes ver este evento."
                      : "Inicia sesión como participante para comprar entradas o añadir a favoritos."
                  }</p>
                  {!userInfo && (
                    <Link href={`/auth/login?redirect=${encodeURIComponent(`/events/${id}`)}`} className="btn-login">
                      Iniciar sesión
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            <div className="event-sidebar-card">
              <h3 className="event-sidebar-title">Información del evento</h3>
              <ul className="event-details-list">
                <li className="event-details-item">
                  <div className="event-details-icon">
                    <FiCalendar />
                  </div>
                  <div className="event-details-content">
                    <h4>Fecha</h4>
                    <p>{formatDate(event.fechaEvento)}</p>
                  </div>
                </li>
                {event.hora && (
                  <li className="event-details-item">
                    <div className="event-details-icon">
                      <FiClock />
                    </div>
                    <div className="event-details-content">
                      <h4>Hora</h4>
                      <p>{formatHour(event.hora)}</p>
                    </div>
                  </li>
                )}
                {event.ubicacion && (
                  <li className="event-details-item">
                    <div className="event-details-icon">
                      <FiMapPin />
                    </div>
                    <div className="event-details-content">
                      <h4>Ubicación</h4>
                    <p>{event.ubicacion}</p>
                    </div>
                  </li>
                )}
                {ticketTypes && ticketTypes.length > 0 && (
                  <li className="event-details-item">
                    <div className="event-details-icon">
                      <FiDollarSign />
                    </div>
                    <div className="event-details-content">
                      <h4>Precio</h4>
                      <p>
                        {ticketTypes.length === 1
                          ? `${parseFloat(ticketTypes[0].precio).toFixed(2)} €`
                          : `${ticketTypes.reduce((min, ticket) =>
                              Math.min(min, parseFloat(ticket.precio)),
                              parseFloat(ticketTypes[0].precio)
                            ).toFixed(2)} € - ${
                              ticketTypes.reduce((max, ticket) =>
                                Math.max(max, parseFloat(ticket.precio)), 0
                              ).toFixed(2)
                            } €`
                        }
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            {event.organizador && (
              <div className="event-sidebar-card">
                <h3 className="event-sidebar-title">Organizado por</h3>
                <div className="event-organizer">
                  {organizerAvatar ? (
                    <img
                      src={organizerAvatar}
                      alt={organizerName}
                      className="event-organizer-avatar"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="event-organizer-avatar">
                      {organizerName?.charAt(0) || "O"}
                    </div>
                  )}
                  <div className="event-organizer-info">
                    <h4>{organizerName}</h4>
                    {event.organizador?.user && (
                      <p>
                        {event.organizador.user.nombre} {event.organizador.user.apellido1}
                      </p>
                    )}
                    {event.organizador?.telefono_contacto && (
                      <p className="event-organizer-contact">
                        <FiUser style={{ marginRight: 4 }} />
                        {event.organizador.telefono_contacto}
                      </p>
                    )}
                  </div>
                </div>
                {organizerId && (
                  <Link href={`/organizers/${organizerId}`} passHref legacyBehavior>
                    <button className="event-organizer-link btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                      Ver perfil del organizador
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
