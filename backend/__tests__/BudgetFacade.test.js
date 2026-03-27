/**
 * Tests pour BudgetFacade
 * Teste la Façade Pattern et l'intégration des services
 */

import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionService from '../src/services/transactionService.js';
import BudgetService from '../src/services/budgetService.js';
import UserRepository from '../src/repositories/userRepository.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('BudgetFacade', () => {
  const testUserId = 'test-user-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    
    // Nettoyer les données de test
    try {
      const allTransactions = TransactionRepository.findByUserId(testUserId);
      allTransactions.forEach(t => {
        TransactionRepository.delete(testUserId, t.id);
      });
    } catch (e) {
      // Utilisateur n'existe pas encore
    }
  });

  describe('addTransactionWithNotifications', () => {
    test('devrait ajouter une transaction et retourner le budget mis à jour', async () => {
      const transactionData = {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date().toISOString()
      };

      const result = await facade.addTransactionWithNotifications(testUserId, transactionData);

      expect(result.transaction).toBeDefined();
      expect(result.transaction.amount).toBe(1000);
      expect(result.budget).toBeDefined();
      expect(result.budget.totalIncome).toBe(1000);
      expect(result.isOverBudget).toBe(false);
    });

    test('devrait notifier si le budget est dépassé', async () => {
      // D'abord définir un budget bas
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      // Ajouter une dépense qui le dépasse
      const transactionData = {
        type: 'expense',
        amount: 600,
        category: 'Food',
        description: 'Groceries',
        date: new Date().toISOString()
      };

      const result = await facade.addTransactionWithNotifications(testUserId, transactionData);

      expect(result.isOverBudget).toBe(true);
      expect(result.budget.totalExpenses).toBe(600);
    });
  });

  describe('getDashboardSummary', () => {
    test('devrait retourner un résumé avec revenus, dépenses et solde', async () => {
      // Ajouter un revenu
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 2000,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date().toISOString()
      });

      // Ajouter une dépense
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 500,
        category: 'Rent',
        description: 'Rent payment',
        date: new Date().toISOString()
      });

      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.totalIncome).toBe(2000);
      expect(summary.totalExpenses).toBe(500);
      expect(summary.balance).toBe(1500);
      expect(summary.indicator).toBe('good');
      expect(summary.recommendations).toBeDefined();
    });

    test('devrait calculer le solde correctement avec plusieurs transactions', async () => {
      const transactions = [
        { type: 'income', amount: 1000, category: 'Salary', description: 'Salary', date: new Date().toISOString() },
        { type: 'income', amount: 200, category: 'Bonus', description: 'Bonus', date: new Date().toISOString() },
        { type: 'expense', amount: 300, category: 'Rent', description: 'Rent', date: new Date().toISOString() },
        { type: 'expense', amount: 150, category: 'Food', description: 'Groceries', date: new Date().toISOString() }
      ];

      for (const transaction of transactions) {
        await facade.addTransactionWithNotifications(testUserId, transaction);
      }

      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.totalIncome).toBe(1200);
      expect(summary.totalExpenses).toBe(450);
      expect(summary.balance).toBe(750);
    });
  });

  describe('getCategoryBreakdown', () => {
    test('devrait retourner la répartition des dépenses par catégorie', async () => {
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 500,
        category: 'Food',
        description: 'Groceries',
        date: new Date().toISOString()
      });

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 500,
        category: 'Rent',
        description: 'Rent',
        date: new Date().toISOString()
      });

      const breakdown = await facade.getCategoryBreakdown(testUserId);

      expect(breakdown.length).toBe(2);
      expect(breakdown[0].amount).toBe(500);
      expect(breakdown[0].percentage).toBe('50.00');
      expect(breakdown[1].amount).toBe(500);
      expect(breakdown[1].percentage).toBe('50.00');
    });
  });

  describe('getFilteredTransactions', () => {
    beforeEach(async () => {
      // Ajouter différentes transactions pour tester les filtres
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Monthly salary',
        date: '2026-03-10'
      });

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 300,
        category: 'Food',
        description: 'Groceries',
        date: '2026-03-15'
      });

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 200,
        category: 'Transport',
        description: 'Fuel',
        date: '2026-03-18'
      });
    });

    test('devrait filtrer les transactions par type', async () => {
      const result = await facade.getFilteredTransactions(testUserId, { type: 'expense' });

      expect(result.length).toBe(2);
      expect(result.every(t => t.type === 'expense')).toBe(true);
    });

    test('devrait filtrer les transactions par catégorie', async () => {
      const result = await facade.getFilteredTransactions(testUserId, { category: 'Food' });

      expect(result.length).toBe(1);
      expect(result[0].category).toBe('Food');
    });

    test('devrait trier les transactions par date (plus récent en premier)', async () => {
      const result = await facade.getFilteredTransactions(testUserId, {});

      expect(new Date(result[0].date) >= new Date(result[1].date)).toBe(true);
    });
  });

  describe('exportTransactionsAsCSV', () => {
    test('devrait générer un CSV valide', async () => {
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date().toISOString()
      });

      const csv = await facade.exportTransactionsAsCSV(testUserId);

      expect(csv).toContain('Date,Type,Montant,Catégorie,Description');
      expect(csv).toContain('Revenu');
      expect(csv).toContain('1000');
      expect(csv).toContain('Salary');
    });
  });

  describe('setMonthlyBudgetLimit', () => {
    test('devrait définir le budget mensuel', async () => {
      const result = await facade.setMonthlyBudgetLimit(testUserId, 2000);

      expect(result).toBeDefined();
      const summary = await facade.getDashboardSummary(testUserId);
      expect(summary.monthlyLimit).toBe(2000);
    });

    test('devrait rejeter les budgets négatifs', async () => {
      await expect(
        facade.setMonthlyBudgetLimit(testUserId, -100)
      ).rejects.toThrow();
    });

    test('devrait rejeter les budgets zéro', async () => {
      await expect(
        facade.setMonthlyBudgetLimit(testUserId, 0)
      ).rejects.toThrow();
    });
  });

  describe('getComprehensiveReport', () => {
    test('devrait générer un rapport complet', async () => {
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 2000,
        category: 'Salary',
        description: 'Monthly salary',
        date: new Date().toISOString()
      });

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 500,
        category: 'Rent',
        description: 'Rent',
        date: new Date().toISOString()
      });

      const report = await facade.getComprehensiveReport(testUserId);

      expect(report.generatedAt).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.summary.totalIncome).toBe(2000);
      expect(report.summary.totalExpenses).toBe(500);
      expect(report.categoryBreakdown).toBeDefined();
      expect(report.transactionCount).toBe(2);
      expect(report.analysis.savingsRate).toBe('75.00');
    });
  });

  describe('updateTransactionWithNotifications', () => {
    test('devrait mettre à jour une transaction et recalculer le budget', async () => {
      // Créer une transaction
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        date: new Date().toISOString()
      });

      const transactionId = result1.transaction.id;

      // Mettre à jour
      const result2 = await facade.updateTransactionWithNotifications(testUserId, transactionId, {
        amount: 150
      });

      expect(result2.transaction.amount).toBe(150);
      expect(result2.budget.totalExpenses).toBe(150);
    });
  });

  describe('deleteTransactionWithNotifications', () => {
    test('devrait supprimer une transaction et recalculer le budget', async () => {
      // Créer une transaction
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Groceries',
        date: new Date().toISOString()
      });

      const transactionId = result1.transaction.id;

      // Supprimer
      const result2 = await facade.deleteTransactionWithNotifications(testUserId, transactionId);

      expect(result2.budget.totalExpenses).toBe(0);
    });
  });
});
