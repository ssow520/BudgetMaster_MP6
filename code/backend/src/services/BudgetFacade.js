import TransactionService from './transactionService.js';
import BudgetService from './budgetService.js';
import UserRepository from '../repositories/userRepository.js';
import notificationService from './notificationService.js';
import TransactionRepository from '../repositories/transactionRepository.js';
import { loadDatabase, saveDatabase } from '../config/database.js';
import logger from '../utils/logger.js';

class BudgetFacade {
  constructor() {
    if (BudgetFacade._instance) {
      return BudgetFacade._instance;
    }
    BudgetFacade._instance = this;
  }

  static getInstance() {
    if (!BudgetFacade._instance) {
      new BudgetFacade();
    }
    return BudgetFacade._instance;
  }

  _ensureUserExists(userId) {
    const user = UserRepository.findById(userId);
    if (!user) {
      const db = loadDatabase();
      db.users.push({
        id: userId,
        firstName: 'Utilisateur',
        lastName: 'Test',
        email: `${userId}@budgetmaster.com`,
        password: 'hashed',
        monthlyBudgetLimit: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      saveDatabase(db);
    }
  }

  addTransactionWithNotifications(userId, transactionData) {
    try {
      const result = TransactionService.create(userId, transactionData);
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const transaction = result.transaction;
      const budgetResult = BudgetService.getSummary(userId);
      const budget = budgetResult.success ? budgetResult.summary : {};

      const isOverBudget = budget.monthlyBudgetLimit > 0 && budget.totalExpense > budget.monthlyBudgetLimit;
      if (isOverBudget) {
        const overage = budget.totalExpense - budget.monthlyBudgetLimit;
        notificationService.notify('budget_exceeded', {
          userId,
          overage: parseFloat(overage.toFixed(2)),
          timestamp: new Date().toISOString(),
        });
      }

      return { success: true, transaction, budget, isOverBudget };
    } catch (error) {
      logger.error(`[Facade] Erreur ajout transaction: ${error.message}`);
      throw error;
    }
  }

  deleteTransactionWithNotifications(userId, transactionId) {
    try {
      const result = TransactionService.delete(transactionId, userId);
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const budget = BudgetService.getSummary(userId);
      notificationService.notify('transaction_deleted', {
        userId,
        transactionId,
        budget,
        timestamp: new Date().toISOString(),
      });

      return { success: true, result, budget };
    } catch (error) {
      logger.error(`[Facade] Erreur suppression transaction: ${error.message}`);
      throw error;
    }
  }

  updateTransactionWithNotifications(userId, transactionId, updateData) {
    try {
      const result = TransactionService.update(transactionId, userId, updateData);
      if (!result.success) {
        return { success: false, message: result.message };
      }

      const budget = BudgetService.getSummary(userId);
      notificationService.notify('transaction_updated', {
        userId,
        transaction: result.transaction,
        budget,
        timestamp: new Date().toISOString(),
      });

      return { success: true, transaction: result.transaction, budget };
    } catch (error) {
      logger.error(`[Facade] Erreur modification transaction: ${error.message}`);
      throw error;
    }
  }

  getDashboardSummary(userId) {
    try {
      const result = BudgetService.getSummary(userId);
      if (!result.success) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          balance: 0,
          indicator: 'balanced',
          monthlyLimit: 0,
          recommendations: [],
          lastUpdated: new Date().toISOString(),
        };
      }

      const summary = result.summary;
      const recommendations = BudgetService.getRecommendations(userId);

      return {
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpense,
        balance: summary.balance,
        indicator: summary.indicator,
        monthlyLimit: summary.monthlyBudgetLimit,
        recommendations,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`[Facade] Erreur calcul résumé: ${error.message}`);
      throw error;
    }
  }

