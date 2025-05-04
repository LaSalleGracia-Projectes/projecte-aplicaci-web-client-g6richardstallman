"use client";
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { FiUsers, FiMapPin, FiAlertTriangle, FiSearch, FiPhone, FiStar, FiMail, FiArrowUp } from 'react-icons/fi';
import { organizersService } from '../../services/organizers.service';
import './organizers.css';

const getInitials = (name) => {
  if (!name) return 'O';
  return name.split(' ').map(part => part.charAt(0).toUpperCase()).slice(0, 2).join('');
};

const OrganizerAvatar = ({ organizer, size = 120 }) => {
  const [imgError, setImgError] = useState(false);
  const initial = getInitials(organizer.nombre_organizacion);
  if (imgError || !organizer.avatar_url) {
    return (
      <div className="organizer-card-initial" style={{ width: size, height: size }} aria-label={`Inicial ${initial}`}>
        {initial}
      </div>
    );
  }
  return (
    <div className="organizer-image-container" style={{ width: size, height: size }}>
      <img
        src={organizer.avatar_url}
        alt={organizer.nombre_organizacion || "Organizador"}
        width={size}
        height={size}
        className="organizer-card-image"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

const OrganizerCard = ({ organizer }) => (
  <Link href={`/organizers/${organizer.id}`} className="organizer-card">
    <div className="organizer-card-avatar">
      <OrganizerAvatar organizer={organizer} />
      {organizer.is_favorite && (
        <div className="organizer-favorite-badge" aria-label="Favorito">
          <FiStar className="favorite-icon" />
        </div>
      )}
    </div>
    <div className="organizer-card-content">
      <h3 className="organizer-card-name">{organizer.nombre_organizacion}</h3>
      {organizer.nombre_usuario && (
        <p className="organizer-card-owner">{organizer.nombre_usuario}</p>
      )}
      <div className="organizer-card-meta">
        {organizer.telefono_contacto && (
          <span className="organizer-card-stat">
            <FiPhone className="organizer-card-icon" aria-hidden="true" />
            {organizer.telefono_contacto}
          </span>
        )}
        {organizer.email && (
          <span className="organizer-card-stat">
            <FiMail className="organizer-card-icon" aria-hidden="true" />
            {organizer.email}
          </span>
        )}
        {organizer.ubicacion && (
          <span className="organizer-card-stat">
            <FiMapPin className="organizer-card-icon" aria-hidden="true" />
            {organizer.ubicacion}
          </span>
        )}
      </div>
    </div>
  </Link>
);

const OrganizerCardSkeleton = () => (
  <div className="organizer-card-skeleton" aria-label="Cargando datos de organizador">
    <div className="organizer-card-avatar-skeleton"></div>
    <div className="organizer-card-content-skeleton">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-stats"></div>
      <div className="skeleton-line skeleton-stats"></div>
    </div>
  </div>
);

export default function OrganizersPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const searchInputRef = useRef(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchOrganizers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await organizersService.getAllOrganizers();
      if (response && response.success && Array.isArray(response.data)) {
        setOrganizers(response.data);
        setError(null);
      } else {
        throw new Error();
      }
    } catch {
      setError("No se pudieron cargar los organizadores. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrganizers(); }, [fetchOrganizers]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const displayedOrganizers = useMemo(() => {
    if (!searchTerm.trim()) return organizers;
    const searchLower = searchTerm.toLowerCase();
    return organizers.filter(org =>
      org.nombre_organizacion?.toLowerCase().includes(searchLower) ||
      org.nombre_usuario?.toLowerCase().includes(searchLower) ||
      org.telefono_contacto?.toLowerCase().includes(searchLower)
    );
  }, [organizers, searchTerm]);

  return (
    <div className="organizers-container">
      <div className="organizers-header">
        <h1 className="organizers-title">
          <FiUsers className="organizers-title-icon" aria-hidden="true" />
          Organizadores de Eventos
        </h1>
        <div className="organizers-search">
          <FiSearch className="organizers-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar organizadores por nombre, contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="organizers-search-input"
            aria-label="Buscar organizadores"
          />
          {searchTerm && (
            <button
              className="organizers-search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              &times;
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="organizers-error" role="alert">
          <FiAlertTriangle className="organizers-error-icon" aria-hidden="true" />
          <p>{error}</p>
          <button onClick={fetchOrganizers} className="organizers-error-retry">
            Reintentar
          </button>
        </div>
      )}
      <div className="organizers-grid" aria-live="polite">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="organizer-card-container">
              <OrganizerCardSkeleton />
            </div>
          ))
        ) : displayedOrganizers.length > 0 ? (
          displayedOrganizers.map(organizer => (
            <div key={organizer.id} className="organizer-card-container">
              <OrganizerCard organizer={organizer} />
            </div>
          ))
        ) : (
          <div className="organizers-empty" role="status">
            <FiUsers className="organizers-empty-icon" aria-hidden="true" />
            <h2 className="organizers-empty-title">
              {searchTerm ? 'No se encontraron organizadores' : 'No hay organizadores disponibles'}
            </h2>
            <p className="organizers-empty-text">
              {searchTerm
                ? 'Intente con otros términos de búsqueda'
                : 'No hay organizadores registrados en este momento'}
            </p>
          </div>
        )}
      </div>
      {showScrollButton && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Volver arriba">
          <FiArrowUp />
        </button>
      )}
    </div>
  );
}
