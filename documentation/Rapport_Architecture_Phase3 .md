# Architecture Détaillée - BudgetMaster

## Vue d'ensemble

BudgetMaster est une application web complète de gestion budgétaire utilisant une architecture moderne :

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de données**: JSON 
- **Authentification**: JWT (JSON Web Tokens)

## Patrons de Conception Implémentés

### 1. **SINGLETON (Mono-instance)**

#### Utilisation: AuthService

**Frontend** (`src/services/AuthService.js`)

**Backend** (`src/services/authService.js`)

---

### 2. **FAÇADE **

#### Utilisation: APIClient et BudgetService

**Frontend - APIClient** (`src/services/api/apiClient.js`)

**Backend - BudgetService** (`src/services/budgetService.js`)

---

### 3. **OBSERVER (Réactivité aux changements)**

#### Utilisation: NotificationService et BudgetContext

**Backend** (`src/services/notificationService.js`)

**Frontend** (`src/context/BudgetContext.jsx`)

---

## Architecture Couches

### Backend - 3 Couches

**Controllers** (`src/controllers/`):
- Réception/validation des requêtes
- Appel des services
- Retour des réponses HTTP

**Services** (`src/services/`):
- Logique maximumétier principale
- Orchestration des repositories
- Implémentation des patrons
- Notifications via Observer

**Repositories** (`src/repositories/`):
- Accès direct aux données
- CRUD operations
- Requêtes spécifiques (filtrage, agrégation)

**Middleware** (`src/middleware/`):
- Authentification JWT
- Gestion globale des erreurs
- Logging des requêtes

### Frontend - Composants et Contextes

---

## Flux de Données

### Flux d'Authentification

```
1. User remplit formulaire Login
   
2. Form handleSubmit() mène à Login Page
   
3. authService.login(email, password)
   
4. authAPI.login() appelle POST /api/auth/login
   
5. Backend: authController.login()
   appelle authService.login() [Singleton]
   effectue Hashage + Vérification mot de passe
   génère JWT
   
6. Token + User retournés au frontend
   
7. saveToken() + saveUser() vers Session Storage
   
8. AuthContext mis à jour
   
9. Components réagissent (useAuth hook)
```

### Flux d'Ajout de Transaction

```
1. TransactionForm.jsx
   
2. validateTransaction() + handleSubmit()
   
3. transactionAPI.create(data)
   appelle apiClient.post('/transactions', data)
   ajoute Authorization header
   
4. Backend: transactionController.create()
   où authMiddleware vérifie JWT
   puis TransactionService.create()
   
5. TransactionRepository.create()
   sauvegarde en database.json
   
6. NotificationService.notify(TRANSACTION_ADDED)
   notifie LoggingObserver.update()
   notifie BudgetAlertObserver.update()
   
7. Frontend reçoit réponse
   déclenche budgetObservable.notify('budget.updated')
   met à jour BudgetContext
   
8. Dashboard rechargé (useEffect)
```

---

## Structures de Données Clés

### User

```javascript
{
  id: "uuid",
  firstName: "Souleymane",
  lastName: "Sow",
  email: "user@example.com",
  password: "hashedPassword",
  monthlyBudgetLimit: 5000,
  createdAt: "2026-02-22T...",
  updatedAt: "2026-02-22T..."
}
```

### Transaction

```javascript
{
  id: "uuid",
  userId: "uuid",
  type: "income" | "expense",
  amount: 1500.50,
  category: "housing",
  frequency: "monthly",
  description: "Loyer",
  date: "2026-02-22T...",
  createdAt: "2026-02-22T...",
  updatedAt: "2026-02-22T..."
}
```

### Budget Summary

```javascript
{
  userId: "uuid",
  totalIncome: 3000,
  totalExpense: 2500,
  balance: 500,
  indicator: "positive",
  monthlyBudgetLimit: 5000,
  budgetRemaining: 2500,
  isOverBudget: false,
  period: {
    startDate: "2026-02-01T...",
    endDate: "2026-02-28T..."
  }
}
```

---

## Endpoints API

### Authentification
```
POST /api/auth/register         : Créer compte
POST /api/auth/login            : Se connecter
POST /api/auth/logout           : Se déconnecter
GET  /api/auth/verify           : Vérifier token (protégé)
```

### Transactions
```
POST   /api/transactions         : Créer transaction (protégé)
GET    /api/transactions         : Lister toutes (protégé)
GET    /api/transactions/income  : Lister revenus (protégé)
GET    /api/transactions/expense : Lister dépenses (protégé)
GET    /api/transactions/filter  : Filtrer (protégé)
PUT    /api/transactions/:id     : Mettre à jour (protégé)
DELETE /api/transactions/:id     : Supprimer (protégé)
```

### Budget
```
GET  /api/budget/summary              : Réaggregateé (protégé)
GET  /api/budget/category-breakdown   : Répartition (protégé)
GET  /api/budget/recommendations      : Recommandations (protégé)
POST /api/budget/set-monthly-limit    : Définir budget (protégé)
GET  /api/budget/monthly-limit        : Obtenir budget (protégé)
GET  /api/budget/comprehensive-report : Rapport complet (protégé)
GET  /api/budget/export/csv           : Export CSV (protégé)
```

---

## Sécurité

### Frontend
- Token stocké en sessionStorage
- PrivateRoute pour protection des pages
- Logout automatique si token expiré

### Backend
- Mots de passe hashés avec bcryptjs
- Tokens JWT avec expiration
- Isolation des données par utilisateur

---