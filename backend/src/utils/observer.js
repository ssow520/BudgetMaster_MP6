class Observer {
  update(eventType, data) {
    throw new Error('update() doit être implémentée par les sous-classes');
  }
}

class Observable {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log(`[Observable] Observer attaché. Total: ${this.observers.length}`);
    }
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log(`[Observable] Observer détaché. Total: ${this.observers.length}`);
    }
  }

  notify(eventType, data) {
    this.observers.forEach((observer) => {
      observer.update(eventType, data);
    });
  }

  getObserverCount() {
    return this.observers.length;
  }
}

export { Observer, Observable };
