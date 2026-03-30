# Backend — BudgetMaster

API REST développée avec Node.js et Express.

## Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── database.js              ← Singleton, stockage JSON
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   └── transactionController.js
│   ├── services/
│   │   ├── authService.js           ← Singleton
│   │   ├── BudgetFacade.js          ← Façade + Singleton
│   │   ├── budgetService.js         ← Singleton
│   │   ├── transactionService.js    ← Singleton
│   │   ├── userService.js           ← Singleton
│   │   └── notificationService.js   ← Singleton + Observer
│   ├── repositories/
│   │   ├── userRepository.js
│   │   └── transactionRepository.js
│   ├── middleware/
│   │   ├── authMiddleware.js        ← Vérification JWT
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── logger.js
│   │   ├── observer.js              ← Observable + Observer abstraite
│   │   └── constants.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   └── transactionRoutes.js
│   └── server.js
├── __tests__/                       ← Tests Ruth
├── src/__tests__/                   ← Tests Souleymane
└── data/
    └── database.json
```

## Démarrage

```bash
cd backend
npm install
npm run dev
```

Serveur disponible sur `http://localhost:3001`.

## Variables d'environnement

Le fichier `.env` à la racine de `backend/` :

```
NODE_ENV=development
PORT=3001
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:5173
```

## Patrons de conception

**Singleton** — appliqué à `Database`, `AuthService`, `BudgetService`, `TransactionService`, `UserService`, `NotificationService` et `BudgetFacade`. Une seule instance de chaque service existe dans toute l'application.

**Façade** — `BudgetFacade` centralise toutes les opérations complexes. Les contrôleurs passent par la façade plutôt qu'appeler plusieurs services directement.

**Observer** — `NotificationService` maintient une liste d'observateurs (`LoggingObserver`, `BudgetAlertObserver`) notifiés automatiquement lors des événements (transaction ajoutée, budget dépassé, etc.).

## Endpoints principaux

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/verify

GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
GET    /api/transactions/income
GET    /api/transactions/expense
GET    /api/transactions/export

GET    /api/budget/summary
GET    /api/budget/recommendations
GET    /api/budget/category-breakdown
GET    /api/budget/comprehensive-report
POST   /api/budget/set-monthly-limit
```

## Tests

```bash
npm test -w backend
```

Résultat : **86/86 tests passent**.

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026