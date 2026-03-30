# Frontend — BudgetMaster

Interface React développée avec Vite.

## Structure réelle du projet

```
frontend/src/
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
│   ├── apiClient.js
│   └── authService.js
├── App.jsx
├── main.jsx
└── index.css
```

## Démarrage

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur `http://localhost:5173`.

## Patrons implémentés

**Singleton — ApiClient** : une seule instance centralise tous les appels HTTP. Le token JWT est ajouté automatiquement à chaque requête via un intercepteur Axios.

**Façade — ApiClient** : les pages et composants appellent `apiClient.get()` ou `apiClient.post()` sans gérer manuellement les headers, les erreurs 401 ou la base URL.

## Dépendances principales

- React 19.2.0
- React Router 7.13.0
- Axios
- Vite 7.3.1

## Variables d'environnement

Le frontend pointe sur `http://localhost:3001/api` via le proxy Vite configuré dans `vite.config.js`. Aucun fichier `.env` nécessaire en développement.

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026