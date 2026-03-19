# 🎯 RÉPARTITION OPTIMISÉE - Phase III
**Basée sur l'état réel du projet + besoins SRS**

---

## ANALYSE ÉTAT ACTUEL

###  Déjà complété
```
Backend:
✓ Services (AuthService, TransactionService, BudgetService)
✓ Controllers (auth, transaction, budget)
✓ Routes (20+ endpoints)
✓ Database.json avec repositories
✓ JWT + bcryptjs (Singleton pour AuthService ✓)
✓ CORS, middleware, logging

Frontend:
✓ APIClient (Façade Pattern ✓)
✓ AuthContext, BudgetContext
✓ useAuth, useBudget, useForm hooks
✓ Formatters, validators, constants
✓ Vite build setup
```

###  À faire (Phase III)
```
Frontend :
❌ 5 Pages (LoginPage, RegisterPage, DashboardPage, TransactionListPage, ProfilePage)
❌ 8 Composants reusables (Navbar, ProtectedRoute, SummaryComponent, etc.)
❌ React Router setup + routing
❌ Observer côté frontend (subscribe à budgetService)
❌ 10+ component tests

Backend :
❌ Quelques endpoints manquants (GET /recommendations, filtrage avancé)
❌ 5-10 unit tests si pas déjà fait

Rapport + Présentation (5h):
❌ Rapport PDF 4000+ mots
❌ PowerPoint 11 slides
```

---

## RÉPARTITION 

### **1. Moses Kassindi ** → Frontend + Observer Pattern
**Responsabilité:** Toute l'interface utilisateur + logique de rendu + pattern Observer côté client

#### TÂCHES RUTH

1. **Routing Setup **
   - [ ] Import BrowserRouter dans main.jsx
   - [ ] Créer ProtectedRoute.jsx (utiliser useAuth)
   - [ ] App.jsx : Routes avec layouts

2. **Pages Skeleton **
   - [ ] LoginPage.jsx (form + submit)
   - [ ] RegisterPage.jsx (form + submit)
   - [ ] DashboardPage.jsx (layout principal)
   - [ ] TransactionListPage.jsx
   - [ ] ProfilePage.jsx

3. **Navbar + ProtectedRoute**
   - [ ] Navbar.jsx avec logout
   - [ ] ProtectedRoute.jsx avec redirect

