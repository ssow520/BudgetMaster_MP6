# API Documentation — BudgetMaster

**Base URL** : `http://localhost:3001/api`
**Authentification** : header `Authorization: Bearer <token>`

---

## Authentification

### POST /auth/register
Créer un nouveau compte.

**Body :**
```json
{
  "firstName": "Prénom",
  "lastName": "Nom",
  "email": "user@example.com",
  "password": "MotDePasse123!"
}
```
Retourne `201` si le compte est créé, `400` si l'email est déjà pris ou si les données sont invalides.

---

### POST /auth/login
Se connecter.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "MotDePasse123!"
}
```
Retourne un token JWT et les infos de base de l'utilisateur. `401` si les identifiants sont incorrects.

---

### POST /auth/logout
Déconnecter l'utilisateur courant.

**Headers :** `Authorization: Bearer <token>`

---

### GET /auth/verify
Vérifier si le token est encore valide.

**Headers :** `Authorization: Bearer <token>`
Retourne `200` si valide, `401` sinon.

---

## Transactions

### POST /transactions
Ajouter une transaction.

**Headers :** `Authorization: Bearer <token>`

**Body :**
```json
{
  "type": "expense",
  "amount": 150.00,
  "category": "Food",
  "description": "Épicerie semaine",
  "date": "2026-03-29"
}
```
Le champ `type` accepte `income` ou `expense`. La `category` est libre. Retourne `201` si ajoutée.

---

### GET /transactions
Toutes les transactions de l'utilisateur connecté.

**Headers :** `Authorization: Bearer <token>`

---

### GET /transactions/income
Revenus seulement.

**Headers :** `Authorization: Bearer <token>`

---

### GET /transactions/expense
Dépenses seulement.

**Headers :** `Authorization: Bearer <token>`

---

### PUT /transactions/:id
Modifier une transaction existante.

**Headers :** `Authorization: Bearer <token>`

**Body :** les champs à changer (`amount`, `category`, `description`, etc.)
Retourne `404` si la transaction n'appartient pas à l'utilisateur ou n'existe pas.

---

### DELETE /transactions/:id
Supprimer une transaction.

**Headers :** `Authorization: Bearer <token>`
Retourne `404` si introuvable.

---

## Budget

### GET /budget/summary
Résumé du mois en cours : revenus, dépenses, solde, limite mensuelle.

**Headers :** `Authorization: Bearer <token>`

```json
{
  "totalIncome": 3000,
  "totalExpenses": 1200,
  "balance": 1800,
  "indicator": "positive",
  "monthlyLimit": 2000,
  "recommendations": []
}
```

---

### POST /budget/set-monthly-limit
Définir la limite mensuelle de dépenses.

**Headers :** `Authorization: Bearer <token>`

**Body :** `{ "monthlyLimit": 2000 }`
Retourne `400` si le montant est zéro ou négatif.

---

### GET /budget/recommendations
Recommandations selon le solde du mois.

**Headers :** `Authorization: Bearer <token>`

---

### GET /budget/category-breakdown
Dépenses regroupées par catégorie avec pourcentage du total.

**Headers :** `Authorization: Bearer <token>`

---

### GET /budget/export/csv
Exporter les transactions en CSV.

**Headers :** `Authorization: Bearer <token>`
Retourne un fichier `budgetmaster_export_[date].csv`.

---

## Codes HTTP

**200** — requête réussie.
**201** — ressource créée (register, nouvelle transaction).
**400** — données invalides ou manquantes.
**401** — token absent, expiré ou invalide.
**403** — authentifié mais pas autorisé à accéder à cette ressource.
**404** — ressource introuvable.
**500** — erreur inattendue côté serveur.

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Dernière mise à jour :** 2026-03-29