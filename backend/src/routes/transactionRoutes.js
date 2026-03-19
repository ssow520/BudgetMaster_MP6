/**
 * Routes des transactions
 */

import express from 'express';
import {
  create,
  getAll,
  getIncome,
  getExpense,
  update,
  delete_,
  filter,
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

// CRUD operations
router.post('/', create);
router.get('/', getAll);
router.get('/income', getIncome);
router.get('/expense', getExpense);
router.get('/filter', filter);
router.put('/:id', update);
router.delete('/:id', delete_);

export default router;
