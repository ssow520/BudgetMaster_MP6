# API Documentation - BudgetMaster

**Base URL**: `http://localhost:3001/api`  
**Authentification**: Bearer Token JWT (header `Authorization`)

---

## Authentification

### POST /auth/register
Créer un nouveau compte.

**Body:**
```json
{
  "firstName": "Souleymane",
  "lastName": "Sow",
  "email": "user@example.com",
  "password": "MotDePasse123!"
}
```
**Réponses:** `201 Created` | `400 Bad Request`

---

### POST /auth/login
Se connecter et obtenir un token JWT.

**Body:**
```json
{ "email": "user@example.com", "password": "MotDePasse123!" }
```
**Réponses:** `200 OK` avec `{ token, user }` | `401 Unauthorized`

---

### POST /auth/logout
Se déconnecter.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK`

---

### GET /auth/verify
Vérifier si le token est valide.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK` | `401 Unauthorized`

---

## Transactions

### POST /transactions
Ajouter une transaction.

**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "type": "expense",
  "amount": 150.00,
  "category": "food",
  "frequency": "monthly",
  "description": "Épicerie",
  "date": "2026-03-25"
}
```
**Réponses:** `201 Created` | `400 Bad Request` | `401 Unauthorized`

---

### GET /transactions
Lister toutes les transactions de l'utilisateur connecté.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK` avec liste des transactions

---

### GET /transactions/income
Lister les revenus uniquement.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK`

---

### GET /transactions/expense
Lister les dépenses uniquement.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK`

---

### PUT /transactions/:id
Modifier une transaction.

**Headers:** `Authorization: Bearer <token>`  
**Body:** Champs à modifier  
**Réponses:** `200 OK` | `404 Not Found`

---

### DELETE /transactions/:id
Supprimer une transaction.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK` | `404 Not Found`

---

## Budget

### GET /budget/summary
Obtenir le résumé budgétaire du mois en cours.

**Headers:** `Authorization: Bearer <token>`  
**Réponse:**
```json
{
  "totalIncome": 3000,
  "totalExpense": 2500,
  "balance": 500,
  "indicator": "positive",
  "monthlyBudgetLimit": 5000,
  "budgetRemaining": 2500,
  "isOverBudget": false
}
```

---

### POST /budget/set-monthly-limit
Définir le budget mensuel maximum.

**Headers:** `Authorization: Bearer <token>`  
**Body:** `{ "monthlyLimit": 3000 }`  
**Réponses:** `200 OK` | `400 Bad Request`

---

### GET /budget/recommendations
Obtenir des recommandations basées sur le solde.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK` avec messages de recommandation

---

### GET /budget/category-breakdown
Répartition des dépenses par catégorie.

**Headers:** `Authorization: Bearer <token>`  
**Réponses:** `200 OK` avec pourcentages par catégorie

---

### GET /budget/export/csv
Exporter toutes les transactions en CSV.

**Headers:** `Authorization: Bearer <token>`  
**Réponse:** Fichier `budgetmaster_export_[date].csv`

---

## Codes d'erreur

| Code | Signification |
|------|--------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Données invalides |
| 401 | Non authentifié |
| 403 | Accès interdit |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

---

**Équipe**: Souleymane Sow, Moses Kasindi, Ruth Kegmo  
**Dernière mise à jour**: 2026-03-25
