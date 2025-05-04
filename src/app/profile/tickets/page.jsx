"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { purchasesService } from "../../../services/purchases.service";
import { documentsService } from "../../../services/documents.service";
import { useNotification } from "../../../context/NotificationContext";
import {
  FiTag,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiFileText,
  FiInfo,
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiUsers
} from "react-icons/fi";
import "./tickets.css";

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(null);
  const { showSuccess, showError } = useNotification();
  const isLoaded = useRef(false);

  // Agrupa las compras por evento y fecha de compra
  const groupTickets = useCallback((compras) => {
    if (!Array.isArray(compras)) return [];
    // Agrupar por clave compuesta evento-fecha
    const grouped = {};
    compras.forEach(compra => {
      const evento = compra.evento || {};
      const fechaCompra = compra.fecha_compra || "";
      const clave = `${evento.id || evento.idEvento || "evento"}_${fechaCompra}`;
      if (!grouped[clave]) {
        grouped[clave] = {
          evento,
          fechaCompra,
          entradas: [],
          total: 0,
          idCompra: compra.id_compra || compra.idVentaEntrada || compra.id || ""
        };
      }
      grouped[clave].entradas.push(compra);
      grouped[clave].total += Number(compra.precio || 0);
    });
    // Ordenar por fecha de compra descendente
    return Object.values(grouped).sort(
      (a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)
    );
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await purchasesService.getMyPurchases();
      if (response && (response.data || response.compras)) {
        setTickets(groupTickets(response.data || response.compras || []));
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error("Error al cargar entradas:", err);
      showError("No se pudieron cargar tus entradas");
      setTickets([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      isLoaded.current = true;
    }
  }, [showError, groupTickets]);

  useEffect(() => {
    if (isLoaded.current) return;
    let mounted = true;
    const fetchData = async () => {
      try {
        const response = await purchasesService.getMyPurchases();
        if (mounted) {
          if (response && (response.data || response.compras)) {
            setTickets(groupTickets(response.data || response.compras || []));
          } else {
            setTickets([]);
          }
          setLoading(false);
          isLoaded.current = true;
        }
      } catch (err) {
        if (mounted) {
          console.error("Error al cargar entradas:", err);
          showError("No se pudieron cargar tus entradas");
          setTickets([]);
          setLoading(false);
          isLoaded.current = true;
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [showError, groupTickets]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleViewEvent = useCallback((eventId) => {
    if (eventId) {
      router.push(`/events/${eventId}`);
    }
  }, [router]);

  const handleDownloadTicket = async (ticketId) => {
    if (!ticketId) return;
    try {
      setGenerating(ticketId);
      await documentsService.getTicketPdf(ticketId);
      showSuccess("Descarga de entrada iniciada");
    } catch (error) {
      console.error("Error al descargar la entrada:", error);
      showError("Error al descargar la entrada");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadInvoice = async (purchaseId) => {
    if (!purchaseId) return;
    try {
      setGenerating(purchaseId + "-invoice");
      await documentsService.getInvoicePdf(purchaseId);
      showSuccess("Descarga de factura iniciada");
    } catch (error) {
      console.error("Error al descargar la factura:", error);
      showError("Error al descargar la factura");
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(date);
    } catch (e) {
      return "Fecha no disponible";
    }
  }, []);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return "Hora no disponible";
    return timeString.substring(0, 5);
  }, []);

  // Memoizar las tarjetas agrupadas
  const ticketGroups = useMemo(() => {
    if (!tickets || tickets.length === 0) return null;
    return tickets.map(group => {
      const evento = group.evento || {};
      const entradas = group.entradas || [];
      const fechaCompra = group.fechaCompra;
      const total = group.total;
      const idCompra = group.idCompra;
      const eventId = evento.id || evento.idEvento;
      const imagenUrl = evento.imagen_url || evento.imagen || "";

      return (
        <div className="ticket-card" key={idCompra}>
          <div className="ticket-card-header">
            <div className="ticket-card-header-main">
              {imagenUrl && (
                <img
                  src={imagenUrl}
                  alt={evento.titulo || evento.nombreEvento || "Evento"}
                  className="ticket-event-image"
                  loading="lazy"
                />
              )}
              <div>
                <h3 className="ticket-card-title">
                  {evento.titulo || evento.nombreEvento || "Evento sin título"}
                </h3>
                <div className="ticket-card-header-date">
                  <FiCalendar className="ticket-card-header-date-icon" aria-hidden="true" />
                  {formatDate(evento.fecha || evento.fechaEvento)}
                  {" · "}
                  <FiClock className="ticket-card-header-date-icon" aria-hidden="true" />
                  {formatTime(evento.hora)}
                </div>
              </div>
            </div>
            <div className="ticket-card-header-status">
              <span className="ticket-status ticket-status-paid">
                {entradas.length} <FiUsers style={{ verticalAlign: "middle" }} /> {entradas.length === 1 ? "entrada" : "entradas"}
              </span>
              <span className="ticket-status ticket-status-total">
                Total: {total.toFixed(2)}€
              </span>
            </div>
          </div>
          <div className="ticket-card-content">
            <div className="ticket-card-details ticket-card-details-3col">
              <div className="ticket-card-detail">
                <FiMapPin className="detail-icon" aria-hidden="true" />
                <span>
                  <strong>Ubicación:</strong> {evento.ubicacion || evento.direccion || "Online"}
                </span>
              </div>
              <div className="ticket-card-detail">
                <FiFileText className="detail-icon" aria-hidden="true" />
                <span>
                  <strong>Fecha compra:</strong> {formatDate(fechaCompra)}
                </span>
              </div>
              <div className="ticket-card-detail">
                <FiTag className="detail-icon" aria-hidden="true" />
                <span>
                  <strong>Categoría:</strong> {evento.categoria || "Sin categoría"}
                </span>
              </div>
            </div>
            <div className="ticket-card-table-wrapper">
              <table className="ticket-card-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {entradas.map((entrada, idx) => {
                    const tipoEntrada = entrada.tipo_entrada ||
                      (entrada.entrada && entrada.entrada.tipoEntrada) || {};
                    const nombrePersona = entrada.nombre_persona ||
                      (entrada.entrada && entrada.entrada.nombre_persona) || "";
                    const precio = entrada.precio || (entrada.entrada && entrada.entrada.precio) || "0.00";
                    const estado = entrada.estado_pago || entrada.estado || "pendiente";
                    const idEntrada = entrada.idEntrada || entrada.id || (entrada.entrada && entrada.entrada.idEntrada);
                    return (
                      <tr key={idEntrada || idx}>
                        <td>{tipoEntrada.nombre || "General"}</td>
                        <td>{nombrePersona}</td>
                        <td style={{ textAlign: "right" }}>{Number(precio).toFixed(2)}€</td>
                        <td style={{ textAlign: "center" }}>
                          <span className={`ticket-status ${estado.toLowerCase() === 'pagado'
                            ? "ticket-status-paid"
                            : "ticket-status-pending"}`}>
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="download-ticket-button"
                            onClick={() => handleDownloadTicket(idEntrada)}
                            disabled={generating === idEntrada}
                            aria-label="Descargar entrada en PDF"
                          >
                            <FiDownload aria-hidden="true" />
                            {generating === idEntrada ? '...' : ''}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="ticket-card-actions">
            {eventId && (
              <button
                className="view-ticket-button"
                onClick={() => handleViewEvent(eventId)}
                aria-label={`Ver detalles del evento: ${evento.titulo || 'Evento'}`}
              >
                <FiEye aria-hidden="true" /> Ver evento
              </button>
            )}
            <button
              className="download-invoice-button"
              onClick={() => handleDownloadInvoice(idCompra)}
              disabled={generating === idCompra + "-invoice"}
              aria-label="Descargar factura en PDF"
            >
              <FiFileText aria-hidden="true" />
              {generating === idCompra + "-invoice" ? 'Descargando...' : 'Descargar factura'}
            </button>
          </div>
        </div>
      );
    });
  }, [tickets, generating, handleViewEvent, formatDate, formatTime, handleDownloadTicket, handleDownloadInvoice]);

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="tickets-spinner" aria-hidden="true"></div>
        <p>Cargando tus entradas...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div className="tickets-title">
          <FiTag className="tickets-icon" aria-hidden="true" />
          <h1>Mis entradas</h1>
        </div>
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Actualizar lista de entradas"
        >
          <FiRefreshCw className={refreshing ? "spinning" : ""} aria-hidden="true" />
          {refreshing ? "Actualizando..." : "Actualizar"}
        </button>
      </div>
      {!tickets || tickets.length === 0 ? (
        <div className="tickets-empty">
          <div className="tickets-empty-icon pulse-animation">
            <FiInfo aria-hidden="true" />
          </div>
          <h2>No tienes entradas compradas</h2>
          <p>
            Explora eventos disponibles y adquiere entradas para tus eventos favoritos.
          </p>
          <div className="tickets-empty-actions">
            <button
              onClick={() => router.push('/events')}
              className="explore-button"
              aria-label="Ver listado de eventos"
            >
              Explorar eventos
            </button>
          </div>
        </div>
      ) : (
        <div className="tickets-list">
          {ticketGroups}
        </div>
      )}
    </div>
  );
}