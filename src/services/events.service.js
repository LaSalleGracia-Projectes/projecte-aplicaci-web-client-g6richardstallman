import { storage } from '../utils/storage';

const API_URL = "http://localhost:8000/api";

export const eventsService = {
  async getAllEvents() {
    const response = await fetch(`${API_URL}/eventos`);
    const data = await this._handleResponse(response);
    
    // Procesamos las imágenes para asegurar que tengan URLs completas
    if (data.eventos) {
      data.eventos = this._processImageUrls(data.eventos);
    } else if (Array.isArray(data)) {
      return this._processImageUrls(data);
    }
    
    return data;
  },

  async getEventById(eventId) {
    const response = await fetch(`${API_URL}/eventos/${eventId}`);
    return this._handleResponse(response);
  },

  async getEventsByCategory(category) {
    const response = await fetch(`${API_URL}/eventos/categoria/${encodeURIComponent(category)}`);
    return this._handleResponse(response);
  },

  async createEvent(eventData) {
    const formData = new FormData();
    
    // Añadimos los campos principales del evento
    formData.append("titulo", eventData.titulo);
    formData.append("descripcion", eventData.descripcion);
    formData.append("fecha", eventData.fecha);
    formData.append("hora", eventData.hora);
    formData.append("ubicacion", eventData.ubicacion);
    formData.append("categoria", eventData.categoria);
    formData.append("es_online", eventData.es_online ? "1" : "0");
    
    // Manejamos la imagen si existe
    if (eventData.imagen && eventData.imagen instanceof File) {
      formData.append("imagen", eventData.imagen);
    }
    
    // Incluimos información de tipos de entradas
    eventData.tipos_entrada.forEach((tipo, index) => {
      formData.append(`tipos_entrada[${index}][nombre]`, tipo.nombre);
      formData.append(`tipos_entrada[${index}][precio]`, tipo.precio);
      formData.append(`tipos_entrada[${index}][descripcion]`, tipo.descripcion || "");
      formData.append(`tipos_entrada[${index}][es_ilimitado]`, tipo.es_ilimitado ? "1" : "0");
      
      if (!tipo.es_ilimitado) {
        formData.append(`tipos_entrada[${index}][cantidad_disponible]`, tipo.cantidad_disponible);
      }
    });
    
    const token = storage.getToken();
    
    // Aseguramos que se envíen todos los headers necesarios
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    headers['Accept'] = 'application/json';
    // No incluimos Content-Type, se establece automáticamente con FormData
    
    try {
      const response = await fetch(`${API_URL}/eventos`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      return this._handleResponse(response);
    } catch (networkError) {
      console.error("Error de red al crear evento:", networkError);
      throw {
        status: 0,
        message: "Error de conexión",
        errors: { message: "No se pudo conectar con el servidor. Verifica tu conexión a internet." }
      };
    }
  },

  async updateEvent(eventId, eventData) {
    const formData = new FormData();
    
    Object.keys(eventData).forEach((key) => {
      if (key === "imagen" && eventData[key] instanceof File) {
        formData.append(key, eventData[key]);
      } else if (key === "tipos_entrada" && Array.isArray(eventData[key])) {
        eventData[key].forEach((tipo, index) => {
          Object.keys(tipo).forEach((tipoKey) => {
            formData.append(`tipos_entrada[${index}][${tipoKey}]`, tipo[tipoKey]);
          });
        });
      } else if (key !== "imagen") {
        formData.append(key, eventData[key]);
      }
    });
    
    const token = storage.getToken();
    
    const response = await fetch(`${API_URL}/eventos/${eventId}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    
    // Añadimos el método PUT manualmente porque fetch no soporta PUT con FormData
    formData.append('_method', 'PUT');
    
    return this._handleResponse(response);
  },

  async deleteEvent(eventId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/eventos/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },

  async getMyEvents() {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/mis-eventos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },
  
  async getEventMinPrice(eventId) {
    const response = await fetch(`${API_URL}/eventos/${eventId}/precio-minimo`);
    return this._handleResponse(response);
  },
  
  async getEventMaxPrice(eventId) {
    const response = await fetch(`${API_URL}/eventos/${eventId}/precio-maximo`);
    return this._handleResponse(response);
  },
  
  async getPriceRanges() {
    const minPricesResponse = await fetch(`${API_URL}/eventos/precios-minimos`);
    const maxPricesResponse = await fetch(`${API_URL}/eventos/precios-maximos`);
    
    const minPrices = await this._handleResponse(minPricesResponse);
    const maxPrices = await this._handleResponse(maxPricesResponse);
    
    return { minPrices, maxPrices };
  },

  // Helper method to handle API responses
  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await this._parseErrorResponse(response);
      throw this._formatErrorResponse(response, errorData);
    }
    
    try {
      return await response.json();
    } catch (e) {
      // Si la respuesta es exitosa pero no es JSON válido
      return { success: true };
    }
  },

  async _parseErrorResponse(response) {
    try {
      return await response.json();
    } catch (e) {
      // Si no se puede parsear la respuesta como JSON
      return { 
        message: response.statusText || "Error del servidor",
        detail: `No se pudo interpretar la respuesta (Código: ${response.status})`
      };
    }
  },

  _formatErrorResponse(response, errorData) {
    return {
      status: response.status,
      statusText: response.statusText,
      message: `HTTP error! status: ${response.status}`,
      errors: errorData || { message: "Error desconocido" }
    };
  },

  _processImageUrls(events) {
    if (!Array.isArray(events)) return events;
    
    return events.map(event => {
      if (event.imagen_url && !event.imagen_url.startsWith('http')) {
        // Si la URL de la imagen es relativa, convertirla en absoluta
        event.imagen_url = `${API_URL}${event.imagen_url.startsWith('/') ? '' : '/'}${event.imagen_url}`;
      }
      return event;
    });
  }
};
