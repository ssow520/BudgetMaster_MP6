import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';
import notificationService from '../src/services/notificationService.js';

describe('BudgetFacade Simple Tests', () => {
  const testUserId = 'simple-test-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    const transactions = TransactionRepository.findByUserId(testUserId);
    transactions.forEach(t => TransactionRepository.delete(t.id));
  });

  describe('Facade Singleton', () => {
    test('retourne la même instance', () => {
      const f1 = BudgetFacade.getInstance();
      const f2 = BudgetFacade.getInstance();
      expect(f1).toBe(f2);
    });

    test('a toutes les méthodes requises', () => {
      const f = BudgetFacade.getInstance();
      expect(typeof f.getDashboardSummary).toBe('function');

      expect(typeof f.getFilteredTransactions).toBe('function');

      expect(typeof f.getCategoryBreakdown).toBe('function');

      expect(typeof f.setMonthlyBudgetLimit).toBe('function');

      expect(typeof f.exportTransactionsAsCSV).toBe('function');

      expect(typeof f.getComprehensiveReport).toBe('function');

      expect(typeof f.addTransactionWithNotifications).toBe('function');

      expect(typeof f.deleteTransactionWithNotifications).toBe('function');

      expect(typeof f.updateTransactionWithNotifications).toBe('function');
    });
  });

  describe('Dashboard Summary', () => {
    test('retourne un résumé pour utilisateur vide', () => {
      const summary = facade.getDashboardSummary(testUserId);

      expect(summary).toBeDefined();

      expect(summary.totalIncome).toBeDefined();

      expect(summary.totalExpenses).toBeDefined();

      expect(summary.balance).toBeDefined();
    });

    test('contient toutes les clés requises', () => {
      const summary = facade.getDashboardSummary(testUserId);

      expect(summary).toHaveProperty('totalIncome');

      expect(summary).toHaveProperty('totalExpenses');

      expect(summary).toHaveProperty('balance');

      expect(summary).toHaveProperty('indicator');

      expect(summary).toHaveProperty('monthlyLimit');

      expect(summary).toHaveProperty('lastUpdated');
    });
  });

  describe('Category Breakdown', () => {
    test('retourne un tableau', () => {
      const breakdown = facade.getCategoryBreakdown(testUserId);
      expect(Array.isArray(breakdown)).toBe(true);
    });

    test('structure correcte si données présentes', () => {
      TransactionRepository.create({
        userId: testUserId,
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Épicerie',
        date: new Date().toISOString(),
      });

      const breakdown = facade.getCategoryBreakdown(testUserId);

      expect(breakdown.length).toBeGreaterThan(0);

      expect(breakdown[0]).toHaveProperty('category');

      expect(breakdown[0]).toHaveProperty('amount');

      expect(breakdown[0]).toHaveProperty('percentage');
    });
  });

  describe('CSV Export', () => {
    test('retourne une chaîne CSV', () => {
      const csv = facade.exportTransactionsAsCSV(testUserId);
      expect(typeof csv).toBe('string');
      expect(csv).toContain('Date,Type,Montant');
    });

    test('CSV contient les données', () => {
      TransactionRepository.create({
        userId: testUserId,
        type: 'expense',
        amount: 25.50,
        category: 'Food',
        description: 'Déjeuner',
        date: new Date().toISOString(),
      });

      const csv = facade.exportTransactionsAsCSV(testUserId);
      expect(csv).toContain('Dépense');
      expect(csv).toContain('25.5');
    });
  });

  describe('Comprehensive Report', () => {
    test('retourne un rapport avec toutes les sections', () => {
      const report = facade.getComprehensiveReport(testUserId);

      expect(report).toBeDefined();

      expect(report.generatedAt).toBeDefined();

      expect(report.summary).toBeDefined();

      expect(report.categoryBreakdown).toBeDefined();

      expect(report.transactionCount).toBeDefined();

      expect(report.recentTransactions).toBeDefined();

      expect(report.analysis).toBeDefined();
    });

    test('analyse contient les bons champs', () => {
      const report = facade.getComprehensiveReport(testUserId);

      expect(report.analysis).toHaveProperty('averageMonthlyIncome');

      expect(report.analysis).toHaveProperty('averageMonthlyExpense');

      expect(report.analysis).toHaveProperty('savingsRate');
    });
  });

  describe('Monthly Budget Limit', () => {
    test('accepte un montant positif', () => {
      const result = facade.setMonthlyBudgetLimit(testUserId, 500);
      expect(result.success).toBe(true);
    });

    test('rejette un montant zéro', () => {
      expect(() => facade.setMonthlyBudgetLimit(testUserId, 0)).toThrow();
    });

    test('rejette un montant négatif', () => {
      expect(() => facade.setMonthlyBudgetLimit(testUserId, -100)).toThrow();
    });
  });

  describe('Notifications', () => {
    test('notificationService est disponible', () => {
      expect(notificationService).toBeDefined();

      expect(typeof notificationService.notify).toBe('function');
      
      expect(typeof notificationService.subscribe).toBe('function');
    });
  });

  describe('Data Integration', () => {
    test('transactions ajoutées directement sont visibles', () => {
      TransactionRepository.create({
        userId: testUserId,
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salaire',
        date: new Date().toISOString(),
      });

      const filtered = facade.getFilteredTransactions(testUserId, {});
      expect(filtered.length).toBeGreaterThan(0);
    });

    test('résumé reflète les transactions', () => {
      TransactionRepository.create({
        userId: testUserId,
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Déjeuner',
        date: new Date().toISOString(),
      });

      const summary = facade.getDashboardSummary(testUserId);
      expect(summary.totalExpenses).toBeGreaterThanOrEqual(100);
    });
  });
});
