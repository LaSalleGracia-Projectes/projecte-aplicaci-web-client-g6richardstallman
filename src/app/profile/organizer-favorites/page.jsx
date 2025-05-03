"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  FiMapPin
} from "react-icons/fi";
import "./organizer-favorites.css"; 

export default function OrganizerFavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const { showSuccess, showError } = useNotification();
  const isLoaded = useRef(false);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await organizerFavoritesService.getFavoriteOrganizers();
      if (response && response.data) {
        setFavorites(response.data || []);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("Error al cargar organizadores favoritos:", err);
      showError("No se pudieron cargar tus organizadores favoritos");
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
        const response = await organizerFavoritesService.getFavoriteOrganizers();
        if (mounted) {
          if (response && response.data) {
            setFavorites(response.data || []);
          } else {
            setFavorites([]);
          }
          setLoading(false);
          isLoaded.current = true;
        }
      } catch (err) {
        if (mounted) {
          console.error("Error al cargar organizadores favoritos:", err);
          showError("No se pudieron cargar tus organizadores favoritos");
          setFavorites([]);
          setLoading(false);
          isLoaded.current = true;
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [showError]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleRemoveFavorite = async (organizerId) => {
    if (!organizerId) return;
    
    try {
      setRemovingId(organizerId);
      await organizerFavoritesService.removeFromFavorites(organizerId);
      setFavorites(prev => prev.filter(fav => fav.organizador?.id !== organizerId));
      showSuccess("Organizador eliminado de favoritos");
    } catch (error) {
      showError("Error al eliminar de favoritos");
      console.error("Error al eliminar organizador de favoritos:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewOrganizer = useCallback((organizerId) => {
    if (organizerId) {
      router.push(`/organizadores/${organizerId}`);
    }
  }, [router]);

  // Memoizar tarjetas para evitar renderizados innecesarios
  const organizerCards = useMemo(() => {
    if (!favorites || favorites.length === 0) return null;
    
    return favorites.map(favorite => (
      <div 
        className="favorite-card organizer-card" 
        key={favorite.id || `org-${favorite.organizador?.id}`}
      >
        <div className="favorite-card-image">
          {favorite.organizador?.logo_url ? (
            <Image 
              src={favorite.organizador.logo_url} 
              alt={favorite.organizador.nombre_organizacion || "Organizador"} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className="favorite-card-no-image organizer-logo">
              <span>{favorite.organizador.nombre_organizacion?.charAt(0) || "O"}</span>
              <FiBriefcase aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="favorite-card-content">
          <h3 className="favorite-card-title">{favorite.organizador?.nombre_organizacion || "Organizador sin nombre"}</h3>
          
          <div className="favorite-card-details organizer-details">
            <div className="favorite-card-detail">
              <FiCalendar className="detail-icon" />
              <span>{favorite.organizador?.num_eventos || 0} eventos organizados</span>
            </div>
            {favorite.organizador?.ciudad && (
              <div className="favorite-card-detail">
                <FiMapPin className="detail-icon" />
                <span>{favorite.organizador.ciudad}</span>
              </div>
            )}
          </div>
        </div>
        <div className="favorite-card-actions">
          <button 
            className="view-event-button"
            onClick={() => handleViewOrganizer(favorite.organizador?.id)}
            aria-label={`Ver organizador ${favorite.organizador?.nombre_organizacion || ""}`}
          >
            Ver organizador <FiArrowRight aria-hidden="true" />
          </button>
          <button
            className="remove-favorite-button"
            onClick={() => handleRemoveFavorite(favorite.organizador?.id)}
            disabled={removingId === favorite.organizador?.id}
            aria-label={`Quitar de favoritos a ${favorite.organizador?.nombre_organizacion || ""}`}
          >
            {removingId === favorite.organizador?.id ? (
              <span className="removing-text">Eliminando...</span>
            ) : (
              <>Quitar de favoritos</>
            )}
          </button>
        </div>
      </div>
    ));
  }, [favorites, removingId, handleViewOrganizer]);

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="favorites-spinner" aria-hidden="true"></div>
        <p>Cargando tus organizadores favoritos...</p>
      </div>
    );
  }

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
          disabled={refreshing}
          aria-label="Actualizar organizadores favoritos"
        >
          <FiRefreshCw className={refreshing ? "spinning" : ""} aria-hidden="true" />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {!favorites || favorites.length === 0 ? (
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
              onClick={() => router.push('/organizadores')}
              className="explore-button"
              aria-label="Ver listado de organizadores"
            >
              Ver organizadores
            </button>
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {organizerCards}
        </div>
      )}
    </div>
  );
}
