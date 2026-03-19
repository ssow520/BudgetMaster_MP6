/**
 * AuthService - Pattern SINGLETON
 * Gère l'authentification côté client
 * Une seule instance partageée dans toute l'application
 */

import { authAPI } from './api/authAPI.js';
import { saveToken, getToken, saveUser, getUser, removeToken, removeUser } from '../utils/storage.js';

class AuthService {
  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }

    this.user = getUser();
    this.token = getToken();
    AuthService.instance = this;
  }

  /**
   * Enregistre un nouvel utilisateur
   */
  async register(firstName, lastName, email, password) {
    const result = await authAPI.register(firstName, lastName, email, password);

    if (result.success) {
      saveUser(result.data.user);
      this.user = result.data.user;
    }

    return result;
  }

  /**
   * Connecte un utilisateur
   */
  async login(email, password) {
    const result = await authAPI.login(email, password);

    if (result.success) {
      saveToken(result.data.token);
      saveUser(result.data.user);
      this.token = result.data.token;
      this.user = result.data.user;
    }

    return result;
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout() {
    const result = await authAPI.logout();

    removeToken();
    removeUser();
    this.token = null;
    this.user = null;

    return result;
  }

  /**
   * Obtient l'utilisateur courant
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Obtient le token JWT
   */
  getToken() {
    return this.token;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  /**
   * Obtient l'instance unique du service
   * @static
   */
  static getInstance() {
    if (!AuthService.instance) {
      new AuthService();
    }
    return AuthService.instance;
  }
}

// Créer et exporter l'instance unique
const authService = new AuthService();

export default authService;
