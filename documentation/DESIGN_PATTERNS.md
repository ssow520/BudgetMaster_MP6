# Patrons de Conception — BudgetMaster

Ce document explique les trois patrons implémentés dans BudgetMaster, pourquoi on les a choisis et comment ils fonctionnent concrètement dans le code.

---

## 1. Singleton

### Le concept

Une seule instance de la classe existe dans toute l'application. Peu importe combien de fois on appelle `new MaClasse()` ou `MaClasse.getInstance()`, on obtient toujours le même objet.

### Pourquoi on en avait besoin

Sans Singleton, `loadDatabase()` faisait `fs.readFileSync()` à chaque appel. Pour un simple `register`, ça représentait 3 lectures disque consécutives. De plus, deux modules qui chargent le fichier séparément peuvent se retrouver avec des versions différentes des données.

### Database — le cas le plus important

```javascript
class Database {
  constructor() {
    if (Database._instance) return Database._instance;
    this._data = this._readFromDisk();
    Database._instance = this;
    console.log('[Database] Singleton instancié — données chargées en mémoire');
  }

  static getInstance() {
    if (!Database._instance) new Database();
    return Database._instance;
  }

  getData() { return this._data; }

  setData(newData) {
    this._data = newData;
    this._writeToDisk();
  }
}

export function loadDatabase() { return Database.getInstance().getData(); }
export function saveDatabase(data) { Database.getInstance().setData(data); }
```

Résultat : après le démarrage du serveur, toutes les lectures viennent de la RAM. Zéro I/O disque sauf pour les écritures. Tous les repositories partagent le même état — plus de désynchronisation possible.

### AuthService

```javascript
class AuthService {
  constructor() {
    if (AuthService.instance) return AuthService.instance;
    this.saltRounds = 10;
    AuthService.instance = this;
  }

  static getInstance() {
    if (!AuthService.instance) new AuthService();
    return AuthService.instance;
  }

  async register(userData) { ... }
  async login(email, password) { ... }
  verifyToken(token) { ... }
}

const authService = new AuthService();
export default authService;
```

Le `saltRounds` à 10 doit rester constant pour que les hash soient comparables entre eux. Le secret JWT doit être le même pour toute la durée de vie du serveur. Le Singleton garantit ça naturellement.

### Même patron appliqué à

`BudgetService`, `TransactionService`, `UserService`, `NotificationService`, `BudgetFacade` — tous suivent le même modèle.

### Points d'attention

Les tests doivent réinitialiser `Database._instance = null` entre les suites pour repartir proprement. C'est géré dans le `beforeEach` de `database.test.js`.

---

## 2. Façade

### Le concept

Une interface simple devant un système complexe. Le code qui appelle la façade n'a pas besoin de savoir comment les sous-systèmes fonctionnent en interne.

### BudgetFacade — côté backend

Sans façade, chaque contrôleur devrait orchestrer `TransactionService`, `BudgetService` et `NotificationService` séparément. Le risque : oublier d'envoyer la notification dans un contrôleur, ou recalculer le budget dans un ordre différent.

```javascript
class BudgetFacade {
  addTransactionWithNotifications(userId, transactionData) {
    // 1. Créer la transaction
    const result = TransactionService.create(userId, transactionData);
    
    // 2. Recalculer le budget
    const budget = BudgetService.getSummary(userId).summary;
    
    // 3. Notifier si dépassement
    const isOverBudget = budget.monthlyBudgetLimit > 0 
      && budget.totalExpense > budget.monthlyBudgetLimit;
    
    if (isOverBudget) {
      notificationService.notify('budget_exceeded', { userId, ... });
    }

    return { transaction: result.transaction, budget, isOverBudget };
  }

  getDashboardSummary(userId) { ... }
  getFilteredTransactions(userId, filters) { ... }
  getCategoryBreakdown(userId) { ... }
  setMonthlyBudgetLimit(userId, limit) { ... }
  exportTransactionsAsCSV(userId) { ... }
  getComprehensiveReport(userId) { ... }
}
```

Les contrôleurs font juste ça :

```javascript
export const addTransaction = async (req, res) => {
  const result = BudgetFacade.getInstance()
    .addTransactionWithNotifications(req.user.userId, req.body);
  res.json(result);
};
```

### ApiClient — côté frontend

```javascript
class ApiClient {
  constructor() {
    this.client = axios.create({ baseURL: 'http://localhost:3001/api' });

    // Ajoute automatiquement le token JWT à chaque requête
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async get(endpoint) { ... }
  async post(endpoint, data) { ... }
  async put(endpoint, data) { ... }
  async delete(endpoint) { ... }
}
```

