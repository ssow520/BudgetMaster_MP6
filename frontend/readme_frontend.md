### Your code here# Frontend - BudgetMaster

Application React pour la gestion budgétaire, développée avec Vite et Bootstrap.

## Structure du Projet

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.jsx          # Barre de navigation
│   │   ├── Footer.jsx          # Pied de page
│   │   └── Loading.jsx         # Indicateur de chargement
│   ├── auth/
│   │   ├── LoginPage.jsx       # Page de connexion
│   │   └── RegisterPage.jsx    # Page d'enregistrement
│   ├── dashboard/
│   │   ├── DashboardPage.jsx   # Tableau de bord principal
│   │   ├── SummaryComponent.jsx # Résumé budgétaire (Cards)
│   │   ├── RecommendationsComponent.jsx # Recommandations
│   │   └── CategoryBreakdownComponent.jsx # Graphique dépenses
│   ├── transactions/
│   │   ├── TransactionListPage.jsx   # Liste des transactions
│   │   ├── TransactionForm.jsx       # Formulaire ajout/édition
│   │   ├── TransactionFilters.jsx    # Filtrage des transactions
│   │   └── TransactionCard.jsx       # Affichage une transaction
│   └── budget/
│       ├── BudgetSettingsPage.jsx    # Gestion du budget mensuel
│       └── BudgetLimitCard.jsx       # Affichage du budget
├── services/
│   ├── api/
│   │   ├── apiClient.js        # Client HTTP centralisé
│   │   ├── authAPI.js          # Endpoints authentification
│   │   ├── transactionAPI.js   # Endpoints transactions
│   │   └── budgetAPI.js        # Endpoints budget
│   ├── Observer.js             # Pattern Observer côté client
│   └── AuthService.js          # Service authentification (Singleton)
├── context/
│   ├── AuthContext.jsx         # Contexte authentification
│   └── BudgetContext.jsx       # Contexte budget (Observable)
├── hooks/
│   ├── useAuth.js              # Hook pour accès auth
│   ├── useBudget.js            # Hook pour budget
│   └── useForm.js              # Hook pour formulaires
├── utils/
│   ├── formatters.js           # Formatage nombres/dates
│   ├── validators.js           # Validation côté client
│   ├── constants.js            # Constantes app
│   └── storage.js              # LocalStorage helpers
├── styles/
│   ├── variables.css           # Variables CSS
│   ├── global.css              # Styles globaux
│   └── components.css          # Styles composants
├── App.jsx                     # Composant racine
├── main.jsx                    # Point d'entrée
└── index.css                   # CSS principal
```

## Installation et Démarrage

### Démarrage en développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## Patrons de Conception Implémentés

### 1. **Singleton - AuthService**
- Une seule instance du service d'authentification
- Gère le token JWT
- Vérifie l'état d'authentification de l'utilisateur

### 2. **Observer - BudgetContext**
- Contexte qui observe les changements budgétaires
- Notifie les composants intéressés
- Permet la réactivité automatique

### 3. **Façade - apiClient**
- Interface unique pour toutes les requêtes API
- Gère le token JWT automatiquement
- Simplifie les appels depuis les composants

## Dépendances Principales

- **React 19.2.0** - Bibliothèque UI
- **React Router 7.13.0** - Routage
- **Bootstrap 5.3.8** - Framework CSS
- **Vite 7.3.1** - Build tool

## Fonctionnalités Frontend

### Pages Implémentées
- Authentification (Login/Register)
- Dashboard avec résumé budgétaire
- Gestion des transactions
- Filtrage et recherche
- Graphiques dépenses par catégorie
- Paramètres budget
- Export données

## Architecture et Sécurité

- Token JWT stocké en session storage
- Routes protégées avec PrivateRoute
- Validation des formulaires côté client
- Gestion des erreurs utilisateur
- Logout automatique si token expiré

## Testing

```bash
npm test
npm run test:watch
```
