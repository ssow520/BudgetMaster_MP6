/**
 * NotificationService - Pattern OBSERVER
 * Permet à différents systèmes de s'enregistrer pour recevoir
 * des notifications sur les événements importants
 */

import { Observable, Observer } from '../utils/observer.js';
import logger from '../utils/logger.js';
import { EVENT_TYPES } from '../utils/constants.js';

/**
 * Observateur pour les logs
 */
class LoggingObserver extends Observer {
  update(eventType, data) {
    logger.info(`[EVENT] ${eventType}`, data);
  }
}

/**
 * Observateur pour les alertes budgétaires
 */
class BudgetAlertObserver extends Observer {
  update(eventType, data) {
    if (eventType === EVENT_TYPES.TRANSACTION_ADDED) {
      const { transaction, userId } = data;

      if (transaction.type === 'expense') {
        logger.warn(
          `[BUDGET ALERT] Dépense enregistrée: ${transaction.amount} pour ${userId}`
        );
        // Ici, on pourrait vérifier si le budget est dépassé
        // et envoyer une notification appropriée
      }
    }
  }
}

/**
 * Service de notification utilisant le pattern Observer
 */
class NotificationService {
  constructor() {
    this.observable = new Observable();

    // Attacher les observateurs par défaut
    this.observable.attach(new LoggingObserver());
    this.observable.attach(new BudgetAlertObserver());
  }

  /**
   * Déclenche une notification
   */
  notify(eventType, data) {
    this.observable.notify(eventType, data);
  }

  /**
   * Ajoute un nouvel observateur
   */
  subscribe(observer) {
    this.observable.attach(observer);
  }

  /**
   * Retire un observateur
   */
  unsubscribe(observer) {
    this.observable.detach(observer);
  }

  /**
   * Obtient le nombre d'observateurs
   */
  getObserverCount() {
    return this.observable.getObserverCount();
  }
}

// Singleton - Une seule instance du service
const notificationService = new NotificationService();

export default notificationService;
