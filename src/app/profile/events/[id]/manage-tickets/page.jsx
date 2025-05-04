"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiTrash2, FiEdit, FiPlusCircle, FiAlertCircle, FiCheck, FiArrowLeft, FiX } from "react-icons/fi";
import { eventsService } from "../../../../../services/events.service";
import { ticketsService } from "../../../../../services/tickets.service";
import { storage } from "../../../../../utils/storage";
import "./manage-tickets.css";

export default function ManageTicketsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newTicket, setNewTicket] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    es_ilimitado: false,
    cantidad_disponible: "1"
  });

  // Cargar evento y tipos de entrada
  useEffect(() => {
    const loadEventAndTickets = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const token = storage.getToken(false) || storage.getToken(true);
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Obtener detalles del evento
        const { evento } = await eventsService.getEventById(id);
        if (!evento) {
          setError('Evento no encontrado');
          return;
        }
        setEvent(evento);

        // Verificar si el usuario es el organizador
        try {
          const myEventsRes = await eventsService.getMyEvents();
          const list = myEventsRes.eventos || myEventsRes.data || [];
          if (!Array.isArray(list) || !list.some(e => (e.idEvento || e.id)?.toString() === id)) {
            setError('No tienes permiso para gestionar las entradas de este evento');
            setIsOwner(false);
            return;
          }
          setIsOwner(true);
        } catch {
          setError('Error al verificar permisos');
          return;
        }

        // Obtener tipos de entrada
        try {
          const ticketsResult = await ticketsService.getEventTicketTypes(id);
          if (ticketsResult.data) {
            setTicketTypes(ticketsResult.data);
          } else if (Array.isArray(ticketsResult)) {
            setTicketTypes(ticketsResult);
          }
        } catch {
          setError('No se pudieron cargar los tipos de entrada');
        }
      } catch {
        setError('Error al cargar los datos del evento');
      } finally {
        setLoading(false);
      }
    };
    loadEventAndTickets();
  }, [id, router]);

  // Iniciar edición
  const handleEdit = useCallback((ticket) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditingTicket({
      idTipoEntrada: ticket.idTipoEntrada,
      nombre: ticket.nombre,
      precio: ticket.precio,
      descripcion: ticket.descripcion || "",
      es_ilimitado: ticket.es_ilimitado,
      cantidad_disponible: ticket.es_ilimitado ? "" : (ticket.cantidad_disponible || ""),
      activo: ticket.activo !== false
    });
    setValidationErrors({});
  }, []);

  // Cambios en formularios
  const handleFormChange = useCallback((e, isEditForm = true) => {
    const { name, value, type, checked } = e.target;
    const formValue = type === "checkbox" ? checked : value;
    setValidationErrors(prev => ({
      ...prev,
      [name]: null
    }));
    if (isEditForm) {
      setEditingTicket((prev) => {
        if (name === 'es_ilimitado' && formValue === true) {
          return { ...prev, [name]: formValue, cantidad_disponible: "" };
        }
        return { ...prev, [name]: formValue };
      });
    } else {
      setNewTicket((prev) => {
        if (name === 'es_ilimitado' && formValue === true) {
          return { ...prev, [name]: formValue, cantidad_disponible: "" };
        }
        return { ...prev, [name]: formValue };
      });
    }
  }, []);

  // Validar datos de ticket
  const validateTicketData = useCallback((data) => {
    const errors = {};
    if (!data.nombre || data.nombre.trim() === '') {
      errors.nombre = 'El nombre del tipo de entrada es obligatorio';
    } else if (data.nombre.length > 100) {
      errors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }
    if (data.precio === undefined || data.precio === '') {
      errors.precio = 'El precio es obligatorio';
    } else if (isNaN(parseFloat(data.precio)) || parseFloat(data.precio) < 0) {
      errors.precio = 'El precio debe ser un número mayor o igual a 0';
    }
    if (!data.es_ilimitado) {
      if (data.cantidad_disponible === undefined || data.cantidad_disponible === '') {
        errors.cantidad_disponible = 'La cantidad de entradas disponibles es obligatoria';
      } else if (isNaN(parseInt(data.cantidad_disponible)) || parseInt(data.cantidad_disponible) < 1) {
        errors.cantidad_disponible = 'La cantidad debe ser un número entero mayor a 0';
      }
    }
    return errors;
  }, []);

  // Guardar edición
  const handleSaveTicket = useCallback(async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    const errors = validateTicketData(editingTicket);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await ticketsService.updateTicketType(id, editingTicket.idTipoEntrada, editingTicket);
      setTicketTypes(ticketTypes.map(ticket =>
        ticket.idTipoEntrada === editingTicket.idTipoEntrada
          ? { ...ticket, ...editingTicket }
          : ticket
      ));
      setMessage({ type: 'success', text: 'Tipo de entrada actualizado correctamente', timeout: 3000 });
      setIsEditing(false);
      setEditingTicket(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      if (err.errors && typeof err.errors === 'object') {
        setValidationErrors(err.errors);
      } else {
        setError(err.message || 'Error al actualizar el tipo de entrada');
      }
    } finally {
      setSubmitting(false);
    }
  }, [editingTicket, id, isOwner, ticketTypes, validateTicketData]);

  // Añadir nuevo tipo de entrada
  const handleAddTicket = useCallback(async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    const errors = validateTicketData(newTicket);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await ticketsService.createTicketType(id, newTicket);
      if (result && (result.data || result.status === 'success')) {
        const newTicketData = result.data || { ...newTicket, idTipoEntrada: Date.now() };
        setTicketTypes([...ticketTypes, newTicketData]);
        setMessage({ type: 'success', text: 'Tipo de entrada añadido correctamente', timeout: 3000 });
        setIsAdding(false);
        setNewTicket({
          nombre: "",
          precio: "",
          descripcion: "",
          es_ilimitado: false,
          cantidad_disponible: "1"
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      if (err.errors && typeof err.errors === 'object') {
        setValidationErrors(err.errors);
      } else {
        setError(err.message || 'Error al añadir el tipo de entrada');
      }
    } finally {
      setSubmitting(false);
    }
  }, [id, isOwner, newTicket, ticketTypes, validateTicketData]);

  // Eliminar tipo de entrada
  const handleDeleteTicket = useCallback(async (ticketId, ticketInfo) => {
    if (ticketInfo.entradas_vendidas && ticketInfo.entradas_vendidas > 0) {
      setError('No se puede eliminar un tipo de entrada que ya tiene ventas');
      return;
    }
    if (!isOwner || !window.confirm('¿Estás seguro de eliminar este tipo de entrada? Esta acción no se puede deshacer.')) {
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await ticketsService.deleteTicketType(id, ticketId);
      setTicketTypes(ticketTypes.filter(ticket => ticket.idTipoEntrada !== ticketId));
      setMessage({ type: 'success', text: 'Tipo de entrada eliminado correctamente', timeout: 3000 });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      if (err.message && err.message.includes('ventas')) {
        setError('No se puede eliminar un tipo de entrada que ya tiene ventas');
      } else {
        setError(err.message || 'Error al eliminar el tipo de entrada');
      }
    } finally {
      setSubmitting(false);
    }
  }, [id, isOwner, ticketTypes]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="spinner mb-4"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error && !isOwner) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-red-50 rounded-lg text-center">
        <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
        <h1 className="text-xl font-bold text-red-700 mb-2">Acceso denegado</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 btn"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 page-transition">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push(`/profile/events/${id}/edit`)}
          className="flex items-center text-gray-600 hover:text-gray-900 btn"
        >
          <FiArrowLeft className="mr-2" /> Volver a editar evento
        </button>
        <h1 className="text-2xl font-bold">Gestionar Entradas</h1>
      </div>

      {message && (
        <div className={`${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border px-4 py-3 rounded mb-6 flex items-center alert`}>
          {message.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
          <span>{message.text}</span>
          <button
            className="ml-auto text-sm"
            onClick={() => setMessage(null)}
          >
            <FiX />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-center alert">
          <FiAlertCircle className="mr-2" />
          <span>{error}</span>
          <button
            className="ml-auto text-sm"
            onClick={() => setError(null)}
          >
            <FiX />
          </button>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 form-card">
        <h2 className="text-lg font-semibold mb-2">{event?.titulo || event?.nombreEvento}</h2>
        <p className="text-gray-600">
          Fecha: {event?.fecha ? new Date(event.fecha).toLocaleDateString() : (event?.fechaEvento ? new Date(event.fechaEvento).toLocaleDateString() : 'No definida')}
          {event?.hora ? ` | Hora: ${event.hora}` : (event?.horaEvento ? ` | Hora: ${event.horaEvento}` : '')}
        </p>
        <p className="text-gray-600 mt-2">
          Ubicación: {event?.es_online ? 'Evento online' : (event?.ubicacion || event?.lugar || 'No definida')}
        </p>
      </div>

      {/* Listado de tipos de entrada */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tipos de entradas</h2>
          {!isAdding && !isEditing && (
            <button
              onClick={() => {
                setIsAdding(true);
                setIsEditing(false);
                setValidationErrors({});
              }}
              disabled={submitting || !isOwner}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded btn"
            >
              <FiPlusCircle className="mr-1" /> Añadir tipo de entrada
            </button>
          )}
        </div>

        {ticketTypes.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200 form-card">
            <p className="text-gray-500">No hay tipos de entradas para este evento. Añade uno para comenzar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 tickets-table">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="px-4 py-2 text-left border-b">Nombre</th>
                  <th className="px-4 py-2 text-left border-b">Precio</th>
                  <th className="px-4 py-2 text-left border-b">Disponibilidad</th>
                  <th className="px-4 py-2 text-left border-b">Entradas vendidas</th>
                  <th className="px-4 py-2 text-center border-b actions-column">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ticketTypes.map((ticket) => (
                  <tr key={ticket.idTipoEntrada} className="hover:bg-gray-50 border-b last:border-b-0">
                    <td className="px-4 py-3">{ticket.nombre}</td>
                    <td className="px-4 py-3">{parseFloat(ticket.precio).toFixed(2)}€</td>
                    <td className="px-4 py-3">
                      {ticket.es_ilimitado ? 
                        <span className="ticket-type-indicator unlimited-badge">Ilimitado</span> : 
                        <span className="ticket-type-indicator limited-badge">{ticket.cantidad_disponible || 0} disponibles</span>
                      }
                    </td>
                    <td className="px-4 py-3">{ticket.entradas_vendidas || 0}</td>
                    <td className="px-4 py-3 actions-column">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Editar"
                          disabled={submitting || !isOwner}
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.idTipoEntrada, ticket)}
                          className={`p-1 rounded ${
                            ticket.entradas_vendidas > 0 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          }`}
                          title={ticket.entradas_vendidas > 0 ? "No se puede eliminar (ya hay ventas)" : "Eliminar"}
                          disabled={submitting || !isOwner || ticket.entradas_vendidas > 0}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario de edición */}
      {isEditing && (
        <div className="border rounded-lg p-5 mb-6 bg-white shadow-sm form-card">
          <h3 className="font-medium text-lg mb-4 pb-2 border-b">Editar tipo de entrada</h3>
          <form onSubmit={handleSaveTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="nombre"
                value={editingTicket.nombre}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded form-input ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: Entrada General"
              />
              {validationErrors.nombre && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.nombre}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio (€) <span className="text-red-600">*</span></label>
              <input
                type="number"
                name="precio"
                value={editingTicket.precio}
                onChange={handleFormChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded form-input ${validationErrors.precio ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {validationErrors.precio && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.precio}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={editingTicket.descripcion}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 border rounded form-input ${validationErrors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Descripción opcional para este tipo de entrada"
                rows="2"
              />
              {validationErrors.descripcion && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.descripcion}</p>
              )}
            </div>
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="es_ilimitado"
                  checked={editingTicket.es_ilimitado}
                  onChange={handleFormChange}
                  className="mr-2 h-4 w-4"
                />
                <span>Entradas ilimitadas</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Marca esta casilla si quieres ofrecer un número ilimitado de entradas de este tipo.
              </p>
            </div>
            {!editingTicket.es_ilimitado && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cantidad disponible <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="cantidad_disponible"
                  value={editingTicket.cantidad_disponible}
                  onChange={handleFormChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded form-input ${validationErrors.cantidad_disponible ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.cantidad_disponible && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.cantidad_disponible}</p>
                )}
              </div>
            )}
            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTicket(null);
                  setValidationErrors({});
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 btn"
                disabled={submitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulario de añadir */}
      {isAdding && (
        <div className="border rounded-lg p-5 mb-6 bg-white shadow-sm form-card">
          <h3 className="font-medium text-lg mb-4 pb-2 border-b">Añadir tipo de entrada</h3>
          <form onSubmit={handleAddTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="nombre"
                value={newTicket.nombre}
                onChange={(e) => handleFormChange(e, false)}
                className={`w-full px-3 py-2 border rounded form-input ${validationErrors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ej: Entrada VIP"
              />
              {validationErrors.nombre && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.nombre}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio (€) <span className="text-red-600">*</span></label>
              <input
                type="number"
                name="precio"
                value={newTicket.precio}
                onChange={(e) => handleFormChange(e, false)}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded form-input ${validationErrors.precio ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="0.00"
              />
              {validationErrors.precio && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.precio}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={newTicket.descripcion}
                onChange={(e) => handleFormChange(e, false)}
                className={`w-full px-3 py-2 border rounded form-input ${validationErrors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Descripción opcional para este tipo de entrada"
                rows="2"
              />
              {validationErrors.descripcion && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.descripcion}</p>
              )}
            </div>
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="es_ilimitado"
                  checked={newTicket.es_ilimitado}
                  onChange={(e) => handleFormChange(e, false)}
                  className="mr-2 h-4 w-4"
                />
                <span>Entradas ilimitadas</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Marca esta casilla si quieres ofrecer un número ilimitado de entradas de este tipo.
              </p>
            </div>
            {!newTicket.es_ilimitado && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cantidad disponible <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="cantidad_disponible"
                  value={newTicket.cantidad_disponible}
                  onChange={(e) => handleFormChange(e, false)}
                  min="1"
                  className={`w-full px-3 py-2 border rounded form-input ${validationErrors.cantidad_disponible ? 'border-red-500' : 'border-gray-300'}`}
                />
                {validationErrors.cantidad_disponible && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.cantidad_disponible}</p>
                )}
              </div>
            )}
            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Añadiendo...
                  </>
                ) : (
                  'Añadir tipo de entrada'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTicket({
                    nombre: "",
                    precio: "",
                    descripcion: "",
                    es_ilimitado: false,
                    cantidad_disponible: "1"
                  });
                  setValidationErrors({});
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 btn"
                disabled={submitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push(`/profile/events`)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center btn"
          >
            <FiArrowLeft className="mr-1" /> Volver a mis eventos
          </button>
          <button
            onClick={() => router.push(`/events/${id}`)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 btn"
          >
            Ver página del evento
          </button>
        </div>
      </div>
    </div>
  );
}
