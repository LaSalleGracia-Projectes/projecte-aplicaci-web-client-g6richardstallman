"use client";
import { useEffect, useState, useRef } from "react";
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
  FiInfo 
} from "react-icons/fi";
import "./tickets.css";

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const { showSuccess, showError } = useNotification();
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;

    const getTickets = async () => {
      try {
        const response = await purchasesService.getMyPurchases();
        if (response && (response.data || response.compras)) {
          setTickets(response.data || response.compras || []);
        }
      } catch (err) {
        console.error("Error al cargar entradas:", err);
        showError("No se pudieron cargar tus entradas");
      } finally {
        setLoading(false);
        isLoaded.current = true;
      }
    };

    getTickets();
  }, [showError]);

  const handleViewEvent = (eventId) => {
    if (!eventId) return;
    router.push(`/eventos/${eventId}`);
  };

  const handleDownloadTicket = async (ticketId) => {
    try {
      setGenerating(ticketId);
      await documentsService.getTicketPdf(ticketId);
      showSuccess("Descarga de entrada iniciada");
    } catch (error) {
      showError("Error al descargar la entrada");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadInvoice = async (purchaseId) => {
    try {
      setGenerating(purchaseId + "-invoice");
      await documentsService.getInvoicePdf(purchaseId);
      showSuccess("Descarga de factura iniciada");
    } catch (error) {
      showError("Error al descargar la factura");
    } finally {
      setGenerating(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="tickets-spinner"></div>
        <p>Cargando tus entradas...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="tickets-header">
        <div className="tickets-title">
          <FiTag className="tickets-icon" />
          <h1>Mis entradas</h1>
        </div>
      </div>

      {!tickets || tickets.length === 0 ? (
        <div className="tickets-empty">
          <div className="tickets-empty-icon">
            <FiInfo />
          </div>
          <h2>No tienes entradas compradas</h2>
          <p>
            Explora eventos disponibles y adquiere entradas para tus eventos favoritos.
          </p>
          <button 
            onClick={() => router.push('/eventos')}
            className="explore-button"
          >
            Explorar eventos
          </button>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map(ticket => {
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
                  <div className="ticket-status">
                    <span className={estado.toLowerCase() === 'pagado' ? 
                                      "ticket-status-paid" : "ticket-status-pending"}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="ticket-card-content">
                  <div className="ticket-card-details">
                    <div className="ticket-card-detail">
                      <FiCalendar className="detail-icon" />
                      <span><strong>Fecha:</strong> {formatDate(evento.fecha || evento.fechaEvento)}</span>
                    </div>
                    
                    <div className="ticket-card-detail">
                      <FiClock className="detail-icon" />
                      <span><strong>Hora:</strong> {formatTime(evento.hora)}</span>
                    </div>
                    
                    <div className="ticket-card-detail">
                      <FiMapPin className="detail-icon" />
                      <span><strong>Ubicación:</strong> {evento.ubicacion || "Online"}</span>
                    </div>
                    
                    <div className="ticket-card-detail">
                      <FiTag className="detail-icon" />
                      <span><strong>Tipo:</strong> {tipoEntrada.nombre || "Entrada general"}</span>
                    </div>

                    <div className="ticket-card-detail">
                      <FiDollarSign className="detail-icon" />
                      <span><strong>Precio:</strong> {precio}€</span>
                    </div>

                    <div className="ticket-card-detail">
                      <FiFileText className="detail-icon" />
                      <span><strong>Fecha compra:</strong> {formatDate(fechaCompra)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ticket-card-actions">
                  {eventId && (
                    <button 
                      className="view-ticket-button"
                      onClick={() => handleViewEvent(eventId)}
                    >
                      Ver evento
                    </button>
                  )}
                  <button
                    className="download-ticket-button"
                    onClick={() => handleDownloadTicket(id)}
                    disabled={generating === id}
                  >
                    {generating === id ? 'Descargando...' : 'Descargar entrada'}
                  </button>
                  <button
                    className="download-invoice-button"
                    onClick={() => handleDownloadInvoice(id)}
                    disabled={generating === id + "-invoice"}
                  >
                    {generating === id + "-invoice" ? 'Descargando...' : 'Descargar factura'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}