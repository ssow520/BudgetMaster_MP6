# Architecture Decision Records — BudgetMaster
---
## ADR-01 — Architecture applicative Node.js/Express + React

**Statut :** Accepté  
**Date :** 2026-03-29  
**Décideurs :** Ruth, Souleymane, Moses  
**Contexte projet :** BudgetMaster
---
## 1. Contexte
**Problème :** Concevoir une application de gestion de budget moderne, évolutive, et accessible sur le web, avec une séparation claire entre la logique et l'interface utilisateur.
**Contraintes :** Délai limité, équipe de trois personnes, technologies imposées par le cours.
**Forces en présence :** Maintenabilité, séparation des responsabilités, facilité de test.

---

## 2. Décision
Nous choisissons une architecture composée d'un backend Node.js/Express (API REST) et d'un frontend React (SPA).
**Nous choisissons :** Node.js/Express pour le backend, React pour le frontend, communication via API REST.
**Pour :** Permettre une séparation des responsabilités et faciliter l'évolution indépendante des deux parties.

---

## 3. Alternatives considérées

### Option A — application Express avec vues intégrées
**Avantages :** Simplicité de déploiement, moins de configuration initiale.
**Inconvénients :** Couplage fort entre frontend et backend et moins flexible pour l'évolution.

### Option B — Architecture microservices
**Avantages :** Isolation des composants, maintenance facilitée à grande échelle.
**Inconvénients :** complexité excessive pour un projet académique de cette taille.

---

## 4. Justification
- Permet d'utiliser des technologies apprise par l'équipe au cours de la session.
- Favorise la maintenabilité, la clarté du code et la séparation des responsabilités.

---

## 5. Conséquences
### Positives
- Développement parallèle possible entre frontend et backend.
- Facilité de tests unitaires et d'intégration.
- Possibilité de réutiliser l'API pour d'autres choses.

### Négatives
- Nécessite la gestion de la communication entre deux serveurs.
- plus de complexité.

---

## 6. Plan d’implémentation
- [x] Backend Node.js/Express initialisé avec routes, controllers, services, repositories
- [x] Frontend React/Vite initialisé
- [x] Proxy Vite configuré : `/api` → `localhost:3001`
- [x] CORS backend : accepte `localhost:5173` et `localhost:5174`
- [x] Script `npm run dev` lance les deux avec `concurrently`

---

## 7. Validation
**Comment vérifier que c’est bon ?**
- `POST /api/auth/register` → `201 Created`
- `POST /api/auth/login` → `200 OK` + token JWT
- Frontend charge les données réelles du backend

---

### 8. Références
- `backend/src/server.js`
- `frontend/vite.config.js`
- `documentation/ARCHITECTURE.md`
- `documentation/SRS.md`

---
 
## ADR-02 — Singleton pour la base de données

**Statut :** Accepté
**Date :** 2026-03-29
**Décideurs :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Contexte projet :** BudgetMaster / backend

---

### 1. Contexte
- **Problème :** Le fichier `database.json` est lu et écrit par plusieurs modules. Sans contrôle, deux modules peuvent charger des versions différentes et se marcher dessus.
- **Contraintes :** Pas de base de données relationnelle, fichier JSON local, Node.js ESM.
- **Forces en présence :** cohérence des données, performance, simplicité de débogage.

---

### 2. Décision
On garde une seule instance de `Database` dans toute l'application. Tous les modules passent par `Database.getInstance()` pour lire ou écrire.

---

### 3. Alternatives considérées

#### Option A — Singleton (choisie)
- **Avantages :** une seule source de vérité en RAM, zéro I/O après démarrage, backup `.bak` automatique.
- **Inconvénients :** un peu plus rigide si on voulait plusieurs bases un jour.

#### Option B — Relire le fichier à chaque requête
- **Avantages :** simple à coder.
- **Inconvénients :** lent, risque de désynchronisation entre modules.

---
 
### 4. Pourquoi ce choix
Sans Singleton, deux services qui écrivent en même temps peuvent corrompre les données. La double protection cache (Node.js, guard dans le constructeur) garantit l'unicité même en ESM où le cache module peut être contourné.

---
 
### 5. Conséquences
#### Positives
données toujours cohérentes, performances optimales, backup automatique avant chaque écriture.

#### Négatives
les tests doivent remettre `Database._instance = null` entre les suites pour repartir proprement.

#### Modules touchés
`UserRepository`, `TransactionRepository` — les deux dépendent de `Database.getInstance()`.

---
 
### 6. Implémentation
- [x] `backend/src/config/database.js` — classe Singleton avec guard constructor
- [x] Exports `loadDatabase()` et `saveDatabase()` pour la rétrocompatibilité
- [x] Backup `.bak` avant chaque `saveDatabase()`
- [x] 12 tests Jest passent

---
 
### 7. Validation
- `Database.getInstance() === new Database()` → `true`
- Modification via instance1 visible depuis instance2
- 12/12 tests `database.test.js` verts

---
 
### 8. Références
- `backend/src/config/database.js`
- `backend/src/__tests__/database.test.js`

---
 
## ADR-03 — Singleton pour AuthService
 
**Statut :** Accepté
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
- **Avantages :** configuration JWT et bcrypt initialisée une seule fois, pas de risque de divergence.
- **Inconvénients :** plus difficile de tester avec des configs différentes sans mocker.

