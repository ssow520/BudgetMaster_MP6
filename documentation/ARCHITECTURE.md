# Architecture — BudgetMaster

## Vue d'ensemble

BudgetMaster est une application web de gestion budgétaire en architecture client-serveur :

- **Frontend** : React + Vite (port 5173)
- **Backend** : Node.js + Express (port 3001)
- **Stockage** : fichier JSON local (`backend/data/database.json`)
- **Authentification** : JWT (JSON Web Tokens)

---

## Patrons de conception implémentés

### Singleton

Appliqué à : `Database`, `AuthService`, `BudgetService`, `TransactionService`, `UserService`, `NotificationService`, `BudgetFacade`.

Chaque classe expose une méthode statique `getInstance()` et un guard dans le constructeur qui retourne l'instance existante si elle est déjà créée. Le résultat : peu importe combien de fois on appelle `new AuthService()`, on obtient toujours le même objet.

Pour `Database` en particulier, ça garantit que toutes les lectures et écritures passent par le même objet en mémoire — pas de désynchronisation possible entre modules.

### Façade

`BudgetFacade` est le point d'entrée unique pour toutes les opérations complexes du backend. Au lieu que les contrôleurs appellent `TransactionService`, `BudgetService` et `NotificationService` séparément, ils passent tous par la façade. Ça garantit que la notification est toujours envoyée après chaque opération, sans que chaque contrôleur ait à s'en souvenir.

`ApiClient` côté frontend joue un rôle similaire : il centralise toutes les requêtes HTTP, gère le header `Authorization`, et expose une interface simple (`get`, `post`, `put`, `delete`).

### Observer

`NotificationService` maintient une liste d'observateurs. Quand un événement survient (`transaction.added`, `budget_exceeded`, etc.), il appelle `notify()` qui déclenche `update()` sur chaque observateur enregistré.

Deux observateurs concrets : `LoggingObserver` (enregistre dans les logs) et `BudgetAlertObserver` (déclenche une alerte si le budget est dépassé). Tous deux héritent de la classe abstraite `Observer` — c'est du polymorphisme en action.

---

## Architecture en couches — Backend

Le backend est divisé en 4 couches verticales :

**Controllers** (`src/controllers/`) — reçoivent les requêtes HTTP, valident les données d'entrée, appellent les services, retournent les réponses. Ils ne contiennent pas de logique métier.

**Services** (`src/services/`) — contiennent toute la logique métier. C'est ici qu'on orchestre les repositories, qu'on applique les patrons de conception, et qu'on envoie les notifications.

**Repositories** (`src/repositories/`) — accès direct aux données. Toutes les opérations CRUD passent par eux. Ils ne connaissent pas les services.

**Database** (`src/config/database.js`) — Singleton qui charge le fichier JSON une seule fois en mémoire au démarrage et expose `loadDatabase()` / `saveDatabase()`.

**Middleware** (`src/middleware/`) — `authMiddleware.js` vérifie le token JWT sur les routes protégées. `errorHandler.js` intercepte toutes les erreurs et retourne une réponse formatée.

---

## Architecture en couches — Frontend

**Pages** (`src/pages/`) — composants de haut niveau associés à une route. Ils orchestrent les composants enfants et appellent les services.

**Composants** (`src/components/`) — composants réutilisables (`Navbar`, `TransactionForm`, `SummaryComponent`, etc.).

**Contexts** (`src/context/`) — `AuthContext` gère la session utilisateur (token JWT, données user, expiration 30 min). `BudgetContext` gère l'état du budget partagé entre composants.

**Services** (`src/services/`) — `ApiClient` (Singleton + Façade) centralise les appels HTTP. `authService` gère register/login côté frontend.

---

## Flux de données

### Authentification

