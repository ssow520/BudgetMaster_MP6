# BudgetMaster — Guide de démarrage

## Prérequis

- Node.js 18+
- npm 8+

---

## Installation

```bash
# À la racine du projet
npm install
```

---

## Démarrer l'application

```bash
npm run dev
```

- Backend : `http://localhost:3001`
- Frontend : `http://localhost:5173`

---

## Lancer les tests

```bash
npm test -w backend
```

Résultat attendu : **86/86 tests passent**.

Pour une suite spécifique :

```bash
cd backend
node --experimental-vm-modules ../node_modules/.bin/jest __tests__/BudgetFacade.test.js
node --experimental-vm-modules ../node_modules/.bin/jest __tests__/BalanceCalculation.test.js
node --experimental-vm-modules ../node_modules/.bin/jest __tests__/FilteringAndQueries.test.js
node --experimental-vm-modules ../node_modules/.bin/jest __tests__/ObserverPattern.test.js
```

---

## Tester l'API manuellement

### Créer un compte

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Prénom", "lastName": "Nom", "email": "user@test.com", "password": "MotDePasse123!"}'
```

### Se connecter

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "MotDePasse123!"}'
```

Sauvegarder le token retourné :

```bash
TOKEN="eyJhbGci..."
```

### Résumé du budget

```bash
curl http://localhost:3001/api/budget/summary \
  -H "Authorization: Bearer $TOKEN"
```

### Ajouter une transaction

```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "expense", "amount": 50, "category": "Alimentation", "description": "Épicerie", "date": "2026-03-29"}'
```

### Lister les transactions

```bash
curl http://localhost:3001/api/transactions \
  -H "Authorization: Bearer $TOKEN"
```

### Exporter en CSV

```bash
curl http://localhost:3001/api/transactions/export \
  -H "Authorization: Bearer $TOKEN" \
  -o transactions.csv
```

---

## Dépannage

### Port déjà utilisé

```bash
kill -9 $(lsof -t -i:3001)
kill -9 $(lsof -t -i:5173)
```

### Problèmes de dépendances

```bash
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### Remettre la base de données à zéro

```bash
echo '{"users":[],"transactions":[],"budgets":[]}' > backend/data/database.json
```

---

## Structure du projet

```
BudgetMaster_MP6/
├── backend/
│   ├── src/
│   │   ├── config/         ← Database Singleton
│   │   ├── controllers/    ← Réception des requêtes HTTP
│   │   ├── middleware/     ← Auth JWT, gestion erreurs
│   │   ├── repositories/   ← Accès aux données
│   │   ├── routes/         ← Définition des endpoints
│   │   ├── services/       ← Logique métier, Façade, Observer
│   │   └── utils/          ← Logger, Observer, Validators
│   ├── __tests__/          ← Tests Ruth
│   ├── src/__tests__/      ← Tests Souleymane
│   └── data/database.json  ← Stockage JSON
├── frontend/
│   └── src/
│       ├── components/     ← Navbar, TransactionForm, Summary...
│       ├── context/        ← AuthContext
│       ├── pages/          ← Login, Register, Dashboard...
│       └── services/       ← ApiClient, authService
└── documentation/
    ├── ADR.md
    ├── API_DOCUMENTATION.md
    ├── ARCHITECTURE.md
    └── DESIGN_PATTERNS.md
```

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026