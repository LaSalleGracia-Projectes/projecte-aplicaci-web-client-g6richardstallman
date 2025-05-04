"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import EventoCard from './components/EventoCard';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaSpinner, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { eventsService } from '../../services/events.service';
import './events.css';

// Skeleton para carga
const EventoCardSkeleton = () => (
  <div className="evento-card-skeleton">
    <div style={{ height: '75%' }}></div>
    <div style={{ height: '25%', padding: '0.75rem' }}>
      <div style={{ height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.5rem', width: '80%' }}></div>
      <div style={{ height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '60%', marginBottom: '1rem' }}></div>
      <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '40%' }}></div>
        <div style={{ height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', width: '30%' }}></div>
      </div>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 10;

const EventosPage = () => {
  // Estados principales
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);

  // Filtros desde la URL
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryFilter = searchParams.get('category');
  const priceMinFilter = searchParams.get('price_min');
  const priceMaxFilter = searchParams.get('price_max');

  const abortControllerRef = useRef(null);

  // Construye los parámetros para la API
  const buildApiParams = useCallback((pageNum) => {
    const params = {
      page: pageNum,
      limit: ITEMS_PER_PAGE,
      with_prices: true
    };
    if (searchQuery) params.search = searchQuery;
    if (priceMinFilter) params.price_min = priceMinFilter;
    if (priceMaxFilter) params.price_max = priceMaxFilter;
    return params;
  }, [searchQuery, priceMinFilter, priceMaxFilter]);

  // Obtiene eventos del backend (paginados y filtrados)
  const fetchEventos = useCallback(async (pageNumber = 1, isLoadingMore = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (!isLoadingMore) setLoading(true);
    else setLoadingMore(true);

    setError(null);

    try {
      const params = buildApiParams(pageNumber);
      let result;
      if (categoryFilter) {
        result = await eventsService.getEventsByCategory(categoryFilter, params);
      } else {
        result = await eventsService.getAllEvents(params);
      }

      let fetchedEvents = [];
      let totalCount = 0;
      if (result?.eventos && Array.isArray(result.eventos)) {
        fetchedEvents = result.eventos;
        totalCount = result.total || fetchedEvents.length;
      } else if (Array.isArray(result)) {
        fetchedEvents = result;
        totalCount = fetchedEvents.length;
      }

      if (pageNumber === 1 || !isLoadingMore) setTotalEvents(totalCount);

      setEventos(prev => isLoadingMore ? [...prev, ...fetchedEvents] : fetchedEvents);
      setHasMore(fetchedEvents.length === ITEMS_PER_PAGE);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Error al cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
      console.error("Error:", err);
    } finally {
      if (!isLoadingMore) setLoading(false);
      else setLoadingMore(false);
      abortControllerRef.current = null;
    }
  }, [categoryFilter, buildApiParams]);

  // Efecto para cargar eventos al montar/cambiar filtros
  useEffect(() => {
    setPage(1);
    setEventos([]);
    fetchEventos(1);
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchEventos, searchQuery, categoryFilter, priceMinFilter, priceMaxFilter]);

  // Cargar más eventos (paginación)
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEventos(nextPage, true);
  }, [fetchEventos, loadingMore, hasMore, page]);

  // Limpiar filtros (volver a la vista principal)
  const clearFilters = useCallback(() => {
    window.location.href = '/events';
  }, []);

  // Título dinámico de la página
  const pageTitle = useMemo(() => {
    if (categoryFilter) {
      const categoryName = categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1).toLowerCase();
      return searchQuery ?
        `Resultados para "${searchQuery}" en ${categoryName}` :
        `Eventos de ${categoryName}`;
    }
    return searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los eventos';
  }, [searchQuery, categoryFilter]);

  // Renderiza skeletons de carga
  const renderSkeletons = useCallback(() => {
    return Array.from({ length: 4 }).map((_, i) => (
      <div key={`skeleton-${i}`} className="evento-card-skeleton-container">
        <EventoCardSkeleton />
      </div>
    ));
  }, []);

  // Render principal
  return (
    <main className="events-page-container">
      {/* Cabecera */}
      <div className="events-header">
        <h1 className="events-header-title">{pageTitle}</h1>
        <Link href="/events/categories" className="events-header-link">
          <FaCalendarAlt className="events-header-link-icon" aria-hidden="true" />
          Ver todas las categorías
        </Link>
      </div>

      {/* Barra de filtros activos */}
      {(searchQuery || categoryFilter || priceMinFilter || priceMaxFilter) && (
        <div className="events-filters-bar">
          <span className="events-filters-label">
            <FaSearch className="events-filters-icon" aria-hidden="true" />
            Filtros activos:
          </span>
          {searchQuery && (
            <span className="events-filter-tag">
              Búsqueda: {searchQuery}
            </span>
          )}
          {categoryFilter && (
            <span className="events-filter-tag">
              Categoría: {categoryFilter}
            </span>
          )}
          {priceMinFilter && (
            <span className="events-filter-tag">
              Precio mínimo: {priceMinFilter}€
            </span>
          )}
          {priceMaxFilter && (
            <span className="events-filter-tag">
              Precio máximo: {priceMaxFilter}€
            </span>
          )}
          <button
            onClick={clearFilters}
            className="events-filters-clear"
            aria-label="Limpiar filtros de búsqueda"
          >
            <FaTimes className="events-filters-clear-icon" aria-hidden="true" />
            Limpiar
          </button>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="events-error">
          <div className="events-error-content">
            <div className="events-error-icon-container">
              <FaExclamationTriangle className="events-error-icon" aria-hidden="true" />
            </div>
            <div className="events-error-message-container">
              <h3 className="events-error-title">Error al cargar los eventos</h3>
              <div className="events-error-text">
                <p>{error}</p>
              </div>
              <button
                type="button"
                onClick={() => fetchEventos(page)}
                className="events-error-button"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de eventos */}
      <div className="events-grid">
        {loading && eventos.length === 0 ? (
          renderSkeletons()
        ) : eventos.length === 0 && !loading ? (
          <div className="events-empty">
            <div className="events-empty-container">
              <FaCalendarAlt className="events-empty-icon" aria-hidden="true" />
              <h3 className="events-empty-title">No hay eventos disponibles</h3>
              <p className="events-empty-text">
                {searchQuery || categoryFilter || priceMinFilter || priceMaxFilter ?
                  'No se encontraron eventos que coincidan con los filtros aplicados.' :
                  'No hay eventos disponibles en este momento.'}
              </p>
              {(searchQuery || categoryFilter || priceMinFilter || priceMaxFilter) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="events-empty-button"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {eventos.map(evento => (
              <EventoCard key={`event-${evento.id}`} evento={evento} />
            ))}
            {loadingMore && renderSkeletons()}
          </>
        )}
      </div>

      {/* Botón de cargar más */}
      {hasMore && eventos.length > 0 && !loading && (
        <div className="events-load-more">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="events-load-more-button"
            aria-label="Cargar más eventos"
          >
            {loadingMore ? (
              <>
                <FaSpinner className="events-load-more-spinner" aria-hidden="true" />
                Cargando...
              </>
            ) : (
              'Cargar más eventos'
            )}
          </button>
        </div>
      )}

      {/* Contador de resultados */}
      {!loading && eventos.length > 0 && (
        <div className="events-result-count">
          Mostrando {eventos.length} de {totalEvents} eventos encontrados
        </div>
      )}
    </main>
  );
};

export default EventosPage;