Sans cette façade, chaque composant React devrait gérer manuellement le header Authorization, les erreurs 401, la base URL. Avec la façade, c'est juste `apiClient.post('/transactions', data)`.

---

## 3. Observer

### Le concept

Un objet (Observable) maintient une liste d'abonnés (Observers) et les notifie automatiquement quand quelque chose se passe. Les observateurs ne se connaissent pas entre eux, et l'Observable ne sait pas ce qu'ils vont faire avec la notification.

### L'implémentation de base

```javascript
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
    }
  }

  detach(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(eventType, data) {
    this.observers.forEach(observer => observer.update(eventType, data));
  }
}
```

### Les observateurs concrets

```javascript
class LoggingObserver extends Observer {
  update(eventType, data) {
    logger.info(`[EVENT] ${eventType}`, data);
  }
}

class BudgetAlertObserver extends Observer {
  update(eventType, data) {
    if (eventType === 'transaction.added' && data.transaction.type === 'expense') {
      logger.warn(`[BUDGET ALERT] Dépense enregistrée: ${data.transaction.amount}`);
    }
  }
}
```

`LoggingObserver` et `BudgetAlertObserver` héritent tous les deux de `Observer` et redéfinissent `update()` différemment — c'est du polymorphisme.

### NotificationService

```javascript
class NotificationService {
  constructor() {
    if (NotificationService._instance) return NotificationService._instance;
    this.observable = new Observable();
    this.observable.attach(new LoggingObserver());
    this.observable.attach(new BudgetAlertObserver());
    NotificationService._instance = this;
  }

  notify(eventType, data) {
    this.observable.notify(eventType, data);
  }

  subscribe(observer) {
    this.observable.attach(observer);
  }

  clearSubscribers() {
    this.observable.observers = [];
    this.observable.attach(new LoggingObserver());
    this.observable.attach(new BudgetAlertObserver());
  }
}
```

### Ce qui se passe quand on ajoute une transaction

```
1. BudgetFacade.addTransactionWithNotifications() appelé

2. TransactionService.create() — transaction sauvegardée

3. notificationService.notify('transaction.added', { transaction, userId })

4. Observable.notify() déclenche update() sur chaque observateur :
   ├── LoggingObserver → log l'événement
   └── BudgetAlertObserver → alerte si dépense

5. Si budget dépassé → notificationService.notify('budget_exceeded', { ... })
```

### Événements disponibles

```javascript
export const EVENT_TYPES = {
  TRANSACTION_ADDED:   'transaction.added',
  TRANSACTION_UPDATED: 'transaction.updated',
  TRANSACTION_DELETED: 'transaction.deleted',
  BUDGET_EXCEEDED:     'budget.exceeded',
  USER_REGISTERED:     'user.registered',
  USER_LOGIN:          'user.login',
};
```

### Ajouter un nouvel observateur

Si on voulait ajouter un `EmailObserver` demain, on n'a pas à toucher à `NotificationService` ni aux services existants :

```javascript
class EmailObserver extends Observer {
  update(eventType, data) {
    if (eventType === 'budget.exceeded') {
      // envoyer un email d'alerte
    }
  }
}

notificationService.subscribe(new EmailObserver());
```

C'est le principe Ouvert/Fermé (OCP) de SOLID en pratique.

---

## Résumé des trois patrons

**Singleton** — garantit qu'une classe n'a qu'une seule instance. Utilisé pour Database, AuthService et tous les services backend. Évite les incohérences de données et les configurations dupliquées.

**Façade** — simplifie l'accès à un sous-système complexe. BudgetFacade côté backend, ApiClient côté frontend. Les contrôleurs et composants n'ont pas à orchestrer plusieurs services manuellement.

**Observer** — notifie automatiquement des abonnés quand un événement survient. Découple les services qui génèrent des événements de ceux qui y réagissent. Facile d'étendre sans modifier le code existant.

---

## Tests

```bash
npm test -w backend
```

Les trois patrons sont couverts par les tests Jest :

- `database.test.js` — Singleton Database (12 tests)
- `authService.test.js` — Singleton AuthService (12 tests)
- `BudgetFacade.test.js` — Façade (tests d'intégration)
- `ObserverPattern.test.js` — Observer et notifications

Résultat : **86/86 tests passent**.

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026
**Dernière mise à jour :** 2026-03-29 — Phase III