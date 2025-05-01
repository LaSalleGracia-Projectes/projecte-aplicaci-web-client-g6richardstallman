import { storage } from '../utils/storage';

const API_URL = "http://localhost:8000/api";

export const documentsService = {
  /**
   * Obtiene el PDF de una factura
   * @param {number} invoiceId - ID de la factura
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async getInvoicePdf(invoiceId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    
    const url = `${API_URL}/factura/${invoiceId}/pdf`;
    
    try {
      window.open(`${url}?token=${token}`, '_blank');
      return { success: true };
    } catch (error) {
      console.error("Error al obtener PDF de factura:", error);
      throw error;
    }
  },
  
  /**
   * Obtiene el PDF de una entrada
   * @param {number} ticketId - ID de la entrada
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async getTicketPdf(ticketId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    
    const url = `${API_URL}/entrada/${ticketId}/pdf`;
    
    try {
      window.open(`${url}?token=${token}`, '_blank');
      return { success: true };
    } catch (error) {
      console.error("Error al obtener PDF de entrada:", error);
      throw error;
    }
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
}
