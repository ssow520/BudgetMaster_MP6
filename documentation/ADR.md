# Architecture Decision Records — BudgetMaster Phase III

---

## ADR-01 — Singleton pour la base de données

**Statut :** Accepted
**Date :** 2026-03-29
**Décideurs :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Contexte projet :** BudgetMaster / backend

---

### 1. Contexte
- **Problème :** Le fichier `database.json` est lu et écrit par plusieurs modules. Sans contrôle, deux modules peuvent charger des versions différentes et se marcher dessus.
- **Contraintes :** Pas de BD relationnelle (contrainte du cours), fichier JSON local, Node.js ESM.
- **Forces en présence :** cohérence des données, performance, simplicité de débogage.

---

### 2. Décision
On garde une seule instance de `Database` dans toute l'application. Tous les modules passent par `Database.getInstance()` pour lire ou écrire.

---

### 3. Alternatives considérées
#### Option A — Singleton (choisie)
- **Pour :** une seule source de vérité en RAM, zéro I/O après démarrage, backup `.bak` automatique.
- **Contre :** un peu plus rigide si on voulait plusieurs bases un jour.

#### Option B — Relire le fichier à chaque requête
- **Pour :** simple à coder.
- **Contre :** lent, risque de désynchronisation entre modules.

---

### 4. Pourquoi ce choix
Sans Singleton, deux services qui écrivent en même temps peuvent corrompre les données. La double protection (cache Node.js + guard dans le constructeur) garantit l'unicité même en ESM où le cache module peut être contourné.

---

### 5. Conséquences
**Bien :** données toujours cohérentes, performances bonnes, backup automatique avant chaque écriture.

**Risques :** les tests doivent remettre `Database._instance = null` entre les suites pour repartir proprement.

**Modules touchés :** `UserRepository`, `TransactionRepository` — les deux dépendent de `Database.getInstance()`.

---

### 6. Implémentation
- [x] `backend/src/config/database.js` — classe Singleton avec guard constructor
- [x] Exports `loadDatabase()` et `saveDatabase()` pour la rétrocompatibilité
- [x] Backup `.bak` avant chaque `saveDatabase()`
- [x] 12 tests Jest passent

---

### 7. Comment vérifier
- `Database.getInstance() === new Database()` doit retourner `true`
- Une modif via instance1 est visible depuis instance2
- 12/12 tests `database.test.js` verts

---

### 8. Références
- `backend/src/config/database.js`
- `backend/src/__tests__/database.test.js`
- `documentation/diagramme_classe.png`

---

## ADR-02 — Singleton pour AuthService

**Statut :** Accepted
**Date :** 2026-03-29
**Décideurs :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Contexte projet :** BudgetMaster / backend

---

### 1. Contexte
- **Problème :** `AuthService` configure bcryptjs (saltRounds) et JWT (secret). Si plusieurs instances existent, les tokens générés par l'une ne seront pas vérifiables par l'autre.
- **Contraintes :** sécurité des sessions, cohérence des hash bcrypt.
- **Forces en présence :** sécurité, performance (bcrypt est intentionnellement lent).

---

### 2. Décision
Une seule instance d'`AuthService` dans tout le backend, accessible via `AuthService.getInstance()` ou via l'export par défaut.

---

### 3. Alternatives considérées
#### Option A — Singleton (choisie)
- **Pour :** configuration JWT et bcrypt initialisée une seule fois, pas de risque de divergence.
- **Contre :** plus difficile de tester avec des configs différentes sans mocker.

#### Option B — Fonctions statiques uniquement
- **Pour :** pas besoin d'instanciation.
- **Contre :** on perd la flexibilité d'injecter une configuration différente en test.

---

### 4. Pourquoi ce choix
Le `saltRounds` doit rester à 10 pour que les hash soient comparables. Le secret JWT doit être constant pendant toute la durée de vie du serveur. Le Singleton garantit ça naturellement.

---

### 5. Conséquences
**Bien :** une seule config JWT, performance bcrypt stable.

**Risques :** les tests ont besoin de `JWT_SECRET` dans l'environnement — géré via `jest.setup.js`.

