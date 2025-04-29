import { apiClient } from '../utils/api';

export const organizersService = {
  async getAllOrganizers() {
    return apiClient.get('/organizadores');
  },
  
  async getOrganizerById(organizerId) {
    return apiClient.get(`/organizadores/${organizerId}`);
  },
  
  async getOrganizerEvents(organizerId) {
    return apiClient.get(`/organizadores/${organizerId}/eventos`);
  },
  
  async checkIsFavorite(organizerId) {
    try {
      return await apiClient.get(`/organizadores/${organizerId}/es-favorito`, true);
    } catch (error) {
      return { is_favorite: false };
    }
  }
};
