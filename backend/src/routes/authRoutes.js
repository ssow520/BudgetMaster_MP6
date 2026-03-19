/**
 * Routes d'authentification
 */

import express from 'express';
import {
  register,
  login,
  logout,
  verifyToken,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Routes protégées
router.get('/verify', authMiddleware, verifyToken);

export default router;
