/**
 * Tests pour le filtrage et les requêtes
 * Validation des performances et précision des filtres
 */

import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('Filtering and Query Tests', () => {
  const testUserId = 'filter-test-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();

    // Nettoyer
    try {
      const transactions = TransactionRepository.findByUserId(testUserId);
      transactions.forEach(t => {
        TransactionRepository.delete(testUserId, t.id);
      });
    } catch (e) {
      // Pas de données
    }
  });

  describe('Filter by Type', () => {
    test('filtrer par type income', async () => {
      const transactions = [
        { type: 'income', amount: 1000, category: 'Salary', description: 'Salary', date: '2026-03-01' },
        { type: 'income', amount: 500, category: 'Bonus', description: 'Bonus', date: '2026-03-05' },
        { type: 'expense', amount: 200, category: 'Food', description: 'Food', date: '2026-03-06' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-07' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, { type: 'income' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'income')).toBe(true);
      expect(filtered[0].amount + filtered[1].amount).toBe(1500);
    });

    test('filtrer par type expense', async () => {
      const transactions = [
        { type: 'income', amount: 1000, category: 'Salary', description: 'Salary', date: '2026-03-01' },
        { type: 'expense', amount: 200, category: 'Food', description: 'Food', date: '2026-03-06' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-07' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, { type: 'expense' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'expense')).toBe(true);
      expect(filtered[0].amount + filtered[1].amount).toBe(300);
    });
  });

  describe('Filter by Category', () => {
    test('filtrer par catégorie Food', async () => {
      const transactions = [
        { type: 'expense', amount: 30, category: 'Food', description: 'Lunch', date: '2026-03-01' },
        { type: 'expense', amount: 50, category: 'Food', description: 'Groceries', date: '2026-03-02' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-03' },
        { type: 'expense', amount: 200, category: 'Rent', description: 'Rent', date: '2026-03-04' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, { category: 'Food' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.category === 'Food')).toBe(true);
      expect(filtered[0].amount + filtered[1].amount).toBe(80);
    });

    test('filtrer par catégorie avec zéro résultat', async () => {
      const transactions = [
        { type: 'expense', amount: 30, category: 'Food', description: 'Lunch', date: '2026-03-01' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-03' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, { category: 'Entertainment' });

      expect(filtered.length).toBe(0);
    });
  });

  describe('Filter by Date Range', () => {
    test('filtrer par plage de dates', async () => {
      const transactions = [
        { type: 'expense', amount: 50, category: 'Food', description: 'Lunch', date: '2026-02-28' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-05' },
        { type: 'expense', amount: 150, category: 'Rent', description: 'Rent', date: '2026-03-15' },
        { type: 'expense', amount: 75, category: 'Food', description: 'Lunch', date: '2026-04-01' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        startDate: '2026-03-01',
        endDate: '2026-03-31'
      });

      expect(filtered.length).toBe(2);
      expect(filtered.some(t => t.amount === 100)).toBe(true);
      expect(filtered.some(t => t.amount === 150)).toBe(true);
    });

    test('filtrer avec date de début seulement', async () => {
      const transactions = [
        { type: 'expense', amount: 50, category: 'Food', description: 'Lunch', date: '2026-02-28' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-05' },
        { type: 'expense', amount: 150, category: 'Rent', description: 'Rent', date: '2026-03-15' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        startDate: '2026-03-01'
      });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => new Date(t.date) >= new Date('2026-03-01'))).toBe(true);
    });
  });

  describe('Combined Filters', () => {
    test('filtrer par type ET catégorie', async () => {
      const transactions = [
        { type: 'expense', amount: 50, category: 'Food', description: 'Lunch', date: '2026-03-01' },
        { type: 'expense', amount: 100, category: 'Food', description: 'Groceries', date: '2026-03-02' },
        { type: 'expense', amount: 200, category: 'Transport', description: 'Gas', date: '2026-03-03' },
        { type: 'income', amount: 1000, category: 'Food', description: 'Invalid', date: '2026-03-04' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        type: 'expense',
        category: 'Food'
      });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'expense' && t.category === 'Food')).toBe(true);
      expect(filtered[0].amount + filtered[1].amount).toBe(150);
    });

    test('filtrer par type, catégorie ET date', async () => {
      const transactions = [
        { type: 'expense', amount: 50, category: 'Food', description: 'Lunch', date: '2026-02-20' },
        { type: 'expense', amount: 100, category: 'Food', description: 'Groceries', date: '2026-03-05' },
        { type: 'expense', amount: 200, category: 'Transport', description: 'Gas', date: '2026-03-06' },
        { type: 'expense', amount: 75, category: 'Food', description: 'Lunch', date: '2026-03-15' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        type: 'expense',
        category: 'Food',
        startDate: '2026-03-01',
        endDate: '2026-03-31'
      });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'expense' && t.category === 'Food')).toBe(true);
    });
  });

  describe('Sorting', () => {
    test('trier par montant croissant', async () => {
      const transactions = [
        { type: 'expense', amount: 150, category: 'Rent', description: 'Rent', date: '2026-03-01' },
        { type: 'expense', amount: 30, category: 'Food', description: 'Lunch', date: '2026-03-02' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-03' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        sortBy: 'amount',
        sortOrder: 'asc'
      });

      expect(filtered[0].amount).toBe(30);
      expect(filtered[1].amount).toBe(100);
      expect(filtered[2].amount).toBe(150);
    });

    test('trier par montant décroissant', async () => {
      const transactions = [
        { type: 'expense', amount: 30, category: 'Food', description: 'Lunch', date: '2026-03-01' },
        { type: 'expense', amount: 150, category: 'Rent', description: 'Rent', date: '2026-03-02' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-03' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        sortBy: 'amount',
        sortOrder: 'desc'
      });

      expect(filtered[0].amount).toBe(150);
      expect(filtered[1].amount).toBe(100);
      expect(filtered[2].amount).toBe(30);
    });

    test('trier par date croissante', async () => {
      const transactions = [
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-15' },
        { type: 'expense', amount: 30, category: 'Food', description: 'Lunch', date: '2026-03-05' },
        { type: 'expense', amount: 150, category: 'Rent', description: 'Rent', date: '2026-03-10' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        sortBy: 'date',
        sortOrder: 'asc'
      });

      expect(new Date(filtered[0].date) <= new Date(filtered[1].date)).toBe(true);
      expect(new Date(filtered[1].date) <= new Date(filtered[2].date)).toBe(true);
    });
  });

  describe('Empty and Edge Cases', () => {
    test('requête sans aucun filtre devrait retourner toutes les transactions', async () => {
      const transactions = [
        { type: 'expense', amount: 50, category: 'Food', description: 'Lunch', date: '2026-03-01' },
        { type: 'income', amount: 1000, category: 'Salary', description: 'Salary', date: '2026-03-01' },
        { type: 'expense', amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-02' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {});

      expect(filtered.length).toBe(3);
    });

    test('requête sur utilisateur sans transactions', async () => {
      const filtered = await facade.getFilteredTransactions(testUserId, {
        type: 'expense'
      });

      expect(filtered.length).toBe(0);
    });

    test('pagination avec limit et offset', async () => {
      const transactions = [
        { type: 'expense', amount: 10, category: 'Food', description: 'Lunch', date: '2026-03-01' },
        { type: 'expense', amount: 20, category: 'Food', description: 'Lunch', date: '2026-03-02' },
        { type: 'expense', amount: 30, category: 'Food', description: 'Lunch', date: '2026-03-03' },
        { type: 'expense', amount: 40, category: 'Food', description: 'Lunch', date: '2026-03-04' },
        { type: 'expense', amount: 50, category: 'Food', description: 'Lunch', date: '2026-03-05' }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const filtered = await facade.getFilteredTransactions(testUserId, {
        limit: 2,
        offset: 1
      });

      expect(filtered.length).toBe(2);
    });
  });
});
