import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || HTTP_STATUS.INTERNAL_ERROR;
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`);

  res.status(status).json({
    success: false,
    error: isProd && status === 500 ? ERROR_MESSAGES.SERVER_ERROR : err.message,
    code: err.code || 'INTERNAL_ERROR',
  });
};

export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route non trouvée: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
  });
};

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
