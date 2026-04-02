import BudgetFacade from '../src/services/BudgetFacade.js';
import notificationService, { NotificationService } from '../src/services/notificationService.js';
import { Observer } from '../src/utils/observer.js';
import TransactionRepository from '../src/repositories/transactionRepository.js';

describe('Observer Pattern Notifications Tests', () => {
  const testUserId = 'observer-test-' + Date.now();
  let facade;

  beforeEach(() => {
    facade = BudgetFacade.getInstance();
    const transactions = TransactionRepository.findByUserId(testUserId);
    transactions.forEach(t => TransactionRepository.delete(t.id));
    notificationService.clearSubscribers();
  });

  afterEach(() => {
    notificationService.clearSubscribers();
  });

  describe('Transaction Added Notifications', () => {
    test('notification envoyée lors de l\'ajout d\'une transaction', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 50,
        category: 'Food',
        description: 'Déjeuner',
        date: new Date().toISOString()
      });

      expect(received.length).toBeGreaterThan(0);
    });

    test('notification contient les détails de la transaction', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      await facade.addTransactionWithNotifications(testUserId, {
        type: 'expense',
        amount: 75,
        category: 'Food',
        description: 'Dîner',
        date: new Date().toISOString()
      });

      const transactionNotif = received.find(n => n.eventType === 'transaction.added');

      expect(transactionNotif).toBeDefined();

      expect(transactionNotif.data.transaction.amount).toBe(75);
    });
  });

  describe('Budget Overage Notifications', () => {
    test('notification de dépassement budgétaire', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      await facade.setMonthlyBudgetLimit(testUserId, 100);
      await facade.addTransactionWithNotifications(testUserId, { 
        type: 'expense', 
        amount: 80, 
        category: 'Food', 
        description: 'Déjeuner', 
        date: new Date().toISOString() 
      });
      await facade.addTransactionWithNotifications(testUserId, { 
        type: 'expense', 
        amount: 30, 
        category: 'Transport', 
        description: 'Essence', 
        date: new Date().toISOString() 
      });

      const overageNotif = received.find(n => n.eventType === 'budget_exceeded');

      expect(overageNotif).toBeDefined();

      expect(overageNotif.data.overage).toBeGreaterThan(0);
    });

    test('pas de notification si budget non dépassé', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      await facade.setMonthlyBudgetLimit(testUserId, 500);
      await facade.addTransactionWithNotifications(testUserId, { 
        type: 'expense', 
        amount: 50, 
        category: 'Food', 
        description: 'Déjeuner', 
        date: new Date().toISOString() 
      });

      const overageNotif = received.find(n => n.eventType === 'budget_exceeded');
      expect(overageNotif).toBeUndefined();
    });
  });

  describe('Transaction Update Notifications', () => {
    test('notification envoyée lors de la modification', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      const result = await facade.addTransactionWithNotifications(testUserId, { 
        type: 'expense', 
        amount: 50, 
        category: 'Food', 
        description: 'Déjeuner', 
        date: new Date().toISOString() 
      });
      await facade.updateTransactionWithNotifications(testUserId, result.transaction.id, { 
        amount: 75 
      });

      const updateNotif = received.find(n => n.eventType === 'transaction_updated');
      expect(updateNotif).toBeDefined();
    });
  });

  describe('Transaction Delete Notifications', () => {
    test('notification envoyée lors de la suppression', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      const result = await facade.addTransactionWithNotifications(testUserId, { 
        type: 'expense', 
        amount: 75, 
        category: 'Food', 
        description: 'Déjeuner', 
        date: new Date().toISOString() 
      });
      await facade.deleteTransactionWithNotifications(testUserId, result.transaction.id);

      const deleteNotif = received.find(n => n.eventType === 'transaction_deleted');
      expect(deleteNotif).toBeDefined();
    });
  });

  describe('Budget Limit Change Notifications', () => {
    test('notification lors du changement de limite budgétaire', async () => {
      const received = [];

      class TestObserver extends Observer {
        update(eventType, data) {
          received.push({ eventType, data });
        }
      }

      notificationService.subscribe(new TestObserver());

      await facade.setMonthlyBudgetLimit(testUserId, 500);

      const budgetNotif = received.find(n => n.eventType === 'budget_limit_changed');
      expect(budgetNotif).toBeDefined();
      expect(budgetNotif.data.newLimit).toBe(500);
    });
  });

  describe('Subscriber Management', () => {
    test('enregistrer un observateur augmente le compte', () => {
      const countBefore = notificationService.getObserverCount();

      class TestObserver extends Observer {
        update() {}
      }

      notificationService.subscribe(new TestObserver());
      expect(notificationService.getObserverCount()).toBeGreaterThan(countBefore);
    });

    test('vider les observateurs', () => {
      class TestObserver extends Observer {
        update() {}
      }

      notificationService.subscribe(new TestObserver());
      
      notificationService.clearSubscribers();

      expect(notificationService.getObserverCount()).toBe(2);
    });

    test('notificationService est disponible', () => {
      expect(notificationService).toBeDefined();
      expect(typeof notificationService.notify).toBe('function');
      expect(typeof notificationService.subscribe).toBe('function');
    });
  });

  describe('Facade Singleton', () => {
    test('BudgetFacade retourne la même instance', () => {
      const f1 = BudgetFacade.getInstance();
      const f2 = BudgetFacade.getInstance();
      expect(f1).toBe(f2);
    });

    test('NotificationService retourne la même instance', () => {
      const ns1 = NotificationService.getInstance();
      const ns2 = NotificationService.getInstance();
      expect(ns1).toBe(ns2);
    });
  });
});