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
    // Usar token persistente o de sesión
    const token = storage.getToken(true) || storage.getToken(false);
    if (!token) {
      throw new Error("No authorization token found");
    }

    // Convertir idTipoEntrada a número (por si acaso)
    const entradas = (purchaseData.entradas || []).map(e => ({
      ...e,
      idTipoEntrada: Number(e.idTipoEntrada),
      cantidad: Number(e.cantidad),
      precio: Number(e.precio)
    }));

    const payload = {
      idEvento: Number(purchaseData.idEvento),
      entradas
    };

    // Log de depuración para ver el payload real
    // console.log("Payload enviado a /compras:", payload);

    const response = await fetch(`${API_URL}/compras`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
