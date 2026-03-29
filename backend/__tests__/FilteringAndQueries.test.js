import BudgetFacade from '../src/services/BudgetFacade.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('Filtering and Query Tests', () => {
  const testUserId = 'filter-test-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    const transactions = TransactionRepository.findByUserId(testUserId);
    transactions.forEach(t => TransactionRepository.delete(t.id));
  });

  describe('Filter by Type', () => {
    test('filtrer par type income', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 500, category: 'Bonus', description: 'Bonus', date: '2026-03-05' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 200, category: 'Food', description: 'Épicerie', date: '2026-03-06' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-07' });

      const filtered = await facade.getFilteredTransactions(testUserId, { type: 'income' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'income')).toBe(true);
    });

    test('filtrer par type expense', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 200, category: 'Food', description: 'Épicerie', date: '2026-03-06' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-07' });

      const filtered = await facade.getFilteredTransactions(testUserId, { type: 'expense' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'expense')).toBe(true);
    });
  });

  describe('Filter by Category', () => {
    test('filtrer par catégorie Food', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 30, category: 'Food', description: 'Déjeuner', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 50, category: 'Food', description: 'Épicerie', date: '2026-03-02' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-03' });

      const filtered = await facade.getFilteredTransactions(testUserId, { category: 'Food' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.category === 'Food')).toBe(true);
    });

    test('filtrer par catégorie inexistante retourne zéro résultat', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 30, category: 'Food', description: 'Déjeuner', date: '2026-03-01' });

      const filtered = await facade.getFilteredTransactions(testUserId, { category: 'Entertainment' });

      expect(filtered.length).toBe(0);
    });
  });

  describe('Filter by Date Range', () => {
    test('filtrer par plage de dates', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 50, category: 'Food', description: 'Déjeuner', date: '2026-02-28' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-05' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 150, category: 'Rent', description: 'Loyer', date: '2026-03-15' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 75, category: 'Food', description: 'Déjeuner', date: '2026-04-01' });

      const filtered = await facade.getFilteredTransactions(testUserId, { startDate: '2026-03-01', endDate: '2026-03-31' });

      expect(filtered.length).toBe(2);
      expect(filtered.some(t => t.amount === 100)).toBe(true);
      expect(filtered.some(t => t.amount === 150)).toBe(true);
    });

    test('filtrer avec date de début seulement', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 50, category: 'Food', description: 'Déjeuner', date: '2026-02-28' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-05' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 150, category: 'Rent', description: 'Loyer', date: '2026-03-15' });

      const filtered = await facade.getFilteredTransactions(testUserId, { startDate: '2026-03-01' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => new Date(t.date) >= new Date('2026-03-01'))).toBe(true);
    });
  });

  describe('Combined Filters', () => {
    test('filtrer par type ET catégorie', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 50, category: 'Food', description: 'Déjeuner', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Food', description: 'Épicerie', date: '2026-03-02' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 200, category: 'Transport', description: 'Essence', date: '2026-03-03' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Food', description: 'Invalide', date: '2026-03-04' });

      const filtered = await facade.getFilteredTransactions(testUserId, { type: 'expense', category: 'Food' });

      expect(filtered.length).toBe(2);
      expect(filtered.every(t => t.type === 'expense' && t.category === 'Food')).toBe(true);
    });
  });

  describe('Sorting', () => {
    test('trier par montant croissant', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 150, category: 'Rent', description: 'Loyer', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 30, category: 'Food', description: 'Déjeuner', date: '2026-03-02' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-03' });

      const filtered = await facade.getFilteredTransactions(testUserId, { sortBy: 'amount', sortOrder: 'asc' });

      expect(filtered[0].amount).toBe(30);
      expect(filtered[1].amount).toBe(100);
      expect(filtered[2].amount).toBe(150);
    });

    test('trier par montant décroissant', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 30, category: 'Food', description: 'Déjeuner', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 150, category: 'Rent', description: 'Loyer', date: '2026-03-02' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-03' });

      const filtered = await facade.getFilteredTransactions(testUserId, { sortBy: 'amount', sortOrder: 'desc' });

      expect(filtered[0].amount).toBe(150);
      expect(filtered[1].amount).toBe(100);
      expect(filtered[2].amount).toBe(30);
    });
  });

  describe('Edge Cases', () => {
    test('aucun filtre retourne toutes les transactions', async () => {
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 50, category: 'Food', description: 'Déjeuner', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'income', amount: 1000, category: 'Salary', description: 'Salaire', date: '2026-03-01' });
      await facade.addTransactionWithNotifications(testUserId, { type: 'expense', amount: 100, category: 'Transport', description: 'Essence', date: '2026-03-02' });

      const filtered = await facade.getFilteredTransactions(testUserId, {});

      expect(filtered.length).toBe(3);
    });

    test('utilisateur sans transactions retourne tableau vide', async () => {
      const filtered = await facade.getFilteredTransactions(testUserId, { type: 'expense' });
      expect(filtered.length).toBe(0);
    });
  });
});