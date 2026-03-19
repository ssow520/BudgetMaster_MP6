# Architecture Détaillée - BudgetMaster

## Vue d'ensemble

BudgetMaster est une application web complète de gestion budgétaire utilisant une architecture moderne :

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de données**: JSON (phase 1), migration vers MongoDB/PostgreSQL prévue
- **Authentification**: JWT (JSON Web Tokens)

## Patrons de Conception Implémentés

### 1. **SINGLETON (Mono-instance)**

#### Utilisation: AuthService

**Frontend** (`src/services/AuthService.js`):
```javascript
// Une seule instance du service d'authentification
// Gère l'état d'authentification global
const authService = new AuthService();
// Accès: authService.getCurrentUser(), authService.getToken()
```

**Backend** (`src/services/authService.js`):
```javascript
// Instance unique pour la gestion des tokens JWT
const authService = new AuthService();
```

**Bénéfices**:
- ✅ Un point d'accès centralisé
- ✅ Partage d'état global
- ✅ Évite les duplications d'instances

---

### 2. **FAÇADE (Simplification)**

#### Utilisation: APIClient et BudgetService

**Frontend - APIClient** (`src/services/api/apiClient.js`):
```javascript
// Interface unique pour TOUS les appels API
apiClient.get(endpoint);
apiClient.post(endpoint, data);
// Gère automatiquement:
// - Ajout du token JWT
// - Gestion des erreurs globales
// - Redirection sur 401
```

**Backend - BudgetService** (`src/services/budgetService.js`):
```javascript
// Simplifie l'interaction avec plusieurs repositories
BudgetService.getSummary(userId)
  // Combine:
  // - TransactionRepository.calculateTotalIncome()
  // - TransactionRepository.calculateTotalExpense()
  // - Calcul du solde
  // - Détermination de l'indicateur
```

**Bénéfices**:
- ✅ Interface simplifiée et cohérente
- ✅ Masque la complexité interne
- ✅ Facilite les modifications futures

---

### 3. **OBSERVER (Réactivité aux changements)**

#### Utilisation: NotificationService et BudgetContext

**Backend** (`src/services/notificationService.js`):
```javascript
// Observateurs d'événements
- LoggingObserver: enregistre les changements
- BudgetAlertObserver: alerte sur dépassement

// Événements déclen chés:
- TRANSACTION_ADDED
- TRANSACTION_UPDATED
- TRANSACTION_DELETED
- BUDGET_EXCEEDED
```

**Frontend** (`src/context/BudgetContext.jsx`):
```javascript
// Observable pour mises à jour budgétaires
budgetObservable.attach(observer);
budgetObservable.notify('budget.updated', data);
```

**Bénéfices**:
- ✅ Découplage entre composants
- ✅ Extensibilité facile
- ✅ Gestion d'événements centralisée

---

## Architecture Couches

### Backend - 3 Couches

```
┌─────────────────────────────┐
│     Controllers             │ (Traitement requêtes HTTP)
├─────────────────────────────┤
│     Services                │ (Logique métier)
├─────────────────────────────┤
│     Repositories            │ (Accès aux données)
├─────────────────────────────┤
│     Database                │ (JSON/MongoDB)
└─────────────────────────────┘
```

**Controllers** (`src/controllers/`):
- Réception/validation des requêtes
- Appel des services
- Retour des réponses HTTP

**Services** (`src/services/`):
- Logique métier principale
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

```
┌─────────────────────────────┐
│     Pages / Composants      │
├─────────────────────────────┤
│     Contexts (State)        │ (AuthContext, BudgetContext)
├─────────────────────────────┤
│     Services (API)          │ (AuthService, APIClient)
├─────────────────────────────┤
│     Hooks                   │ (useAuth, useBudget)
├─────────────────────────────┤
│     Utils                   │ (formatters, validators)
└─────────────────────────────┘
```

---

## Flux de Données

### Flux d'Authentification

```
1. User remplit formulaire Login
   ↓
2. Form handleSubmit() → Login Page
   ↓
3. authService.login(email, password)
   ↓
4. authAPI.login() → POST /api/auth/login
   ↓
5. Backend: authController.login()
   → authService.login() [Singleton]
   → Hashage + Vérification mot de passe
   → Génération JWT
   ↓
6. Token + User retournés au frontend
   ↓
7. saveToken() + saveUser() → Session Storage
   ↓
8. AuthContext mis à jour
   ↓
9. Components réagissent (useAuth hook)
```

### Flux d'Ajout de Transaction

