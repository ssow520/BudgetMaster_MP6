/**
 * BudgetFacade.js - Façade Pattern pour centraliser la logique métier
 * Simplifie les opérations complexes en cachant les détails d'implémentation
 * 
 * Responsabilités:
 * - Ajouter transactions avec notifications automatiques
 * - Calculer le budget et les recommandations
 * - Gérer les filtres de transactions
 * - Export des données
 */

import TransactionService from './transactionService.js';
import BudgetService from './budgetService.js';
import notificationService from './notificationService.js';
import TransactionRepository from '../repositories/transactionRepository.js';
import logger from '../utils/logger.js';

class BudgetFacade {
  constructor() {
    // Les services utilisent des méthodes statiques
    // pas besoin d'instancier
  }

  /**
   * Ajouter une transaction avec notifications automatiques
   * Centralise: validation → ajout → recalcul → notifications
   */
  addTransactionWithNotifications(userId, transactionData) {
    try {
      logger.info(`[Façade] Ajout transaction pour user: ${userId}`);

      // 1. Ajouter la transaction
      const result = TransactionService.create(userId, transactionData);
      
      if (!result.success) {
        logger.warn(`[Façade] Validation échouée: ${result.message}`);
        return { success: false, message: result.message };
      }

      const transaction = result.transaction;

      // 2. Récalculer le budget
      const budgetResult = BudgetService.getSummary(userId);
      const budget = budgetResult.success ? budgetResult.summary : {};

      // 3. Vérifier dépassement budget
      const isOverBudget = budget.totalExpense > budget.monthlyBudgetLimit && budget.monthlyBudgetLimit > 0;
      
      if (isOverBudget) {
        const overage = budget.totalExpense - budget.monthlyBudgetLimit;
        const percentageExceeded = ((overage / budget.monthlyBudgetLimit) * 100).toFixed(2);
        
        // Envoyer notification
        notificationService.notify('budget_exceeded', {
          userId,
          totalExpenses: budget.totalExpense,
          budgetLimit: budget.monthlyBudgetLimit,
          overage: parseFloat(overage.toFixed(2)),
          percentageExceeded: parseFloat(percentageExceeded),
          timestamp: new Date().toISOString()
        });
        
        logger.warn(`[Façade] Budget dépassé pour user ${userId}: +${overage.toFixed(2)}$ (${percentageExceeded}%)`);
      }

      logger.info(`[Façade] Transaction ajoutée avec succès`);

      return { 
        success: true,
        transaction, 
        budget, 
        isOverBudget 
      };
    } catch (error) {
      logger.error(`[Façade] Erreur ajout transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer une transaction avec notifications
   */
  deleteTransactionWithNotifications(userId, transactionId) {
    try {
      logger.info(`[Façade] Suppression transaction ${transactionId}`);

      // 1. Récupérer avant suppression
      const allTransactions = TransactionRepository.findByUserId(userId);
      const transaction = allTransactions.find(t => t.id === transactionId);

      // 2. Supprimer
      const result = TransactionService.delete(userId, transactionId);

      if (!result.success) {
        logger.warn(`[Façade] Suppression échouée: ${result.message}`);
        return { success: false, message: result.message };
      }

      // 3. Recalculer budget
      const budget = BudgetService.getSummary(userId);

      // 4. Notifier observateurs
      notificationService.notify('transaction_deleted', {
        userId,
        transaction,
        budget,
        timestamp: new Date().toISOString()
      });

      logger.info(`[Façade] Transaction supprimée avec succès`);
      return { success: true, result, budget };
    } catch (error) {
      logger.error(`[Façade] Erreur suppression transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mettre à jour une transaction
   */
  updateTransactionWithNotifications(userId, transactionId, updateData) {
    try {
      logger.info(`[Façade] Mise à jour transaction ${transactionId}`);

      // 1. Mettre à jour
      const result = TransactionService.update(userId, transactionId, updateData);

      if (!result.success) {
        logger.warn(`[Façade] Modification échouée: ${result.message}`);
        return { success: false, message: result.message };
      }

      const transaction = result.transaction;

      // 2. Recalculer budget
      const budget = BudgetService.getSummary(userId);

      // 3. Notifier observateurs
      notificationService.notify('transaction_updated', {
        userId,
        transaction,
        budget,
        timestamp: new Date().toISOString()
      });

      logger.info(`[Façade] Transaction mise à jour avec succès`);
      return { success: true, transaction, budget };
    } catch (error) {
      logger.error(`[Façade] Erreur modification transaction: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir le résumé du tableau de bord
   */
  getDashboardSummary(userId) {
    try {
      logger.info(`[Façade] Calcul résumé dashboard pour user: ${userId}`);

      const result = BudgetService.getSummary(userId);
      
      if (!result.success) {
        logger.warn(`[Façade] Erreur: ${result.message}`);
        return null;
      }

      const summary = result.summary;
      const recommendations = BudgetService.getRecommendations(userId);

      return {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpense,
        balance: summary.balance,
        indicator: summary.indicator,
        monthlyLimit: summary.monthlyBudgetLimit,
        recommendations: recommendations,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`[Façade] Erreur calcul résumé: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir les transactions filtrées
   */
  getFilteredTransactions(userId, filters = {}) {
    try {
      logger.info(`[Façade] Filtre transactions pour user: ${userId}`, filters);

      let transactions = TransactionRepository.findByUserId(userId);

      // Appliquer les filtres
      if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter(t => t.type === filters.type);
      }

      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        transactions = transactions.filter(t => new Date(t.date) >= start);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        transactions = transactions.filter(t => new Date(t.date) <= end);
      }

      // Tri
      if (filters.sortBy === 'amount' && filters.sortOrder === 'asc') {
        transactions.sort((a, b) => a.amount - b.amount);
      } else if (filters.sortBy === 'amount' && filters.sortOrder === 'desc') {
        transactions.sort((a, b) => b.amount - a.amount);
      } else if (filters.sortBy === 'date' && filters.sortOrder === 'asc') {
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      } else {
        // Par défaut: date décroissante (plus récent en premier)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      // Pagination
      if (filters.offset !== undefined && filters.limit !== undefined) {
        transactions = transactions.slice(filters.offset, filters.offset + filters.limit);
      }

      logger.info(`[Façade] ${transactions.length} transactions trouvées après filtrage`);
      return transactions;
    } catch (error) {
      logger.error(`[Façade] Erreur filtrage transactions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir la répartition par catégorie
   */
  getCategoryBreakdown(userId) {
    try {
      logger.info(`[Façade] Calcul répartition catégories pour user: ${userId}`);

      const transactions = TransactionRepository.findByUserId(userId);
      const expenses = transactions.filter(t => t.type === 'expense');

      const breakdown = {};
      let totalExpenses = 0;

      expenses.forEach(transaction => {
        const category = transaction.category || 'Autre';
        breakdown[category] = (breakdown[category] || 0) + transaction.amount;
        totalExpenses += transaction.amount;
      });

      // Convertir en percentages
      const result = Object.entries(breakdown).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : '0'
      }));

      logger.info(`[Façade] Répartition calculée: ${Object.keys(breakdown).length} catégories`);
      return result;
    } catch (error) {
      logger.error(`[Façade] Erreur répartition catégories: ${error.message}`);
      throw error;
    }
  }

  /**
   * Définir le budget mensuel
   */
  setMonthlyBudgetLimit(userId, monthlyLimit) {
    try {
      if (!monthlyLimit || monthlyLimit <= 0) {
        throw new Error('Le budget mensuel doit être un nombre positif');
      }

      logger.info(`[Façade] Définition budget mensuel: ${monthlyLimit}$ pour user: ${userId}`);

      const result = BudgetService.setMonthlyLimit(userId, monthlyLimit);

      // Notifier
      notificationService.notify('budget_limit_changed', {
        userId,
        newLimit: monthlyLimit,
        timestamp: new Date().toISOString()
      });

      logger.info(`[Façade] Budget mensuel défini et observateurs notifiés`);
      return { success: true, result };
    } catch (error) {
      logger.error(`[Façade] Erreur définition budget: ${error.message}`);
      throw error;
    }
  }

  /**
   * Exporter les transactions en CSV
   */
  exportTransactionsAsCSV(userId) {
    try {
      logger.info(`[Façade] Export CSV pour user: ${userId}`);

      const transactions = TransactionRepository.findByUserId(userId);

      // Créer le CSV
      let csv = 'Date,Type,Montant,Catégorie,Description\n';

      transactions.forEach(transaction => {
        const date = new Date(transaction.date).toLocaleDateString('fr-CA');
        const type = transaction.type === 'income' ? 'Revenu' : 'Dépense';
        const category = transaction.category || 'N/A';
        const description = (transaction.description || '').replace(/"/g, '""');

        csv += `"${date}","${type}","${transaction.amount}","${category}","${description}"\n`;
      });

      logger.info(`[Façade] CSV généré: ${transactions.length} transactions`);
      return csv;
    } catch (error) {
      logger.error(`[Façade] Erreur export CSV: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir un rapport complet
   */
  getComprehensiveReport(userId) {
    try {
      logger.info(`[Façade] Génération rapport complet pour user: ${userId}`);

      const dashboard = this.getDashboardSummary(userId);
      
      if (!dashboard) {
        // Retourner un rapport vide si utilisateur n'existe pas
        return {
          generatedAt: new Date().toISOString(),
          summary: null,
          categoryBreakdown: [],
          transactionCount: 0,
          recentTransactions: [],
          analysis: {
            averageMonthlyIncome: 0,
            averageMonthlyExpense: 0,
            savingsRate: 0
          }
        };
      }

      const categoryBreakdown = this.getCategoryBreakdown(userId);
      const transactions = TransactionRepository.findByUserId(userId);

      const report = {
        generatedAt: new Date().toISOString(),
        summary: dashboard,
        categoryBreakdown,
        transactionCount: transactions.length,
        recentTransactions: transactions.slice(0, 10), // 10 dernières
        analysis: {
          averageMonthlyIncome: dashboard.totalIncome / 1, // Simplifié pour démo
          averageMonthlyExpense: dashboard.totalExpenses / 1,
          savingsRate: dashboard.totalIncome > 0 
            ? (((dashboard.totalIncome - dashboard.totalExpenses) / dashboard.totalIncome) * 100).toFixed(2)
            : 0
        }
      };

      logger.info(`[Façade] Rapport complet généré`);
      return report;
    } catch (error) {
      logger.error(`[Façade] Erreur génération rapport: ${error.message}`);
      throw error;
    }
  }
}

// Singleton Pattern
let instance;

export default {
  getInstance: () => {
    if (!instance) {
      instance = new BudgetFacade();
    }
    return instance;
  }
};
