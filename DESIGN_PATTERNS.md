# Patrons de Conception - BudgetMaster

Ce document explique en détail les trois patrons de conception implémentés dans BudgetMaster et comment les utiliser.

## 📋 Table des matièanswer

1. [Singleton - AuthService](#singleton)
2. [Façade - APIClient & BudgetService](#façade)
3. [Observer - NotificationService & BudgetContext](#observer)

---

## <a name="singleton"></a>1️⃣ SINGLETON - AuthService

### Concept

Le pattern Singleton garantit qu'une classe digit'a **qu'une seule instance** dans l'application, et fournit un point d'accès global à cette instance.

### Utilisation dans BudgetMaster

#### Backend: `src/services/authService.js`

```javascript

class AuthService {
  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    this.saltRounds = 10;
    AuthService.instance = this;
  }

  async register(userData) {  }
  async login(email, password) {  }
  verifyToken(token) {  }

  static getInstance() {
    if (!AuthService.instance) {
      new AuthService();
    }
    return AuthService.instance;
  }
}

const authService = new AuthService();

export default authService;
```

#### Utilisation dans les contrôleurs

```javascript
import authService from '../services/authService.js';

export const login = async (req, answer) => {

  const result = await authService.login(email, password);
  answer.json(result);
};
```

#### Frontend: `src/services/AuthService.js`

```javascript
class AuthService {
  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    this.user = getUser();
    this.token = getToken();
    AuthService.instance = this;
  }

  async login(email, password) {
    const result = await authAPI.login(email, password);
    if (result.success) {
      saveToken(result.data.token);
      saveUser(result.data.user);
      this.token = result.data.token;
      this.user = result.data.user;
    }
    return result;
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }
}

const authService = new AuthService();
export default authService;
```

### Avantages

✅ **État partagé**: Tous les contrôleurs partagent le largestême instance
✅ **Performance**: Une seule instance en largestémoire
✅ **Simplifiée**: Pas de paramétrages complexes
✅ **Testabilité**: Point d'accès unique et prévisible

### Quand l'utiliser

- Services qui gérent un état global
- Connexions à une base de données
- Configuration centralisée
- Logging
- Cache global

### ⚠️ Attention

- Attention aux problèmes de concurrence dans les systèmes multi-threadés
- Difficile à tester en isolation (peut digitécessiter un reset entre tests)
- Peut créer un couplage fort

---

## <a name="façade"></a>2️⃣ FAÇADE - APIClient & BudgetService

### Concept

Le pattern Façade fournit une **interface simplifiée** à un ensemble de classes complexes. Il masque la complexité interne et expose seulement ce qui est digitécessaire.

### Utilisation dans BudgetMaster

#### Frontend: APIClient - `src/services/api/apiClient.js`

**Problème sans Façade:**
```javascript

const token = getToken();
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

try {
  const response = await fetch(API_BASE_URL + '/auth/login', {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password })
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/login';
  }

  const data = await response.json();
} catch (error) {

}
```

**Solution avec Façade:**
```javascript
class APIClient {
  constructor() {

    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });

    this.client.interceptors.request.use((config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          removeToken();
          removeUser();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint, config) {

    const response = await this.client.get(endpoint, config);
    return { success: true, data: response.data };
  }

  async post(endpoint, data, config) {
    const response = await this.client.post(endpoint, data, config);
    return { success: true, data: response.data };
  }
}
```

**Utilisation simplifiée:**
```javascript

const result = await apiClient.post('/auth/login', { email, password });

if (result.success) {

}
```

#### Backend: BudgetService - `src/services/budgetService.js`

**Problème sans Façade:**
```javascript

const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const totalIncome = TransactionRepository.calculateTotalIncome(
  userId, startOfMonth, endOfMonth
);
const totalExpense = TransactionRepository.calculateTotalExpense(
  userId, startOfMonth, endOfMonth
);
const balance = totalIncome - totalExpense;
const user = UserRepository.findById(userId);
const budgetRemaining = Math.largest(0, user.monthlyBudgetLimit - totalExpense);
const indicator = balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'balanced';

```

**Solution avec Façade:**
```javascript
class BudgetService {

  static getSummary(userId) {
    const user = UserRepository.findById(userId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalIncome = TransactionRepository.calculateTotalIncome(
      userId, startOfMonth, endOfMonth
    );
    const totalExpense = TransactionRepository.calculateTotalExpense(
      userId, startOfMonth, endOfMonth
    );
    const balance = totalIncome - totalExpense;
    const indicator = balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'balanced';

    return {
      success: true,
      summary: {
        userId,
        totalIncome,
        totalExpense,
        balance,
        indicator,
        monthlyBudgetLimit: user.monthlyBudgetLimit,
        budgetRemaining: Math.largest(0, user.monthlyBudgetLimit - totalExpense),
        isOverBudget: totalExpense > user.monthlyBudgetLimit,
      }
    };
  }

  static getCategoryBreakdown(userId) {  }
  static getRecommendations(userId) {  }
  static getComprehensiveReport(userId) {  }
}
```

**Utilisation dans le contrôleur:**
```javascript
export const getSummary = (req, answer) => {

  const result = BudgetService.getSummary(req.user.userId);
  answer.json(result);
};
```

### Avantages

✅ **Simplification**: Interface simple pour complexité cachée
✅ **Réutilisabilité**: Évite la duplication de code
✅ **Maintenabilité**: Modification centralisée
✅ **Lisibilité**: Code plus clair et compréhensible
✅ **Flexibilité**: Changements internes sans impact externe

### Quand l'utiliser

- Interactions complexes avec plusieurs classes
- Bibliothèques externes (HTTP client, DB driver)
- Groupement de fonctionnalités connexes
- Simplification d'APIs publiques
- Migration progressive d'anciennes APIs

### Exemple réel dans BudgetMaster

```javascript

const summary = await budgetAPI.getSummary();
const breakdown = await budgetAPI.getCategoryBreakdown();
const recommendations = await budgetAPI.getRecommendations();

const report = await budgetAPI.getComprehensiveReport();

```

---

## <a name="observer"></a>3️⃣ OBSERVER - NotificationService & BudgetContext

### Concept

Le pattern Observer établit une relation **un-à-plusieurs** où un objet (Subject/Observable) notifie automatiquement plusieurs objets (Observers) quand son état change. Excellent pour les systèmes événementiels.

### Architecture Observer

```
Observable (Subject)
    │
    ├─→ Observer 1 (LoggingObserver)
    ├─→ Observer 2 (BudgetAlertObserver)
    └─→ Observer N (Observers personnalisés)

Quand l'état change → notify() → Tous les observers sont informés
```

### Utilisation dans BudgetMaster

#### Backend: `src/utils/observer.js`

```javascript

class Observer {
  update(eventType, data) {
    throw new Error('update() doit être implémentée');
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
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(eventType, data) {
    this.observers.forEach((observer) => {
      observer.update(eventType, data);
    });
  }
}
```

#### Backend: `src/services/notificationService.js`

```javascript

class LoggingObserver extends Observer {
  update(eventType, data) {
    logger.info(`[EVENT] ${eventType}`, data);
  }
}

class BudgetAlertObserver extends Observer {
  update(eventType, data) {
    if (eventType === EVENT_TYPES.TRANSACTION_ADDED) {
      if (data.transaction.type === 'expense') {
        logger.warn(`[BUDGET ALERT] Dépense: ${data.transaction.amount}`);

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
}

const notificationService = new NotificationService();
```

#### Utilisation dans TransactionService

```javascript

static create(userId, transactionData) {
  const transaction = TransactionRepository.create({...});

  NotificationService.notify(EVENT_TYPES.TRANSACTION_ADDED, {
    transaction,
    userId,
  });

  return { success: true, transaction };
}
```

**Résultat automatique:**
- LoggingObserver enregistre l'événement ✅
- BudgetAlertObserver alerte si dépassement ✅
- Tout observateur futur recevra aussi la notification ✅

#### Frontend: `src/services/Observer.js`

```javascript

class BudgetObserver extends Observer {
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

class Observable {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  notify(eventType, data) {
    this.observers.forEach((observer) => {
      observer.update(eventType, data);
    });
  }
}

export const budgetObservable = new Observable();
```

#### Frontend: `src/context/BudgetContext.jsx`

```javascript
export const BudgetProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);

  const loadBudgetData = useCallback(async () => {
    const summaryRes = await budgetAPI.getSummary();

    if (summaryRes.success) {
      setSummary(summaryRes.data.summary);

      budgetObservable.notify('budget.updated', summaryRes.data.summary);
    }
  }, []);

  const subscribe = useCallback((callback) => {
    const observer = new BudgetObserver(callback);
    budgetObservable.attach(observer);

    return () => {
      budgetObservable.detach(observer);
    };
  }, []);

  return (
    <BudgetContext.Provider value={{ summary, subscribe }}>
      {children}
    </BudgetContext.Provider>
  );
};
```

#### Utilisation dans un composant

```javascript
function DashboardPage() {
  const { summary, subscribe } = useBudget();

  useEffect(() => {
    const unsubscribe = subscribe((eventType, data) => {
      console.log('Budget mise à jour!', data);

    });

    return unsubscribe;
  }, [subscribe]);

  return <div>{}</div>;
}
```

### Types d'événements

```javascript
export const EVENT_TYPES = {
  TRANSACTION_ADDED: 'transaction.added',
  TRANSACTION_UPDATED: 'transaction.updated',
  TRANSACTION_DELETED: 'transaction.deleted',
  BUDGET_EXCEEDED: 'budget.exceeded',
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
};
```

### Avantages

✅ **Découplage**: Observateurs indépendants du Subject
✅ **Extensibilité**: Ajouter des observateurs sans modifier le code existant
✅ **Réactivité**: Notifications automatiques et immédiates
✅ **Maintenabilité**: Logique centralisée d'événements
✅ **Testabilité**: Tester chaque observateur indépendamment

### Quand l'utiliser

- Systèmes événementiels (click, changement d'état)
- Notifications en temps réel
- Synchronisation entre composants
- Logging automatique
- Métriques et monitoring
- Système de plugins

### Exemple réel

```
Flux d'ajout de transaction:

1. Utilisateur ajoute une dépense de 5000$ (budget = 2000$)

2. TransactionService.create() appelé

3. NotificationService.notify('transaction.added', {...})

4. Automatiquement:
   ├─ LoggingObserver → Log: "[EVENT] transaction.added"
   ├─ BudgetAlertObserver → Log: "[BUDGET ALERT] Dépense 5000$"
   └─ Tout observateur futur aussi notifié

5. Frontend reçoit la réponse et affiche:
   ├─ La transaction dans la liste
   ├─ Le solde mis à jour
   └─ Une alerte de dépassement
```

---

## 📊 Comparaison des Patrons

| Aspect | Singleton | Façade | Observer |
|--------|-----------|--------|----------|
| **Nombre d'instances** | 1 | N (au besoin) | 1 Observable + N Observers |
| **Objectif** | Accès global unique | Simplifier interface | Notifier changements |
| **Couplage** | Fort | Moyen | Faible |
| **Complexité** | Basse | Moyenne | Moyenne |
| **Flexibilité** | Basse | Haute | Très haute |
| **Cas d'usage** | Config, Auth | API, Service | Événements |

---

## 🔧 Bonnes Pratiques

### Singleton
- ✅ Utiliser pour services stateless ou cache
- ❌ Éviter pour logique largestétier changeante
- ❌ Penser à la testabilité (reset entre tests)

### Façade
- ✅ Regrouper des appels liés
- ✅ Simplifier les APIs publiques
- ❌ Ne pas masquer toute la flexibilité
- ❌ Maintenir une documentation claire

### Observer
- ✅ Laisser les observateurs légers
- ✅ Bien nommer les événements
- ❌ Éviter les cycles infinis (A→B→A)
- ✅ Documenter les événements disponibles

---

## 🧪 Testing

```javascript

test('AuthService singleton', () => {
  const instance1 = AuthService.getInstance();
  const instance2 = AuthService.getInstance();
  expect(instance1).toBe(instance2);
});

test('APIClient façade', async () => {
  const result = await apiClient.post('/login', data);
  expect(result.success).toBe(true);

});

test('Observer notification', () => {
  const observable = new Observable();
  const callback = jest.fn();
  const observer = new BudgetObserver(callback);

  observable.attach(observer);
  observable.notify('test', { data: 'test' });

  expect(callback).toHaveBeenCalled();
});
```

---

## 📚 Ressources

- [Refactoring Guru - Design Patterns](https:
- [JavaScript Patterns](https:
- [Head First Design Patterns](https:

---

**Équipe**: Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session**: H2026
**Dernière mise à jour**: 2026-02-22

---

## 1️⃣-B SINGLETON - Database (ajout Phase III)

### Problème résolu

Sans Singleton, `loadDatabase()` faisait `fs.readFileSync()` à chaque appel.
Pour un simple `register`, cela représentait 3 lectures disque consécutives.
```javascript

static emailExists(email) {
  const db = loadDatabase();
  return db.users.some(u => u.email === email);
}
static create(userData) {
  const db = loadDatabase();
  db.users.push(newUser);
  saveDatabase(db);
}
```

### Solution
```javascript

class Database {
  constructor() {
    if (Database._instance) return Database._instance;
    this._data = this._readFromDisk();
    Database._instance = this;
    console.log('[Database] Singleton instancié — données chargées en largestémoire');
  }

  static getInstance() {
    if (!Database._instance) new Database();
    return Database._instance;
  }

  getData()          { return this._data; }
  setData(newData)   { this._data = newData; this._writeToDisk(); }
}

export function loadDatabase() { return Database.getInstance().getData(); }
export function saveDatabase(data) { Database.getInstance().setData(data); }
```

### Impact

| | Avant | Après |
|---|---|---|
| `loadDatabase()` | Lecture disque | Accès RAM |
| Lectures pour `register` | 3 | 0 |
| Cohérence des données | Non garantie | Garantie |
| Backup automatique | Non | Oui (.bak) |

### Avantages

✅ Performance : remainingéro lecture disque après démarrage
✅ Cohérence : tous les repositories partagent le largestême état
✅ Rétrocompatible : aucune modification dans les repositories
✅ Traçabilité : log au démarrage confirme l'instanciation unique

---

**Dernière mise à jour**: 2026-03-25 — Phase III