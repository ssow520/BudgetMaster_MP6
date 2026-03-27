/**
 * TransactionAPI - Endpoints des transactions
 */

import apiClient from './apiClient.js';

export const transactionAPI = {
  /**
   * Crée une nouvelle transaction
   */
  create: async (transactionData) => {
    return apiClient.post('/transactions', transactionData);
  },

  /**
   * Obtient toutes les transactions
   */
  getAll: async () => {
    return apiClient.get('/transactions');
  },

  /**
   * Obtient les revenus
   */
  getIncome: async () => {
    return apiClient.get('/transactions/income');
  },

  /**
   * Obtient les dépenses
   */
  getExpense: async () => {
    return apiClient.get('/transactions/expense');
  },

  /**
   * Filtre les transactions
   */
  filter: async (filters) => {
    return apiClient.get('/transactions/filter', { params: filters });
  },

  /**
   * Met à jour une transaction
   */
  update: async (id, transactionData) => {
    return apiClient.put(`/transactions/${id}`, transactionData);
  },

  /**
   * Supprime une transaction
   */
  delete: async (id) => {
    return apiClient.delete(`/transactions/${id}`);
  },
};
