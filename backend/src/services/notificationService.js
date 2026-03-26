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
 logger.warn(
 `[BUDGET ALERT] Dépense enregistrée: ${transaction.amount} pour ${userId}`
);

      }
}
      }
        }

        class NotificationService {
        constructor() {
      this.observable = new Observable();

this.observable.attach(new LoggingObserver());
this.observable.attach(new BudgetAlertObserver());
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

getObserverCount() {
  return this.observable.getObserverCount();
   }
   }

  const notificationService = new NotificationService();

  export default notificationService;