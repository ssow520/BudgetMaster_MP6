import authService from '../services/authService.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../utils/constants.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Token manquant',
      });
    }

    const token = authHeader.substring(7);
    const verification = authService.verifyToken(token);

    if (!verification.valid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
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
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGES.UNAUTHORIZED,
    });
  }
};
