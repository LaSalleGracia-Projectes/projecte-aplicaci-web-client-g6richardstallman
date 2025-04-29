"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaListUl } from 'react-icons/fa';

const CategoriesPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorías predefinidas
  const categoriasPredefinidas = [
    { id: 'concierto', nombre: 'Concierto', imagen: '/img/categories/concierto.jpg' },
    { id: 'festival', nombre: 'Festival', imagen: '/img/categories/festival.jpg' },
    { id: 'teatro', nombre: 'Teatro', imagen: '/img/categories/teatro.jpg' },
    { id: 'deportes', nombre: 'Deportes', imagen: '/img/categories/deportes.jpg' },
    { id: 'conferencia', nombre: 'Conferencia', imagen: '/img/categories/conferencia.jpg' },
    { id: 'exposicion', nombre: 'Exposición', imagen: '/img/categories/exposicion.jpg' },
    { id: 'taller', nombre: 'Taller', imagen: '/img/categories/taller.jpg' },
    { id: 'otro', nombre: 'Otro', imagen: '/img/categories/otro.jpg' },
  ];

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        
        // Para cada categoría, obtener la cantidad de eventos
        const categoriasConConteo = await Promise.all(
          categoriasPredefinidas.map(async (categoria) => {
            try {
              const res = await fetch(`http://localhost:8000/api/eventos/categoria/${categoria.id}`);
              
              if (!res.ok) {
                throw new Error(`Error al obtener datos para la categoría ${categoria.id}`);
              }
              
              const data = await res.json();
              return {
                ...categoria,
                conteo: data.total || 0,
                eventos: data.eventos || []
              };
            } catch (err) {
              console.error(`Error al obtener eventos para categoría ${categoria.id}:`, err);
              return {
                ...categoria,
                conteo: 0,
                eventos: []
              };
            }
          })
        );
        
        // Ordenar categorías por número de eventos (descendente)
        const categoriasOrdenadas = categoriasConConteo.sort((a, b) => b.conteo - a.conteo);
        setCategorias(categoriasOrdenadas);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("No se pudieron cargar las categorías. Por favor, inténtelo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategorias();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <FaListUl className="text-red-600 text-2xl" />
        <h1 className="text-2xl font-bold">Categorías de Eventos</h1>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categorias.map(categoria => (
            <Link href={`/events/categories/${categoria.id}`} key={categoria.id}>
              <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow h-48">
                <Image
                  src={categoria.imagen || '/img/default-category.jpg'}
                  alt={categoria.nombre}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-xl font-bold text-white">{categoria.nombre}</h2>
                  <p className="text-white text-sm">{categoria.conteo} eventos</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
};

export default CategoriesPage;
