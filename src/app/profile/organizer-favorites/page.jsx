"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { organizerFavoritesService } from "../../../services/organizerFavorites.service";
import { useNotification } from "../../../context/NotificationContext";
import { 
  FiUsers, 
  FiCalendar, 
  FiArrowRight, 
  FiBriefcase,
  FiRefreshCw,
  FiMapPin,
  FiGlobe,
  FiMail,
  FiPhone,
  FiInfo
} from "react-icons/fi";
import "./organizer-favorites.css"; 

export default function OrganizerFavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const { showSuccess, showError } = useNotification();

  // Improved favorites fetch function with better error handling
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await organizerFavoritesService.getFavoriteOrganizers();
      
      if (response?.data?.favoritos) {
        setFavorites(response.data.favoritos);
      } else if (response?.favoritos) {
        setFavorites(response.favoritos);
      } else if (Array.isArray(response)) {
        setFavorites(response);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Error loading favorite organizers:", err);
      showError("No se pudieron cargar tus organizadores favoritos");
      setFavorites([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  // Optimized remove favorite function with cleaner state management
  const handleRemoveFavorite = async (organizerId) => {
    if (!organizerId || removingId) return;
    
    try {
      setRemovingId(organizerId);
      await organizerFavoritesService.removeFromFavorites(organizerId);
      
      // Update local state immediately for better UX
      setFavorites(prev => prev.filter(fav => {
        const id = fav.id || fav.organizador?.id;
        return id !== organizerId;
      }));
      
      showSuccess("Organizador eliminado de favoritos");
    } catch (error) {
      console.error("Error removing organizer from favorites:", error);
      showError("Error al eliminar de favoritos");
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewOrganizer = useCallback((organizerId) => {
    if (organizerId) {
      router.push(`/organizers/${organizerId}`);
    }
  }, [router]);

  // Empty state component
  const EmptyState = () => (
    <div className="favorites-empty">
      <div className="favorites-empty-icon organizer-empty-icon">
        <FiBriefcase aria-hidden="true" />
      </div>
      <h2>No tienes organizadores favoritos</h2>
      <p>
        Explora los perfiles de organizadores y añádelos a favoritos para acceder rápidamente a ellos.
      </p>
      <div className="favorites-empty-actions">
        <button 
          onClick={() => router.push('/organizers')}
          className="explore-button"
          aria-label="Ver listado de organizadores"
        >
          Ver organizadores
        </button>
      </div>
    </div>
  );

  // Loading state component
  const LoadingState = () => (
    <div className="favorites-loading">
      <div className="favorites-spinner" aria-hidden="true"></div>
      <p>Cargando tus organizadores favoritos...</p>
    </div>
  );

  // Individual organizer card component for cleaner rendering
  const OrganizerCard = ({ favorite }) => {
    // Handle potential data structure differences
    const organizerId = favorite.id || favorite.organizador?.id;
    const organizerName = favorite.nombre_organizacion || favorite.organizador?.nombre_organizacion || "Organizador";
    const contactPhone = favorite.telefono_contacto || favorite.organizador?.telefono_contacto;
    const logoUrl = favorite.avatar_url || favorite.organizador?.avatar_url || favorite.organizador?.logo_url;
    const city = favorite.ciudad || favorite.organizador?.ciudad;
    const website = favorite.sitio_web || favorite.organizador?.sitio_web;
    const email = favorite.user?.email || favorite.organizador?.user?.email;

    return (
      <div className="favorite-card organizer-card">
        <div className="favorite-card-image">
          {logoUrl ? (
            <Image 
              src={logoUrl} 
              alt={organizerName} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
          ) : (
            <div className="favorite-card-no-image organizer-logo">
              <span>{organizerName.charAt(0)}</span>
              <FiBriefcase aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="favorite-card-content">
          <h3 className="favorite-card-title">{organizerName}</h3>
          
          <div className="favorite-card-details organizer-details">
            {contactPhone && (
              <div className="favorite-card-detail">
                <FiPhone className="detail-icon" />
                <span>{contactPhone}</span>
              </div>
            )}
            
            {email && (
              <div className="favorite-card-detail">
                <FiMail className="detail-icon" />
                <span>{email}</span>
              </div>
            )}
            
            {website && (
              <div className="favorite-card-detail">
                <FiGlobe className="detail-icon" />
                <span className="truncate-text">{website}</span>
              </div>
            )}
            
            {city && (
              <div className="favorite-card-detail">
                <FiMapPin className="detail-icon" />
                <span>{city}</span>
              </div>
            )}
            
            {(!contactPhone && !email && !website && !city) && (
              <div className="favorite-card-detail no-details">
                <FiInfo className="detail-icon" />
                <span>No hay información adicional disponible</span>
              </div>
            )}
          </div>
        </div>
        <div className="favorite-card-actions">
          <button 
            className="view-event-button"
            onClick={() => handleViewOrganizer(organizerId)}
            aria-label={`Ver organizador ${organizerName}`}
          >
            Ver organizador <FiArrowRight aria-hidden="true" />
          </button>
          <button
            className="remove-favorite-button"
            onClick={() => handleRemoveFavorite(organizerId)}
            disabled={removingId === organizerId}
            aria-label={`Quitar de favoritos a ${organizerName}`}
          >
            {removingId === organizerId ? (
              <span className="removing-text">Eliminando...</span>
            ) : (
              <>Quitar de favoritos</>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-title">
          <FiUsers className="favorites-icon organizer-icon" aria-hidden="true" />
          <h1>Mis organizadores favoritos</h1>
        </div>
        <button 
          className="refresh-button" 
          onClick={handleRefresh}
          disabled={refreshing || loading}
          aria-label="Actualizar organizadores favoritos"
        >
          <FiRefreshCw className={refreshing ? "spinning" : ""} aria-hidden="true" />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : !favorites || favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <OrganizerCard 
              key={favorite.id || favorite.organizador?.id || Math.random().toString(36)} 
              favorite={favorite} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
