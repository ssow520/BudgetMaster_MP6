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
- Base de données: JSON (phase I)

---

## Démarrage

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

### Test API
```bash
bash test_api.sh
```

---

## Structure du Projet

```
BudgetMaster_MP6/
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
│
├── frontend/
│   ├── src/
│   │   ├── components/ 
│   │   ├── services/ (Patrons + API)
│   │   ├── context/ (React contexts)
│   │   ├── hooks/ (Hooks personnalisés)
│   │   ├── utils/ (Helpers)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│
└── documentation/
    ├── SRS.md (Cahier des charges)
    ├── ADR.md (Décisions architecturales)
    ├── rapport.md
    └── (diagrammes UML)
```

---
