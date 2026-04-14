# BudgetMaster — Gestion budgétaire personnelle

Application web full-stack de gestion de budget développée dans le cadre du cours Techniques de l'informatique, session H2026.

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Dépôt :** github.com/ssow520/BudgetMaster_MP6
**Tableau de bord :** [Asana](https://app.asana.com)

---

## Démarrage rapide

### Prérequis
- Node.js 18+
- npm 8+

### Installation et démarrage

```bash
npm install
npm run dev
```

- Backend : `http://localhost:3001`
- Frontend : `http://localhost:5173`

### Tests

```bash
npm test -w backend
```

Résultat attendu : **86/86 tests passent**.

---

## Fonctionnalités

- Création de compte et authentification JWT
- Ajout, modification et suppression de transactions (revenus et dépenses)
- Calcul automatique du solde en temps réel
- Limite de budget mensuel avec détection de dépassement
- Recommandations basées sur le solde
- Répartition des dépenses par catégorie
- Export des transactions en CSV

---
## Architecture

Le projet suit une architecture client-serveur avec deux workspaces séparés dans un monorepo.

### Backend — Node.js / Express

```
backend/
└── src/
    ├── config/
    │   └── database.js              ← Singleton, stockage JSON
    ├── controllers/
    │   ├── authController.js
    │   ├── budgetController.js
    │   └── transactionController.js
    ├── services/
    │   ├── authService.js           ← Singleton
    │   ├── BudgetFacade.js          ← Façade + Singleton
    │   ├── budgetService.js         ← Singleton
    │   ├── transactionService.js    ← Singleton
    │   ├── userService.js           ← Singleton
    │   └── notificationService.js   ← Singleton + Observer
    ├── repositories/
    │   ├── userRepository.js
    │   └── transactionRepository.js
    ├── middleware/
    │   ├── authMiddleware.js        ← Vérification JWT
    │   └── errorHandler.js
    ├── utils/
    │   ├── validators.js
    │   ├── logger.js
    │   ├── observer.js              ← Observable + Observer abstraite
    │   └── constants.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── budgetRoutes.js
    │   └── transactionRoutes.js
    └── server.js
```
 
### Frontend — React / Vite
 
```
frontend/
└── src/
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx
    │   │   └── dashboard/
    │   │       ├── SummaryComponent.jsx
    │   │       └── RecommendationsComponent.jsx
    │   └── transactions/
    │       └── TransactionForm.jsx
    ├── context/
    │   └── AuthContext.jsx
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── TransactionsPage.jsx
    │   └── ProfilePage.jsx
    ├── services/
    │   ├── apiClient.js             ← Façade + Singleton
    │   └── authService.js
    ├── App.jsx
    ├── main.jsx
    └── index.css
```
 
---
 
## Patrons de conception
 
**Singleton** — `Database`, `AuthService`, `BudgetService`, `TransactionService`, `UserService`, 
`NotificationService`, `BudgetFacade`, `ApiClient`. Une seule instance de chaque service dans toute l'application.
 
**Façade** — `BudgetFacade` côté backend centralise toutes les opérations complexes. `ApiClient` 
côté frontend centralise tous les appels HTTP et gère le token JWT automatiquement.
 
**Observer** — `NotificationService` notifie automatiquement `LoggingObserver` et `BudgetAlertObserver` 
lors des événements (transaction ajoutée, budget dépassé).
 
---
 
## Endpoints API
 
### Authentification
```
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
GET   /api/auth/verify
```
 
### Transactions
```
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/transactions/income
GET    /api/transactions/expense
GET    /api/transactions/export
```
 
### Budget
```
GET   /api/budget/summary
GET   /api/budget/recommendations
GET   /api/budget/category-breakdown
GET   /api/budget/comprehensive-report
POST  /api/budget/set-monthly-limit
```
 
---
 
## Variables d'environnement
 
Créer un fichier `.env` dans `backend/` :
 
```
NODE_ENV=development
PORT=3001
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:5173
```
 
---
 
## Dépannage
 
```bash
# Port déjà utilisé
kill -9 $(lsof -t -i:3001)
kill -9 $(lsof -t -i:5173)
 
# Remettre la base de données à zéro
echo '{"users":[],"transactions":[],"budgets":[]}' > backend/data/database.json
```
 
---
 
## Documentation
 
- `documentation/SRS.md`
- `documentation/ADR.md`
- `documentation/report.md`
- `documentation/ARCHITECTURE.md`
 
---
 
**Session :** H2026 — Collège LaSalle