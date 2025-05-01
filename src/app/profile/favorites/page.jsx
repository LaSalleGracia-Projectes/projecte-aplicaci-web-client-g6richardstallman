"use client";
import { useEffect, useState, useRef } from "react";
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
  FiSearch 
} from "react-icons/fi";
import "./favorites.css";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const { showSuccess, showError } = useNotification();
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;

    const getFavorites = async () => {
      try {
        const response = await favoritesService.getFavoriteEvents();
        if (response && response.data) {
          setFavorites(response.data || []);
        }
      } catch (err) {
        console.error("Error al cargar favoritos:", err);
        showError("No se pudieron cargar tus eventos favoritos");
      } finally {
        setLoading(false);
        isLoaded.current = true;
      }
    };

    getFavorites();
  }, [showError]);

  const handleRemoveFavorite = async (eventId) => {
    try {
      setRemovingId(eventId);
      await favoritesService.removeFromFavorites(eventId);
      setFavorites(prev => prev.filter(fav => fav.id_evento !== eventId));
      showSuccess("Evento eliminado de favoritos");
    } catch (error) {
      showError("Error al eliminar de favoritos");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewEvent = (eventId) => {
    router.push(`/eventos/${eventId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="favorites-spinner"></div>
        <p>Cargando tus eventos favoritos...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-title">
          <FiHeart className="favorites-icon" />
          <h1>Mis eventos favoritos</h1>
        </div>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">
            <FiSearch />
          </div>
          <h2>No tienes eventos favoritos</h2>
          <p>
            Explora eventos y guárdalos como favoritos para acceder rápidamente a ellos desde aquí.
          </p>
          <div className="favorites-empty-actions">
            <button 
              onClick={() => router.push('/eventos')}
              className="explore-button"
            >
              Explorar eventos
            </button>
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div className="favorite-card" key={favorite.id}>
              <div className="favorite-card-image">
                {favorite.evento?.imagen_url ? (
                  <Image 
                    src={favorite.evento.imagen_url} 
                    alt={favorite.evento.titulo} 
                    width={300}
                    height={180}
                    objectFit="cover"
                  />
                ) : (
                  <div className="favorite-card-no-image">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="favorite-card-content">
                <h3 className="favorite-card-title">{favorite.evento?.titulo}</h3>
                <div className="favorite-card-details">
                  <div className="favorite-card-detail">
                    <FiCalendar className="detail-icon" />
                    <span>{formatDate(favorite.evento?.fecha)}</span>
                  </div>
                  <div className="favorite-card-detail">
                    <FiClock className="detail-icon" />
                    <span>{formatTime(favorite.evento?.hora)}</span>
                  </div>
                  <div className="favorite-card-detail">
                    <FiMapPin className="detail-icon" />
                    <span>{favorite.evento?.ubicacion || "Online"}</span>
                  </div>
                  <div className="favorite-card-detail">
                    <FiTag className="detail-icon" />
                    <span>{favorite.evento?.categoria}</span>
                  </div>
                </div>
              </div>
              <div className="favorite-card-actions">
                <button 
                  className="view-event-button"
                  onClick={() => handleViewEvent(favorite.evento.id)}
                >
                  Ver evento <FiArrowRight />
                </button>
                <button 
                  className="remove-favorite-button"
                  onClick={() => handleRemoveFavorite(favorite.evento.id)}
                  disabled={removingId === favorite.evento.id}
                >
                  {removingId === favorite.evento.id ? (
                    <span className="removing-text">Eliminando...</span>
                  ) : (
                    <>Quitar de favoritos</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}