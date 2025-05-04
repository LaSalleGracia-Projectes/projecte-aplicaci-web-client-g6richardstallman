"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { favoritesService } from "../../../services/favorites.service";
import { useNotification } from "../../../context/NotificationContext";
import { 
  FiHeart, 
  FiCalendar, 
  FiMapPin, 
  FiTag, 
  FiClock, 
  FiArrowRight, 
  FiSearch,
  FiRefreshCw 
} from "react-icons/fi";
import "./favorites.css";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const { showSuccess, showError } = useNotification();
  const isLoaded = useRef(false);

  // Carga los favoritos desde el backend y los transforma para la UI
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await favoritesService.getFavoriteEvents();
      // El backend devuelve { favoritos: [...], ... }
      let favoritos = [];
      if (response && Array.isArray(response.favoritos)) {
        favoritos = response.favoritos;
      } else if (response && Array.isArray(response.data)) {
        favoritos = response.data;
      }
      setFavorites(favoritos);
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      showError("No se pudieron cargar tus eventos favoritos");
      setFavorites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isLoaded.current = true;
    }
  }, [showError]);

  useEffect(() => {
    if (isLoaded.current) return;
    let mounted = true;
    const fetchData = async () => {
      try {
        const response = await favoritesService.getFavoriteEvents();
        let favoritos = [];
        if (response && Array.isArray(response.favoritos)) {
          favoritos = response.favoritos;
        } else if (response && Array.isArray(response.data)) {
          favoritos = response.data;
        }
        if (mounted) {
          setFavorites(favoritos);
          setLoading(false);
          isLoaded.current = true;
        }
      } catch (err) {
        if (mounted) {
          console.error("Error al cargar favoritos:", err);
          showError("No se pudieron cargar tus eventos favoritos");
          setFavorites([]);
          setLoading(false);
          isLoaded.current = true;
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [showError]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleRemoveFavorite = async (eventId) => {
    if (!eventId) return;
    try {
      setRemovingId(eventId);
      await favoritesService.removeFromFavorites(eventId);
      setFavorites(prev => prev.filter(fav => fav.evento?.idEvento !== eventId && fav.evento?.id !== eventId));
      showSuccess("Evento eliminado de favoritos");
    } catch (error) {
      showError("Error al eliminar de favoritos");
      console.error("Error al eliminar de favoritos:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewEvent = useCallback((eventId) => {
    if (eventId) {
      router.push(`/events/${eventId}`);
    }
  }, [router]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(date);
    } catch (e) {
      return "Fecha no disponible";
    }
  }, []);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return "Hora no disponible";
    return timeString.substring(0, 5);
  }, []);

  // Mapea los favoritos para mostrar tarjetas bonitas
  const favoriteCards = useMemo(() => {
    if (!favorites || favorites.length === 0) return null;
    return favorites.map(favorite => {
      // El objeto favorito puede tener 'evento' o estar plano
      const evento = favorite.evento || favorite;
      const eventId = evento.idEvento || evento.id;
      const titulo = evento.nombreEvento || evento.titulo || "Evento sin título";
      // --- CORRECCIÓN DE RUTA DE IMAGEN ---
      let imagenUrl = evento.imagen_url || evento.imagen;
      if (!imagenUrl || imagenUrl === "eventos/default.jpg" || imagenUrl === "/eventos/default.jpg") {
        imagenUrl = "/img/default-event.jpg"; // Debe empezar por "/"
      } else if (typeof imagenUrl === "string" && !imagenUrl.startsWith("/") && !imagenUrl.startsWith("http")) {
        imagenUrl = "/" + imagenUrl;
      }
      // --- FIN CORRECCIÓN ---
      const fecha = evento.fechaEvento || evento.fecha;
      const hora = evento.horaEvento || evento.hora;
      const ubicacion = evento.ubicacion || "Online";
      const categoria = evento.categoria || "Sin categoría";
      return (
        <div 
          className="favorite-card" 
          key={favorite.id || `fav-${eventId}`}
        >
          <div className="favorite-card-image">
            {imagenUrl ? (
              <Image 
                src={imagenUrl}
                alt={titulo}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                priority={false}
                loading="lazy"
              />
            ) : (
              <div className="favorite-card-no-image">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
          <div className="favorite-card-content">
            <h3 className="favorite-card-title">{titulo}</h3>
            <div className="favorite-card-details">
              <div className="favorite-card-detail">
                <FiCalendar className="detail-icon" />
                <span>{formatDate(fecha)}</span>
              </div>
              <div className="favorite-card-detail">
                <FiClock className="detail-icon" />
                <span>{formatTime(hora)}</span>
              </div>
              <div className="favorite-card-detail">
                <FiMapPin className="detail-icon" />
                <span>{ubicacion}</span>
              </div>
              <div className="favorite-card-detail">
                <FiTag className="detail-icon" />
                <span>{categoria}</span>
              </div>
            </div>
          </div>
          <div className="favorite-card-actions">
            <button 
              className="view-event-button"
              onClick={() => handleViewEvent(eventId)}
            >
              Ver evento <FiArrowRight />
            </button>
            <button 
              className="remove-favorite-button"
              onClick={() => handleRemoveFavorite(eventId)}
              disabled={removingId === eventId}
            >
              {removingId === eventId ? (
                <span className="removing-text">Eliminando...</span>
              ) : (
                <>Quitar de favoritos</>
              )}
            </button>
          </div>
        </div>
      );
    });
  }, [favorites, removingId, formatDate, formatTime, handleViewEvent]);

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="favorites-spinner" aria-hidden="true"></div>
        <p>Cargando tus eventos favoritos...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-title">
          <FiHeart className="favorites-icon" aria-hidden="true" />
          <h1>Mis eventos favoritos</h1>
        </div>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Actualizar favoritos"
        >
          <FiRefreshCw className={refreshing ? "spinning" : ""} aria-hidden="true" />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">
            <FiSearch aria-hidden="true" />
          </div>
          <h2>No tienes eventos favoritos</h2>
          <p>
            Explora eventos y guárdalos como favoritos para acceder rápidamente a ellos desde aquí.
          </p>
          <div className="favorites-empty-actions">
            <button 
              onClick={() => router.push('/events')}
              className="explore-button"
            >
              Explorar eventos
            </button>
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteCards}
        </div>
      )}
    </div>
  );
}