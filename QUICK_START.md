# 🚀 BudgetMaster Phase III - Quick Start Guide

**Project Root**: `/Users/ruthkegmo/Downloads/BudgetMaster_MP6/`

---

## ⚡ Quick Start (Restart Everything)

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# Backend running on http://localhost:3001
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🧪 Run Tests

### Ruth's Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific suite
npm test -- BudgetFacade.simple.test.js
npm test -- BalanceCalculation.test.js
npm test -- FilteringAndQueries.test.js
npm test -- ObserverPattern.test.js

# Watch mode (auto-rerun on changes)
npm test:watch
```

### Expected Results:
```
PASS __tests__/BudgetFacade.simple.test.js
Tests: 21 passed, 21 total ✅
```

---

## 📝 API Testing with cURL

### Test Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "password": "password123"
  }'

# Login (get JWT token)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'

# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Test Budget Façade Endpoints

```bash
# Get Dashboard Summary
curl -X GET http://localhost:3001/api/budget/summary \
  -H "Authorization: Bearer $TOKEN"

# Get Category Breakdown
curl -X GET http://localhost:3001/api/budget/category-breakdown \
  -H "Authorization: Bearer $TOKEN"

# Get Recommendations
curl -X GET http://localhost:3001/api/budget/recommendations \
  -H "Authorization: Bearer $TOKEN"

# Set Monthly Budget Limit
curl -X POST http://localhost:3001/api/budget/set-monthly-limit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthlyLimit": 2000}'

# Get Comprehensive Report
curl -X GET http://localhost:3001/api/budget/comprehensive-report \
  -H "Authorization: Bearer $TOKEN"

# Export to CSV
curl -X GET http://localhost:3001/api/transactions/export \
  -H "Authorization: Bearer $TOKEN" \
  -o transactions.csv
```

### Test Transaction Endpoints

```bash
# Add Transaction
curl -X POST http://localhost:3001/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 50,
    "category": "Food",
    "description": "Lunch",
    "frequency": "once",
    "date": "2026-03-19"
  }'

# Get All Transactions
curl -X GET http://localhost:3001/api/transactions \
  -H "Authorization: Bearer $TOKEN"

# Get Filtered Transactions
curl -X GET "http://localhost:3001/api/transactions/filter?type=expense&category=Food" \
  -H "Authorization: Bearer $TOKEN"

# Get Income Transactions
curl -X GET http://localhost:3001/api/transactions/income \
  -H "Authorization: Bearer $TOKEN"

# Get Expense Transactions
curl -X GET http://localhost:3001/api/transactions/expense \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Project Status

### ✅ Ruth - Backend Consolidation (COMPLETE)
- [x] Façade Pattern implemented (9 methods)
- [x] Controllers refactored to use Façade
- [x] 21 tests passing
- [x] All endpoints integrated
- [x] Error handling complete
- [x] Logging active
- [x] CSV export working
- [x] Budget notifications working

### ⏳ Moses - Frontend (IN PROGRESS)
- [ ] Login Page
- [ ] Register Page
- [ ] Dashboard Page (uses `GET /api/budget/summary`)
- [ ] Transaction List Page (uses `GET /api/transactions`)
- [ ] Profile Page
- [ ] Navbar Component
- [ ] ProtectedRoute Component
- [ ] Summary Component
- [ ] Recommendations Component
- [ ] Transaction Form Component
- [ ] Spinner Component
- [ ] Alert Component
- [ ] Card Component

**Estimated Time**: 9 hours  
**API Endpoints Ready**: ✅ All 20+ endpoints

### ⏳ Souleymane - Architecture & Report (PENDING)
- [ ] Verify Singleton patterns
- [ ] Database integrity tests
- [ ] Error handling review
- [ ] Phase III Report (4000+ words)
- [ ] UML Diagrams

**Estimated Time**: 9 hours  
**Documentation**: Phase II complete, ready for Phase III review

---

## 🔍 File Structure

```
BudgetMaster_MP6/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── BudgetFacade.js ✅ COMPLETE
│   │   │   ├── transactionService.js
│   │   │   ├── budgetService.js
│   │   │   ├── notificationService.js
│   │   │   └── authService.js
│   │   ├── controllers/
│   │   │   ├── budgetController.js ✅ REFACTORED
│   │   │   ├── transactionController.js ✅ REFACTORED
│   │   │   └── authController.js
│   │   ├── routes/
│   │   ├── repositories/
│   │   ├── middleware/
│   │   └── utils/
│   ├── __tests__/
│   │   ├── BudgetFacade.simple.test.js ✅ 21/21 PASSING
│   │   ├── BalanceCalculation.test.js
│   │   ├── FilteringAndQueries.test.js
│   │   └── ObserverPattern.test.js
│   ├── jest.config.js ✅ CONFIGURED
│   ├── package.json ✅ UPDATED
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── documentation/
│   └── ADR.md
├── IMPLEMENTATION_COMPLETE.md ✅ THIS FILE
└── README.md
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### npm install Issues

```bash
# Clear cache and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Tests Not Running

```bash
# Make sure you're in backend directory
cd backend

# Check Node version (should be 18+)
node --version

# Run with explicit configuration
NODE_OPTIONS=--experimental-vm-modules npm test
```

### Database Issues

```bash
# Database is at backend/data/database.json
# To reset: delete the file and restart server
cd backend
rm data/database.json
npm run dev
```

---

## 📚 Additional Resources

- **Architecture Documentation**: See `documentation/ADR.md`
- **API Endpoints**: See `backend/src/routes/`
- **Test Details**: See `RUTH_BACKEND_SUMMARY.md`
- **Implementation Details**: See `IMPLEMENTATION_COMPLETE.md`

---

## ⏰ Timeline

**Saturday March 22, 2026**:
- 9h-18h: All 3 team members working
- Ruth: Backend validation + fixes (1-2h)
- Moses: Frontend implementation (4-5h)
- Souleymane: Architecture review (3-4h)

**Sunday March 23, 2026**:
- 9h-20h: Final assembly + testing (11h available)
- Ruth: Final API validation
- Moses: Finish frontend + integration
- Souleymane: Complete report
- 23h59: **DEADLINE**

---

**Status**: ✅ Ruth's Backend 100% Complete  
**Tests**: ✅ 21/21 Passing  
**API**: ✅ All Endpoints Ready  
**Next**: Moses starts Frontend, Souleymane starts Architecture Review

Good luck! 🚀
