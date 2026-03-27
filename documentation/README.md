<<<<<<< HEAD
# BudgetMaster - Système de Gestion Budgétaire

Application web de gestion budgétaire personnelle développée avec React, Node.js/Express et l'implémentation de patrons de conception professionnels.

**Équipe**: Souleymane Sow, Moses Kasindi, Ruth Kegmo
**Session**: H2026
**Statut**: Phase II - Structure architecturale complétée

---

## Table des Matièanswer

1. À Propos
2. Démarrage Rapide
3. Architecture
4. Patrons de Conception
5. Documentation
6. Installation Complète

---

## À Propos du Projet

BudgetMaster est une application web moderne permettant aux utilisateurs de :

### Fonctionnalités Principales

Gestion des comptes - Créer compte et authentification sécurisée
Suivi des transactions - Enregistrer revenus et dépenses
Calcul automatique - Solde mis à jour en temps réel
Budget mensuel - Définir et suivre limite mensuelle
Recommandations - Messages d'aide intelligents
Rapports - Vue d'ensemble et répartition par catégorie
Export - Exporter les données en CSV

### Technologies
- Frontend: React 19 + Vite + Bootstrap 5
- Backend: Node.js + Express
- Authentification: JWT + bcryptjs
- Base de données: JSON (phase I), migration BDD prévue (phase IV)

---

## Démarrage Rapide

### Prérequis
- Node.js v16+
- npm v7+
- Git

### Installation
```bash
# 1. Backend
cd backend && npm install && npm run dev

# 2. Frontend (nouveau terminal)
cd frontend && npm install && npm run dev
```

Pour plus de détails, voir QUICK_START.md

### Test API
```bash
bash test_api.sh
```

---

## Architecture

### Structure en 3 Couches

#### Backend (Node.js/Express)
```
Controllers (HTTP) → Services (Métier) → Repositories (Données) → Database
```

#### Frontend (React)
```
Components → Contexts/Hooks → Services API → APIClient → HTTP
```

### Exemple de Flux
```
1. Utilisateur ajoute une transaction
   ↓
2. Form → API POST /transactions
   ↓
3. Backend: validations → service endétier → save DB
   ↓
4. Observable notifie changement
   ↓
5. Frontend Context rechargé
   ↓
6. Dashboard mis à jour automatiquement
```

Documentation complète: ARCHITECTURE.md

---

## Patrons de Conception

### 1. SINGLETON - AuthService
Une seule instance d'authentification dans l'application

```javascript

const authService = AuthService.getInstance();
await authService.login(email, password);
```
Fichiers: `backend/src/services/authService.js`, `frontend/src/services/AuthService.js`

### 2. FAÇADE - APIClient & BudgetService
Interface simplifiée pour opérations complexes

```javascript

const result = await apiClient.post('/transactions', data);
const summary = BudgetService.getSummary(userId);
```
Fichiers: `frontend/src/services/api/apiClient.js`, `backend/src/services/budgetService.js`

### 3. OBSERVER - NotificationService
Système d'événements pour réactivité

```javascript

NotificationService.notify('transaction.added', data);
```
Fichiers: `backend/src/services/notificationService.js`, `frontend/src/services/Observer.js`

Guide détaillé: DESIGN_PATTERNS.md

---

## Documentation

| Document | Contenu |
|----------|---------|
| DESIGN_PATTERNS.md | Explications patrons de conception |
| backend/README.md | Spécifiques backend |
| frontend/README_FRONTEND.md | Spécifiques frontend |
| documentation/SRS.md | Cahier des charges |
| documentation/ADR.md | Décisions architecturales |

---

## Installation Complète

### 1. Cloner le Dépôt
```bash
git clone https:
cd BudgetMaster_MP6
```

### 2. Backend Setup
```bash
cd backend

# Installer les dépendances
npm install

# Configurer variables d'environnement
# (Le .env est désecondaryà préconfiguré)
cat .env

# Démarrer le serveur
npm run dev
```