#### Option B — Fonctions statiques uniquement
- **Avantages :** pas besoin d'instanciation.
- **Inconvénients :** on perd la flexibilité d'injecter une configuration différente en test.
 
---

### 4. Pourquoi ce choix
Le `saltRounds` doit rester à 10 pour que les hash soient comparables. Le secret JWT doit être constant pendant toute la durée de vie du serveur. Le Singleton garantit ça naturellement.

---
 
### 5. Conséquences
 
#### Positives
une seule config JWT, performance bcrypt stable.
 
#### Negatives
les tests ont besoin de `JWT_SECRET` dans l'environnement — géré via `jest.setup.js`.
 
#### Modules touchés
`AuthController`, `authMiddleware`.
 
---

### 6. Implémentation
- [x] `backend/src/services/authService.js` — Singleton avec `getInstance()`
- [x] Export de l'instance par défaut pour les contrôleurs
- [x] `backend/jest.setup.js` avec `process.env.JWT_SECRET`
- [x] 12 tests Jest passent
 
---
 
### 7. Validation
- `authService.saltRounds === 10` → `true`
- Token généré puis vérifié → `valid: true`
- Token modifié manuellement → `valid: false`
- 12/12 tests `authService.test.js` verts
 
---
 
### 8. Références
- `backend/src/services/authService.js`
- `backend/src/__tests__/authService.test.js`
 
---

## ADR-04 — Façade pour BudgetFacade
 
**Statut :** Accepté
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
- **Avantages :** interface simple pour les contrôleurs, orchestration centralisée, notifications toujours déclenchées.
- **Inconvénients :** la classe peut grossir — il faut surveiller qu'elle ne devienne pas un God Object.
 
#### Option B — Appels directs aux services depuis les contrôleurs
- **Avantages :** code plus direct, moins d'indirection.
- **Inconvénients :** on duplique l'orchestration dans chaque contrôleur, les notifications peuvent être oubliées.
 
---
 
### 4. Pourquoi ce choix
La façade garantit qu'on ne peut pas ajouter une transaction sans que le budget soit recalculé et la notification envoyée. C'est une contrainte métier importante qu'on ne veut pas laisser à la discrétion de chaque contrôleur.
 
---
 
### 5. Conséquences
 
#### Positives
contrôleurs minimalistes, logique métier centralisée, CSV et rapport complet accessibles depuis un seul endroit.
 
#### Negatives
la façade doit rester un orchestrateur — si elle contient trop de logique métier, il faut la diviser.
 
#### Modules touchés 
`BudgetController`, `TransactionController` délèguent tout à `BudgetFacade`.
 
---
 
### 6. Implémentation
- [x] `backend/src/services/BudgetFacade.js` — 9 méthodes publiques
- [x] `_ensureUserExists()` pour créer un utilisateur si nécessaire
- [x] Intégration `NotificationService` dans chaque opération
- [x] 86/86 tests Jest passent
 
---
 
### 7. Validation
- `BudgetFacade.getInstance() === BudgetFacade.getInstance()` → `true`
- Ajout d'une transaction → budget recalculé → notification envoyée
- Tous les tests `BudgetFacade.test.js` verts
 
---
 
### 8. Références
- `backend/src/services/BudgetFacade.js`
- `backend/__tests__/BudgetFacade.test.js`
 
---
 
## ADR-05 — Observer pour NotificationService
 
**Statut :** Accepté
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
 
#### Option A — Observer Pattern (choisie)
- **Avantages :** on peut ajouter un `EmailObserver` demain sans toucher au code existant.
- **Inconvénients :** plus de classes à maintenir.
 
#### Option B — Appels directs dans TransactionService
- **Avantages :** simple.
- **Inconvénients :** couplage fort, viole OCP, difficile à tester.
 
---
 
### 4. Pourquoi ce choix
Le patron Observer est le choix naturel quand plusieurs composants doivent réagir aux mêmes événements. Il démontre aussi héritage et polymorphisme — deux des quatre piliers POO demandés dans le cours.
 
---
 
### 5. Conséquences
 
#### Positives
Ajout d'un observateur sans modifier `NotificationService`, tests indépendants grâce à `clearSubscribers()`.
 
#### Negatives 
si `clearSubscribers()` n'est pas appelé entre les tests, les observateurs s'accumulent et faussent les résultats.
 
#### Modules touchés
`TransactionService` et `BudgetFacade` appellent `NotificationService.notify()`.
 
---
 
### 6. Implémentation
- [x] `backend/src/utils/observer.js` — classes `Observable` et `Observer` abstraite
- [x] `LoggingObserver` et `BudgetAlertObserver`
- [x] `NotificationService` Singleton avec `subscribe()` et `clearSubscribers()`
- [x] Tests Observer passent
 
---
 
### 7. Validation
- Ajout transaction → `transaction.added` reçu par les observateurs
- Dépassement budget → `budget_exceeded` déclenché
- `clearSubscribers()` → 2 observateurs par défaut (Logging + BudgetAlert)
 
---
 
### 8. Références
- `backend/src/utils/observer.js`
- `backend/src/services/notificationService.js`
- `backend/__tests__/ObserverPattern.test.js`
 
---
 
**Équipe :** Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session :** H2026 — Collège LaSalle