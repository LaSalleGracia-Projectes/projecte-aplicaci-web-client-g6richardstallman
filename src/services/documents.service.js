import { apiClient } from '../utils/api';
import { storage } from '../utils/storage';

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
    
    const url = `${apiClient.baseUrl}/factura/${invoiceId}/pdf`;
    
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
    
    const url = `${apiClient.baseUrl}/entrada/${ticketId}/pdf`;
    
    try {
      window.open(`${url}?token=${token}`, '_blank');
      return { success: true };
    } catch (error) {
      console.error("Error al obtener PDF de entrada:", error);
      throw error;
    }
  }
};
