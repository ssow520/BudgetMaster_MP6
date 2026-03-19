/**
 * AuthAPI - Endpoints d'authentification
 */

import apiClient from './apiClient.js';

export const authAPI = {
  /**
   * Enregistre un nouvel utilisateur
   */
  register: async (firstName, lastName, email, password) => {
    return apiClient.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
  },

  /**
   * Connecte un utilisateur
   */
  login: async (email, password) => {
    return apiClient.post('/auth/login', {
      email,
      password,
    });
  },

  /**
   * Déconnecte l'utilisateur
   */
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Vérifie si le token est valide
   */
  verifyToken: async () => {
    return apiClient.get('/auth/verify');
  },
};
