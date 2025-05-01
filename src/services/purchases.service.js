import { storage } from '../utils/storage';

const API_URL = "http://localhost:8000/api";

export const purchasesService = {
  /**
   * Obtiene las compras del usuario autenticado
   * @returns {Promise<Object>} - Lista de compras
   */
  async getMyPurchases() {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/compras`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },

  /**
   * Realiza una compra de entradas
   * @param {Object} purchaseData - Datos de la compra
   * @returns {Promise<Object>} - Resultado de la compra
   */
  async purchaseTickets(purchaseData) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/compras`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(purchaseData)
    });
    
    return this._handleResponse(response);
  },

  /**
   * Obtiene el detalle de una compra específica
   * @param {number} purchaseId - ID de la compra
   * @returns {Promise<Object>} - Detalles de la compra
   */
  async getTicketDetail(purchaseId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/compras/${purchaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return this._handleResponse(response);
  },

  /**
   * Genera una factura para una compra
   * @param {number} purchaseId - ID de la compra
   * @returns {Promise<Object>} - Datos de la factura
   */
  async generateInvoice(purchaseId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }
    
    const response = await fetch(`${API_URL}/compras/${purchaseId}/factura`, {
      method: 'GET',
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
