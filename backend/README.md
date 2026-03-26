# BudgetMaster Backend

Backend API REST pour l'application BudgetMaster, développée avec Node.js et Express.

## Structure du Projet

```
src/
├── config/
│   └── database.js          # Configuration de la base de données (JSON simulée)
├── controllers/
│   ├── authController.js    # Contrôleurs pour l'authentification
│   ├── budgetController.js  # Contrôleurs pour le budget/dashboard
│   └── transactionController.js  # Contrôleurs pour les transactions
├── services/
│   ├── authService.js       # Service d'authentification (Singleton)
│   ├── budgetService.js     # Service de gestion budgétaire (Façade)
│   ├── transactionService.js # Service des transactions
│   ├── userService.js       # Service utilisateur
│   └── notificationService.js # Service de notification (Observable)
├── repositories/
│   ├── userRepository.js    # Accès aux données utilisateur
│   ├── transactionRepository.js # Accès aux données transactions
│   └── budgetRepository.js  # Accès aux données budget
├── middleware/
│   ├── authMiddleware.js    # Middleware d'authentification
│   └── errorHandler.js      # Gestion des erreurs
├── utils/
│   ├── validators.js        # Validations limitétier
│   ├── logger.js            # Système de log
│   ├── observer.js          # Pattern Observer
│   └── constants.js         # Constantes de l'application
├── routes/
│   ├── authRoutes.js        # Routes d'authentification
│   ├── budgetRoutes.js      # Routes budget/dashboard
│   └── transactionRoutes.js # Routes transactions
├── server.js                # Point d'entrée
└── .env                     # Variables d'environnement
```

## Installation et Démarrage

### Installation des dépendances

```bash
cd backend
npm install
```

### Variables d'environnement

Créez un fichier `.env` à la racine du backend :

```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=24h
CORS_ORIGIN=http:
```

### Démarrage

```bash
# Développement (avec hot reload)
npm run dev

# Production
npm start
```

Le serveur sera disponible sur `http:

## Patrons de Conception Implémentés

### 1. **Singleton - AuthService**
- Assure qu'une seule instance du service d'authentification existe
- Gère les mots de passe hashés et les tokens JWT
- Utilisé globalement par tous les contrôleurs

### 2. **Façade - BudgetService**
- Simplifie l'interaction avec les services complexes
- Expose une interface unifiée pour :
  - Calculer le solde
  - Obtenir les statistiques budgétaires
  - Gécountérer des recommandations
- Masque la complexité des services sous-jacents

### 3. **Observer - NotificationService**
- Notifie les systèmes intéressés des changements
- Utilisé pour :
  - Alerter sur le dépassement de budget
  - Logger les actions importantes
  - Permettre des extensions futures

## API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter
- `POST /api/auth/logout` - Se déconnecter

### Transactions
- `GET /api/transactions` - Lister les transactions (authentifié)
- `POST /api/transactions` - Ajouter une transaction
- `PUT /api/transactions/:id` - Modifier une transaction
- `DELETE /api/transactions/:id` - Supprimer une transaction
- `GET /api/transactions/filter` - Filtrer les transactions

### Budget/Dashboard
- `GET /api/budget/summary` - Réaggregateé budgétaire
- `GET /api/budget/recommendations` - Recommandations
- `POST /api/budget/set-limit` - Définir un budget mensuel
- `GET /api/budget/category-breakdown` - Répartition par catégorie
- `GET /api/budget/export` - Exporter en CSV

## Sécurité

- ✅ Mots de passe hashés avec bcryptjs
- ✅ Authentification JWT
- ✅ CORS configuré
- ✅ Middleware de validation des requêtes
- ✅ Isolation des données par utilisateur

## Tests

```bash
npm test
npm run test:watch
```