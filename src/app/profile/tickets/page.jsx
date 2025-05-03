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
  FiEye
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

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await purchasesService.getMyPurchases();
      if (response && (response.data || response.compras)) {
        setTickets(response.data || response.compras || []);
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
  }, [showError]);

  useEffect(() => {
    if (isLoaded.current) return;
    
    let mounted = true;
    
    const fetchData = async () => {
      try {
        const response = await purchasesService.getMyPurchases();
        if (mounted) {
          if (response && (response.data || response.compras)) {
            setTickets(response.data || response.compras || []);
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
  }, [showError]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  const handleViewEvent = useCallback((eventId) => {
    if (eventId) {
      router.push(`/eventos/${eventId}`);
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

  // Memoizar las tarjetas de tickets para evitar renderizados innecesarios
  const ticketCards = useMemo(() => {
    if (!tickets || tickets.length === 0) return null;
    
    return tickets.map(ticket => {
      const evento = ticket.evento || (ticket.entrada && ticket.entrada.evento) || {};
      const tipoEntrada = ticket.tipo_entrada || 
                          (ticket.entrada && ticket.entrada.tipoEntrada) || {};
      const precio = ticket.precio || '0.00';
      const estado = ticket.estado_pago || 'pendiente';
      const id = ticket.id || ticket.idVentaEntrada || '';
      const fechaCompra = ticket.fecha_compra || '';
      const eventId = evento.id || evento.idEvento;
      
      const key = id || `ticket-${Math.random().toString(36).substring(2, 9)}`;
      
      return (
        <div className="ticket-card" key={key}>
          <div className="ticket-card-header">
            <h3 className="ticket-card-title">
              {evento.titulo || evento.nombreEvento || "Evento sin título"}
            </h3>
            <div className={`ticket-status ${estado.toLowerCase() === 'pagado' ? 
                            "ticket-status-paid" : "ticket-status-pending"}`}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </div>
          </div>
          
          <div className="ticket-card-content">
            <div className="ticket-card-details">
              <div className="ticket-card-detail">
                <FiCalendar className="detail-icon" aria-hidden="true" />
                <span><strong>Fecha:</strong> {formatDate(evento.fecha || evento.fechaEvento)}</span>
              </div>
              
              <div className="ticket-card-detail">
                <FiClock className="detail-icon" aria-hidden="true" />
                <span><strong>Hora:</strong> {formatTime(evento.hora)}</span>
              </div>
              
              <div className="ticket-card-detail">
                <FiMapPin className="detail-icon" aria-hidden="true" />
                <span><strong>Ubicación:</strong> {evento.ubicacion || "Online"}</span>
              </div>
              
              <div className="ticket-card-detail">
                <FiTag className="detail-icon" aria-hidden="true" />
                <span><strong>Tipo:</strong> {tipoEntrada.nombre || "Entrada general"}</span>
              </div>

              <div className="ticket-card-detail">
                <FiDollarSign className="detail-icon" aria-hidden="true" />
                <span><strong>Precio:</strong> {precio}€</span>
              </div>

              <div className="ticket-card-detail">
                <FiFileText className="detail-icon" aria-hidden="true" />
                <span><strong>Fecha compra:</strong> {formatDate(fechaCompra)}</span>
              </div>
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
              className="download-ticket-button"
              onClick={() => handleDownloadTicket(id)}
              disabled={generating === id}
              aria-label="Descargar entrada en PDF"
            >
              <FiDownload aria-hidden="true" />
              {generating === id ? 'Descargando...' : 'Descargar entrada'}
            </button>
            <button
              className="download-invoice-button"
              onClick={() => handleDownloadInvoice(id)}
              disabled={generating === id + "-invoice"}
              aria-label="Descargar factura en PDF"
            >
              <FiFileText aria-hidden="true" />
              {generating === id + "-invoice" ? 'Descargando...' : 'Descargar factura'}
            </button>
          </div>
        </div>
      );
    });
  }, [tickets, generating, handleViewEvent, formatDate, formatTime]);

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
              onClick={() => router.push('/eventos')}
              className="explore-button"
              aria-label="Ver listado de eventos"
            >
              Explorar eventos
            </button>
          </div>
        </div>
      ) : (
        <div className="tickets-list">
          {ticketCards}
        </div>
      )}
    </div>
  );
}