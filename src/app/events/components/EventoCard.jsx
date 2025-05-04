import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import "./EventoCard.css";

const formatearFecha = (fechaString) => {
  if (!fechaString) return "";

  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formateando fecha:", e);
    return "";
  }
};

const formatearHora = (horaString) => {
  if (!horaString) return "";
  try {
    const [hora, minutos] = horaString.split(":");
    return `${hora}:${minutos}h`;
  } catch (e) {
    console.error("Error formateando hora:", e);
    return horaString || "";
  }
};

const IMAGE_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const EventoCard = ({ evento }) => {
  const {
    id,
    nombreEvento,
    imagen_url,
    fechaEvento,
    hora,
    ubicacion,
    categoria,
    precio_desde,
    total_entradas_disponibles,
    es_online,
  } = evento;

  const fechaFormateada = formatearFecha(fechaEvento);
  const horaFormateada = formatearHora(hora);
  const imagenUrl = imagen_url || "/img/default-event.jpg";

  const [imageError, setImageError] = useState(false);

  const isLimitedAvailability =
    total_entradas_disponibles !== undefined &&
    total_entradas_disponibles > 0 &&
    total_entradas_disponibles < 10;

  return (
    <Link
      href={`/events/${id}`}
      className="evento-card-container"
      aria-label={`Ver detalles de ${nombreEvento}`}
    >
      <article className="evento-card">
        <div className="evento-card-image-container">
          {!imageError ? (
            <Image
              src={imagenUrl}
              alt={nombreEvento}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="evento-card-image"
              loading="lazy"
              placeholder="blur"
              blurDataURL={IMAGE_PLACEHOLDER}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="evento-card-image-placeholder">
              <FiCalendar
                className="evento-card-image-placeholder-icon"
                aria-hidden="true"
              />
              <p className="evento-card-image-placeholder-text">
                Imagen no disponible
              </p>
            </div>
          )}

          <div className="evento-card-badge-container">
            {categoria && (
              <span className="evento-card-badge">
                <FaTag className="evento-card-badge-icon" aria-hidden="true" />
                {categoria}
              </span>
            )}
            {es_online && (
              <span className="evento-card-badge evento-card-badge-online">
                Online
              </span>
            )}
          </div>

          {isLimitedAvailability && (
            <span className="evento-card-badge evento-card-badge-limited">
              ¡Últimas {total_entradas_disponibles} entradas!
            </span>
          )}

          {precio_desde !== undefined && precio_desde !== null && (
            <div className="evento-card-price">Desde {precio_desde}€</div>
          )}
        </div>

        <div className="evento-card-content">
          <div className="evento-card-title-container">
            <h3 className="evento-card-title">{nombreEvento}</h3>
          </div>

          {ubicacion && (
            <div className="evento-card-location">
              <p className="evento-card-location-text">
                <FaMapMarkerAlt
                  className="evento-card-location-icon"
                  aria-hidden="true"
                />
                <span
                  className="evento-card-location-text-value"
                  title={ubicacion}
                >
                  {ubicacion}
                </span>
              </p>
            </div>
          )}

          <div className="evento-card-spacer"></div>

          <div className="evento-card-footer">
            {fechaFormateada && (
              <time dateTime={fechaEvento} className="evento-card-date">
                <FaCalendarAlt
                  className="evento-card-date-icon"
                  aria-hidden="true"
                />
                <span>{fechaFormateada}</span>
              </time>
            )}
            {horaFormateada && (
              <span className="evento-card-time">
                <FaClock className="evento-card-time-icon" aria-hidden="true" />
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
    precio_desde: PropTypes.number,
    total_entradas_disponibles: PropTypes.number,
    es_online: PropTypes.bool,
  }).isRequired,
};

export default memo(EventoCard);
