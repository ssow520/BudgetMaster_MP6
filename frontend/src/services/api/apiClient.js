/**
 * APIClient - Pattern FAÇADE
 * Interface unique centralisée pour tous les appels API
 * Gère automatiquement le token JWT et les erreurs
 */

import axios from 'axios';
import { API_BASE_URL, HTTP_STATUS } from '../utils/constants.js';
import { getToken, removeToken, removeUser } from '../utils/storage.js';

class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token JWT
    this.client.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
          // Token expiré ou invalide
          removeToken();
          removeUser();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Effectue une requête GET
   */
  async get(endpoint, config = {}) {
    try {
      const response = await this.client.get(endpoint, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Effectue une requête POST
   */
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await this.client.post(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Effectue une requête PUT
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await this.client.put(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Effectue une requête DELETE
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await this.client.delete(endpoint, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Gère les erreurs API
   * @private
   */
  _handleError(error) {
    const message = error.response?.data?.message || error.message || 'Une erreur est survenue';
    const errors = error.response?.data?.errors || null;

    return {
      success: false,
      message,
      errors,
      status: error.response?.status || 500,
      originalError: error,
    };
  }
}

// Singleton - Une seule instance du client API
const apiClient = new APIClient();

export default apiClient;
