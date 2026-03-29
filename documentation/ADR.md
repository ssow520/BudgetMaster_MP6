# Architecture Decision Records ADR-01 — Choix de l'architecture applicative (Node.js/Express + React)
**Statut :** Accepted  
**Date :** 2026-03-29  
**Décideurs :** Ruth, Souleymane, Moses  
**Contexte projet :** BudgetMaster

---

## 1. Contexte
- **Problème / besoin :** Concevoir une application de gestion de budget moderne, évolutive, et accessible sur le web, avec une séparation claire entre la logique métier et l'interface utilisateur.
- **Contraintes :** Temps limité, équipe de taille réduite, utilisation des technologies qu'on decouvre juste.
- **Forces en présence :** Recherche de simplicité, de maintenabilité, de performance, et de sécurité.

---

## 2. Décision
Nous choisissons une architecture composée d'un backend Node.js/Express (API REST) et d'un frontend React (SPA).
- Nous choisissons : Node.js/Express pour le backend, React pour le frontend, communication via API REST.
- Pour : Permettre une séparation des responsabilités et faciliter l'évolution indépendante des deux parties.

---

## 3. Alternatives considérées
### Option A — application Express avec vues intégrées
- **Avantages :** Simplicité de déploiement, moins de configuration initiale.
- **Inconvénients :** Couplage fort entre frontend et backend et moins flexible pour l'évolution.

### Option B — Architecture microservices
- **Avantages :** Isolation des composants, maintenance facilitée à grande échelle.
- **Inconvénients :** Complexité accrue, surcoût d'infrastructure.

---

## 4. Justification (Pourquoi cette décision ?)
- Permet d'utiliser des technologies apprise par l'équipe au cours de la session.
- Favorise la maintenabilité, la clarté du code et la séparation des responsabilités.

---

## 5. Conséquences
### Positives
- Développement parallèle possible entre frontend et backend.
- Facilité de tests unitaires et d'intégration.
- Possibilité de réutiliser l'API pour d'autres choses.

### Négatives / Risques
- Nécessite la gestion de la communication entre deux serveurs.
- plus de complexité.

### Impact sur l’architecture / le code
- Modules touchés : tous les modules backend (Express), tous les composants frontend (React).
- Patterns concernés : MVC côté backend, observer/observable pour notifications, séparation stricte des couches.
- Refactoring prévu : pas encore.

---

## 6. Plan d’implémentation (court)
- [x] Étape 1 : Initialiser le backend Node.js/Express et le frontend React (Vite).
- [x] Étape 2 : Définir les routes API REST et les modèles de données.
- [x] Étape 3 : Connecter le frontend à l'API, implémenter l'authentification et la gestion des budgets/transactions.

---

## 7. Validation
**Comment vérifier que c’est bon ?**
  - Couverture de tests unitaires et d'intégration satisfaisante (>80%).
  - Fonctionnalités principales accessibles via l'interface web et l'API.
  - Respect des critères d'acceptation définis dans le SRS.

---

## 8. Liens
- UML : diagramme_classe.png, Diagramme_composant.png
- Issue/Tâche : voir le board de gestion de projet (GitHub Projects)
- Référence : API_DOCUMENTATION.md, ARCHITECTURE.md, SRS.md
