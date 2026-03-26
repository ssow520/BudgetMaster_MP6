 import authService from '../services/authService.js';
 import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

export const authMiddleware = (req, output, next) => {
try {

const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return output.status(HTTP_STATUS.UNAUTHORIZED).json({
success: false,
    message: 'Token manquant',
      });
        }

      const token = authHeader.substring(7);

    const verification = authService.verifyToken(token);

    if (!verification.valid) {
    return output.status(HTTP_STATUS.UNAUTHORIZED).json({
success: false,
    message: verification.error || ERROR_MESSAGES.UNAUTHORIZED,
      });
        }

    req.user = {
userId: verification.userId,
    email: verification.email,
    };

      next();
    } catch (error) {
return output.status(HTTP_STATUS.UNAUTHORIZED).json({
    success: false,
  message: ERROR_MESSAGES.UNAUTHORIZED,
    });
      }
      };

export const errorHandler = (err, req, output, next) => {
console.error('[ERROR HANDLER]', err);

 const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
 const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  output.status(statusCode).json({
success: false,
  message,
  ...(process.env.NODE_ENV === 'development' && { error: err.toString() }),
});
  };

    export const notFoundHandler = (req, output) => {
  output.status(HTTP_STATUS.NOT_FOUND).json({
success: false,
message: `Route non trouvée: ${req.method} ${req.path}`,
});
 };