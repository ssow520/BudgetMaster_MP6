import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('Budget Calculation Tests', () => {
  const testUserId = 'balance-test-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    const transactions = TransactionRepository.findByUserId(testUserId);
    transactions.forEach(t => TransactionRepository.delete(t.id));
  });

  describe('Balance Calculation', () => {
    test('solde initial devrait être 0', async () => {
      const summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalIncome).toBe(0);
      expect(summary.totalExpenses).toBe(0);
      expect(summary.balance).toBe(0);
    });

    test('solde = total revenus - total dépenses', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 500, category: 'Bonus', description: 'Bonus', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 200, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 150, category: 'Transport', description: 'Essence', date: new Date().toISOString() });

      const summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalIncome).toBe(1500);
      expect(summary.totalExpenses).toBe(350);
      expect(summary.balance).toBe(1150);
    });

    test('solde négatif quand dépenses > revenus', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 500, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 800, category: 'Rent', description: 'Loyer', date: new Date().toISOString() });

      const summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalIncome).toBe(500);
      expect(summary.totalExpenses).toBe(800);
      expect(summary.balance).toBe(-300);
    });

    test('solde positif avec bon ratio dépenses/revenus', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 3000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 500, category: 'Rent', description: 'Loyer', date: new Date().toISOString() });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 200, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });

      const summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(2300);
    });

    test('solde mis à jour après suppression de transaction', async () => {
      const result1 = await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      const result2 = await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 300, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });

      let summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(700);

      await facade.deleteTransactionWithNotifications(testUserId, result2.transaction.id);

      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalExpenses).toBe(0);
      expect(summary.balance).toBe(1000);
    });

    test('solde mis à jour après modification de transaction', async () => {
      const result1 = await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });

      let summary = await facade.getDashboardSummary(testUserId);
      expect(summary.balance).toBe(1000);

      await facade.updateTransactionWithNotifications(testUserId, result1.transaction.id, { amount: 1500 });

      summary = await facade.getDashboardSummary(testUserId);
      expect(summary.totalIncome).toBe(1500);
      expect(summary.balance).toBe(1500);
    });
  });

  describe('Budget Limit Validation', () => {
    test('détecte dépassement de budget', async () => {
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      const result1 = await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 300, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });
      expect(result1.isOverBudget).toBe(false);

      const result2 = await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 250, category: 'Rent', description: 'Loyer', date: new Date().toISOString() });
      expect(result2.isOverBudget).toBe(true);
    });

    test('revenu ne compte pas dans le budget de dépenses', async () => {
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      const result1 = await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 10000, category: 'Salary', description: 'Salaire', date: new Date().toISOString() });
      expect(result1.isOverBudget).toBe(false);

      const result2 = await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Food', description: 'Épicerie', date: new Date().toISOString() });
      expect(result2.isOverBudget).toBe(false);
    });
  });
});