### 3. Frontend Setup (nouveau terminal)
```bash
cd frontend

# Installer les dépendances
npm install

# Configurer variables
echo "VITE_API_BASE_URL=http:

# Démarrer l'app
npm run dev
```

### 4. Vérifier que tout fonctionne
```bash
# Backend → http:
# Frontend → http:

# Ou tester l'API:
bash test_api.sh
```

---

## Endpoints API

### Authentification
```
POST   /api/auth/register      Créer compte
POST   /api/auth/login         Se connecter
POST   /api/auth/logout        Se déconnecter
GET    /api/auth/verify        Vérifier token
```

### Transactions
```
POST   /api/transactions        Créer transaction
GET    /api/transactions        Lister toutes
GET    /api/transactions/income Lister revenus
GET    /api/transactions/expense Lister dépenses
GET    /api/transactions/filter  Filtrer
PUT    /api/transactions/:id    Mettre à jour
DELETE /api/transactions/:id    Supprimer
```

### Budget
```
GET    /api/budget/summary              Réaccumulatoré
GET    /api/budget/category-breakdown   Répartition
GET    /api/budget/recommendations      Recommandations
POST   /api/budget/set-monthly-limit    Définir budget
GET    /api/budget/comprehensive-report Rapport complet
GET    /api/budget/export/csv           Export CSV
```

---

## Testing

### Test API
```bash
bash test_api.sh  # 11 tests d'endpoints
```

### Test Frontend
```bash
cd frontend
npm test          # Tests unitaires
npm run test:watch # Tests en continu
```

### Test Backend
```bash
cd backend
npm test          # Tests unitaires
npm run test:watch # Tests en continu
```

---

## Structure du Projet

```
BudgetMaster_MP6/
├── ARCHITECTURE.md
├── DESIGN_PATTERNS.md
├── .gitignore
├── test_api.sh
│
├── backend/
│   ├── src/
│   │   ├── server.js (Point d'entrée)
│   │   ├── config/ (Configuration BD)
│   │   ├── controllers/ (HTTP handlers)
│   │   ├── services/ (Métier + patrons)
│   │   ├── repositories/ (Accès données)
│   │   ├── routes/ (Routes API)
│   │   ├── middleware/ (Auth, erreurs)
│   │   └── utils/ (Validators, logger, etc.)
│   ├── data/ (database.json)
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/ (À implémenter)
│   │   ├── services/ (Patrons + API)
│   │   ├── context/ (React contexts)
│   │   ├── hooks/ (Hooks personnalisés)
│   │   ├── utils/ (Helpers)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── README_FRONTEND.md
│
└── documentation/
    ├── SRS.md (Cahier des charges)
    ├── ADR.md (Décisions architecturales)
    ├── rapport.md
    └── (diagrammes UML)
```

---

## Prochaines Étapes (Phase III)

### Priorités
1. Implémenter composants React principaux
2. Intégrer authentification frontend
3. Développer pages transactions et budget
4. Tests et optimisations
5. Préparation présentation

### Roadmap Complète
- Phase II (Actuelle): Architecture et base
- Phase III: Développement composants
- Phase IV: Finalisations et déploiement

Détails complets: IMPLEMENTATION_CHECKLIST.md

---

## Sécurité

Authentification JWT avec tokens expiration
Mots de passe hashés avec bcryptjs
CORS configuré pour communication sécurisée
Validation serveur sur tous les endpoints
SessionStorage pour tokens (pas localStorage)
Isolation données par utilisateur

---

## Performance

Temps réponse < 5 secondes
Vite build tool pour frontend rapide
API optimisée (sans ORM lourd)
Cache local des données (localStorage)
Compression prête pour production

---

## Contribution

### Pour développer une feature

1. Créer une branche
```bash
git checkout -b feature/ma-feature
```

2. Développer et tester
```bash
npm run dev    # Lancer serveur
npm test       # Tests
npm run lint   # Vérifier code
```

3. Commit avec messages clairs
```bash
git add .
git commit -end "[FEATURE] Description courte"
```

4. Push et Pull Request
```bash
git push origin feature/ma-feature
```