  getFilteredTransactions(userId, filters = {}) {
    try {
      let transactions = TransactionRepository.findByUserId(userId);

      if (filters.type && filters.type !== 'all') {
        transactions = transactions.filter((t) => t.type === filters.type);
      }

      if (filters.category) {
        transactions = transactions.filter((t) => t.category === filters.category);
      }

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        transactions = transactions.filter((t) => new Date(t.date) >= start);
      }

      if (filters.endDate) {
        const end = new Date(filters.endDate);
        transactions = transactions.filter((t) => new Date(t.date) <= end);
      }

      if (filters.sortBy === 'amount' && filters.sortOrder === 'asc') {
        transactions.sort((a, b) => a.amount - b.amount);

      } else if (filters.sortBy === 'amount' && filters.sortOrder === 'desc') {
        transactions.sort((a, b) => b.amount - a.amount);

      } else if (filters.sortBy === 'date' && filters.sortOrder === 'asc') {
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        
      } else {
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      }

      if (filters.offset !== undefined && filters.limit !== undefined) {
        transactions = transactions.slice(filters.offset, filters.offset + filters.limit);
      }

      logger.info(`[Facade] ${transactions.length} transactions trouvées`);
      return transactions;
    } catch (error) {
      logger.error(`[Facade] Erreur filtrage: ${error.message}`);
      throw error;
    }
  }

  getCategoryBreakdown(userId) {
    try {
      const transactions = TransactionRepository.findByUserId(userId);
      const expenses = transactions.filter((t) => t.type === 'expense');

      const breakdown = {};
      let totalExpenses = 0;

      expenses.forEach((t) => {
        const category = t.category || 'Autre';
        breakdown[category] = (breakdown[category] || 0) + t.amount;
        totalExpenses += t.amount;
      });

      return Object.entries(breakdown).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : '0',
      }));
    } catch (error) {
      logger.error(`[Facade] Erreur répartition catégories: ${error.message}`);
      throw error;
    }
  }

  setMonthlyBudgetLimit(userId, monthlyLimit) {
    try {
      if (!monthlyLimit || monthlyLimit <= 0) {
        throw new Error('Le budget mensuel doit être un nombre positif');
      }

      this._ensureUserExists(userId);

      const result = BudgetService.setMonthlyLimit(userId, monthlyLimit);

      notificationService.notify('budget_limit_changed', {
        userId,
        newLimit: monthlyLimit,
        timestamp: new Date().toISOString(),
      });

      return { success: true, result };
    } catch (error) {
      logger.error(`[Facade] Erreur définition budget: ${error.message}`);
      throw error;
    }
  }

  exportTransactionsAsCSV(userId) {
    try {
      const transactions = TransactionRepository.findByUserId(userId);
      let csv = 'Date,Type,Montant,Catégorie,Description\n';

      transactions.forEach((t) => {
        const date = new Date(t.date).toLocaleDateString('fr-CA');
        const type = t.type === 'income' ? 'Revenu' : 'Dépense';
        const category = t.category || 'N/A';
        const description = (t.description || '').replace(/"/g, '""');
        csv += `"${date}","${type}","${t.amount}","${category}","${description}"\n`;
      });

      logger.info(`[Facade] CSV généré: ${transactions.length} transactions`);
      return csv;
    } catch (error) {
      logger.error(`[Facade] Erreur export CSV: ${error.message}`);
      throw error;
    }
  }

  getComprehensiveReport(userId) {
    try {
      const dashboard = this.getDashboardSummary(userId);
      const categoryBreakdown = this.getCategoryBreakdown(userId);
      const transactions = TransactionRepository.findByUserId(userId);

      return {
        generatedAt: new Date().toISOString(),
        summary: dashboard,
        categoryBreakdown,
        transactionCount: transactions.length,
        recentTransactions: transactions.slice(0, 10),
        analysis: {
          averageMonthlyIncome: dashboard ? dashboard.totalIncome : 0,
          averageMonthlyExpense: dashboard ? dashboard.totalExpenses : 0,
          savingsRate: dashboard && dashboard.totalIncome > 0
            ? (((dashboard.totalIncome - dashboard.totalExpenses) / dashboard.totalIncome) * 100).toFixed(2)
            : 0,
        },
      };
    } catch (error) {
      logger.error(`[Facade] Erreur rapport complet: ${error.message}`);
      throw error;
    }
  }
}

BudgetFacade._instance = null;
export default BudgetFacade;