**Modules touchés :** `AuthController`, `authMiddleware`.

---

### 6. Implémentation
- [x] `backend/src/services/authService.js` — Singleton avec `getInstance()`
- [x] Export de l'instance par défaut pour les contrôleurs
- [x] `backend/jest.setup.js` avec `process.env.JWT_SECRET`
- [x] 12 tests Jest passent

---

### 7. Comment vérifier
- `authService.saltRounds === 10` → `true`
- Token généré puis vérifié → `valid: true`
- Token modifié manuellement → `valid: false`
- 12/12 tests `authService.test.js` verts

---

### 8. Références
- `backend/src/services/authService.js`
- `backend/src/__tests__/authService.test.js`

---

## ADR-03 — Façade pour BudgetFacade

**Statut :** Accepted
**Date :** 2026-03-29
**Décideurs :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Contexte projet :** BudgetMaster / backend

---

### 1. Contexte
- **Problème :** Chaque opération sur les transactions implique 3-4 services : créer la transaction, recalculer le budget, envoyer une notification. Sans façade, ce code se répète dans chaque contrôleur.
- **Contraintes :** SOLID, lisibilité du code, facilité de test.
- **Forces en présence :** maintenabilité, SRP, éviter la duplication.

---

### 2. Décision
On crée `BudgetFacade` comme point d'entrée unique pour toutes les opérations complexes. Les contrôleurs appellent la façade, pas les services directement.

---

### 3. Alternatives considérées
#### Option A — Façade Singleton (choisie)
- **Pour :** interface simple pour les contrôleurs, orchestration centralisée, notifications toujours déclenchées.
- **Contre :** la classe peut grossir — il faut surveiller qu'elle ne devienne pas un "God Object".

#### Option B — Appels directs aux services depuis les contrôleurs
- **Pour :** code plus direct, moins d'indirection.
- **Contre :** on duplique l'orchestration dans chaque contrôleur, les notifications peuvent être oubliées.

---

### 4. Pourquoi ce choix
La façade garantit qu'on ne peut pas ajouter une transaction sans que le budget soit recalculé et la notification envoyée. C'est une contrainte métier importante qu'on ne veut pas laisser à la discrétion de chaque contrôleur.

---

### 5. Conséquences
**Bien :** contrôleurs minimalistes, logique métier centralisée, CSV et rapport complet accessibles depuis un seul endroit.

**Risques :** la façade doit rester un orchestrateur — si elle contient trop de logique métier, il faut la diviser.

**Modules touchés :** `BudgetController`, `TransactionController` délèguent tout à `BudgetFacade`.

---

### 6. Implémentation
- [x] `backend/src/services/BudgetFacade.js` — 9 méthodes publiques
- [x] `_ensureUserExists()` pour créer un utilisateur de test si nécessaire
- [x] Intégration `NotificationService` dans chaque opération
- [x] 86/86 tests Jest passent

---

### 7. Comment vérifier
- `BudgetFacade.getInstance() === BudgetFacade.getInstance()` → `true`
- Ajout d'une transaction → budget recalculé → notification envoyée
- Tous les tests `BudgetFacade.test.js` verts

---

### 8. Références
- `backend/src/services/BudgetFacade.js`
- `backend/__tests__/BudgetFacade.test.js`

---

## ADR-04 — Observer pour NotificationService

**Statut :** Accepted
**Date :** 2026-03-29
**Décideurs :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Contexte projet :** BudgetMaster / backend

---

### 1. Contexte
- **Problème :** Quand une transaction est ajoutée ou qu'un budget est dépassé, plusieurs composants doivent réagir (logger, alerte budget). Sans Observer, `TransactionService` devrait connaître et appeler chacun de ces composants directement.
- **Contraintes :** couplage faible, extensibilité future, OCP.
- **Forces en présence :** découplage, testabilité, ajout facile de nouveaux abonnés.

---

### 2. Décision
On implémente le patron Observer avec `Observable`, une classe abstraite `Observer`, et deux observateurs concrets : `LoggingObserver` et `BudgetAlertObserver`.

---

