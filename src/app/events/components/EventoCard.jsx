// Componente para mostrar un evento en el listado
import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';

// Formateadores de fecha/hora extraídos como funciones puras
const formatearFecha = (fechaString) => {
  if (!fechaString) return '';
  
  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Error formateando fecha:", e);
    return '';
  }
};

const formatearHora = (horaString) => {
  if (!horaString) return '';
  try {
    const [hora, minutos] = horaString.split(':');
    return `${hora}:${minutos}h`;
  } catch (e) {
    console.error("Error formateando hora:", e);
    return horaString || '';
  }
};

const EventoCard = ({ evento }) => {
  // Formateos calculados solo una vez
  const fechaFormateada = formatearFecha(evento.fechaEvento);
  const horaFormateada = formatearHora(evento.hora);
  
  // Definimos una URL de imagen por defecto
  const imagenUrl = evento.imagen_url || '/img/default-event.jpg';

  return (
    <Link href={`/eventos/${evento.id}`} className="block h-full" aria-label={`Ver detalles de ${evento.nombreEvento}`}>  
      <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full">
        {/* Imagen con altura fija - Optimizada */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={imagenUrl}
            alt={evento.nombreEvento}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P//fwAJtAPdcCRGlQAAAABJRU5ErkJggg=="
          />
          {evento.categoria && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">
              {evento.categoria}
            </span>
          )}
          {/* Banner de precio si hay entradas */}
          {evento.precio_desde && (
            <div className="absolute bottom-0 right-0 bg-red-600 text-white px-3 py-1 font-semibold text-sm">
              Desde {evento.precio_desde}€
            </div>
          )}
        </div>
        
        {/* Contenido con altura flexible */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Título con altura fija para evitar desalineación */}
          <div className="h-14 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{evento.nombreEvento}</h3>
          </div>
          
          {/* Ubicación con altura fija */}
          <div className="h-6 mb-2">
            {evento.ubicacion && (
              <p className="text-sm text-gray-500 line-clamp-1">
                <span className="inline-flex items-center">
                  <FaMapMarkerAlt className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{evento.ubicacion}</span>
                </span>
              </p>
            )}
          </div>
          
          {/* Espacio flexible */}
          <div className="flex-grow"></div>
          
          {/* Fecha y hora siempre al fondo */}
          <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-600 flex justify-between items-center">
            {fechaFormateada && (
              <time dateTime={evento.fechaEvento} className="flex items-center">
                <FaCalendarAlt className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{fechaFormateada}</span>
              </time>
            )}
            {horaFormateada && (
              <span className="flex items-center">
                <FaClock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>{horaFormateada}</span>
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

EventoCard.propTypes = {
  evento: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombreEvento: PropTypes.string.isRequired,
    imagen_url: PropTypes.string,
    fechaEvento: PropTypes.string,
    hora: PropTypes.string,
    ubicacion: PropTypes.string,
    categoria: PropTypes.string,
    precio_desde: PropTypes.number, // Precio mínimo de las entradas
  }).isRequired,
};

// Usar memo para evitar renderizados innecesarios
export default memo(EventoCard);
