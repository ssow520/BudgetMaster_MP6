/**
 * Routes du budget et dashboard
 */

import express from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getRecommendations,
  setMonthlyLimit,
  getMonthlyLimit,
  getComprehensiveReport,
  exportToCSV,
} from '../controllers/budgetController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

// Endpoints budget
router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/recommendations', getRecommendations);
router.post('/set-monthly-limit', setMonthlyLimit);
router.get('/monthly-limit', getMonthlyLimit);
router.get('/comprehensive-report', getComprehensiveReport);
router.get('/export/csv', exportToCSV);

export default router;
