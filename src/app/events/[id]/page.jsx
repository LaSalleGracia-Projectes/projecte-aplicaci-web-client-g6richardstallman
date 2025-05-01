"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { eventsService } from "../../../services/events.service";
import { favoritesService } from "../../../services/favorites.service";
import { storage } from "../../../utils/storage";
import { FiCalendar, FiMapPin, FiClock, FiTag, FiHeart, FiUser, FiAlertTriangle, FiChevronLeft, FiShare2, FiDollarSign, FiUsers } from "react-icons/fi";
import "./events-details.css";

export default function EventDetailPage() {
  // State management
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Hooks
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  // Fetch event details
  const fetchEventDetails = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const result = await eventsService.getEventById(id);
      
      if (result && result.evento) {
        setEvent(result.evento);
        document.title = `${result.evento.nombreEvento} | Eventflix`;
        
        // Check favorite status
        if (storage.getToken(false)) {
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
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
    
    // Clean up
    return () => {
      document.title = "Eventflix";
    };
  }, [fetchEventDetails]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    const token = storage.getToken(false);
    if (!token) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/events/${id}`)}`);
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(id);
      } else {
        await favoritesService.addToFavorites(id);
      }
      
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite status:", err);
    }
  };

  // Navigate to tickets page
  const buyTickets = () => {
    router.push(`/events/${id}/tickets`);
  };
  
  // Share event functionality
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.nombreEvento,
        text: `Mira este evento: ${event.nombreEvento}`,
        url: window.location.href
      }).catch(err => console.error('Error sharing event:', err));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('¡Enlace copiado al portapapeles!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="event-loading">
        <div className="loading-spinner" aria-label="Cargando detalles del evento"></div>
        <p>Cargando evento...</p>
      </div>
    );
  }

  // Error state
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

  // No event data
  if (!event) return null;

  return (
    <div className="event-detail-container">
      {/* Hero Section */}
      <section className="event-hero">
        <img 
          src={event.imagen_url || '/img/default-event.jpg'} 
          alt={event.nombreEvento}
          className="event-hero-image"
        />
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
                  <span>{event.hora}</span>
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
      
      {/* Main Content */}
      <div className="event-content">
        <div className="event-main-content">
          {/* Description */}
          <section className="event-description-section">
            <h2 className="event-description-title">Acerca de este evento</h2>
            <div className="event-description-content">
              {event.descripcion || "No hay descripción disponible para este evento."}
            </div>
          </section>
          
          {/* Tickets Section */}
          {event.tiposEntrada && event.tiposEntrada.length > 0 && (
            <section className="event-tickets-section">
              <h2 className="event-tickets-title">Entradas disponibles</h2>
              <div className="event-tickets-grid">
                {event.tiposEntrada.map(ticket => {
                  const soldOut = !ticket.es_ilimitado && 
                    ((ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)) <= 0);
                  const lowStock = !ticket.es_ilimitado && 
                    ((ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)) <= 5) &&
                    ((ticket.cantidad_disponible - (ticket.entradas_vendidas || 0)) > 0);
                  
                  return (
                    <div key={ticket.id} className="event-ticket-card">
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
              
              <div className="event-tickets-action">
                <button
                  onClick={buyTickets}
                  className="btn-primary"
                >
                  <FiTag />
                  Comprar entradas
                </button>
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="event-sidebar">
          {/* Action Buttons */}
          <div className="event-sidebar-card">
            <div className="event-actions">
              <button
                onClick={buyTickets}
                className="btn-primary"
              >
                <FiTag />
                Comprar entradas
              </button>
              
              <button
                onClick={toggleFavorite}
                className={`btn-secondary ${isFavorite ? 'btn-secondary-active' : ''}`}
              >
                <FiHeart className={isFavorite ? "btn-icon fill-red-500" : "btn-icon"} />
                {isFavorite ? "Guardado en favoritos" : "Añadir a favoritos"}
              </button>
              
              <button
                onClick={shareEvent}
                className="btn-secondary"
              >
                <FiShare2 className="btn-icon" />
                Compartir evento
              </button>
            </div>
          </div>
          
          {/* Date and Location Details */}
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
                    <p>{event.hora}</p>
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
              {event.tiposEntrada && event.tiposEntrada.length > 0 && (
                <li className="event-details-item">
                  <div className="event-details-icon">
                    <FiDollarSign />
                  </div>
                  <div className="event-details-content">
                    <h4>Precio</h4>
                    <p>
                      {event.tiposEntrada.reduce((min, ticket) => 
                        Math.min(min, parseFloat(ticket.precio)), 
                        parseFloat(event.tiposEntrada[0].precio)
                      ).toFixed(2)} € - {
                      event.tiposEntrada.reduce((max, ticket) => 
                        Math.max(max, parseFloat(ticket.precio)), 0
                      ).toFixed(2)} €
                    </p>
                  </div>
                </li>
              )}
              {event.asistentes_maximos && (
                <li className="event-details-item">
                  <div className="event-details-icon">
                    <FiUsers />
                  </div>
                  <div className="event-details-content">
                    <h4>Aforo máximo</h4>
                    <p>{event.asistentes_maximos} personas</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          {/* Organizer Info */}
          {event.organizador && (
            <div className="event-sidebar-card">
              <h3 className="event-sidebar-title">Organizado por</h3>
              <div className="event-organizer">
                <div className="event-organizer-avatar">
                  {event.organizador.nombre_organizacion?.charAt(0) || "O"}
                </div>
                <div className="event-organizer-info">
                  <h4>{event.organizador.nombre_organizacion}</h4>
                  {event.organizador.user && (
                    <p>
                      {event.organizador.user.nombre} {event.organizador.user.apellido1}
                    </p>
                  )}
                </div>
              </div>
              
              {event.organizador.id && (
                <Link href={`/organizers/${event.organizador.id}`} className="event-organizer-link">
                  Ver perfil del organizador
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
