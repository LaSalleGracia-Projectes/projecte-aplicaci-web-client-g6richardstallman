"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import EventoCard from '../../components/EventoCard';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const CategoryEventsPage = () => {
  const params = useParams();
  const { category } = params;
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12;
  
  // Función optimizada para obtener eventos con paginación
  const fetchEventos = useCallback(async (pageNumber = 1, isLoadingMore = false) => {
    if (!category) return;
    if (!isLoadingMore) setLoading(true);
    
    try {
      // Crear URL con parámetros de paginación y optimizacion
      const params = new URLSearchParams({
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
        with_prices: true // Obtener precios en la misma llamada
      });
      
      const url = `http://localhost:8000/api/eventos/categoria/${category}?${params.toString()}`;
      
      const controller = new AbortController();
      const signal = controller.signal;
      
      const res = await fetch(url, { signal });
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.eventos) {
        // Actualizar eventos dependiendo si es carga inicial o "cargar más"
        setEventos(prev => isLoadingMore ? [...prev, ...data.eventos] : data.eventos);
        setHasMore(data.eventos.length === ITEMS_PER_PAGE);
      } else {
        setEventos(prev => isLoadingMore ? prev : []);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error al cargar eventos por categoría:', err);
      setError('No se pudieron cargar los eventos. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [category]);
  
  useEffect(() => {
    // Resetear a la primera página cuando cambia la categoría
    setPage(1);
    setEventos([]);
    fetchEventos(1);
    
    return () => {
      // Limpieza si es necesaria
    };
  }, [category, fetchEventos]);
  
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEventos(nextPage, true);
  };
  
  // Función para formatear el nombre de la categoría
  const formatearNombreCategoria = (cat) => {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };
  
  const categoriaNombre = formatearNombreCategoria(category);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Eventos de {categoriaNombre}</h1>
        <Link href="/events/categories" className="text-red-600 hover:underline flex items-center gap-1">
          <FaArrowLeft className="h-3 w-3" />
          <span>Ver todas las categorías</span>
        </Link>
      </div>
      
      {/* Estados de carga y error mejorados */}
      {loading && eventos.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      ) : eventos.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No hay eventos disponibles en esta categoría.
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
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md inline-flex items-center transition-colors"
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

export default CategoryEventsPage;