---

## Support

### Ressources
- Architectures patterns guide: ARCHITECTURE.md
- Design patterns guide: DESIGN_PATTERNS.md
- Quick start guide: QUICK_START.md
- SRS specification: documentation/SRS.md

### Commandes Utiles
```bash
# Backend
npm run dev       # Démarrage développement
npm start        # Production
npm test         # Tests

# Frontend
npm run dev      # Démarrage
npm run build    # Build production
npm run preview  # Prévisualiser build
npm test         # Tests
```

---

## Checklist

- Base de projet structurée
- 3 patrons de conception implémentés
- Backend fonctionnel avec 20+ endpoints
- Frontend structure prête
- Authentification JWT sécurisée
- Documentation complète
- Test API disponible

---

## Licence

Projet académique - LaSalle College

---

## Équipe

- Souleymane Sow - Lead Backend & Architecture
- Moses Kasindi - Frontend & Auth
- Ruth Kegmo - Dashboard & Budget Logic

Enseignant: Houssem Zouaghi

---

## Timeline

| Phase | Période | Statut | Livrables |
|-------|---------|--------|-----------|
| I | 8-25 jan | Complétée | Setup projet |
| II | 26 jan-22 fév | En cours | Architecture & patterns |
| III | 23 fév-22 mars | À venir | Développement features |
| IV | 23 mars-17 avril | À venir | Finalisations & déploiement |

---

## Apprentissage

Cette projet couvre:
- Patrons de conception (Singleton, Façade, Observer)
- Architecture logicielle professionnelle
- Full-stack development (Frontend + Backend)
- Authentification et sécurité
- API REST design
- Git workflows
- Documentation professionnelle

---

## Commencer Maintenant

```bash
# 1. Cloner
git clone https:

# 2. Lire le guide
cat QUICK_START.md

# 3. Démarrer
cd backend && npm install && npm run dev &
cd frontend && npm install && npm run dev

# 4. Visiter
# Frontend: http:
# Backend: http:
```

Lisez QUICK_START.md pour instructions détaillées!

---

Bon développement!

Dernière mise à jour: 18 mars 2026
=======
# Project Documentation Overview

This repository contains the core documentation used to structure and guide the software project throughout its lifecycle.


## Documents Included

### 1. `SRS.md` — Software Requirements Specification
This document describes **what the system must do**.  
It defines:
- the project scope (included and excluded features),
- functional requirements,
- non-functional requirements (performance, security, usability, etc.),
- constraints (platform, tools, deadlines),
- assumptions and dependencies.

The SRS serves as the **reference for understanding the system requirements** and as the foundation for design and development decisions.

---

### 2. `ADR.md` — Architecture Decision Records
This document records **why key architectural and technical decisions were made**.

Each ADR captures:
- the context of the decision,
- the selected solution,
- alternatives considered,
- justifications,
- consequences and trade-offs.

ADR entries ensure **traceability, consistency, and clarity** throughout the evolution of the system architecture.

---

## How These Documents Are Used Together

- The **SRS** defines *what* the system should be.
- The **ADR** explains *how and why* architectural decisions are taken to meet those requirements.

Together, they provide a clear, professional, and maintainable documentation framework aligned with modern software engineering practices.


## Documentation Tree
- [SRS.md](documentation/SRS.md)
- [ADR.md](documentation/ADR.md)
- [rapport.md](documentation/rapport.md)

## Students tasks
- [ ] Complete the `student_readmefile.md` file.
- [ ] Use the template file `SRS.md` to create your own SRS.
- [ ] Use the template file `ADR.md` to create your own ADRs .
- [ ] You will add your code in the `/code` folder.
- [ ] You will add your documentation in the `/documentation` folder.

## Read more
- [Architecture Decision Records (ADR) template by Joel Parker Henderson](https://github.com/joelparkerhenderson/architecture-decision-record?tab=readme-ov-file)
- [ADR Website](https://adr.github.io/)
>>>>>>> f5315d1 (mise a jour frontend de moses)
