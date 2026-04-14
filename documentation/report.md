# Rapport — BudgetMaster
## Application web de gestion budgétaire personnelle
 
**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026 — Collège LaSalle
**Tableau de bord agile :** [Asana](https://app.asana.com)
 
---

## Phase I — Lancement du projet
**Période :** 8 janvier au 25 janvier 2026
**Pondération :** 10%

### 1.1 Formation de l'équipe
 
L'équipe est composée de trois étudiants du programme Techniques de l'informatique au Collège LaSalle : 
Souleymane Sow, Moses Kasindi et Ruth Kegmo. Les responsabilités ont été réparties dès le départ 
Souleymane prend en charge l'architecture backend et la base de données, 
Moses développe le frontend React, 
Ruth consolide la logique métier et les patrons comportementaux.

### 1.2 Idée et type de projet
 
BudgetMaster est une application web de gestion budgétaire personnelle. 
L'idée vient d'un besoin réel notamment nos expériences à meme 
les étudiants et jeunes actifs ont du mal à avoir une vision claire de leur situation financière entre les revenus limités, 
les dépenses récurrentes et les dépenses variables. Le type de produit retenu est une application web accessible depuis un navigateur, sans installation requise.

### 1.3 Mise en place du dépôt Git
 
Le dépôt GitHub `https://github.com/ssow520/BudgetMaster_MP6` a été créé avec la structure demandée.
le `README.md` à la racine, dossier `documentation/` contenant le cahier des charges et les registres de décisions architecturales. 
Les commits sont réguliers et structurés avec le format `[FEATURE]`, `[BUGFIX]`, `[DOCS]`, `[REFACTOR]`.

### 1.4 Mise en place d'Asana
 
Le tableau de bord Asana a été configuré pour suivre l'avancement du projet par sprints. 
Chaque phase correspond à un sprint avec des tâches assignées à chaque membre.
 
---

## Phase II — Analyse, exigences et premiers patrons
**Période :** 26 janvier au 22 février 2026
**Pondération :** 10%

### 2.1 Corrections suite aux commentaires Phase I

Suite aux commentaires reçus, les liens cassés dans le `README.md` ont été corrigés vers le bon chemin `documentation/SRS.md`. 
L'accessibilité du SRS depuis la page principale du dépôt a été validée.

### 2.2 Cahier des charges

Les 15 exigences fonctionnelles et 5 exigences non fonctionnelles sont documentées dans `documentation/SRS.md`. 
La Phase II a renforcé leur formulation selon le format standard "Le système doit…" et ajouté des critères de validation pour chaque exigence.
Des cas d'erreur ont été ajoutés : email déjà utilisé, identifiants invalides, montant négatif ou nul, transaction inexistante.
 
Le périmètre inclut la création et gestion de compte, l'authentification, le CRUD des revenus et dépenses, 
le calcul automatique du solde, l'historique des transactions, le tableau de bord budgétaire et les recommandations simples. 
Sont exclus : la connexion à des comptes bancaires réels, les paiements en ligne, le multi-devises et l'intelligence artificielle avancée.

### 2.3 Modèle de données

Trois entités principales ont été définies.

**User :** id, firstName, lastName, email, password (hashé bcrypt), monthlyBudgetLimit, createdAt, updatedAt.

**Transaction :** id, userId, type (income ou expense), amount, category, frequency, description, date, createdAt, updatedAt.

**Budget :** userId, monthlyLimit. Le solde est calculé dynamiquement par BudgetService à partir des transactions — jamais stocké directement pour éviter les incohérences.

### 2.4 Diagrammes UML Phase II

`documentation/Diagramme_composant.png` — architecture en trois sous-systèmes : Frontend React, Backend API REST, Data Layer. 
Le frontend communique avec le backend via les interfaces IAuthAPI et IBudgetAPI.

`documentation/Diagramme_cas_d'uilisation.png` — cas d'utilisation regroupés en quatre blocs : 
gestion du compte, gestion des transactions, calcul budgétaire, administration. 
Toute modification de transaction déclenche automatiquement le calcul du solde.
 
`documentation/diagramme_classe initial.png` — DashboardPage composée de Card (IncomeCard, ExpenseCard, 
BalanceCard héritant de la classe abstraite Card). 
DashboardService communique via ApiClient pour récupérer les données sous forme de DashboardDTO.

### 2.5 Prototype initial
 
Un prototype fonctionnel a été développé avec les fonctionnalités de base : authentification JWT, ajout de transactions, calcul du solde. 
Ce prototype a servi de base pour la Phase III.

---
 
## Phase III — Raffinement architectural et conception avancée
**Période :** 23 février au 29 mars 2026

### 3.1 Corrections suite à la Phase II

L'architecture backend a été réorganisée avec des dépendances unidirectionnelles : 
`routes/ → controllers/ → services/ → repositories/ → database/`. 
La gestion des erreurs a été centralisée dans `errorHandler.js`. L'authentification JWT a été renforcée. 
Le modèle de données a été normalisé avec des valeurs par défaut explicites.

### 3.2 Patron Singleton — Base de données et services

#### Problème identifié
 
Sans Singleton, chaque appel à `loadDatabase()` effectuait une lecture disque. Pour une simple opération `register`, 
cela représentait 3 lectures disque consécutives. Deux modules pouvaient aussi charger des versions différentes des données en mémoire.

#### Solution — Singleton Database

```javascript
class Database {
  constructor() {
    if (Database._instance) {
      return Database._instance;
    }
    this._data = this._readFromDisk();
    Database._instance = this;
    console.log('[Database] Singleton instancié — données chargées en mémoire');
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
Double mécanisme de protection : cache de modules Node.js et variable statique `Database._instance`. 
Après le démarrage, toutes les lectures viennent de la RAM. Un backup `.bak` est créé automatiquement avant chaque écriture.
 
Le même patron est appliqué à AuthService, BudgetService, TransactionService, UserService, NotificationService et BudgetFacade.

#### Singleton AuthService

```javascript
class AuthService {
  constructor() {
    if (AuthService.instance) return AuthService.instance;
    this.saltRounds = 10;
    AuthService.instance = this;
  }
}
 
const authService = new AuthService();
export default authService;
```
Le `saltRounds = 10` est configuré une seule fois. Le secret JWT reste constant pendant toute la durée de vie du serveur.

### 3.3 Sécurité, validation et gestion des erreurs

`errorHandler.js` est séparé de `authMiddleware.js` pour respecter le principe de responsabilité unique. 
Il intercepte toutes les erreurs non gérées et masque les détails des erreurs 500 en production. 
Quatre schémas Joi couvrent tous les inputs critiques : inscription, connexion, transaction, limite budget. 
L'option `abortEarly: false` collecte toutes les erreurs en une seule passe. 
La même erreur générique est retournée que l'email n'existe pas ou que le mot de passe soit incorrect 
pour ne pas indiquer à un attaquant si l'email est dans le système.

### 3.4 Tests et résultats

Jest est configuré avec `--experimental-vm-modules` pour supporter les ESModules natifs. 
Un fichier `jest.setup.js` injecte les variables d'environnement nécessaires.
 
**Tests Database Singleton** (`src/__tests__/database.test.js`) — 12 tests couvrant 
l'unicité du Singleton, le partage d'état, le modèle de données et le logging au démarrage.
 
**Tests AuthService Singleton** (`src/__tests__/authService.test.js`) — 12 tests couvrant l'unicité de 
l'instance, bcrypt (hash irréversible, salt aléatoire), JWT (génération, vérification, rejet des tokens falsifiés) et la validation Joi.
 
**Tests Ruth** (`backend/__tests__/`) — 62 tests couvrant BudgetFacade, BalanceCalculation, FilteringAndQueries et ObserverPattern.

Résultat global :
```
Test Suites: 7 passed, 7 total
Tests:       86 passed, 86 total
Time:        1.2 s
```
### 3.5 Patron Façade — Consolidation backend

Sans Façade, les controllers orchestraient eux-mêmes plusieurs services, créant de la duplication et risquant d'oublier les notifications. 
`BudgetFacade` centralise 9 méthodes publiques qui garantissent qu'on ne peut pas ajouter une transaction sans que 
le budget soit recalculé et la notification envoyée.

Les endpoints complétés en Phase III sont `GET /api/budget/recommendations` (FR-8), 
les filtres sur `GET /api/transactions` (FR-11), `PUT` et `DELETE /api/transactions/:id` (FR-5), 
`POST /api/budget/set-monthly-limit` (FR-13) et `GET /api/transactions/export` (FR-15).

### 3.6 Patron Observer — Notifications

`Observable` maintient une liste d'observateurs. `Observer` est une classe abstraite avec une méthode `update()`. 
`LoggingObserver` et `BudgetAlertObserver` héritent de `Observer` et redéfinissent `update()` différemment c'est du polymorphisme. 
`NotificationService` orchestre les notifications.

Quand une transaction est ajoutée, `NotificationService.notify('transaction.added', data)` déclenche `update()` sur tous les observateurs. 
Si le budget est dépassé, `budget_exceeded` est déclenché automatiquement.

### 3.7 Frontend React

Pages développées : LoginPage, RegisterPage, DashboardPage (connecté au backend), TransactionListPage et ProfilePage. 
Composants principaux : Navbar (avec expiration de session 30 minutes), ProtectedRoute, SummaryComponent (format monétaire canadien), 
RecommendationsComponent, TransactionForm (catégories, fréquence, date par défaut). `AuthContext` persiste la session au rechargement de page.
 
### 3.8 Diagrammes UML Phase III
 
`documentation/Diagramme de classe mis a jour.png` — diagramme de classes mis à jour avec les patrons Singleton, 
Façade et Observer, incluant toutes les classes backend et frontend.
 
`documentation/Diagramme_composant.png` — architecture en couches mise à jour.
 
`documentation/Diagramme_cas_d'uilisation.png` — cas d'utilisation FR-1 à FR-15.
 
### 3.9 Conclusion
 
La Phase III a permis de consolider l'architecture de BudgetMaster autour de trois patrons de conception. 
Le Singleton garantit la cohérence des données et des configurations partagées. 
La Façade simplifie les controllers et centralise la logique métier. 
L'Observer découple les services qui génèrent des événements de ceux qui y réagissent.
 
L'application respecte toutes les exigences fonctionnelles (FR-1 à FR-15) et non fonctionnelles (NFR-1 à NFR-5) 
définies dans le cahier des charges. 86 tests passent.
 
---
 
**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026 — Collège LaSalle
**Dernière mise à jour :** 2026-03-29
 