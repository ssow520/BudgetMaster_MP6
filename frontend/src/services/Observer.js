/**
 * Pattern Observer - Côté Client
 * Permet aux composants de s'abonner aux changements budgétaires
 */

/**
 * Observateur - Interface de base
 */
export class Observer {
  update(eventType, data) {
    throw new Error('update() doit être implémentée');
  }
}

/**
 * Observateur concrète pour les mises à jour budgétaires
 */
export class BudgetObserver extends Observer {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  update(eventType, data) {
    if (this.callback) {
      this.callback(eventType, data);
    }
  }
}

/**
 * Observable - Gère les abonnés
 */
export class Observable {
  constructor() {
    this.observers = [];
  }

  /**
   * Ajoute un observateur
   */
  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * Retire un observateur
   */
  detach(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  /**
   * Notifie tous les observateurs
   */
  notify(eventType, data) {
    this.observers.forEach((observer) => {
      observer.update(eventType, data);
    });
  }
}

// Singleton - Instance globale pour les événements budgétaires
export const budgetObservable = new Observable();
