# Patrons de Conception - BudgetMaster

Ce document explique en détail les trois patrons de conception implémentés dans BudgetMaster et comment les utiliser.

## 📋 Table des matières

1. [Singleton - AuthService](#singleton)
2. [Façade - APIClient & BudgetService](#façade)
3. [Observer - NotificationService & BudgetContext](#observer)

---

## <a name="singleton"></a>1️⃣ SINGLETON - AuthService

### Concept

Le pattern Singleton garantit qu'une classe n'a **qu'une seule instance** dans l'application, et fournit un point d'accès global à cette instance.

### Utilisation dans BudgetMaster

#### Backend: `src/services/authService.js`

```javascript
// 1. Classe avec vérification d'instance
class AuthService {
  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;  // Retourne l'instance existante
    }
    this.saltRounds = 10;
    AuthService.instance = this;     // Crée l'instance unique
  }

  // Méthodes partagées
  async register(userData) { /* ... */ }
  async login(email, password) { /* ... */ }
  verifyToken(token) { /* ... */ }

  // Getter statique pour l'instance
  static getInstance() {
    if (!AuthService.instance) {
      new AuthService();
    }
    return AuthService.instance;
  }
}

// 2. Créer l'instance unique au chargement du module
const authService = new AuthService();

// 3. Exporter l'instance unique
export default authService;
```

#### Utilisation dans les contrôleurs

```javascript
import authService from '../services/authService.js';

export const login = async (req, res) => {
  // Utiliser l'instance unique - aucune new AuthService()
  const result = await authService.login(email, password);
  res.json(result);
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

✅ **État partagé**: Tous les contrôleurs partagent le même instance  
✅ **Performance**: Une seule instance en mémoire  
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
- Difficile à tester en isolation (peut nécessiter un reset entre tests)
- Peut créer un couplage fort

---

## <a name="façade"></a>2️⃣ FAÇADE - APIClient & BudgetService

### Concept

Le pattern Façade fournit une **interface simplifiée** à un ensemble de classes complexes. Il masque la complexité interne et expose seulement ce qui est nécessaire.

### Utilisation dans BudgetMaster

#### Frontend: APIClient - `src/services/api/apiClient.js`

**Problème sans Façade:**
```javascript
// Complexe et répétitif
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
  // Gestion d'erreur complexe...
}
```

**Solution avec Façade:**
```javascript
class APIClient {
  constructor() {
    // Configuration axios une seule fois
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });

    // Intercepteurs automatiques
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

  // Interface simplifiée
  async get(endpoint, config) {
    // Tout géré automatiquement!
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
// Tout est géré automatiquement!
const result = await apiClient.post('/auth/login', { email, password });

if (result.success) {
  // Traiter les données
}
```

#### Backend: BudgetService - `src/services/budgetService.js`

**Problème sans Façade:**
```javascript
// Utiliser plusieurs repositories manuellement
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
const budgetRemaining = Math.max(0, user.monthlyBudgetLimit - totalExpense);
const indicator = balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'balanced';

// Répétitif et complexe...
```

**Solution avec Façade:**
```javascript
class BudgetService {
  // Une méthode simple qui gère tout
  static getSummary(userId) {
    const user = UserRepository.findById(userId);
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Calculs délégués aux repositories
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
        budgetRemaining: Math.max(0, user.monthlyBudgetLimit - totalExpense),
        isOverBudget: totalExpense > user.monthlyBudgetLimit,
      }
    };
  }

  // Autres méthodes qui regroupent des opérations complexes
  static getCategoryBreakdown(userId) { /* ... */ }
  static getRecommendations(userId) { /* ... */ }
  static getComprehensiveReport(userId) { /* ... */ }
}
```

**Utilisation dans le contrôleur:**
```javascript
export const getSummary = (req, res) => {
  // Une seule ligne!
  const result = BudgetService.getSummary(req.user.userId);
  res.json(result);
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
// Sans Façade - Complexe
const summary = await budgetAPI.getSummary();
const breakdown = await budgetAPI.getCategoryBreakdown();
const recommendations = await budgetAPI.getRecommendations();
// 3 requêtes, code dupliqué...

// Avec Façade - Simple
const report = await budgetAPI.getComprehensiveReport();
// 1 requête, tout ensemble!
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
// 1. Interface Observer
class Observer {
  update(eventType, data) {
    throw new Error('update() doit être implémentée');
  }
}

// 2. Observable - Gère les observateurs
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

  // Notifie tous les observateurs
  notify(eventType, data) {
    this.observers.forEach((observer) => {
      observer.update(eventType, data);
    });
  }
}
```

#### Backend: `src/services/notificationService.js`

```javascript
// Observateurs concrets
class LoggingObserver extends Observer {
  update(eventType, data) {
    logger.info(`[EVENT] ${eventType}`, data);  // Log l'événement
  }
}

class BudgetAlertObserver extends Observer {
  update(eventType, data) {
    if (eventType === EVENT_TYPES.TRANSACTION_ADDED) {
      if (data.transaction.type === 'expense') {
        logger.warn(`[BUDGET ALERT] Dépense: ${data.transaction.amount}`);
        // Pourrait envoyer une notification push, email, etc.
      }
    }
  }
}

// Service qui utilise l'Observable
class NotificationService {
  constructor() {
    this.observable = new Observable();
    
    // Attacher les observateurs par défaut
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
// Quand une transaction est créée
static create(userId, transactionData) {
  const transaction = TransactionRepository.create({...});

  // Notifier les observateurs
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
// Même pattern côté client pour les contextes React
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
      
      // Notifier les observateurs
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

  // S'abonner aux changements budgétaires
  useEffect(() => {
    const unsubscribe = subscribe((eventType, data) => {
      console.log('Budget mise à jour!', data);
      // Mettre à jour l'interface
    });

    return unsubscribe;  // Se désabonner au démontage
  }, [subscribe]);

  return <div>{/* Afficher le budget */}</div>;
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
- ❌ Éviter pour logique métier changeante
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
// Test Singleton
test('AuthService singleton', () => {
  const instance1 = AuthService.getInstance();
  const instance2 = AuthService.getInstance();
  expect(instance1).toBe(instance2);
});

// Test Façade
test('APIClient façade', async () => {
  const result = await apiClient.post('/login', data);
  expect(result.success).toBe(true);
  // Token ajouté automatiquement ✅
});

// Test Observer
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

- [Refactoring Guru - Design Patterns](https://refactoring.guru/design-patterns)
- [JavaScript Patterns](https://www.patterns.dev/)
- [Head First Design Patterns](https://www.oreilly.com/library/view/head-first-design/0596007124/)

---

**Équipe**: Souleymane Sow, Moses Kasindi, Ruth Kegmo  
**Session**: H2026  
**Dernière mise à jour**: 2026-02-22
