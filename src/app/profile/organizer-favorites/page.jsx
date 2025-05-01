"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { organizerFavoritesService } from "../../../services/organizerFavorites.service";
import { useNotification } from "../../../context/NotificationContext";
import { FiUsers, FiCalendar, FiArrowRight, FiBriefcase } from "react-icons/fi";
import "../favorites/favorites.css"; // Reutilizamos los estilos de favorites

export default function OrganizerFavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const { showSuccess, showError } = useNotification();
  // Usamos una referencia para evitar múltiples llamadas
  const isLoaded = useRef(false);

  useEffect(() => {
    // Evitamos llamadas repetidas
    if (isLoaded.current) return;

    const getFavorites = async () => {
      try {
        const response = await organizerFavoritesService.getFavoriteOrganizers();
        if (response && response.data) {
          setFavorites(response.data || []);
        }
      } catch (err) {
        console.error("Error al cargar organizadores favoritos:", err);
        showError("No se pudieron cargar tus organizadores favoritos");
      } finally {
        setLoading(false);
        // Marcamos que ya hemos cargado los datos
        isLoaded.current = true;
      }
    };

    getFavorites();
  }, [showError]);

  const handleRemoveFavorite = async (organizerId) => {
    try {
      setRemovingId(organizerId);
      await organizerFavoritesService.removeFromFavorites(organizerId);
      setFavorites(prev => prev.filter(fav => fav.organizador?.id !== organizerId));
      showSuccess("Organizador eliminado de favoritos");
    } catch (error) {
      showError("Error al eliminar de favoritos");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewOrganizer = (organizerId) => {
    router.push(`/organizadores/${organizerId}`);
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="favorites-spinner"></div>
        <p>Cargando tus organizadores favoritos...</p>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-title">
          <FiUsers className="favorites-icon" />
          <h1>Mis organizadores favoritos</h1>
        </div>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="favorites-empty-icon">
            <FiBriefcase />
          </div>
          <h2>No tienes organizadores favoritos</h2>
          <p>
            Explora los perfiles de organizadores y añádelos a favoritos para acceder rápidamente a ellos.
          </p>
          <div className="favorites-empty-actions">
            <button 
              onClick={() => router.push('/organizadores')}
              className="explore-button"
            >
              Ver organizadores
            </button>
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div className="favorite-card" key={favorite.id || Math.random().toString(36).substring(2, 9)}>
              <div className="favorite-card-image">
                {favorite.organizador?.logo_url ? (
                  <Image 
                    src={favorite.organizador.logo_url} 
                    alt={favorite.organizador.nombre_organizacion} 
                    width={300}
                    height={180}
                    objectFit="cover"
                  />
                ) : (
                  <div className="favorite-card-no-image">
                    <span>{favorite.organizador.nombre_organizacion?.charAt(0) || "O"}</span>
                  </div>
                )}
              </div>
              <div className="favorite-card-content">
                <h3 className="favorite-card-title">{favorite.organizador?.nombre_organizacion}</h3>
                
                <div className="favorite-card-details">
                  <div className="favorite-card-detail">
                    <FiCalendar className="detail-icon" />
                    <span>{favorite.organizador?.num_eventos || 0} eventos organizados</span>
                  </div>
                </div>
              </div>
              <div className="favorite-card-actions">
                <button 
                  className="view-event-button"
                  onClick={() => handleViewOrganizer(favorite.organizador.id)}
                >
                  Ver organizador <FiArrowRight />
                </button>
                <button
                  className="remove-favorite-button"
                  onClick={() => handleRemoveFavorite(favorite.organizador.id)}
                  disabled={removingId === favorite.organizador.id}
                >
                  {removingId === favorite.organizador.id ? (
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
