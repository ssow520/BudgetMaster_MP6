/**
 * Server.js - Point d'entrée de l'application Backend
 * Configure Express et lance le serveur
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ====== MIDDLEWARE ======

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ====== ROUTES ======

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// ====== ERROR HANDLING ======

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ====== SERVER START ======

app.listen(PORT, () => {
  logger.info(`╔════════════════════════════════════════════╗`);
  logger.info(`║  BudgetMaster Backend - H2026           ║`);
  logger.info(`║  Server running on http://localhost:${PORT} ║`);
  logger.info(`║  Environment: ${process.env.NODE_ENV}${' '.repeat(17 - process.env.NODE_ENV.length)}║`);
  logger.info(`╚════════════════════════════════════════════╝`);
});

export default app;
