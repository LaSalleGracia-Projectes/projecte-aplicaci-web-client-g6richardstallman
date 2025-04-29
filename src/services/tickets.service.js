import { apiClient } from '../utils/api';

export const ticketsService = {
  async getEventTicketTypes(eventId) {
    return apiClient.get(`/eventos/${eventId}/tipos-entrada`);
  },

  async createTicketType(eventId, ticketData) {
    return apiClient.post(`/eventos/${eventId}/tipos-entrada`, ticketData, true);
  },

  async updateTicketType(eventId, ticketTypeId, ticketData) {
    return apiClient.put(`/eventos/${eventId}/tipos-entrada/${ticketTypeId}`, ticketData, true);
  },

  async deleteTicketType(eventId, ticketTypeId) {
    return apiClient.delete(`/eventos/${eventId}/tipos-entrada/${ticketTypeId}`, true);
  }
};
