/**
 * BudgetAPI - Endpoints du budget et dashboard
 */

import apiClient from './apiClient.js';

export const budgetAPI = {
  /**
   * Obtient le résumé budgétaire
   */
  getSummary: async () => {
    return apiClient.get('/budget/summary');
  },

  /**
   * Obtient la répartition par catégorie
   */
  getCategoryBreakdown: async () => {
    return apiClient.get('/budget/category-breakdown');
  },

  /**
   * Obtient les recommandations
   */
  getRecommendations: async () => {
    return apiClient.get('/budget/recommendations');
  },

  /**
   * Définit le budget mensuel
   */
  setMonthlyLimit: async (monthlyLimit) => {
    return apiClient.post('/budget/set-monthly-limit', { monthlyLimit });
  },

  /**
   * Obtient le budget mensuel courant
   */
  getMonthlyLimit: async () => {
    return apiClient.get('/budget/monthly-limit');
  },

  /**
   * Obtient un rapport complet
   */
  getComprehensiveReport: async () => {
    return apiClient.get('/budget/comprehensive-report');
  },

  /**
   * Exporte les données en CSV
   */
  exportToCSV: async () => {
    return apiClient.get('/budget/export/csv', {
      responseType: 'blob',
    });
  },
};
