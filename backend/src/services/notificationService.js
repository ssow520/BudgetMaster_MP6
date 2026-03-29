import { Observable, Observer } from '../utils/observer.js';
import logger from '../utils/logger.js';
import { EVENT_TYPES } from '../utils/constants.js';

class LoggingObserver extends Observer {
  update(eventType, data) {
    logger.info(`[EVENT] ${eventType}`, data);
  }
}

class BudgetAlertObserver extends Observer {
  update(eventType, data) {
    if (eventType === EVENT_TYPES.TRANSACTION_ADDED) {
      const { transaction, userId } = data;
      if (transaction.type === 'expense') {
        logger.warn(`[BUDGET ALERT] Dépense enregistrée: ${transaction.amount} pour ${userId}`);
      }
    }
  }
}

class NotificationService {
  constructor() {
    if (NotificationService._instance) {
      return NotificationService._instance;
    }
    this.observable = new Observable();
    this.observable.attach(new LoggingObserver());
    this.observable.attach(new BudgetAlertObserver());
    NotificationService._instance = this;
  }

  static getInstance() {
    if (!NotificationService._instance) {
      new NotificationService();
    }
    return NotificationService._instance;
  }

  notify(eventType, data) {
    this.observable.notify(eventType, data);
  }

  subscribe(observer) {
    this.observable.attach(observer);
  }

  unsubscribe(observer) {
    this.observable.detach(observer);
  }

  clearSubscribers() {
    this.observable.observers = [];
    this.observable.attach(new LoggingObserver());
    this.observable.attach(new BudgetAlertObserver());
  }

  getObserverCount() {
    return this.observable.getObserverCount();
  }
}

NotificationService._instance = null;
const notificationService = new NotificationService();
export { NotificationService };
export default notificationService;
