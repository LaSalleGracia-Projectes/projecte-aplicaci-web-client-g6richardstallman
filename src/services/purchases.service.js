import { storage } from "../utils/storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const purchasesService = {
  async getMyPurchases() {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/compras`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this._handleResponse(response);
  },

  async purchaseTickets(purchaseData) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/compras`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseData),
    });

    return this._handleResponse(response);
  },

  async getTicketDetail(purchaseId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/compras/${purchaseId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this._handleResponse(response);
  },

  async generateInvoice(purchaseId) {
    const token = storage.getToken();
    if (!token) {
      throw new Error("No authorization token found");
    }

    const response = await fetch(`${API_URL}/compras/${purchaseId}/factura`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this._handleResponse(response);
  },

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
      errors: errorData,
    };
  },
};
