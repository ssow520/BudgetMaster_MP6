import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('BudgetFacade', () => {
  const testUserId = 'test-user-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    const transactions = TransactionRepository.findByUserId(testUserId);
    transactions.forEach(t => TransactionRepository.delete(t.id));
  });

  describe('addTransactionWithNotifications', () => {
    test('devrait ajouter une transaction et retourner le budget mis à jour', async () => {
      const result = await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salaire mensuel',
        date: new Date().toISOString()
      });

      expect(result.transaction).toBeDefined();
      expect(result.transaction.amount).toBe(1000);
      expect(result.budget).toBeDefined();
      expect(result.isOverBudget).toBe(false);
    });

    test('devrait notifier si le budget est dépassé', async () => {
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      const result = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 600,
        category: 'Food',
        description: 'Épicerie',
        date: new Date().toISOString()
      });

      expect(result.isOverBudget).toBe(true);
    });
  });

  describe('getDashboardSummary', () => {
    test('devrait retourner un résumé avec revenus, dépenses et solde', async () => {
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 2000,
        category: 'Salary',
        description: 'Salaire mensuel',
        date: new Date().toISOString()
      });

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 500,
        category: 'Rent',
        description: 'Loyer',
        date: new Date().toISOString()
      });

      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.totalIncome).toBe(2000);
      expect(summary.totalExpenses).toBe(500);
      expect(summary.balance).toBe(1500);
      expect(summary.recommendations).toBeDefined();
    });

    test('devrait calculer le solde correctement avec plusieurs transactions', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 200, category: 'Bonus', description: 'Bonus', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 300, category: 'Rent', description: 'Loyer', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 150, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });

      const summary = await facade.getDashboardSummary(testUserId);

      expect(summary.totalIncome).toBe(1200);
      expect(summary.totalExpenses).toBe(450);
      expect(summary.balance).toBe(750);
    });
  });

  describe('getCategoryBreakdown', () => {
    test('devrait retourner la répartition des dépenses par catégorie', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 500, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 500, category: 'Rent', description: 'Loyer', date: new Date().toISOString() });

      const breakdown = await facade.getCategoryBreakdown(testUserId);

      expect(breakdown.length).toBe(2);
      expect(breakdown[0].percentage).toBe('50.00');
      expect(breakdown[1].percentage).toBe('50.00');
    });
  });

  describe('getFilteredTransactions', () => {
    beforeEach(async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: '2026-03-10' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 300, category: 'Food', description: 'Épicerie', date: '2026-03-15' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 200, category: 'Transport', description: 'Essence', date: '2026-03-18' });
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

    test('devrait trier par date décroissante par défaut', async () => {
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
        description: 'Salaire mensuel',
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
      expect(result.success).toBe(true);
    });

    test('devrait rejeter les budgets négatifs', async () => {
      expect(() => facade.setMonthlyBudgetLimit(testUserId, -100)).toThrow();
    });

    test('devrait rejeter le budget zéro', async () => {
      expect(() => facade.setMonthlyBudgetLimit(testUserId, 0)).toThrow();
    });
  });

  describe('getComprehensiveReport', () => {
    test('devrait générer un rapport complet', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 2000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 500, category: 'Rent', description: 'Loyer', date: new Date().toISOString() });

      const report = await facade.getComprehensiveReport(testUserId);

      expect(report.generatedAt).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.summary.totalIncome).toBe(2000);
      expect(report.summary.totalExpenses).toBe(500);
      expect(report.categoryBreakdown).toBeDefined();
      expect(report.transactionCount).toBe(2);
      expect(report.analysis).toBeDefined();
      expect(report.analysis.savingsRate).toBe('75.00');
    });
  });

  describe('updateTransactionWithNotifications', () => {
    test('devrait mettre à jour une transaction', async () => {
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Épicerie',
        date: new Date().toISOString()
      });

      const result2 = await facade.updateTransactionWithNotifications(testUserId, result1.transaction.id, { amount: 150 });

      expect(result2.transaction.amount).toBe(150);
    });
  });

  describe('deleteTransactionWithNotifications', () => {
    test('devrait supprimer une transaction', async () => {
      const result1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Épicerie',
        date: new Date().toISOString()
      });

      const result2 = await facade.deleteTransactionWithNotifications(testUserId, result1.transaction.id);
      expect(result2.success).toBe(true);
    });
  });
});