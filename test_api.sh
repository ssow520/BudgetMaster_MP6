#!/bin/bash

# Script de test API pour BudgetMaster
# Utilisation: bash test_api.sh

set -e

# Configuration
API_URL="http://localhost:5000/api"
USER_EMAIL="test@example.com"
USER_PASSWORD="TestPassword123"
USER_FIRSTNAME="John"
USER_LASTNAME="Doe"

echo "🚀 Test API BudgetMaster"
echo "================================"
echo "API URL: $API_URL"
echo ""

# Couleurs pour output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. ENREGISTREMENT
echo -e "${BLUE}1. Test Enregistrement${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"$USER_FIRSTNAME\",
    \"lastName\": \"$USER_LASTNAME\",
    \"email\": \"$USER_EMAIL\",
    \"password\": \"$USER_PASSWORD\"
  }")

echo "Response: $REGISTER_RESPONSE"
echo ""

# 2. CONNEXION
echo -e "${BLUE}2. Test Connexion${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"$USER_PASSWORD\"
  }")

echo "Response: $LOGIN_RESPONSE"

# Extraire le token (simple extraction)
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}Token obtenu: ${TOKEN:0:20}...${NC}"
echo ""

# 3. VÉRIFIER TOKEN
echo -e "${BLUE}3. Test Vérification Token${NC}"
curl -s -X GET "$API_URL/auth/verify" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 4. AJOUTER UN REVENU
echo -e "${BLUE}4. Test Ajout Revenu${NC}"
TRANSACTION_RESPONSE=$(curl -s -X POST "$API_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"income\",
    \"amount\": 3000.00,
    \"frequency\": \"monthly\",
    \"description\": \"Salaire mensuel\",
    \"date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }")

echo "Response: $TRANSACTION_RESPONSE"
echo ""

# 5. AJOUTER UNE DÉPENSE
echo -e "${BLUE}5. Test Ajout Dépense${NC}"
curl -s -X POST "$API_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"expense\",
    \"amount\": 500.00,
    \"category\": \"housing\",
    \"frequency\": \"monthly\",
    \"description\": \"Loyer\",
    \"date\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }" | python3 -m json.tool
echo ""

# 6. LISTER LES TRANSACTIONS
echo -e "${BLUE}6. Test Liste Transactions${NC}"
curl -s -X GET "$API_URL/transactions" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 7. RÉSUMÉ BUDGÉTAIRE
echo -e "${BLUE}7. Test Résumé Budgétaire${NC}"
curl -s -X GET "$API_URL/budget/summary" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 8. DÉFINIR BUDGET MENSUEL
echo -e "${BLUE}8. Test Définir Budget${NC}"
curl -s -X POST "$API_URL/budget/set-monthly-limit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"monthlyLimit\": 5000.00
  }" | python3 -m json.tool
echo ""

# 9. RÉPARTITION PAR CATÉGORIE
echo -e "${BLUE}9. Test Répartition Catégories${NC}"
curl -s -X GET "$API_URL/budget/category-breakdown" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 10. RECOMMANDATIONS
echo -e "${BLUE}10. Test Recommandations${NC}"
curl -s -X GET "$API_URL/budget/recommendations" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

# 11. RAPPORT COMPLET
echo -e "${BLUE}11. Test Rapport Complet${NC}"
curl -s -X GET "$API_URL/budget/comprehensive-report" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo ""

echo -e "${GREEN}✅ Tests terminés!${NC}"
