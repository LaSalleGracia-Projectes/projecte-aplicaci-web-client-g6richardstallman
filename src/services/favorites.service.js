import { apiClient } from '../utils/api';

export const favoritesService = {
  async getFavoriteEvents() {
    return apiClient.get('/favoritos', true);
  },

  async addToFavorites(eventId) {
    return apiClient.post('/favoritos', { idEvento: eventId }, true);
  },

  async removeFromFavorites(eventId) {
    return apiClient.delete(`/favoritos/${eventId}`, true);
  },

  async checkIsFavorite(eventId) {
    try {
      return await apiClient.get(`/favoritos/check/${eventId}`, true);
    } catch (error) {
      return { isFavorito: false };
    }
  }
};
