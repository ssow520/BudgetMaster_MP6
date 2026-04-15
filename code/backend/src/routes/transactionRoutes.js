import express from 'express';
import { create, getAll, getIncome, getExpense, update, delete_, filter, exportCSV } from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', create);
router.get('/', getAll);
router.get('/income', getIncome);
router.get('/expense', getExpense);
router.get('/filter', filter);
router.get('/export', exportCSV);
router.put('/:id', update);
router.delete('/:id', delete_);

export default router;
