import { apiClient } from '../utils/api';

export const eventsService = {
  async getAllEvents() {
    return apiClient.get('/eventos');
  },

  async getEventById(eventId) {
    return apiClient.get(`/eventos/${eventId}`);
  },

  async getEventsByCategory(category) {
    return apiClient.get(`/eventos/categoria/${encodeURIComponent(category)}`);
  },

  async createEvent(eventData) {
    const formData = new FormData();
    
    formData.append("titulo", eventData.titulo);
    formData.append("descripcion", eventData.descripcion);
    formData.append("fecha", eventData.fecha);
    formData.append("hora", eventData.hora);
    formData.append("ubicacion", eventData.ubicacion);
    formData.append("categoria", eventData.categoria);
    formData.append("es_online", eventData.es_online ? "1" : "0");
    
    if (eventData.imagen && eventData.imagen instanceof File) {
      formData.append("imagen", eventData.imagen);
    }
    
    eventData.tipos_entrada.forEach((tipo, index) => {
      formData.append(`tipos_entrada[${index}][nombre]`, tipo.nombre);
      formData.append(`tipos_entrada[${index}][precio]`, tipo.precio);
      formData.append(`tipos_entrada[${index}][descripcion]`, tipo.descripcion || "");
      formData.append(`tipos_entrada[${index}][es_ilimitado]`, tipo.es_ilimitado ? "1" : "0");
      
      if (!tipo.es_ilimitado) {
        formData.append(`tipos_entrada[${index}][cantidad_disponible]`, tipo.cantidad_disponible);
      }
    });
    
    return apiClient.sendFormData('/eventos', formData);
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
    
    return apiClient.sendFormData(`/eventos/${eventId}`, formData, 'PUT');
  },

  async deleteEvent(eventId) {
    return apiClient.delete(`/eventos/${eventId}`, true);
  },

  async getMyEvents() {
    return apiClient.get('/mis-eventos', true);
  },
  
  async getEventMinPrice(eventId) {
    return apiClient.get(`/eventos/${eventId}/precio-minimo`);
  },
  
  async getEventMaxPrice(eventId) {
    return apiClient.get(`/eventos/${eventId}/precio-maximo`);
  },
  
  async getPriceRanges() {
    const minPrices = await apiClient.get('/eventos/precios-minimos');
    const maxPrices = await apiClient.get('/eventos/precios-maximos');
    return { minPrices, maxPrices };
  }
};
