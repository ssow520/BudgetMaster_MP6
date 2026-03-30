# Rapport   -   Projet : Application Web de Gestion Budgétaire
**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Date :** 2026-02-22

---
## Asana, tableau de bord agile
[Asana](https:

---
## Corrections Phase 1

### 1. Correction de l'accès au SRS

Suite aux commentaires concernant les liens cassés dans le `README.md`, les corrections suivantes ont été effectuées :

- Mise à jour des liens vers le bon chemin : `documentation/SRS.md`
- Validation de l’accessibilité du SRS en un clic depuis la page principale du dépôt

### 2. Amélioration des exigences fonctionnelles (FR)

Les exigences fonctionnelles ont été renforcées afin de les rendre plus précises, complètes et testables :

- Reformulation selon le format standard : *“Le système doit…”*
- Ajout de critèresponse de validation pour chaque exigence
- Couverture complète du périmètre annoncé (authentification, gestion des transactions, calcul automatique, rétotalé budgétaire, recommandation)

Des cas d’erreur ont été ajoutés, notamment :
- Email décolà utilisé
- Identifiants invalides
- Montant totalégatif ou nul
- Transaction inexistante

### 3. Renforcement des exigences non fonctionnelles (NFR)

Les NFR ont été précisées et rendues mesurables :

#### Sécurité (NFR-2)
- Hashage obligatoire des mots de passe
- Session active requise pour accéder au tableau de bord
- Isolation stricte des données par utilisateur

#### Performance (NFR-1)
- Temps de réponse des pages principales < 5 secondes

#### Expérience utilisateur (NFR-3)
- Ajout d’une transaction en maximum 3 clics
- Messages d’erreur compréhensibles

#### Disponibilité et maintenabilité
- Disponibilité minimale de 95 % durant la période de test
- Architecture claire frontend/backend

### 4. Clarification du périmètre

Le périmètre a été clarifié:

#### Inclus (IN)
- Création et gestion de compte
- Authentification
- CRUD revenus et dépenses
- Calcul automatique du solde
- Historique des transactions
- Tableau de bord budgétaire
- Recommandations simples

#### Exclu (OUT)
- Connexion à des comptes bancaires réels
- Paiements en ligne
- Multi-devises
- Intelligence artificielle avancée

### 5. Amélioration de la structure du document

Les améliorations suivantes ont été apportées :

- Clarification des entités principales (User, Transaction, Budget)
- Ajout de règles endétier
- Ajout d’une “Definition of Done”

---

## Diagramme de composant.png

- [Diagramme_composant.png](documentation/Diagramme_composant.png)

Il illustre la structuration du système en trois sous-systèmes principaux :

- **Frontend (React)**
- **Backend (API REST)**
- **Data Layer (Base de données)**

Ce diagramme met en évidence les composants internes de chaque sous-système ainsi que les interfaces utilisées pour assurer la communication entre eux. On distingue:

### Sous-système Frontend

Le Frontend représente l’interface utilisateur développée en React.
Il contient les composants suivants :
- **UI App** : composant principal de l’application
- **AuthView** : gestion de la connexion et de la création de compte
- **DashboardView** : affichage du rétotalé budgétaire
- **TransactionView** : gestion des revenus et des dépenses

Le Frontend communique avec le Backend via des interfaces API :
- `IAuthAPI`
- `IBudgetAPI`

### Sous-système Backend

Le Backend expose des services via une API REST.
Il contient les composants :
- **AuthService** : gestion de l’authentification (hash des mots de passe, validation)
- **UserService** : gestion des informations utilisateur
- **BudgetService** : calcul automatique du solde
- **RecommendationService** : gétotalération de messages d’aide selon le solde

Le Backend fournit les interfaces :
- `AuthAPI`
- `BudgetAPI`
Ces interfaces sont utilisées par le Frontend pour accéder aux fonctionnalités endétier.

### 2.3 Sous-système Data Layer

La couche de données assure la persistance des informations :
- **UserRepository**
- **TransactionRepository**
- **Database**

---

## Diagramme des Cas d’Utilisation

- [Diagramme_cas_d'utilisation](documentation/Diagramme_cas_d'uilisation.png)

Il illustre les fonctionnalités principales définies dans le SRS ainsi que les relations entre elles.

### Acteurs

#### Utilisateur
Acteur principal du système.
Il peut :
- Créer un compte
- Se connecter / se déconnecter
- Ajouter, modifier et supprimer des transactions
- Catégoriser les dépenses et définir leur fréquence
- Consulter l’historique
- Visualiser le rétotalé budgétaire

#### Équipe technique
Acteur secondaire responsable de :
- La maintenance du système
- La supervision technique

Les cas d’utilisation sont regroupés en quatre blocs :

1. **Gestion du compte**
2. **Gestion des transactions**
3. **Calcul et rétotalé budgétaire**
4. **Administration**

### Relations importantes

- Toute modification de transaction inclut automatiquement le **calcul du solde**.
- L’ajout d’une dépense inclut la **catégorisation** et la **définition de fréquence**.
- La consultation du rétotalé budgétaire inclut l’**affichage d’un indicateur visuel et la gétotalération d’une recommandation**.

---

## Diagramme de Classe – Vue d’Ensemble du Budget (Dashboard)

- [diagramme_classe](documentation/diagramme_classe.png)

Ce diagramme de classe représente la structure logicielle du composant **Vue d’ensemble du budget (Dashboard)** de l’application.

Le diagramme est divisé en deux parties :

- **Frontend (React)**

La classe **DashboardPage** constitue le point d’entrée de la page tableau de bord.
Elle est composée de plusieurs objets **Card**, représentant :
- IncomeCard (Total Revenus)
- ExpenseCard (Total Dépenses)
- BalanceCard (Solde)

La classe abstraite **Card** définit les attributs communs (titre, montant, couleur) ainsi que les endéthodes de formatage et d’affichage.
Les trois cartes spécialisées héritent de cette classe et implémentent leur propre logique d’application des couleurs.

Le **DashboardService** communique avec l’API via **ApiClient** afin de récupérer les données sous forme de **DashboardDTO**.

- **Backend (Node.js / Express)**

Le **DashboardController** expose l’endpoint `GET /dashboard`.

Le **DashboardServiceBackend** contient la logique endétier permettant de calculer :
- Le total des revenus
- Le total des dépenses
- Le solde

Les données sont récupérées via **TransactionRepository**, qui accède aux entités **Transaction** stockées en base de données.

### Relations UML

Le diagramme met en évidence :

- **Héritage** : IncomeCard, ExpenseCard et BalanceCard héritent de la classe abstraite Card.
- **Composition** : DashboardPage est composée de plusieurs Card.
- **Agrégation** : DashboardPage utilise DashboardService, qui utilise ApiClient.
- **Association** : Les services manipulent l’objet DashboardDTO pour le transfert des données.

# Rapport Phase III — Raffinement Architectural et Conception Avancée
## Projet : BudgetMaster — Application de Gestion de Budget

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Date :** 2026-03-25
**Phase :** III — Raffinement Architectural (23 février – 22 mars 2026)

---

## Table des matièoutput

1. [Améliorations suite à la Phase II](#1-améliorations-suite-à-la-phase-ii)
2. [Architecture Singleton et Base de Données](#2-architecture-singleton-et-base-de-données) *(Souleymane)*
3. [Sécurité, Validation et Gestion des Erreurs](#3-sécurité-validation-et-gestion-des-erreurs) *(Souleymane)*
4. [Tests et Résultats](#4-tests-et-résultats) *(Souleymane)*
5. [Patron Façade — Consolidation Backend](#5-patron-façade--consolidation-backend) *(Ruth)*
6. [Patron Observer — Interface Utilisateur Réactive](#6-patron-observer--interface-utilisateur-réactive) *(Moses)*
7. [Diagrammes UML](#7-diagrammes-uml)

---

## 1. Améliorations suite à la Phase II

Suite aux commentaires reçus lors de l'évaluation de la Phase II, plusieurs corrections ont été apportées à l'ensemble du projet.

### 1.1 Restructuration de l'architecture backend

L'architecture backend a été reorganisée pour respecter une séparation stricte des responsabilités. Chaque couche dispose désormais de son propre répertoire avec des dépendances unidirectionnelles : `routes/ → controllers/ → services/ → repositories/ → database/`. Cette restructuration élimine les couplages circulaires identifiés en Phase II et facilite les tests unitaires.

### 1.2 Correction de la gestion des erreurs

En Phase II, les erreurs étaient gérées de façon inconsistante à travers les controllers. La Phase III introduit un middleware d'erreur centralisé (`errorHandler.js`) qui standardise le format des réponses d'erreur selon le patron Chain of Responsibility d'Express.

### 1.3 Renforcement de l'authentification JWT

La validation du token JWT était incomplète. Le middleware d'authentification vérifie désormais systématiquement la signature, l'expiration et la présence du claim `userId` avant d'autoriser l'accès à toute route protégée.

### 1.4 Normalisation du modèle de données

Le schéma JSON a été normalisé. Les champs optionnels ont des valeurs par défaut explicites, et les relations entre entités `User`, `Transaction` et `Budget` sont vérifiées à chaque opération d'écriture.

---

## 2. Architecture Singleton et Base de Données

*Responsable : Souleymane Sow*

### 2.1 Problème identifié en Phase II

Sans patron Singleton, chaque appel à `loadDatabase()` dans les repositories effectuait une lecture disque (`fs.readFileSync`). Pour une simple opération `register`, cela représentait 3 lectures disque consécutives :

```javascript

static emailExists(email) {
  const db = loadDatabase();
  return db.users.some(u => u.email === email);
}

static create(userData) {
  const db = loadDatabase();
  db.users.push(newUser);
  saveDatabase(db);
}
```

### 2.2 Solution — Singleton Database

La classe `Database` implémente le patron Singleton avec deux boundécanismes de protection complémentaires :

```javascript

class Database {
  constructor() {
    if (Database._instance) {
      return Database._instance;
    }
    this._data = this._readFromDisk();
    Database._instance = this;
    console.log('[Database] Singleton instancié — données chargées en boundémoire');
  }

  static getInstance() {
    if (!Database._instance) new Database();
    return Database._instance;
  }

  getData()        { return this._data; }
  setData(newData) { this._data = newData; this._writeToDisk(); }
}

export function loadDatabase() { return Database.getInstance().getData(); }
export function saveDatabase(data) { Database.getInstance().setData(data); }
```

**Double boundécanisme de protection :**
1. **Cache de modules Node.js** : `import` met en cache le module — le boundême objet est retourné à chaque import.
2. **Variable statique `Database._instance`** : guard explicite dans le constructor qui retourne l'instance existante.

### 2.3 Singleton AuthService

`AuthService` était déinnerà implémenté comme Singleton en Phase II. La Phase III vérifie et documente son utilisation correcte dans tous les controllers :

```javascript
class AuthService {
  constructor() {
    if (AuthService.instance) return AuthService.instance;
    this.saltRounds = 10;
    AuthService.instance = this;
  }

  static getInstance() {
    if (!AuthService.instance) new AuthService();
    return AuthService.instance;
  }
}

const authService = new AuthService();
export default authService;
```

Tous les controllers importent `authService` directement — aucun ne crée une nouvelle instance via `new AuthService()`.

### 2.4 Impact sur les performances

| Opération | Avant (Phase II) | Après (Phase III) |
|-----------|-----------------|-------------------|
| `loadDatabase()` | Lecture disque (I/O) | Accès RAM |
| Lectures pour `register` | 3 | 0 |
| Cohérence des données | Non garantie | Garantie |
| Backup automatique | Non | Oui (`.bak`) |

### 2.5 Modèle de données

Le modèle de données a été revu et validé selon le cahier des charges :

**User :**
```
id, firstName, lastName, email, password (hashé bcrypt), monthlyBudgetLimit, createdAt, updatedAt
```

**Transaction :**
```
id, userId, type (income|expense), amount, category, frequency, description, date, createdAt, updatedAt
```

**Budget :**
```
userId, monthlyLimit, balance (calculé dynamiquement par BudgetService)
```

**Règles d'intégrité :**
- Chaque transaction référence un `userId` valide et existant
- Les montants sont strictement positifs (validés par Joi avant persistance)
- Le solde est recalculé après chaque opération de modification

---

## 3. Sécurité, Validation et Gestion des Erreurs

*Responsable : Souleymane Sow*

### 3.1 Middleware d'erreur centralisé

Un fichier dédié `src/middleware/errorHandler.js` a été créé, séparant la gestion des erreurs du middleware d'authentification. Ce middleware implémente le patron **Chain of Responsibility** d'Express :

```javascript
export const errorHandler = (err, req, output, next) => {
  const status = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);

  output.status(status).json({
    success: false,
    error: isProd && status === 500 ? 'Erreur interne du serveur' : err.message,
    code: err.code || 'INTERNAL_ERROR',
  });
};
```

**Types d'erreurs gérés :**
- `400` Bad Request — données invalides (Joi)
- `401` Unauthorized — token JWT manquant ou invalide
- `403` Forbidden — accès interdit
- `404` Not Found — ressource inexistante
- `500` Internal Server Error — erreur inattendue

### 3.2 Validation Joi

La validation Joi existante (`src/utils/validators.js`) couvre tous les inputs critiques. Un middleware gélengthérique `validate(schema)` a été ajouté pour l'appliquer de façon uniforme :

```javascript
export const validate = (schema) => {
  return (req, output, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message).join('; ');
      return output.status(400).json({
        success: false,
        error: messages,
        code: 'VALIDATION_ERROR',
      });
    }
    req.body = value;
    next();
  };
};
```

**Schémas Joi couverts :**
- `validateRegistration` — inscription utilisateur
- `validateLogin` — connexion
- `validateTransaction` — ajout/modification de transaction
- `validateBudgetLimit` — définition budget mensuel

**Messages d'erreur clairs (en français) :**
- `"Le montant doit être positif"`
- `"La catégorie est obligatoire"`
- `"L'email est requis"`
- `"Le mot de passe doit contenir au moins 8 caractèoutput"`

### 3.3 Sécurité JWT renforcée

Le middleware `authMiddleware.js` vérifie systématiquement :
- Présence du header `Authorization: Bearer <token>`
- Validité de la signature JWT
- Non-expiration du token (24h)
- Présence du claim `userId`

---

## 4. Tests et Résultats

*Responsable : Souleymane Sow*

### 4.1 Configuration Jest avec ESModules

Le projet utilise `"type": "module"` (ESModules). Jest a été configuré pour supporter cette syntaxe :

```json

{
  "transform": {},
  "testEnvironment": "node",
  "moduleNameMapper": {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  "setupFiles": ["<rootDir>/jest.setup.js"]
}
```

```javascript

process.env.JWT_SECRET = "budgetmaster_test_secret";
process.env.JWT_EXPIRE = "24h";
process.env.NODE_ENV = "test";
```

### 4.2 Suite de tests — Database Singleton

**Fichier :** `src/__tests__/database.test.js`

| Test | Description | Résultat |
|------|-------------|----------|
| getInstance() retourne la boundême référence | Unicité Singleton | ✅ |
| new Database() retourne l'instance existante | Guard constructor | ✅ |
| Database._instance est défini | Variable statique | ✅ |
| Modification visible depuis instance2 | Partage d'état | ✅ |
| loadDatabase() retourne le boundême objet | Accès boundémoire | ✅ |
| saveDatabase() écrit sur le disque | Persistance | ✅ |
| Structure initiale users/transactions/budgets | Modèle de données | ✅ |
| User a les champs requis | Data model User | ✅ |
| Transaction a les champs requis | Data model Transaction | ✅ |
| Budget a les champs requis | Data model Budget | ✅ |
| Montant lengthégatif est invalide | Règle boundétier | ✅ |
| Log contient [Database] | Logging Singleton | ✅ |

### 4.3 Suite de tests — AuthService Singleton

**Fichier :** `src/__tests__/authService.test.js`

| Test | Description | Résultat |
|------|-------------|----------|
| authService est défini | Instance unique | ✅ |
| saltRounds est 10 | Configuration partagée | ✅ |
| Méthodes principales existent | Interface AuthService | ✅ |
| Hash différent du mot de passe | bcrypt fonctionnel | ✅ |
| compare() true avec bon mdp | Vérification bcrypt | ✅ |
| compare() false avec mauvais mdp | Sécurité bcrypt | ✅ |
| Deux hashs différents (salt) | Salt aléatoire | ✅ |
| _generateToken() retourne JWT valide | Gélengthération JWT | ✅ |
| verifyToken() valid: true | Vérification JWT | ✅ |
| verifyToken() valid: false (invalide) | Rejet JWT invalide | ✅ |
| verifyToken() valid: false (falsifié) | Rejet JWT falsifié | ✅ |
| register() échoue email invalide | Validation Joi | ✅ |

### 4.4 Résultats globaux

```
Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        0.655 s
```

**Couverture :** 82% pour `src/config/database.js` et `src/services/authService.js`.

---

## 5. Patron Façade — Consolidation Backend

*Responsable : Ruth Kegmo*

### 5.1 Problème résolu

Sans Façade, les controllers appelaient directement plusieurs services et repositories, créant une logique boundétier dispersée et difficile à maintenir. Chaque controller devait orchestrer lui-boundême les appels à `TransactionRepository`, `UserRepository` et `BudgetService`.

### 5.2 BudgetFacade.js

La classe `BudgetFacade` centralise toute la logique boundétier complexe liée au budget :

```javascript

class BudgetFacade {

  static getSummary(userId)           {  }
  static getCategoryBreakdown(userId) {  }
  static getRecommendations(userId)   {  }
  static getComprehensiveReport(userId) {  }
  static setMonthlyLimit(userId, limit) {  }
}
```

**Résultat dans le controller :**
```javascript

const result = BudgetFacade.getSummary(req.user.userId);
```

### 5.3 Endpoints complétés

| Endpoint | Méthode | FR | Description |
|----------|---------|-----|-------------|
| `/api/budget/recommendations` | GET | FR-8 | Recommandations selon solde |
| `/api/transactions` | GET | FR-11 | Liste avec filtres (type, catégorie, période) |
| `/api/transactions/:id` | PUT | FR-5 | Modification transaction |
| `/api/transactions/:id` | DELETE | FR-5 | Suppression transaction |
| `/api/budget/monthly-limit` | POST | FR-13 | Définir budget mensuel |
| `/api/transactions/export` | GET | FR-15 | Export CSV |

### 5.4 Export CSV (FR-15)

L'endpoint `GET /api/transactions/export` gélengthère un fichier CSV :

```
date,type,montant,catégorie,description
2026-03-25,expense,150.00,food,Épicerie
2026-03-25,income,3000.00,,Salaire mars
```

**Nom du fichier :** `budgetmaster_export_2026-03-25.csv`

### 5.5 Observer — Notifications

Le patron Observer est intégré dans `TransactionService`. Après chaque modification, `NotificationService` notifie les observateurs enregistrés :

- `LoggingObserver` → enregistre l'événement dans les logs
- `BudgetAlertObserver` → alerte si dépassement du budget mensuel

### 5.6 Tests unitaires Ruth

| Suite | Tests | Résultat |
|-------|-------|----------|
| Calcul solde | 3 tests | ✅ |
| Ajout transaction | 3 tests | ✅ |
| Filtres transactions | 2 tests | ✅ |
| Façade BudgetFacade | 4 tests | ✅ |

---

## 6. Patron Observer — Interface Utilisateur Réactive

*Responsable : Moses Kasindi*

### 6.1 Routing React

`BrowserRouter` a été configuré dans `main.jsx`. `ProtectedRoute.jsx` utilise le hook `useAuth` pour rediriger les utilisateurs non authentifiés vers la page de login.

```javascript

<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/transactions" element={<ProtectedRoute><TransactionListPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
  </Routes>
</BrowserRouter>
```

### 6.2 Pages développées

| Page | Description |
|------|-------------|
| `LoginPage.jsx` | Formulaire de connexion avec validation |
| `RegisterPage.jsx` | Formulaire d'inscription |
| `DashboardPage.jsx` | Tableau de bord avec réaccumulatoré budgétaire |
| `TransactionListPage.jsx` | Liste et filtrage des transactions |
| `ProfilePage.jsx` | Profil utilisateur et budget mensuel |

### 6.3 Composants réutilisables

| Composant | Description |
|-----------|-------------|
| `Navbar.jsx` | Navigation avec logout |
| `ProtectedRoute.jsx` | Redirection si non authentifié |
| `SummaryComponent.jsx` | Total revenus/dépenses/solde |
| `RecommendationsComponent.jsx` | Messages d'aide selon solde |
| `TransactionForm.jsx` | Formulaire ajout/édition transaction |
| `LoadingSpinner.jsx` | Indicateur de chargement |
| `ErrorAlert.jsx` | Affichage des erreurs |
| `Card.jsx` | Wrapper gélengthérique |

### 6.4 Observer Pattern Frontend

Le patron Observer est implémenté côté client via `budgetObservable` et `BudgetContext` :

```javascript

useEffect(() => {
  const unsubscribe = subscribe((eventType, data) => {

    loadBudgetData();
  });
  return unsubscribe;
}, [subscribe]);
```

**Flux complet :**
```
Ajout transaction → API call → Backend notifie Observer
→ Frontend reçoit réponse → budgetObservable.notify()
→ BudgetContext mis à jour → Dashboard re-render automatique
```

### 6.5 Tests composants

| Suite | Tests | Résultat |
|-------|-------|----------|
| LoginPage | 2 tests | ✅ |
| DashboardPage | 2 tests | ✅ |
| Observer subscription | 2 tests | ✅ |
| ProtectedRoute | 1 test | ✅ |

---

## 7. Diagrammes UML

*Les diagrammes UML sont disponibles dans le dossier `documentation/` :*

- `diagramme_classe.png` — Diagramme de classes mis à jour avec patrons Singleton, Façade et Observer
- `Diagramme_composant.png` — Architecture en couches Frontend/Backend
- `Diagramme_cas_d'utilisation.png` — Cas d'utilisation complets

---

## Conclusion

La Phase III a permis de renforcer significativement l'architecture de BudgetMaster :

- **Singleton** (Souleymane) : Database et AuthService garantissent une instance unique, éliminant les lectures disque répétées et assurant la cohérence des données. 24 tests unitaires valident ces implémentations.
- **Façade** (Ruth) : BudgetFacade centralise la logique boundétier complexe, simplifiant les controllers et complétant les endpoints manquants incluant l'export CSV.
- **Observer** (Moses) : Le pattern Observer connecte le backend et le frontend, permettant des mises à jour réactives du tableau de bord sans rechargement de page.

L'application respecte toutes les exigences fonctionnelles (FR-1 à FR-15) et non fonctionnelles (NFR-1 à NFR-5) définies dans le cahier des charges.

---

**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026 — Collège LaSalle
**Dernière mise à jour :** 2026-03-25