4. **Composants Reusables**
   - [ ] SummaryComponent (affiche total revenus/dépenses/solde)
   - [ ] RecommendationsComponent (affiche messages d'aide)
   - [ ] TransactionForm (ajout/edit transaction)
   - [ ] LoadingSpinner
   - [ ] ErrorAlert
   - [ ] Card (wrapper)

5. **Observer Pattern Frontend**
   - [ ] Importer budgetService depuis backend
   - [ ] Dans chaque page qui affiche des données:
     - Subscribe à changements
     - Re-render automatique

6. **Intégration + Tests**
   - [ ] Router linkages
   - [ ] Form submit → API calls
   - [ ] Tester flows: login → dashboard → add transaction → observe update

---

### **2. Ruth kegmo ** → Backend Consolidation + Facade
**Responsabilité:** Compléter backend + Façade Pattern + tests

####  TÂCHES Ruth 

1. **Façade Pattern Backend **
   - [ ] Créer `src/services/BudgetFacade.js`
   - [ ] Centraliser logique métier complexe

2. **Endpoints manquants**
   - [ ] GET `/api/budget/recommendations` (FR-8)
   - [ ] GET `/api/transactions` avec filtres (FR-11)
   - [ ] PUT `/api/transactions/:id` (FR-5)
   - [ ] DELETE `/api/transactions/:id` (FR-5)
   - [ ] POST `/api/budget/monthly-limit` (FR-13)

3. **Vérifier Service Logic**
   - [ ] TransactionService: calcul solde correct
   - [ ] BudgetService: agrégations correctes
   - [ ] Observer notifications fonctionnent

4. **Unit Tests**
   - [ ] Tests calcul solde
   - [ ] Tests ajout transaction
   - [ ] Tests filtres
   - [ ] Tests façade

5. **Export CSV**
   - [ ] Endpoint GET `/api/transactions/export`
   - [ ] Format CSV: date, type, montant, catégorie, description

6. **Intégration Façade aux Controllers (1h)**
   - [ ] Remplacer appels directs par façade
   - [ ] Vérifier que notifications fonctionnent

---

### **3. SOULEYMANE SOW** → Architecture + Database + Singleton + Report
**Responsabilité:** Architecture backend solide + Singleton + Base de données + Rapport

####  TÂCHES SOULEYMANE

1. **Singleton Pattern - Database**
   - [ ] Vérifier que Database.js utilise bien Singleton
   - [ ] Un seule instance database partout
   - [ ] Logging de la connexion

2. **Singleton Pattern - Services**
   - [ ] AuthService doit être Singleton
   - [ ] Une seule instance de bcrypt/jwt
   - [ ] Vérifier usage dans controllers

3. **Data Model Review**
   - [ ] User: id, email, password (hashed), name, createdAt
   - [ ] Transaction: id, userId, type, amount, category, description, date
   - [ ] Budget: userId, monthlyLimit, balance
   - [ ] Vérifier toutes les relations

4. **Database Integrity Tests**
   - [ ] Test Singleton: même instance partout
   - [ ] Test persistence: data survit après restart
   - [ ] Test data model: structure correcte

5. **Error Handling + Validation**
   - [ ] Middleware d'erreur centralisé
   - [ ] Validation Joi sur tous les inputs
   - [ ] Messages d'erreur clairs

6. **Documentation Backend**
   - [ ] API_DOCUMENTATION.md
   - [ ] ARCHITECTURE.md (revoir et compléter)
   - [ ] DESIGN_PATTERNS.md (ajouter détails Singleton)

7. **Rapport et documentation Phase III**
   - [ ] Section 1: Améliorations Phase II
   - [ ] Section 2: Architecture Singleton + Database 
   - [ ] Section 3: Sécurité + Validation (600 words)
   - [ ] Section 4: Tests + Résultats
   - [ ] Diagrammes UML



### RUTH + MOSES + SOULEYMANE

Moses a besoin de:
- Frontend running (npm run dev)
- Backend running (pour API calls)
- useAuth, useBudget hooks ✓ (déjà créé)

Ruth a besoin de:
- Backend running
- Singleton Database ✓ (Souleymane)
- Services (AuthService, etc.) ✓ (déjà créé)

Souleymane a besoin de:
- Backend running
- Database.js ✓ (existe)
- Services ✓ (existent)

---

## DELIVERABLES PHASE III

### **Délivrés par MOSES (Frontend)**
```
frontend/src/
├── pages/
│   ├── LoginPage.jsx ✓
│   ├── RegisterPage.jsx ✓
│   ├── DashboardPage.jsx ✓
│   ├── TransactionListPage.jsx ✓
│   └── ProfilePage.jsx ✓
├── components/
│   ├── Navbar.jsx ✓
│   ├── ProtectedRoute.jsx ✓
│   ├── SummaryComponent.jsx ✓
│   ├── RecommendationsComponent.jsx ✓
│   ├── TransactionForm.jsx ✓
│   ├── LoadingSpinner.jsx ✓
│   ├── ErrorAlert.jsx ✓
│   └── Card.jsx ✓
└── App.jsx (avec routing) ✓

Tests (5+)
Observer subscriptions ✓
```

### **Délivrés par RUTH (Backend)**
```
backend/src/services/
├── BudgetFacade.js ✓

backend/src/routes/ (endpoints)
├── GET /api/budget/recommendations ✓
├── GET /api/transactions?filter=... ✓
├── PUT /api/transactions/:id ✓
├── DELETE /api/transactions/:id ✓
├── POST /api/budget/monthly-limit ✓
└── GET /api/transactions/export ✓

Tests (10+) ✓
```

### **Délivrés par SOULEYMANE (Architecture)**
```
Backend/src/
├── database/Database.js (Singleton ✓)
├── services/AuthService.js (Singleton ✓)
├── __tests__/ (Database tests ✓)
└── documentation/
    ├── API_DOCUMENTATION.md ✓
    ├── ARCHITECTURE.md (updated) ✓
    └── DESIGN_PATTERNS.md (Singleton detail) ✓

Rapport Phase III:
├── Améliorations Phase II (500w)
├── Architecture Singleton (800w)
├── Sécurité & Validation (600w)
├── Tests & Résultats (600w)
├── Diagrammes UML
└── PDF généré ✓
```

---
**Questions? Clarifications?**
