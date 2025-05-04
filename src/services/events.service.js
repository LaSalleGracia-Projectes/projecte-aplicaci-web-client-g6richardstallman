import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function buildQueryString(params) {
  if (!params) return "";
  const esc = encodeURIComponent;
  return (
    "?" +
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => esc(k) + "=" + esc(v))
      .join("&")
  );
}

export const eventsService = {
  async getAllEvents(params) {
    try {
      const url = `${API_URL}/eventos${buildQueryString(params)}`;
      const response = await fetch(url);
      const data = await this._handleResponse(response);

      if (data && data.eventos) {
        return {
          message: data.message || "Eventos obtenidos con éxito",
          eventos: this._processImageUrls(data.eventos),
          total: data.total ?? data.eventos.length
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

  async getEventsByCategory(category, params) {
    try {
      const url = `${API_URL}/eventos/categoria/${encodeURIComponent(category)}${buildQueryString(params)}`;
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
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          formDataEntries[key] = `[File: ${value.name}, size: ${value.size}]`;
        } else {
          formDataEntries[key] = value;
        }
      }
      console.log("Enviando datos al servidor:", formDataEntries);

      const response = await fetch(`${API_URL}/eventos/${eventId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
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

    if (eventData.fecha) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const eventDate = new Date(eventData.fecha);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate > today) {
        formData.append("fecha", eventData.fecha);
      } else {
        console.log("Not sending fecha because it's not after today:", eventData.fecha);
      }
    }

    if (eventData.hora) {
      const horaPattern = /^\d{1,2}:\d{2}(:\d{2})?$/;
      if (horaPattern.test(eventData.hora)) {
        const formattedHora = eventData.hora.split(':').slice(0, 2).join(':');
        formData.append("hora", formattedHora);
      } else {
        console.warn("Invalid hora format:", eventData.hora);
        formData.append("hora", eventData.hora);
      }
    }

    if (eventData.ubicacion) formData.append("ubicacion", eventData.ubicacion);
    if (eventData.categoria) formData.append("categoria", eventData.categoria);

    formData.append("es_online", eventData.es_online ? "1" : "0");

    if (eventData.es_online) {
      const streamingUrl = eventData.enlace_streaming || eventData.ubicacion || "";

      const isValidUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/.test(streamingUrl);

      const urlToUse = isValidUrl ? streamingUrl :
        streamingUrl.startsWith('http') ? streamingUrl :
          `https://${streamingUrl}`;

      formData.append("enlace_streaming", urlToUse);
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

        formData.append(`tipos_entrada[${index}][activo]`, tipo.activo ? "1" : "0");

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
      if (response.status === 204) {
        return { success: true };
      }
      return { success: true, message: 'Operación completada' };
    }
  },

  async _parseErrorResponse(response) {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const jsonResponse = await response.json();
        console.log("Full API error response:", jsonResponse);
        return jsonResponse;
      }

      const textResponse = await response.text();
      console.log("API non-JSON error response:", textResponse);

      return {
        message: response.statusText || "Error del servidor",
        detail: textResponse || `Error (Código: ${response.status})`,
        raw: textResponse
      };
    } catch (e) {
      console.error("Error parsing error response:", e);
      return {
        message: response.statusText || "Error del servidor",
        detail: `No se pudo interpretar la respuesta (Código: ${response.status})`
      };
    }
  },

  _formatErrorResponse(response, errorData) {
    let errors = {};

    if (errorData.errors && typeof errorData.errors === 'object') {
      errors = errorData.errors;
    } else if (errorData.messages && typeof errorData.messages === 'object') {
      errors = errorData.messages;
    } else if (errorData.message && errorData.status === 422) {
      errors = { validation: errorData.message };
    }

    const mappedErrors = {};

    if (errors.fecha && Array.isArray(errors.fecha)) {
      mappedErrors.fecha = errors.fecha.map(msg =>
        msg.includes('after') ? 'La fecha debe ser posterior al día de hoy' : msg
      );
    }

    if (errors.hora && Array.isArray(errors.hora)) {
      mappedErrors.hora = errors.hora.map(msg =>
        msg.includes('format') ? 'El formato de hora debe ser HH:MM' : msg
      );
    }

    if (errors.enlace_streaming && Array.isArray(errors.enlace_streaming)) {
      mappedErrors.enlace_streaming = errors.enlace_streaming.map(msg =>
        msg.includes('required') ? 'Para eventos online se requiere un enlace de streaming válido' :
          msg.includes('url') ? 'El enlace de streaming debe ser una URL válida' : msg
      );
    }

    const formattedError = {
      status: response.status,
      statusText: response.statusText,
      message: errorData.message || errorData.error || `Error HTTP: ${response.status}`,
      errors: Object.keys(mappedErrors).length > 0 ? { ...errors, ...mappedErrors } : errors,
      rawErrors: errorData,
      mappedErrors: mappedErrors
    };

    console.log("Formatted API error:", formattedError);
    return formattedError;
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

      const processed = { ...event };

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
