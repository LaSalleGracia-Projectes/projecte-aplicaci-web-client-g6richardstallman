"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventById } from "../../../services/events.service";
import { FiCalendar, FiMapPin, FiClock, FiTag, FiHeart } from "react-icons/fi";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log("Fetching event with ID:", id);
        
        const result = await getEventById(id);
        console.log("API Response:", result);
        
        if (result && result.evento) {
          setEvent(result.evento);
          
          // Check if the event is in favorites if the user is authenticated
          const token = localStorage.getItem('access_token');
          if (token) {
            try {
              const favResponse = await fetch(`http://localhost:8000/api/favoritos/check/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const favData = await favResponse.json();
              setIsFavorite(favData.isFavorito || false);
            } catch (err) {
              console.error("Error checking favorite status:", err);
            }
          }
        } else {
          setError('No se pudo cargar el evento o no existe');
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError('Error al cargar los detalles del evento');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/auth/login?redirect=' + encodeURIComponent(`/events/${id}`));
      return;
    }

    try {
      const url = `http://localhost:8000/api/favoritos${isFavorite ? `/${id}` : ''}`;
      const method = isFavorite ? 'DELETE' : 'POST';
      const body = isFavorite ? null : JSON.stringify({ idEvento: id });
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: method === 'POST' ? body : undefined
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Error toggling favorite:", result);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const buyTickets = () => {
    router.push(`/events/${id}/tickets`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/events')}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Ver otros eventos
        </button>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Event Hero Section */}
        <div className="relative h-80">
          <img 
            src={event.imagen_url || '/img/default-event.jpg'} 
            alt={event.nombreEvento}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  {event.categoria}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.nombreEvento}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(event.fechaEvento).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>{event.hora}</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="mr-2" />
                  <span>{event.ubicacion}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Details */}
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Detalles del evento</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{event.descripcion}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                  isFavorite 
                    ? "bg-pink-100 text-pink-600 border border-pink-300" 
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                <FiHeart className={isFavorite ? "fill-pink-600" : ""} />
                {isFavorite ? "En favoritos" : "Añadir a favoritos"}
              </button>
              
              <button
                onClick={buyTickets}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FiTag />
                Comprar entradas
              </button>
            </div>
          </div>
          
          {/* Organizer Info */}
          {event.organizador && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Organizado por</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xl font-bold">
                  {event.organizador.nombre_organizacion?.charAt(0) || "O"}
                </div>
                <div className="ml-4">
                  <h4 className="font-medium">{event.organizador.nombre_organizacion}</h4>
                  <p className="text-gray-600 text-sm">
                    {event.organizador.user?.nombre} {event.organizador.user?.apellido1}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Available Tickets Section (can be expanded in the future) */}
          {event.tiposEntrada && event.tiposEntrada.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Entradas disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.tiposEntrada.map(tipo => (
                  <div 
                    key={tipo.id} 
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{tipo.nombre}</h4>
                      <p className="text-gray-600">{tipo.descripcion}</p>
                      <p className="text-gray-700 mt-1">
                        {tipo.es_ilimitado 
                          ? 'Disponibilidad: Ilimitada' 
                          : `Disponibles: ${tipo.cantidad_disponible - (tipo.entradas_vendidas || 0)}`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">€{tipo.precio}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={buyTickets}
                  className="px-8 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                >
                  Comprar entradas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
