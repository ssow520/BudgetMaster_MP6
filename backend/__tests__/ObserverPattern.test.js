/**
 * Tests pour le pattern Observer
 * Validation des notifications automatiques
 */

import BudgetFacade from '../src/services/BudgetFacade.js';
import NotificationService from '../src/services/notificationService.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('Observer Pattern Notifications Tests', () => {
  const testUserId = 'observer-test-' + Date.now();
  let facade;
  let notificationService;
  let notifications = [];

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    notificationService = NotificationService.getInstance();

    // Nettoyer
    try {
      const transactions = TransactionRepository.findByUserId(testUserId);
      transactions.forEach(t => {
        TransactionRepository.delete(testUserId, t.id);
      });
    } catch (e) {
      // Pas de données
    }

    // Réinitialiser les notifications
    notifications = [];

    // Enregistrer un observateur
    notificationService.subscribe((notification) => {
      notifications.push(notification);
    });
  });

  afterEach(() => {
    // Nettoyer les observateurs
    notificationService.clearSubscribers();
    notifications = [];
  });

  describe('Transaction Added Notifications', () => {
    test('notification envoyée lors de l\'ajout d\'une transaction', async () => {
      const transactionsBefore = notifications.length;

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 50,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      expect(notifications.length).toBeGreaterThan(transactionsBefore);
      const lastNotif = notifications[notifications.length - 1];
      expect(lastNotif.type).toBe('transaction_added');
    });

    test('notification contient les détails corrects', async () => {
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 75,
        category: 'Food',
        description: 'Dinner',
        date: new Date().toISOString()
      });

      const transactionNotif = notifications.find(n => n.type === 'transaction_added');
      expect(transactionNotif).toBeDefined();
      expect(transactionNotif.data.amount).toBe(75);
      expect(transactionNotif.data.category).toBe('Food');
    });
  });

  describe('Budget Overage Notifications', () => {
    test('notification de dépassement budgétaire', async () => {
      // Définir budget de 100
      await facade.setMonthlyBudgetLimit(testUserId, 100);

      // Ajouter dépense de 80
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 80,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      // Ajouter dépense de 30 (total 110 > 100)
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 30,
        category: 'Transport',
        description: 'Gas',
        date: new Date().toISOString()
      });

      // Vérifier notification de dépassement
      const overageNotif = notifications.find(n => n.type === 'budget_exceeded');
      expect(overageNotif).toBeDefined();
      expect(overageNotif.data.totalExpenses).toBe(110);
      expect(overageNotif.data.budgetLimit).toBe(100);
    });

    test('pas de notification si budget non dépassé', async () => {
      // Définir budget de 500
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      // Ajouter petite dépense
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 50,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      // Vérifier pas de notification de dépassement
      const overageNotif = notifications.find(n => n.type === 'budget_exceeded');
      expect(overageNotif).toBeUndefined();
    });

    test('notification précise du pourcentage de dépassement', async () => {
      // Définir budget de 100
      await facade.setMonthlyBudgetLimit(testUserId, 100);

      // Ajouter dépense de 150 (50% de dépassement)
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 150,
        category: 'Rent',
        description: 'Rent',
        date: new Date().toISOString()
      });

      const overageNotif = notifications.find(n => n.type === 'budget_exceeded');
      expect(overageNotif).toBeDefined();
      expect(overageNotif.data.percentageExceeded).toBe(50);
    });
  });

  describe('Transaction Update Notifications', () => {
    test('notification envoyée lors de la modification d\'une transaction', async () => {
      const result = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 50,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      const notificationsBefore = notifications.length;

      // Modifier la transaction
      await facade.updateTransactionWithNotifications(testUserId, result.transaction.id, {
        amount: 75
      });

      expect(notifications.length).toBeGreaterThan(notificationsBefore);
      const updateNotif = notifications.find(n => n.type === 'transaction_updated');
      expect(updateNotif).toBeDefined();
    });

    test('notification de modification contient montant ancien et nouveau', async () => {
      const result = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 50,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      // Réinitialiser pour vérifier la notification de modification
      notifications = [];

      // Modifier la transaction
      await facade.updateTransactionWithNotifications(testUserId, result.transaction.id, {
        amount: 100
      });

      const updateNotif = notifications.find(n => n.type === 'transaction_updated');
      expect(updateNotif.data.oldAmount).toBe(50);
      expect(updateNotif.data.newAmount).toBe(100);
    });
  });

  describe('Transaction Delete Notifications', () => {
    test('notification envoyée lors de la suppression', async () => {
      const result = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 75,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      notifications = [];

      // Supprimer
      await facade.deleteTransactionWithNotifications(testUserId, result.transaction.id);

      const deleteNotif = notifications.find(n => n.type === 'transaction_deleted');
      expect(deleteNotif).toBeDefined();
      expect(deleteNotif.data.amount).toBe(75);
    });
  });

  describe('Budget Limit Change Notifications', () => {
    test('notification lors du changement de limite budgétaire', async () => {
      const notificationsBefore = notifications.length;

      // Définir budget
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      expect(notifications.length).toBeGreaterThan(notificationsBefore);
      const budgetNotif = notifications.find(n => n.type === 'budget_limit_changed');
      expect(budgetNotif).toBeDefined();
      expect(budgetNotif.data.newLimit).toBe(500);
    });

    test('notification contient ancienne et nouvelle limite', async () => {
      // Définir budget initial
      await facade.setMonthlyBudgetLimit(testUserId, 300);

      notifications = [];

      // Changer la limite
      await facade.setMonthlyBudgetLimit(testUserId, 500);

      const budgetNotif = notifications.find(n => n.type === 'budget_limit_changed');
      expect(budgetNotif.data.oldLimit).toBe(300);
      expect(budgetNotif.data.newLimit).toBe(500);
    });
  });

  describe('Multiple Notifications', () => {
    test('scénario complexe avec multiples notifications', async () => {
      // Ajouter revenu
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'income',
        amount: 1000,
        category: 'Salary',
        description: 'Salary',
        date: new Date().toISOString()
      });

      const notifAfterIncome = notifications.length;

      // Définir budget
      await facade.setMonthlyBudgetLimit(testUserId, 200);

      const notifAfterBudget = notifications.length;
      expect(notifAfterBudget).toBeGreaterThan(notifAfterIncome);

      // Ajouter dépense normale
      const expense1 = await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 100,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      const notifAfterExpense1 = notifications.length;

      // Ajouter dépense qui dépasse le budget
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 150,
        category: 'Rent',
        description: 'Rent',
        date: new Date().toISOString()
      });

      const notifAfterExpense2 = notifications.length;

      // Vérifier que nouvelle notification a été envoyée (dépassement)
      expect(notifAfterExpense2).toBeGreaterThan(notifAfterExpense1);

      // Vérifier qu'une notification de dépassement existe
      const overageNotif = notifications.find(n => n.type === 'budget_exceeded');
      expect(overageNotif).toBeDefined();

      // Vérifier total des notifications
      expect(notifications.length).toBeGreaterThanOrEqual(5); // income, budget_limit_changed, transaction_added (x2), budget_exceeded
    });
  });

  describe('Notification Ordering', () => {
    test('notifications en ordre chronologique', async () => {
      const startTime = Date.now();

      // Ajouter plusieurs transactions avec délai minimal
      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 10,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 20,
        category: 'Food',
        description: 'Lunch',
        date: new Date().toISOString()
      });

      // Vérifier que notifications sont en ordre
      const timestamps = notifications
        .filter(n => n.type === 'transaction_added')
        .map(n => n.timestamp || 0);

      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
      }
    });
  });

  describe('Subscriber Management', () => {
    test('enregistrer un observateur', () => {
      const customNotifications = [];
      const subscriber = (notif) => customNotifications.push(notif);

      notificationService.subscribe(subscriber);

      expect(notificationService.subscribers.length).toBeGreaterThan(0);
    });

    test('retirer un observateur', () => {
      const subscriber = () => {};
      notificationService.subscribe(subscriber);
      const countBefore = notificationService.subscribers.length;

      notificationService.unsubscribe(subscriber);
      const countAfter = notificationService.subscribers.length;

      expect(countAfter).toBeLessThan(countBefore);
    });

    test('vider tous les observateurs', () => {
      notificationService.subscribe(() => {});
      notificationService.subscribe(() => {});

      notificationService.clearSubscribers();

      expect(notificationService.subscribers.length).toBe(0);
    });
  });
});
