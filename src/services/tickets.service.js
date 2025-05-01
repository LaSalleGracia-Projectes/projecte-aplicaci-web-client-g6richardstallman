import { storage } from '../utils/storage';

const API_URL = "http://localhost:8000/api";

export const ticketsService = {
  async getEventTicketTypes(eventId) {
    const response = await fetch(`${API_URL}/eventos/${eventId}/tipos-entrada`);
    return this._handleResponse(response);
  },

  async createTicketType(eventId, ticketData) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/eventos/${eventId}/tipos-entrada`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });
    
    return this._handleResponse(response);
  },

  async updateTicketType(eventId, ticketTypeId, ticketData) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/eventos/${eventId}/tipos-entrada/${ticketTypeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });
    
    return this._handleResponse(response);
  },

  async deleteTicketType(eventId, ticketTypeId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/eventos/${eventId}/tipos-entrada/${ticketTypeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },

  // Helper method to handle API responses
  async _handleResponse(response) {
    if (!response.ok) {
      const errorData = await this._parseErrorResponse(response);
      throw this._formatErrorResponse(response, errorData);
    }
    
    return response.json();
  },

  async _parseErrorResponse(response) {
    try {
      return await response.json();
    } catch (e) {
      return { message: response.statusText };
    }
  },

  _formatErrorResponse(response, errorData) {
    return {
      status: response.status,
      statusText: response.statusText,
      message: `HTTP error! status: ${response.status}`,
      errors: errorData
    };
  }
};
