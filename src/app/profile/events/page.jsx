"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { eventsService } from "../../../services/events.service";
import { userService } from "../../../services/user.service";
import { useNotification } from "../../../context/NotificationContext";
import { 
  FiCalendar, FiClock, FiMapPin, FiTag, FiEdit, 
  FiTrash2, FiEye, FiPackage, FiPlus, FiSearch,
  FiAlertTriangle, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import "./events.css";
import Image from "next/image";
import EventImage from "../../../components/EventImage";

export default function EventsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [actionInProgress, setActionInProgress] = useState(false);

  const goToCreateEvent = useCallback(() => {
    router.push("/profile/events/create");
  }, [router]);

  const fetchEvents = useCallback(async () => {
    try {
      const user = userService.getStoredUserInfo();
      if (!user || user.tipo_usuario?.toLowerCase() !== "organizador") {
        router.replace("/profile");
        return;
      }

      setLoading(true);
      setError(null);
      
      const result = await eventsService.getMyEvents();
      
      if (result && typeof result === 'object') {
        if (Array.isArray(result)) {
          setEvents(result);
        } else if (Array.isArray(result.data)) {
          setEvents(result.data);
        } else if (Array.isArray(result.eventos)) {
          setEvents(result.eventos);
        } else {
          console.warn("Unexpected response format from getMyEvents:", result);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("Error al cargar eventos:", err);
      if (err.status === 401) {
        setError("Sesión expirada. Por favor inicia sesión de nuevo");
        setTimeout(() => router.replace("/auth/login"), 3000);
      } else if (err.status === 403) {
        setError("No tienes permisos para acceder a esta página");
      } else {
        setError("No se pudieron cargar tus eventos");
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDeleteEvent = useCallback(async (eventId) => {
    if (actionInProgress) return;
    
    try {
      setDeletingEventId(eventId);
      setActionInProgress(true);
      await eventsService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.idEvento !== eventId));
      showSuccess("Evento eliminado correctamente");
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error al eliminar evento:", err);
      if (err.status === 409) {
        showError("No se puede eliminar el evento porque ya tiene entradas vendidas");
      } else if (err.status === 404) {
        showError("El evento ya no existe");
        fetchEvents();
      } else {
        showError("No se pudo eliminar el evento");
      }
    } finally {
      setDeletingEventId(null);
      setActionInProgress(false);
    }
  }, [showSuccess, showError, fetchEvents, actionInProgress]);

  const openDeleteConfirmation = useCallback((event) => {
    if (actionInProgress) return;
    setConfirmDelete(event);
  }, [actionInProgress]);

  const handleImageError = useCallback((eventId) => {
    setImageErrors(prev => ({
      ...prev,
      [eventId]: true
    }));
  }, []);

  const trackAction = useCallback((action, eventId) => {
    console.debug(`Action: ${action}, Event ID: ${eventId}`);
  }, []);

  const sortedAndFilteredEvents = useMemo(() => {
    let filtered = events.filter(event => 
      event.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.fecha || b.fechaEvento) - new Date(a.fecha || a.fechaEvento);
        case "date_asc":
          return new Date(a.fecha || a.fechaEvento) - new Date(b.fecha || b.fechaEvento);
        case "title_asc":
          return (a.titulo || a.nombreEvento).localeCompare(b.titulo || b.nombreEvento);
        case "title_desc":
          return (b.titulo || b.nombreEvento).localeCompare(a.titulo || a.nombreEvento);
        default:
          return new Date(b.fecha || b.fechaEvento) - new Date(a.fecha || a.fechaEvento);
      }
    });
  }, [events, searchTerm, sortBy]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedAndFilteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedAndFilteredEvents.length / eventsPerPage);

  const formatDate = useCallback((dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (err) {
      console.warn("Invalid date format:", dateString);
      return "Fecha no disponible";
    }
  }, []);

  const eventStatusBadge = useCallback((event) => {
    try {
      const eventDate = new Date(event.fecha || event.fechaEvento);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        return <span className="event-badge past">Finalizado</span>;
      } else if ((event.entradas_vendidas >= event.entradas_disponibles) && 
                event.entradas_disponibles > 0) {
        return <span className="event-badge sold-out">Agotado</span>;
      } else if (Math.abs(eventDate - today) / (1000 * 60 * 60 * 24) <= 7) {
        return <span className="event-badge soon">Próximamente</span>;
      } else {
        return <span className="event-badge active">Activo</span>;
      }
    } catch (err) {
      return <span className="event-badge">Estado desconocido</span>;
    }
  }, []);
  
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="events-loading">
        <div className="events-spinner"></div>
        <p>Cargando tus eventos...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="events-title">
          <FiCalendar className="events-icon" aria-hidden="true" />
          <h1>Mis Eventos</h1>
        </div>
        
        <button 
          onClick={goToCreateEvent}
          className="create-event-button"
          aria-label="Crear nuevo evento"
          disabled={actionInProgress}
        >
          <FiPlus aria-hidden="true" />
          <span>Crear Nuevo Evento</span>
        </button>
      </div>

      {error ? (
        <div className="events-empty events-error-state">
          <FiAlertTriangle size={70} />
          <h2>No pudimos cargar tus eventos</h2>
          <p>{error}</p>
          <button 
            onClick={goToCreateEvent}
            className="create-first-event-button"
            disabled={actionInProgress}
          >
            <FiPlus />
            <span>Crear mi primer evento</span>
          </button>
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="events-controls">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Buscar eventos"
              />
            </div>
            <div className="sort-container">
              <label htmlFor="sort-select">Ordenar por:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date_desc">Fecha (más reciente)</option>
                <option value="date_asc">Fecha (más antigua)</option>
                <option value="title_asc">Título (A-Z)</option>
                <option value="title_desc">Título (Z-A)</option>
              </select>
            </div>
          </div>

          <div className="events-list">
            {currentEvents.length > 0 ? currentEvents.map(event => (
              <div key={event.idEvento} className="event-card">
                <div className="event-image-container">
                  <EventImage 
                    src={event.imagen_url} 
                    alt={event.titulo || event.nombreEvento} 
                    width={300}
                    height={180}
                    className="event-image"
                    fallbackIcon={<FiCalendar size={40} />}
                  />
                  {eventStatusBadge(event)}
                </div>
                
                <div className="event-content">
                  <h2 className="event-title">{event.titulo || event.nombreEvento}</h2>
                  
                  <div className="event-details">
                    <div className="event-detail">
                      <FiCalendar className="event-detail-icon" />
                      <span>{formatDate(event.fecha || event.fechaEvento)}</span>
                    </div>
                    
                    <div className="event-detail">
                      <FiClock className="event-detail-icon" />
                      <span>{event.hora || "Hora no especificada"}</span>
                    </div>
                    
                    <div className="event-detail">
                      <FiMapPin className="event-detail-icon" />
                      <span>{event.ubicacion || "Ubicación no especificada"}</span>
                    </div>
                    
                    <div className="event-detail">
                      <FiTag className="event-detail-icon" />
                      <span>{event.categoria || "Sin categoría"}</span>
                    </div>
                  </div>

                  <div className="event-stats">
                    <div className="event-stat">
                      <span className="event-stat-label">Entradas vendidas:</span>
                      <span className="event-stat-value">{event.entradas_vendidas || 0}</span>
                    </div>
                    <div className="event-stat">
                      <span className="event-stat-label">Disponibles:</span>
                      <span className="event-stat-value">{event.entradas_disponibles || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="event-actions">
                  <button 
                    onClick={() => {
                      router.push(`/profile/events/${event.idEvento}/edit`);
                      trackAction("edit", event.idEvento);
                    }}
                    className="event-action-button edit-button"
                    aria-label={`Editar evento ${event.titulo || event.nombreEvento}`}
                    disabled={deletingEventId === event.idEvento || actionInProgress}
                  >
                    <FiEdit aria-hidden="true" />
                    <span>Editar</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      openDeleteConfirmation(event);
                      trackAction("delete", event.idEvento);
                    }}
                    className="event-action-button delete-button"
                    aria-label={`Eliminar evento ${event.titulo || event.nombreEvento}`}
                    disabled={deletingEventId === event.idEvento || actionInProgress}
                  >
                    <FiTrash2 aria-hidden="true" />
                    <span>Eliminar</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      router.push(`/events/${event.idEvento}`);
                      trackAction("view", event.idEvento);
                    }}
                    className="event-action-button view-button"
                    aria-label={`Ver evento ${event.titulo || event.nombreEvento}`}
                    disabled={deletingEventId === event.idEvento || actionInProgress}
                  >
                    <FiEye aria-hidden="true" />
                    <span>Ver</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      router.push(`/profile/events/${event.idEvento}/manage-tickets`);
                      trackAction("manage-tickets", event.idEvento);
                    }}
                    className="event-action-button manage-button"
                    aria-label={`Gestionar entradas para ${event.titulo || event.nombreEvento}`}
                    disabled={deletingEventId === event.idEvento || actionInProgress}
                  >
                    <FiPackage aria-hidden="true" />
                    <span>Entradas</span>
                  </button>
                </div>
              </div>
            )) : (
              <div className="no-search-results">
                <FiSearch size={48} />
                <h3>No se encontraron eventos</h3>
                <p>Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
          
          {sortedAndFilteredEvents.length > eventsPerPage && (
            <div className="pagination-controls">
              <button 
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
                aria-label="Página anterior"
              >
                <FiChevronLeft />
                <span>Anterior</span>
              </button>
              
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
                aria-label="Página siguiente"
              >
                <span>Siguiente</span>
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="events-empty">
          <FiCalendar size={80} color="#ef4444" />
          <h2>¡Comienza a crear tus eventos!</h2>
          <p>Todavía no has creado ningún evento. Crea tu primer evento para empezar a vender entradas.</p>
          <button 
            onClick={goToCreateEvent}
            className="create-first-event-button"
            disabled={actionInProgress}
          >
            <FiPlus />
            <span>Crear mi primer evento</span>
          </button>
        </div>
      )}

      {confirmDelete && (
        <div 
          className="delete-confirmation-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="delete-modal-title"
          onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}
          tabIndex={-1}
        >
          <div className="delete-confirmation-content">
            <FiAlertTriangle size={48} className="warning-icon" aria-hidden="true" />
            <h3 id="delete-modal-title">¿Eliminar evento?</h3>
            <p>¿Estás seguro de que deseas eliminar el evento <strong>{confirmDelete.titulo || confirmDelete.nombreEvento}</strong>?</p>
            <p className="delete-warning">Esta acción no se puede deshacer.</p>
            
            <div className="delete-confirmation-actions">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="cancel-delete-button"
                type="button"
                aria-label="Cancelar eliminación"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  handleDeleteEvent(confirmDelete.idEvento);
                  trackAction("confirm-delete", confirmDelete.idEvento);
                }}
                className="confirm-delete-button"
                type="button"
                aria-label="Confirmar eliminación de evento"
                disabled={deletingEventId === confirmDelete.idEvento}
              >
                {deletingEventId === confirmDelete.idEvento ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Eliminando...</span>
                  </>
                ) : "Eliminar evento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
