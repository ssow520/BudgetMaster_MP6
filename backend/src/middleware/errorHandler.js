/**
 * Middleware de gestion des erreurs - Pattern Chain of Responsibility
 * Centralise toutes les erreurs de l'application
 */

import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Classe d erreur personnalisée
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Middleware d erreur centralisé (4 paramètres obligatoires pour Express)
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || HTTP_STATUS.INTERNAL_ERROR;
  const isProd = process.env.NODE_ENV === 'production';

  // Log complet en interne
  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);

  // Réponse client sans fuite d info sensible en production
  res.status(status).json({
    success: false,
    error: isProd && status === 500 ? ERROR_MESSAGES.SERVER_ERROR : err.message,
    code: err.code || 'INTERNAL_ERROR',
  });
};

/**
 * Middleware 404
 */
export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route non trouvée: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
  });
};

/**
 * Middleware de validation générique
 * Applique un schéma Joi à req.body
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message).join('; ');
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: messages,
        code: 'VALIDATION_ERROR',
      });
    }
    req.body = value;
    next();
  };
};
