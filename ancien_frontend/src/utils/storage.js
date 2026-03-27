/**
 * Storage Helpers - Utilitaires pour le stockage local
 */

import { STORAGE_KEYS } from './constants.js';

/**
 * Sauvegarde le token JWT
 */
export const saveToken = (token) => {
  sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Obtient le token JWT
 */
export const getToken = () => {
  return sessionStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Supprime le token
 */
export const removeToken = () => {
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Sauvegarde les informations utilisateur
 */
export const saveUser = (user) => {
  sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Obtient les informations utilisateur
 */
export const getUser = () => {
  const user = sessionStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

/**
 * Supprime les informations utilisateur
 */
export const removeUser = () => {
  sessionStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Sauvegarde le budget en cache local
 */
export const saveBudgetCache = (budget, duration = 5 * 60 * 1000) => {
  const cacheData = {
    data: budget,
    timestamp: Date.now() + duration,
  };
  localStorage.setItem(STORAGE_KEYS.BUDGET_CACHE, JSON.stringify(cacheData));
};

/**
 * Obtient le budget en cache
 */
export const getBudgetCache = () => {
  const cached = localStorage.getItem(STORAGE_KEYS.BUDGET_CACHE);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (timestamp < Date.now()) {
      localStorage.removeItem(STORAGE_KEYS.BUDGET_CACHE);
      return null;
    }
    return data;
  } catch {
    return null;
  }
};

/**
 * Vide le cache du budget
 */
export const clearBudgetCache = () => {
  localStorage.removeItem(STORAGE_KEYS.BUDGET_CACHE);
};

/**
 * Effectue un logout complet
 */
export const clearAllStorage = () => {
  removeToken();
  removeUser();
  clearBudgetCache();
};

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getUser();
};
