/**
 * Middleware d'authentification
 * Vérifie la validité du token JWT avant d'accéder aux ressources protégées
 */

import authService from '../services/authService.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

export const authMiddleware = (req, res, next) => {
  try {
    // Obtenir le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token manquant',
      });
    }

    const token = authHeader.substring(7); // Retirer "Bearer "

    // Vérifier le token
    const verification = authService.verifyToken(token);

    if (!verification.valid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: verification.error || ERROR_MESSAGES.UNAUTHORIZED,
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      userId: verification.userId,
      email: verification.email,
    };

    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
};

/**
 * Middleware de gestion des erreurs
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[ERROR HANDLER]', err);

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.toString() }),
  });
};

/**
 * Middleware de gestion 404
 */
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route non trouvée: ${req.method} ${req.path}`,
  });
};