L'utilisateur remplit le formulaire de connexion. `authService.login()` envoie `POST /api/auth/login`. Le backend vérifie le mot de passe avec bcryptjs, génère un token JWT et le retourne. Le frontend sauvegarde le token dans `localStorage` avec un `loginTime`. `AuthContext` est mis à jour et `Navbar` affiche le nom de l'utilisateur. Après 30 minutes, la session expire automatiquement.

### Ajout d'une transaction

`TransactionForm` soumet le formulaire. `DashboardPage` appelle `apiClient.post('/transactions', data)` avec le token JWT en header. Le backend passe par `authMiddleware` qui vérifie le token, puis par `transactionController` qui délègue à `BudgetFacade.addTransactionWithNotifications()`. La façade crée la transaction via `TransactionService`, recalcule le budget via `BudgetService`, et notifie via `NotificationService`. La réponse revient au frontend qui recharge le dashboard.

---

## Structures de données

### User
```javascript
{
  id: "uuid",
  firstName: "Prénom",
  lastName: "Nom",
  email: "user@example.com",
  password: "hash_bcrypt",
  monthlyBudgetLimit: 2000,
  createdAt: "2026-03-29T...",
  updatedAt: "2026-03-29T..."
}
```

### Transaction
```javascript
{
  id: "uuid",
  userId: "uuid",
  type: "income" | "expense",
  amount: 150.50,
  category: "Alimentation",
  frequency: "once",
  description: "Épicerie",
  date: "2026-03-29T...",
  createdAt: "2026-03-29T...",
  updatedAt: "2026-03-29T..."
}
```

### Budget Summary
```javascript
{
  totalIncome: 3000,
  totalExpenses: 1200,
  balance: 1800,
  indicator: "positive",
  monthlyLimit: 2000,
  recommendations: [],
  lastUpdated: "2026-03-29T..."
}
```

---

## Sécurité

Côté backend, les mots de passe sont hashés avec bcryptjs (saltRounds: 10). Les tokens JWT expirent après 24h. Toutes les routes de transactions et budget sont protégées par `authMiddleware`. Chaque repository filtre les données par `userId` — un utilisateur ne peut pas accéder aux transactions d'un autre.

Côté frontend, le token est stocké dans `localStorage`. La session expire après 30 minutes d'inactivité (géré par `Navbar` via `setTimeout`). Les pages protégées sont enveloppées dans `ProtectedRoute`.

---

## Tests

Les tests sont dans deux dossiers :

`backend/src/__tests__/` — tests de Souleymane :
- `database.test.js` — 12 tests sur le Singleton Database
- `authService.test.js` — 12 tests sur le Singleton AuthService, bcrypt et JWT

`backend/__tests__/` — tests de Ruth :
- `BudgetFacade.test.js` — façade et intégration des services
- `BudgetFacade.simple.test.js` — tests simplifiés de la façade
- `BalanceCalculation.test.js` — calcul du solde
- `FilteringAndQueries.test.js` — filtres et tri des transactions
- `ObserverPattern.test.js` — patron Observer et notifications

Lancer tous les tests :
```bash
npm test -w backend
```

Résultat : **86/86 tests passent**.

---

## Conventions de codage

Les fonctions utilisent `camelCase`, les classes `PascalCase`, les constantes `UPPER_SNAKE_CASE`. Les fichiers JS suivent `camelCase.js`, les composants React `PascalCase.jsx`.

Chaque fichier commence par les imports et termine par l'export. La gestion d'erreurs est explicite avec try/catch dans tous les services. Les logs passent par `logger.js` — jamais de `console.log` direct dans le code de production.

Messages de commit :
```
[FEATURE] Description courte
[BUGFIX] Description courte
[REFACTOR] Description courte
[DOCS] Description courte
```

---

## Évolutions prévues

Migration de JSON vers une vraie base de données (MongoDB ou PostgreSQL). Pagination côté serveur pour les listes de transactions. Graphiques avec Chart.js. Notifications push. Export PDF en plus du CSV.

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026
**Dernière mise à jour :** 2026-03-29 — Phase III