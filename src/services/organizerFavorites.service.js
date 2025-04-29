import { apiClient } from '../utils/api';

export const organizerFavoritesService = {
  async getFavoriteOrganizers() {
    return apiClient.get('/organizadores-favoritos', true);
  },
  
  async addToFavorites(organizerId) {
    return apiClient.post('/organizadores-favoritos', { idOrganizador: organizerId }, true);
  },
  
  async removeFromFavorites(organizerId) {
    return apiClient.delete(`/organizadores-favoritos/${organizerId}`, true);
  },
  
  async checkIsFavorite(organizerId) {
    try {
      return await apiClient.get(`/organizadores-favoritos/check/${organizerId}`, true);
    } catch (error) {
      return { is_favorite: false };
    }
  }
};
