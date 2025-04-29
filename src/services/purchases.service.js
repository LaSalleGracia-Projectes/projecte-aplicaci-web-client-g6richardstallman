import { apiClient } from '../utils/api';

export const purchasesService = {
  /**
   * Obtiene las compras del usuario autenticado
   * @returns {Promise<Object>} - Lista de compras
   */
  async getMyPurchases() {
    return apiClient.get('/compras', true);
  },

  /**
   * Realiza una compra de entradas
   * @param {Object} purchaseData - Datos de la compra
   * @returns {Promise<Object>} - Resultado de la compra
   */
  async purchaseTickets(purchaseData) {
    return apiClient.post('/compras', purchaseData, true);
  },

  /**
   * Obtiene el detalle de una compra específica
   * @param {number} purchaseId - ID de la compra
   * @returns {Promise<Object>} - Detalles de la compra
   */
  async getTicketDetail(purchaseId) {
    return apiClient.get(`/compras/${purchaseId}`, true);
  },

  /**
   * Genera una factura para una compra
   * @param {number} purchaseId - ID de la compra
   * @returns {Promise<Object>} - Datos de la factura
   */
  async generateInvoice(purchaseId) {
    return apiClient.get(`/compras/${purchaseId}/factura`, true);
  }
};
