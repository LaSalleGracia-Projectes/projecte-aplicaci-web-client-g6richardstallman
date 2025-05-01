"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import EventoCard from './components/EventoCard';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaTimes, FaSpinner } from 'react-icons/fa';

const EventosPage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryFilter = searchParams.get('category');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;

  // Función para obtener eventos optimizada con caché
  const fetchEventos = async (page = 1, isLoadingMore = false) => {
    if (!isLoadingMore) setLoading(true);
    
    try {
      // Usar URLSearchParams para construir la query de manera más eficiente
      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        with_prices: true // Pedimos los precios en la misma llamada
      });
      
      if (categoryFilter) params.append('category', categoryFilter);
      
      // URL base
      const url = categoryFilter 
        ? `http://localhost:8000/api/eventos/categoria/${categoryFilter}`
        : 'http://localhost:8000/api/eventos';
      
      // Agregar parámetros de paginación
      const fullUrl = `${url}?${params.toString()}`;
      
      // Uso de AbortController para cancelar peticiones si es necesario
      const controller = new AbortController();
      const signal = controller.signal;
      
      const res = await fetch(fullUrl, { signal });
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      let filteredEventos = data.eventos || [];
      
      // Aplicar filtro de búsqueda en el cliente si es necesario
      if (searchQuery) {
        filteredEventos = filteredEventos.filter(evento => 
          evento.nombreEvento && evento.nombreEvento.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Actualizar eventos: concatenar en caso de paginación o reemplazar
      setEventos(prev => isLoadingMore ? [...prev, ...filteredEventos] : filteredEventos);
      
      // Determinar si hay más páginas para cargar
      setHasMore(filteredEventos.length === ITEMS_PER_PAGE);
      
      return filteredEventos;
    } catch (err) {
      console.error("Error al cargar eventos:", err);
      setError('Error de conexión. Por favor, inténtelo de nuevo más tarde.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reiniciar a la primera página cuando cambian los filtros
    setPage(1);
    setEventos([]);
    fetchEventos(1);
    
    // Implementar limpieza si la componente se desmonta
    return () => {
      // Si hay algún controlador de fetch activo, puedes cancelarlo aquí
    };
  }, [searchQuery, categoryFilter]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchEventos(nextPage, true);
  };

  const clearFilters = () => {
    window.location.href = '/events';
  };

  // Memorizar el título de la página para evitar recalculos
  const pageTitle = useMemo(() => {
    if (categoryFilter) {
      const categoryName = categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1).toLowerCase();
      return searchQuery ? 
        `Resultados para "${searchQuery}" en ${categoryName}` : 
        `Eventos de ${categoryName}`;
    }
    return searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los eventos';
  }, [searchQuery, categoryFilter]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        
        <Link href="/events/categories" className="text-red-600 hover:underline">
          Ver todas las categorías
        </Link>
      </div>
      
      {(searchQuery || categoryFilter) && (
        <div className="mb-4">
          <button 
            onClick={clearFilters}
            className="flex items-center text-gray-600 hover:text-red-600"
            aria-label="Limpiar filtros de búsqueda"
          >
            <FaTimes className="mr-1" /> 
            Limpiar filtros
          </button>
        </div>
      )}
      
      {/* Parte de visualización principal */}
      {loading && eventos.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : error && eventos.length === 0 ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">{error}</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {searchQuery || categoryFilter ? 
            `No se encontraron eventos que coincidan con los filtros aplicados` : 
            'No hay eventos disponibles.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eventos.map(evento => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </div>
          
          {/* Botón de cargar más */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md inline-flex items-center transition-colors disabled:opacity-50"
                aria-label="Cargar más eventos"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más eventos'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default EventosPage;