```
1. TransactionForm.jsx
   ↓
2. validateTransaction() + handleSubmit()
   ↓
3. transactionAPI.create(data)
   → apiClient.post('/transactions', data)
   → Ajoute Authorization header
   ↓
4. Backend: transactionController.create()
   → authMiddleware vérifie JWT
   → TransactionService.create()
   ↓
5. TransactionRepository.create()
   → Sauvegarde en database.json
   ↓
6. NotificationService.notify(TRANSACTION_ADDED)
   → LoggingObserver.update()
   → BudgetAlertObserver.update()
   ↓
7. Frontend reçoit réponse
   → budgetObservable.notify('budget.updated')
   → BudgetContext mis à jour
   ↓
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
  indicator: "positive", // 'positive', 'negative', 'balanced'
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
POST /api/auth/register         → Créer compte
POST /api/auth/login            → Se connecter
POST /api/auth/logout           → Se déconnecter
GET  /api/auth/verify           → Vérifier token (protégé)
```

### Transactions
```
POST   /api/transactions         → Créer transaction (protégé)
GET    /api/transactions         → Lister toutes (protégé)
GET    /api/transactions/income  → Lister revenus (protégé)
GET    /api/transactions/expense → Lister dépenses (protégé)
GET    /api/transactions/filter  → Filtrer (protégé)
PUT    /api/transactions/:id     → Mettre à jour (protégé)
DELETE /api/transactions/:id     → Supprimer (protégé)
```

### Budget
```
GET  /api/budget/summary              → Résumé (protégé)
GET  /api/budget/category-breakdown   → Répartition (protégé)
GET  /api/budget/recommendations      → Recommandations (protégé)
POST /api/budget/set-monthly-limit    → Définir budget (protégé)
GET  /api/budget/monthly-limit        → Obtenir budget (protégé)
GET  /api/budget/comprehensive-report → Rapport complet (protégé)
GET  /api/budget/export/csv           → Export CSV (protégé)
```

---

## Sécurité

### Frontend
- ✅ Token stocké en sessionStorage (pas localStorage pour plus de sécurité)
- ✅ Validation des formulaires côté client
- ✅ PrivateRoute pour protection des pages
- ✅ Logout automatique si token expiré

### Backend
- ✅ Mots de passe hashés avec bcryptjs
- ✅ Tokens JWT avec expiration
- ✅ Middleware d'authentification sur routes protégées
- ✅ CORS configuré
- ✅ Isolation des données par utilisateur

---

## Performance

### Frontend
- ✅ Vite pour build rapide
- ✅ React Router pour SPA
- ✅ Cache des requêtes API (localStorage)
- ✅ Lazy loading des routes (à implémenter)

### Backend
- ✅ Temps réponse < 5 secondes
- ✅ Endpoints optimisés
- ✅ Pagination pour les listes (à implémenter)
- ✅ Compression des réponses (à implémenter)

---

## Évolution Future (Phase IV)

### Base de Données
- Migration de JSON vers MongoDB ou PostgreSQL
- Indexation pour performances
- Sauvegardes régulières

### Features Avancées
- Catégorisation smart (ML)
- Prédictions budgétaires
- Notifications push
- Mobile app (React Native)
- Graphiques avancés (Chart.js)

### Optimisations
- Pagination côté serveur
- Compression (gzip)
- CDN pour assets
- Caching (Redis)
- Rate limiting

---

## Guide de Contribution

### Ajouter une nouvelle feature

1. **Backend**:
   - Ajouter validations dans `utils/validators.js`
   - Créer repository si nécessaire
   - Créer service avec logique métier
   - Créer controller
   - Ajouter routes

2. **Frontend**:
   - Créer API wrapper dans `services/api/`
   - Ajouter contexte React si nécessaire
   - Créer composants
   - Ajouter page

3. **Testing**:
   - Tests unitaires pour services
   - Tests d'intégration pour API
   - Tests de composants React

---

## Conventions de Codage

### Nommage
- Fonctions: `camelCase`
- Classes: `PascalCase`
- Constantes: `UPPER_SNAKE_CASE`
- Fichiers: `camelCase.js` ou `PascalCase.jsx`

### Structure
- Imports en haut
- Exports à la fin
- Commentaires JSDoc pour fonctions publiques
- Gestion d'erreurs explicite

### Commits Git
```
[FEATURE] Description courte
[BUGFIX] Description courte
[REFACTOR] Description courte
[DOCS] Description courte
```

---

**Équipe**: Souleymane Sow, Moses Kasindi, Ruth Kegmo  
**Session**: H2026  
**Dernière mise à jour**: 2026-02-22
