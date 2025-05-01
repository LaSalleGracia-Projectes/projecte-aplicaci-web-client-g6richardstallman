import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const eventsService = {
  async getAllEvents() {
    try {
      const response = await fetch(`${API_URL}/eventos`);
      const data = await this._handleResponse(response);
      
      if (data && data.eventos) {
        return {
          message: data.message || "Eventos obtenidos con éxito",
          eventos: this._processImageUrls(data.eventos),
          total: data.eventos.length
        };
      }
      return data;
    } catch (err) {
      console.error('Error fetching events:', err);
      throw err;
    }
  },

  async getEventById(eventId) {
    try {
      const response = await fetch(`${API_URL}/eventos/${eventId}`);
      const data = await this._handleResponse(response);
      
      if (data && data.evento && data.evento.imagen) {
        data.evento.imagen_url = this._buildImageUrl(data.evento.imagen);
      }
      
      return data;
    } catch (err) {
      console.error(`Error fetching event with ID ${eventId}:`, err);
      throw err;
    }
  },

  async getEventsByCategory(category) {
    try {
      const url = `${API_URL}/eventos/categoria/${encodeURIComponent(category)}`;
      const response = await fetch(url);
      const data = await this._handleResponse(response);
      
      if (data && data.eventos) {
        data.eventos = this._processImageUrls(data.eventos);
      }
      
      return data;
    } catch (err) {
      console.error(`Error fetching events for category ${category}:`, err);
      throw err;
    }
  },

  async getEventsMinPrices() {
    try {
      const response = await fetch(`${API_URL}/eventos/precios-minimos`);
      return this._handleResponse(response);
    } catch (err) {
      console.error('Error fetching minimum prices:', err);
      throw err;
    }
  },

  async getEventMinPrice(eventId) {
    try {
      const response = await fetch(`${API_URL}/eventos/${eventId}/precio-minimo`);
      return this._handleResponse(response);
    } catch (err) {
      console.error(`Error fetching minimum price for event ${eventId}:`, err);
      throw err;
    }
  },

  async getEventsMaxPrices() {
    try {
      const response = await fetch(`${API_URL}/eventos/precios-maximos`);
      return this._handleResponse(response);
    } catch (err) {
      console.error('Error fetching maximum prices:', err);
      throw err;
    }
  },

  async getEventMaxPrice(eventId) {
    try {
      const response = await fetch(`${API_URL}/eventos/${eventId}/precio-maximo`);
      return this._handleResponse(response);
    } catch (err) {
      console.error(`Error fetching maximum price for event ${eventId}:`, err);
      throw err;
    }
  },

  async getEventTicketTypes(eventId) {
    try {
      const response = await fetch(`${API_URL}/eventos/${eventId}/tipos-entrada`);
      return this._handleResponse(response);
    } catch (err) {
      console.error(`Error fetching ticket types for event ${eventId}:`, err);
      throw err;
    }
  },

  async createEvent(eventData) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const formData = this._prepareEventFormData(eventData);

    try {
      const response = await fetch(`${API_URL}/eventos`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData,
      });

      return this._handleResponse(response);
    } catch (err) {
      console.error("Error creating event:", err);
      throw this._formatNetworkError(err);
    }
  },

  async updateEvent(eventId, eventData) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const formData = this._prepareEventFormData(eventData);
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/eventos/${eventId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: formData,
      });

      return this._handleResponse(response);
    } catch (err) {
      console.error(`Error updating event ${eventId}:`, err);
      throw this._formatNetworkError(err);
    }
  },

  async deleteEvent(eventId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    try {
      const response = await fetch(`${API_URL}/eventos/${eventId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      return this._handleResponse(response);
    } catch (err) {
      console.error(`Error deleting event ${eventId}:`, err);
      throw this._formatNetworkError(err);
    }
  },

  async getMyEvents() {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    try {
      const response = await fetch(`${API_URL}/mis-eventos`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
      });

      const data = await this._handleResponse(response);
      
      if (data && data.eventos) {
        data.eventos = this._processImageUrls(data.eventos);
      }
      
      return data;
    } catch (err) {
      console.error("Error fetching my events:", err);
      throw this._formatNetworkError(err);
    }
  },

  _prepareEventFormData(eventData) {
    const formData = new FormData();

    if (eventData.titulo) formData.append("titulo", eventData.titulo);
    if (eventData.descripcion) formData.append("descripcion", eventData.descripcion);
    if (eventData.fecha) formData.append("fecha", eventData.fecha);
    if (eventData.hora) formData.append("hora", eventData.hora);
    if (eventData.ubicacion) formData.append("ubicacion", eventData.ubicacion);
    if (eventData.categoria) formData.append("categoria", eventData.categoria);
    
    if (typeof eventData.es_online !== 'undefined') {
      formData.append("es_online", eventData.es_online ? "1" : "0");
    }

    if (eventData.es_online && eventData.enlace_streaming) {
      formData.append("enlace_streaming", eventData.enlace_streaming);
    }

    if (eventData.imagen instanceof File) {
      formData.append("imagen", eventData.imagen);
    }

    if (Array.isArray(eventData.tipos_entrada) && eventData.tipos_entrada.length > 0) {
      eventData.tipos_entrada.forEach((tipo, index) => {
        if (tipo.idTipoEntrada) {
          formData.append(`tipos_entrada[${index}][idTipoEntrada]`, tipo.idTipoEntrada);
        }
        
        formData.append(`tipos_entrada[${index}][nombre]`, tipo.nombre);
        formData.append(`tipos_entrada[${index}][precio]`, tipo.precio);
        formData.append(`tipos_entrada[${index}][es_ilimitado]`, tipo.es_ilimitado ? "1" : "0");
        
        if (tipo.descripcion) {
          formData.append(`tipos_entrada[${index}][descripcion]`, tipo.descripcion);
        }
        
        if (typeof tipo.activo !== 'undefined') {
          formData.append(`tipos_entrada[${index}][activo]`, tipo.activo ? "1" : "0");
        }
        
        if (!tipo.es_ilimitado && tipo.cantidad_disponible) {
          formData.append(`tipos_entrada[${index}][cantidad_disponible]`, tipo.cantidad_disponible);
        }
      });
    }

    return formData;
  },

  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await this._parseErrorResponse(response);
      throw this._formatErrorResponse(response, errorData);
    }

    try {
      return await response.json();
    } catch (e) {
      return { success: true };
    }
  },

  async _parseErrorResponse(response) {
    try {
      return await response.json();
    } catch (e) {
      return {
        message: response.statusText || "Error del servidor",
        detail: `No se pudo interpretar la respuesta (Código: ${response.status})`,
      };
    }
  },

  _formatErrorResponse(response, errorData) {
    return {
      status: response.status,
      statusText: response.statusText,
      message: errorData.message || `Error HTTP: ${response.status}`,
      errors: errorData.errors || { message: errorData.message || "Error desconocido" },
    };
  },

  _formatNetworkError(err) {
    return {
      status: err.status || 0,
      message: "Error de conexión",
      errors: err.errors || {
        message: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      },
    };
  },

  _processImageUrls(events) {
    if (!Array.isArray(events)) return events;

    return events.map(event => {
      if (!event) return {};
      
      const processed = {...event};
      
      if (processed.imagen) {
        processed.imagen_url = this._buildImageUrl(processed.imagen);
      }
      
      return processed;
    });
  },

  _buildImageUrl(imagePath) {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const baseUrl = `${API_URL.replace('/api', '')}/storage/`;
    const cleanPath = imagePath.replace(/^\/storage\//, '');
    
    return `${baseUrl}${cleanPath}`;
  }
};
