/**
 * Pattern Observer
 * Permet à plusieurs objets de s'enregistrer pour recevoir des notifications
 * lorsque des événements se produisent
 */

class Observer {
  /**
   * Appelé quand un événement est déclenché
   * @param {string} eventType - Type d'événement
   * @param {Object} data - Données associées à l'événement
   */
  update(eventType, data) {
    throw new Error('update() doit être implémentée par les sous-classes');
  }
}

/**
 * Gérant d'événements observable
 * Permet aux observateurs de s'enregistrer et de recevoir des notifications
 */
class Observable {
  constructor() {
    this.observers = [];
  }

  /**
   * Ajoute un observateur
   * @param {Observer} observer
   */
  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log(`[Observable] Observer attaché. Total: ${this.observers.length}`);
    }
  }

  /**
   * Retire un observateur
   * @param {Observer} observer
   */
  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`[Observable] Observer détaché. Total: ${this.observers.length}`);
    }
  }

  /**
   * Notifie tous les observateurs
   * @param {string} eventType - Type d'événement
   * @param {Object} data - Données
   */
  notify(eventType, data) {
    this.observers.forEach((observer) => {
      observer.update(eventType, data);
    });
  }

  /**
   * Obtient le nombre d'observateurs attachés
   */
  getObserverCount() {
    return this.observers.length;
  }
}

export { Observer, Observable };