### 3. Alternatives considérées
#### Option A — Observer Pattern (choisi)
- **Pour :** on peut ajouter un `EmailObserver` demain sans toucher au code existant.
- **Contre :** plus de classes à maintenir.

#### Option B — Appels directs dans TransactionService
- **Pour :** simple.
- **Contre :** couplage fort, viole OCP, difficile à tester.

---

### 4. Pourquoi ce choix
Le patron Observer est le choix naturel quand plusieurs composants doivent réagir aux mêmes événements. Il démontre aussi héritage et polymorphisme — deux des quatre piliers POO demandés dans le cours.

---

### 5. Conséquences
**Bien :** ajout d'un observateur sans modifier `NotificationService`, tests indépendants grâce à `clearSubscribers()`.

**Risques :** si `clearSubscribers()` n'est pas appelé entre les tests, les observateurs s'accumulent et faussent les résultats.

**Modules touchés :** `TransactionService` et `BudgetFacade` appellent `NotificationService.notify()`.

---

### 6. Implémentation
- [x] `backend/src/utils/observer.js` — classes `Observable` et `Observer` abstraite
- [x] `LoggingObserver` et `BudgetAlertObserver`
- [x] `NotificationService` Singleton avec `subscribe()` et `clearSubscribers()`
- [x] Tests Observer passent

---

### 7. Comment vérifier
- Ajout transaction → `transaction.added` reçu par les observateurs
- Dépassement budget → `budget_exceeded` déclenché
- `clearSubscribers()` → 2 observateurs par défaut (Logging + BudgetAlert)

---

### 8. Références
- `backend/src/utils/observer.js`
- `backend/src/services/notificationService.js`
- `backend/__tests__/ObserverPattern.test.js`

---

## ADR-05 — Architecture monorepo Node.js/Express + React/Vite

**Statut :** Accepted
**Date :** 2026-03-29
**Décideurs :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Contexte projet :** BudgetMaster / architecture globale

---

### 1. Contexte
- **Problème :** L'équipe est divisée en deux — frontend (Moses) et backend (Souleymane). On a besoin d'une structure qui permet de travailler en parallèle sans bloquer l'autre.
- **Contraintes :** stack imposée par le cours (Node.js, React), délai court, trois membres d'équipe.
- **Forces en présence :** séparation des responsabilités, développement parallèle, déploiement indépendant possible.

---

### 2. Décision
Deux workspaces npm (`frontend/` et `backend/`) dans un monorepo. Un seul `npm run dev` à la racine lance les deux via `concurrently`.

---

### 3. Alternatives considérées
#### Option A — Monorepo avec workspaces (choisie)
- **Pour :** développement parallèle, séparation claire, un seul `git clone` pour tout.
- **Contre :** CORS à configurer, deux ports à gérer.

#### Option B — Rendu côté serveur (SSR)
- **Pour :** un seul serveur.
- **Contre :** hors scope du cours, complexité inutile.

---

### 4. Pourquoi ce choix
Moses a développé son frontend indépendamment avec des données mockées. L'intégration s'est faite en Phase III en connectant son `apiClient` au backend Express. Le monorepo a facilité ça sans restructurer le projet.

---

### 5. Conséquences
**Bien :** chaque partie est testable indépendamment, `npm run dev` lance tout d'un coup.

**Risques :** le frontend peut tomber sur le port 5174 si 5173 est occupé — le CORS doit accepter les deux.

**Modules touchés :** `frontend/vite.config.js` (proxy), `backend/src/server.js` (CORS).

---

### 6. Implémentation
- [x] Workspaces npm dans `package.json` racine
- [x] CORS backend : accepte `localhost:5173` et `localhost:5174`
- [x] Proxy Vite : `/api` → `localhost:3001`
- [x] `concurrently` dans le script `dev`

---

### 7. Comment vérifier
- `POST /api/auth/register` → `201 Created`
- `POST /api/auth/login` → `200 OK` + token JWT
- Dashboard affiche `totalIncome: 0` pour un nouveau compte

---

### 8. Références
- `backend/src/server.js`
- `frontend/vite.config.js`
- `package.json` (racine)