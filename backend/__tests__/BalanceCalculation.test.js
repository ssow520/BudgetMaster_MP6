/**
 * Tests pour le calcul du solde
 * Validation de la logique métier de calcul budgétaire
 */

import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('Budget Calculation Tests', () => {
  const testUserId = 'balance-test-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    
    // Nettoyer les données
    try {
      const transactions = TransactionRepository.findByUserId(testUserId);
      transactions.forEach(t => {
        TransactionRepository.delete(testUserId, t.id);
      });
    } catch (e) {
      // Pas de données
    }
  });

  describe('Balance Calculation', () => {
    test('solde initial devrait être 0', async () => {
      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.totalIncome).toBe(0);
      expect(summary.totalExpenses).toBe(0);
      expect(summary.balance).toBe(0);
    });

    test('solde = total revenus - total dépenses', async () => {
      const transactions = [
        { type: 'income', amount: 1000, category: 'Salary', description: 'Salary', date: new Date().toISOString() },
        { type: 'income', amount: 500, category: 'Bonus', description: 'Bonus', date: new Date().toISOString() },
        { type: 'expense', amount: 200, category: 'Food', description: 'Groceries', date: new Date().toISOString() },
        { type: 'expense', amount: 150, category: 'Transport', description: 'Gas', date: new Date().toISOString() }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const summary = await facade.getDashboardSummary(testUserId);

      // totalIncome = 1000 + 500 = 1500
      // totalExpenses = 200 + 150 = 350
      // balance = 1500 - 350 = 1150
      expect(summary.totalIncome).toBe(1500);
      expect(summary.totalExpenses).toBe(350);
      expect(summary.balance).toBe(1150);
    });

    test('solde négatif quand dépenses > revenus', async () => {
      const transactions = [
        { type: 'income', amount: 500, category: 'Salary', description: 'Salary', date: new Date().toISOString() },
        { type: 'expense', amount: 800, category: 'Rent', description: 'Rent', date: new Date().toISOString() }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.totalIncome).toBe(500);
      expect(summary.totalExpenses).toBe(800);
      expect(summary.balance).toBe(-300);
      expect(summary.indicator).toBe('poor');
    });

    test('solde positif avec bon ratio dépenses/revenus', async () => {
      const transactions = [
        { type: 'income', amount: 3000, category: 'Salary', description: 'Salary', date: new Date().toISOString() },
        { type: 'expense', amount: 500, category: 'Rent', description: 'Rent', date: new Date().toISOString() },
        { type: 'expense', amount: 200, category: 'Food', description: 'Food', date: new Date().toISOString() }
      ];

      for (const trans of transactions) {
        await facade.addTransactionWithNotifications(testUserId, trans);
      }

      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.balance).toBe(2300);
      expect(summary.indicator).toBe('good');
    });

    test('mise à jour du solde après suppression de transaction', async () => {
      // Ajouter 2 transactions
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salary',
        date: new Date().toISOString()
      });

      const result2 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 300,
        category: 'Food',
        description: 'Food',
        date: new Date().toISOString()
      });

      // Vérifier le solde
      let summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(700);

      // Supprimer la dépense
      await facade.deleteTransactionWithNotifications(testUserId, result2.transaction.id);

      // Vérifier que le solde est mis à jour
      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalExpenses).toBe(0);
      expect(summary.balance).toBe(1000);
    });

    test('mise à jour du solde après modification de montant', async () => {
      // Ajouter une dépense
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salary',
        date: new Date().toISOString()
      });

      let summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(1000);

      // Modifier le montant
      await facade.updateTransactionWithNotifications(testUserId, result1.transaction.id, {
        amount: 1500
      });

      // Vérifier le solde
      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalIncome).toBe(1500);
      expect(summary.balance).toBe(1500);
    });
  });

  describe('Budget Limit Validation', () => {
    test('devrait détecter dépassement de budget', async () => {
      // Définir budget de 500
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      // Ajouter une dépense de 300 (OK)
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 300,
        category: 'Food',
        description: 'Food',
        date: new Date().toISOString()
      });

      expect(result1.isOverBudget).toBe(false);

      // Ajouter une dépense de 250 (Dépassement)
      const result2 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 250,
        category: 'Rent',
        description: 'Rent',
        date: new Date().toISOString()
      });

      expect(result2.isOverBudget).toBe(true);
      expect(result2.budget.totalExpenses).toBe(550);
    });

    test('revenu ne devrait pas compter dans le budget de dépenses', async () => {
      // Définir budget de 500 (pour dépenses)
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      // Ajouter un gros revenu (ne compte pas)
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 10000,
        category: 'Lottery',
        description: 'Lottery',
        date: new Date().toISOString()
      });

      expect(result1.isOverBudget).toBe(false);

      // Ajouter une petite dépense
      const result2 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Food',
        date: new Date().toISOString()
      });

      expect(result2.isOverBudget).toBe(false);
    });
  });

  describe('Multiple Operations', () => {
    test('scénario complet avec multiples opérations', async () => {
      // Étape 1: Budget initial
      let summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(0);

      // Étape 2: Ajouter revenu
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 2000,
        category: 'Salary',
        description: 'Monthly salary',
        date: '2026-03-01'
      });

      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(2000);

      // Étape 3: Ajouter dépenses
      const expenses = [
        { amount: 500, category: 'Rent', description: 'Rent', date: '2026-03-05' },
        { amount: 200, category: 'Food', description: 'Groceries', date: '2026-03-10' },
        { amount: 100, category: 'Transport', description: 'Gas', date: '2026-03-15' }
      ];

      for (const exp of expenses) {
        await facade.addTransactionWithNotifications(testUserId, {
          type: 'expense',
          ...exp
        });
      }

      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalExpenses).toBe(800);
      expect(summary.balance).toBe(1200);

      // Étape 4: Ajouter bonus
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 500,
        category: 'Bonus',
        description: 'Performance bonus',
        date: '2026-03-20'
      });

      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalIncome).toBe(2500);
      expect(summary.balance).toBe(1700);

      // Étape 5: Vérifier les catégories
      const breakdown = await facade.getCategoryBreakdown(testUserId);
      expect(breakdown.length).toBe(3); // Rent, Food, Transport
      expect(breakdown.find(b => b.category === 'Rent').percentage).toBe('62.50'); // 500/800
    });
  });
});
