"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEventById, getEventTicketTypes } from "../../../../../services/events.service";
import { FiTrash2, FiEdit, FiPlusCircle, FiAlertCircle, FiCheck, FiArrowLeft } from "react-icons/fi";

export default function ManageTicketsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState(null);
  
  // For editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  
  // For adding new ticket type
  const [isAdding, setIsAdding] = useState(false);
  const [newTicket, setNewTicket] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    es_ilimitado: false,
    cantidad_disponible: ""
  });

  // Load event and ticket types
  useEffect(() => {
    const loadEventAndTickets = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Get event details
        const eventResult = await getEventById(id);
        
        if (!eventResult.evento) {
          setError('Evento no encontrado');
          return;
        }
        
        setEvent(eventResult.evento);
        
        // Check if user is the organizer of this event
        try {
          const myEventsRes = await fetch('http://localhost:8000/api/mis-eventos', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const myEventsData = await myEventsRes.json();
          
          if (!myEventsRes.ok) {
            throw new Error('No se pudieron verificar los permisos');
          }
          
          const isUserEvent = myEventsData.eventos?.some(
            (evento) => evento.idEvento.toString() === id.toString()
          );
          
          if (!isUserEvent) {
            setError('No tienes permiso para gestionar las entradas de este evento');
            setIsOwner(false);
            return;
          }
          
          setIsOwner(true);
        } catch (err) {
          console.error("Error verificando permisos:", err);
          setError('Error al verificar permisos');
          return;
        }

        // Get ticket types
        const ticketsResult = await getEventTicketTypes(id);
        if (ticketsResult.data) {
          setTicketTypes(ticketsResult.data);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    loadEventAndTickets();
  }, [id, router]);

  // Start editing ticket type
  const handleEdit = (ticket) => {
    setIsEditing(true);
    setIsAdding(false);
    setEditingTicket({
      idTipoEntrada: ticket.idTipoEntrada,
      nombre: ticket.nombre,
      precio: ticket.precio,
      descripcion: ticket.descripcion || "",
      es_ilimitado: ticket.es_ilimitado,
      cantidad_disponible: ticket.cantidad_disponible || "",
    });
  };

  // Handle changes in form fields
  const handleFormChange = (e, isEditForm = true) => {
    const { name, value, type, checked } = e.target;
    const formValue = type === "checkbox" ? checked : value;
    
    if (isEditForm) {
      setEditingTicket((prev) => ({
        ...prev,
        [name]: formValue,
      }));
    } else {
      setNewTicket((prev) => ({
        ...prev,
        [name]: formValue,
      }));
    }
  };

  // Handle submission of edited ticket type
  const handleSaveTicket = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/eventos/${id}/tipos-entrada/${editingTicket.idTipoEntrada}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingTicket)
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        // Update the ticket type in the list
        setTicketTypes(ticketTypes.map(ticket => 
          ticket.idTipoEntrada === editingTicket.idTipoEntrada 
            ? { ...ticket, ...editingTicket }
            : ticket
        ));
        
        setMessage({ type: 'success', text: 'Tipo de entrada actualizado correctamente' });
        setIsEditing(false);
        setEditingTicket(null);
      } else {
        setError(result.message || 'Error al actualizar el tipo de entrada');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error de conexión al actualizar');
    }
  };

  // Handle submission of new ticket type
  const handleAddTicket = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/eventos/${id}/tipos-entrada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTicket)
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        // Add the new ticket type to the list
        setTicketTypes([...ticketTypes, result.data]);
        
        setMessage({ type: 'success', text: 'Tipo de entrada añadido correctamente' });
        setIsAdding(false);
        setNewTicket({
          nombre: "",
          precio: "",
          descripcion: "",
          es_ilimitado: false,
          cantidad_disponible: ""
        });
      } else {
        setError(result.message || 'Error al añadir el tipo de entrada');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error de conexión al añadir entrada');
    }
  };

  // Handle deletion of ticket type
  const handleDeleteTicket = async (ticketId) => {
    if (!isOwner || !window.confirm('¿Estás seguro de eliminar este tipo de entrada? Esta acción no se puede deshacer.')) {
      return;
    }
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/eventos/${id}/tipos-entrada/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        // Remove the ticket type from the list
        setTicketTypes(ticketTypes.filter(ticket => ticket.idTipoEntrada !== ticketId));
        setMessage({ type: 'success', text: 'Tipo de entrada eliminado correctamente' });
      } else {
        setError(result.message || 'Error al eliminar el tipo de entrada');
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Error de conexión al eliminar entrada');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Cargando datos...</div>;
  }
  
  if (error && !isOwner) {
    return (
      <div className="max-w-lg mx-auto my-12 p-6 bg-red-50 rounded-lg text-center">
        <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
        <h1 className="text-xl font-bold text-red-700 mb-2">Acceso denegado</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.push(`/events/${id}/edit`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" /> Volver a editar evento
        </button>
        <h1 className="text-2xl font-bold">Gestionar Entradas</h1>
      </div>
      
      {message && (
        <div className={`${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} border px-4 py-3 rounded mb-6 flex items-center`}>
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
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-center">
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

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">{event?.nombreEvento}</h2>
        <p className="text-gray-600 mb-4">Fecha: {new Date(event?.fechaEvento).toLocaleDateString()} | Hora: {event?.hora}</p>
      </div>

      {/* List of ticket types */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Tipos de entradas</h2>
          {!isAdding && (
            <button 
              onClick={() => {
                setIsAdding(true);
                setIsEditing(false);
              }}
              className="flex items-center text-blue-600 hover:text-blue-800"
              disabled={!isOwner}
            >
              <FiPlusCircle className="mr-1" /> Añadir tipo de entrada
            </button>
          )}
        </div>

        {ticketTypes.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded">
            <p className="text-gray-500">No hay tipos de entradas para este evento. Añade uno para comenzar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left border">Nombre</th>
                  <th className="px-4 py-2 text-left border">Precio</th>
                  <th className="px-4 py-2 text-left border">Disponibilidad</th>
                  <th className="px-4 py-2 text-left border">Entradas vendidas</th>
                  <th className="px-4 py-2 text-left border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ticketTypes.map((ticket) => (
                  <tr key={ticket.idTipoEntrada} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{ticket.nombre}</td>
                    <td className="px-4 py-3 border">{ticket.precio}€</td>
                    <td className="px-4 py-3 border">
                      {ticket.es_ilimitado ? 'Ilimitado' : ticket.cantidad_disponible}
                    </td>
                    <td className="px-4 py-3 border">{ticket.entradas_vendidas || 0}</td>
                    <td className="px-4 py-3 border">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(ticket)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                          disabled={!isOwner}
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.idTipoEntrada)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar"
                          disabled={!isOwner || ticket.entradas_vendidas > 0}
                        >
                          <FiTrash2 />
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

      {/* Edit form */}
      {isEditing && (
        <div className="border p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-4">Editar tipo de entrada</h3>
          <form onSubmit={handleSaveTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={editingTicket.nombre}
                onChange={handleFormChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Precio (€)</label>
              <input
                type="number"
                name="precio"
                value={editingTicket.precio}
                onChange={handleFormChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={editingTicket.descripcion}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="es_ilimitado"
                  checked={editingTicket.es_ilimitado}
                  onChange={handleFormChange}
                  className="mr-2"
                />
                Entradas ilimitadas
              </label>
            </div>
            
            {!editingTicket.es_ilimitado && (
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad disponible</label>
                <input
                  type="number"
                  name="cantidad_disponible"
                  value={editingTicket.cantidad_disponible}
                  onChange={handleFormChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTicket(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className="border p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-4">Añadir tipo de entrada</h3>
          <form onSubmit={handleAddTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={newTicket.nombre}
                onChange={(e) => handleFormChange(e, false)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Precio (€)</label>
              <input
                type="number"
                name="precio"
                value={newTicket.precio}
                onChange={(e) => handleFormChange(e, false)}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={newTicket.descripcion}
                onChange={(e) => handleFormChange(e, false)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="es_ilimitado"
                  checked={newTicket.es_ilimitado}
                  onChange={(e) => handleFormChange(e, false)}
                  className="mr-2"
                />
                Entradas ilimitadas
              </label>
            </div>
            
            {!newTicket.es_ilimitado && (
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad disponible</label>
                <input
                  type="number"
                  name="cantidad_disponible"
                  value={newTicket.cantidad_disponible}
                  onChange={(e) => handleFormChange(e, false)}
                  required
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Añadir tipo de entrada
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
                    cantidad_disponible: ""
                  });
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <button 
          onClick={() => router.push(`/profile/events`)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Volver a mis eventos
        </button>
      </div>
    </div>
  );
}
