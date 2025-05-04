"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { eventsService } from "../../../../services/events.service";
import { ticketsService } from "../../../../services/tickets.service";
import { purchasesService } from "../../../../services/purchases.service";
import { storage } from "../../../../utils/storage";
import { useNotification } from "../../../../context/NotificationContext";
import { FiCalendar, FiMapPin, FiClock, FiTag, FiChevronLeft, FiPlus, FiMinus, FiShoppingCart, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import "./purchase-tickets.css";

export default function TicketsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useNotification ? useNotification() : { showSuccess: () => {}, showError: () => {} };

  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const [selectedTickets, setSelectedTickets] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);

        const token = storage.getToken(false) || storage.getToken(true);
        if (!token) {
          router.push(`/auth/login?redirect=${encodeURIComponent(`/events/${id}/tickets`)}`);
          return;
        }

        const userInfo = storage.get("user_info", null, false) || storage.get("user_info", null, true);
        let userRole = null;
        if (userInfo) {
          userRole = (userInfo.tipo_usuario || userInfo.rol || userInfo.user?.tipo_usuario || userInfo.user?.rol || "").toLowerCase();
        }
        if (userRole !== "participante") {
          setError("Solo los participantes pueden comprar entradas para eventos");
          setLoading(false);
          return;
        }

        const eventResponse = await eventsService.getEventById(id);
        if (!eventResponse || !eventResponse.evento) {
          setError("No se encontró información del evento");
          setLoading(false);
          return;
        }
        setEvent(eventResponse.evento);
        document.title = `Entradas: ${eventResponse.evento.nombreEvento} | Eventflix`;

        const ticketTypesResponse = await ticketsService.getEventTicketTypes(id);
        const ticketsData = ticketTypesResponse.data ||
          ticketTypesResponse.tiposEntrada ||
          ticketTypesResponse || [];

        const initialTicketSelection = {};
        ticketsData.forEach(ticket => {
          initialTicketSelection[ticket.id || ticket.idTipoEntrada] = 0;
        });

        setTicketTypes(ticketsData);
        setSelectedTickets(initialTicketSelection);
      } catch (err) {
        setError("Ocurrió un error al cargar la información del evento");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
    return () => { document.title = "Eventflix"; };
  }, [id, router]);

  useEffect(() => {
    let total = 0;

    Object.keys(selectedTickets).forEach(ticketId => {
      const ticketType = ticketTypes.find(t =>
        (t.id && String(t.id) === String(ticketId)) ||
        (t.idTipoEntrada && String(t.idTipoEntrada) === String(ticketId))
      );

      if (ticketType && selectedTickets[ticketId] > 0) {
        total += ticketType.precio * selectedTickets[ticketId];
      }
    });

    setTotalAmount(total);
  }, [selectedTickets, ticketTypes]);

  const getTicketId = (ticket) => ticket.id || ticket.idTipoEntrada;

  const getAvailableTickets = (ticketType) => {
    if (ticketType.es_ilimitado) return 10;
    return ticketType.cantidad_disponible - (ticketType.entradas_vendidas || 0);
  };

  const isSoldOut = (ticketType) => {
    if (ticketType.es_ilimitado) return false;
    return (ticketType.cantidad_disponible - (ticketType.entradas_vendidas || 0)) <= 0;
  };

  const handleIncrement = (ticketId) => {
    const ticket = ticketTypes.find(t =>
      (t.id && String(t.id) === String(ticketId)) ||
      (t.idTipoEntrada && String(t.idTipoEntrada) === String(ticketId))
    );
    if (!ticket) return;
    const maxAvailable = ticket.es_ilimitado ? 10 : (ticket.cantidad_disponible - (ticket.entradas_vendidas || 0));
    if (selectedTickets[ticketId] < maxAvailable) {
      setSelectedTickets(prev => ({
        ...prev,
        [ticketId]: (prev[ticketId] || 0) + 1
      }));
    }
  };

  const handleDecrement = (ticketId) => {
    if (selectedTickets[ticketId] > 0) {
      setSelectedTickets(prev => ({
        ...prev,
        [ticketId]: prev[ticketId] - 1
      }));
    }
  };

  const handleSetQuantity = (ticketId, value) => {
    const ticket = ticketTypes.find(t =>
      (t.id && String(t.id) === String(ticketId)) ||
      (t.idTipoEntrada && String(t.idTipoEntrada) === String(ticketId))
    );
    if (!ticket) return;
    const maxAvailable = ticket.es_ilimitado ? 10 : (ticket.cantidad_disponible - (ticket.entradas_vendidas || 0));
    const newValue = Math.max(0, Math.min(maxAvailable, parseInt(value) || 0));
    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: newValue
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handlePurchase = async () => {
    try {
      const hasSelectedTickets = Object.values(selectedTickets).some(qty => qty > 0);
      if (!hasSelectedTickets) {
        showError("Debes seleccionar al menos una entrada");
        return;
      }
      setPurchasing(true);

      const purchaseData = {
        idEvento: id,
        entradas: []
      };
      Object.keys(selectedTickets).forEach(ticketId => {
        if (selectedTickets[ticketId] > 0) {
          const ticketType = ticketTypes.find(t =>
            (t.id && String(t.id) === String(ticketId)) ||
            (t.idTipoEntrada && String(t.idTipoEntrada) === String(ticketId))
          );
          if (ticketType) {
            purchaseData.entradas.push({
              idTipoEntrada: ticketId,
              cantidad: selectedTickets[ticketId],
              precio: ticketType.precio
            });
          }
        }
      });

      try {
        await purchasesService.purchaseTickets(purchaseData);

        setPurchaseSuccess(true);
        showSuccess("¡Compra realizada con éxito!");

        const resetTickets = {};
        Object.keys(selectedTickets).forEach(id => { resetTickets[id] = 0; });
        setSelectedTickets(resetTickets);

        const refreshResponse = await ticketsService.getEventTicketTypes(id);
        setTicketTypes(refreshResponse.data || refreshResponse.tiposEntrada || refreshResponse || []);
      } catch (err) {
        showError(
          (err.errors && (err.errors.message || err.errors.error)) ||
          err.message ||
          "No se pudo completar la compra en el servidor."
        );
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="loading-spinner"></div>
        <p>Cargando información de entradas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-error">
        <div className="error-icon">
          <FiAlertCircle />
        </div>
        <h2 className="error-title">Error</h2>
        <p className="error-message">{error}</p>
        <Link href={`/events/${id}`} className="btn-back">
          <FiChevronLeft />
          Volver al evento
        </Link>
      </div>
    );
  }

  if (!event) return null;

  const hasAnyAvailableTickets = ticketTypes.some(ticket => !isSoldOut(ticket));

  return (
    <div className="tickets-container">
      <div className="ticket-event-header">
        <Link href={`/events/${id}`} className="btn-back">
          <FiChevronLeft />
          Volver al evento
        </Link>
        <h1 className="event-title">Entradas: {event.nombreEvento}</h1>
      </div>

      <div className="event-info-card">
        <div className="event-image-container">
          <img
            src={event.imagen_url || '/img/default-event.jpg'}
            alt={event.nombreEvento}
            className="event-image"
          />
        </div>
        <div className="event-details">
          <h2>{event.nombreEvento}</h2>
          <div className="event-meta-details">
            <div className="meta-item">
              <FiCalendar />
              <span>{formatDate(event.fechaEvento)}</span>
            </div>
            {event.hora && (
              <div className="meta-item">
                <FiClock />
                <span>{event.hora}</span>
              </div>
            )}
            {event.ubicacion && (
              <div className="meta-item">
                <FiMapPin />
                <span>{event.ubicacion}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {purchaseSuccess && (
        <div className="purchase-success">
          <div className="success-icon">
            <FiCheck />
          </div>
          <div className="success-content">
            <h3>¡Compra realizada con éxito!</h3>
            <p>Recibirás los detalles de tu compra por correo electrónico.</p>
            <Link href="/my-tickets" className="btn-view-tickets">Ver mis entradas</Link>
          </div>
          <button className="close-success" onClick={() => setPurchaseSuccess(false)}>
            <FiX />
          </button>
        </div>
      )}

      <div className="tickets-purchase-container">
        <div className="tickets-list-section">
          <h2 className="section-title">
            <FiTag className="section-icon" />
            Entradas disponibles
          </h2>
          {!hasAnyAvailableTickets ? (
            <div className="no-tickets-message">
              <p>No hay entradas disponibles para este evento.</p>
            </div>
          ) : (
            <div className="ticket-types-list">
              {ticketTypes.map(ticket => {
                const ticketId = getTicketId(ticket);
                const availableTickets = getAvailableTickets(ticket);
                const soldOut = isSoldOut(ticket);
                const lowStock = !ticket.es_ilimitado && availableTickets <= 5 && availableTickets > 0;
                const price = parseFloat(ticket.precio).toFixed(2);

                return (
                  <div
                    key={ticketId}
                    className={`ticket-type-card ${soldOut ? 'sold-out' : ''}`}
                  >
                    <div className="ticket-details">
                      <h3 className="ticket-name">{ticket.nombre}</h3>
                      <p className="ticket-price">€{price}</p>
                      {ticket.descripcion && (
                        <p className="ticket-description">{ticket.descripcion}</p>
                      )}
                      <div className="ticket-availability">
                        {soldOut ? (
                          <span className="no-stock">Agotado</span>
                        ) : lowStock ? (
                          <span className="low-stock">¡Solo {availableTickets} disponibles!</span>
                        ) : ticket.es_ilimitado ? (
                          <span className="unlimited">Disponibilidad ilimitada</span>
                        ) : (
                          <span className="in-stock">{availableTickets} disponibles</span>
                        )}
                      </div>
                    </div>
                    {!soldOut && (
                      <div className="ticket-quantity">
                        <div className="quantity-counter">
                          <button
                            className="quantity-btn"
                            onClick={() => handleDecrement(ticketId)}
                            disabled={!selectedTickets[ticketId]}
                          >
                            <FiMinus />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={ticket.es_ilimitado ? 10 : availableTickets}
                            value={selectedTickets[ticketId] || 0}
                            onChange={(e) => handleSetQuantity(ticketId, e.target.value)}
                            className="quantity-input"
                          />
                          <button
                            className="quantity-btn"
                            onClick={() => handleIncrement(ticketId)}
                            disabled={selectedTickets[ticketId] >= availableTickets}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="order-summary-section">
          <div className="order-summary-card">
            <h2 className="summary-title">Resumen de compra</h2>
            <div className="summary-items">
              {Object.keys(selectedTickets).map(ticketId => {
                const quantity = selectedTickets[ticketId];
                if (quantity <= 0) return null;
                const ticket = ticketTypes.find(t =>
                  (t.id && String(t.id) === String(ticketId)) ||
                  (t.idTipoEntrada && String(t.idTipoEntrada) === String(ticketId))
                );
                if (!ticket) return null;
                const subtotal = parseFloat(ticket.precio) * quantity;
                return (
                  <div key={ticketId} className="summary-item">
                    <div className="item-details">
                      <span className="item-quantity">{quantity}x</span>
                      <span className="item-name">{ticket.nombre}</span>
                    </div>
                    <span className="item-price">€{subtotal.toFixed(2)}</span>
                  </div>
                );
              })}
              {totalAmount <= 0 && (
                <div className="empty-cart">
                  <FiShoppingCart className="cart-icon" />
                  <p>No has seleccionado ninguna entrada</p>
                </div>
              )}
            </div>
            {totalAmount > 0 && (
              <div className="summary-total">
                <span className="total-label">Total</span>
                <span className="total-amount">€{totalAmount.toFixed(2)}</span>
              </div>
            )}
            <button
              className="checkout-button"
              onClick={handlePurchase}
              disabled={totalAmount <= 0 || purchasing}
            >
              {purchasing ? 'Procesando...' : 'Completar compra'}
            </button>
            <p className="summary-note">
              Al completar tu compra, aceptas los términos y condiciones de Eventflix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
