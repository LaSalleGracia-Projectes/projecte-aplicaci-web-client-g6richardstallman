import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const documentsService = {
  async getInvoicePdf(invoiceId) {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const url = `${API_URL}/factura/${invoiceId}/pdf`;
      window.open(`${url}?token=${token}`, "_blank");
      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async getTicketPdf(ticketId) {
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const url = `${API_URL}/entrada/${ticketId}/pdf`;
      window.open(`${url}?token=${token}`, "_blank");
      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};
