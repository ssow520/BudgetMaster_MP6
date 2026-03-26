 import bcryptjs from 'bcryptjs';
 import jwt from 'jsonwebtoken';
 import UserRepository from '../repositories/userRepository.js';
import logger from '../utils/logger.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants.js';
import { validateRegistration, validateLogin, formatValidationErrors } from '../utils/validators.js';

class AuthService {
constructor() {
if (AuthService.instance) {
return AuthService.instance;
}

    this.saltRounds = 10;
      AuthService.instance = this;
    }

    async register(userData) {
  try {

  const { error, value } = validateRegistration(userData);
   if (error) {
   return {
  success: false,
    errors: formatValidationErrors(error.details),
      message: 'Validation échouée',
      };
      }

          if (UserRepository.emailExists(value.email)) {
          return {
        success: false,
      message: ERROR_MESSAGES.EMAIL_ALREADY_USED,
errors: { email: ERROR_MESSAGES.EMAIL_ALREADY_USED },
      };
      }

          const hashedPassword = await bcryptjs.hash(value.password, this.saltRounds);

      const newUser = UserRepository.create({
firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
password: hashedPassword,
      });

        logger.info(`Nouvel utilisateur enregistré: ${newUser.email}`);

        const { password, ...userWithoutPassword } = newUser;
      return {
success: true,
      user: userWithoutPassword,
message: SUCCESS_MESSAGES.ACCOUNT_CREATED,
      };
      } catch (error) {
      logger.error('Erreur lors de l\'enregistrement:', error);
        return {
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      };
    }
      }

        async login(email, password) {
      try {

  const { error, value } = validateLogin({ email, password });
if (error) {
  return {
   success: false,
   errors: formatValidationErrors(error.details),
  message: 'Validation échouée',
    };
      }

        const user = UserRepository.findByEmail(value.email);
          if (!user) {
          logger.warn(`Tentative de connexion avec email inexistant: ${value.email}`);
          return {
        success: false,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
};
      }

        const passwordMatch = await bcryptjs.compare(value.password, user.password);
        if (!passwordMatch) {
          logger.warn(`Tentative de connexion avec mot de passe incorrect: ${value.email}`);
          return {
        success: false,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
};
      }

        const token = this._generateToken(user);

          logger.info(`Connexion réussie: ${user.email}`);

      const { password: _, ...userWithoutPassword } = user;
return {
      success: true,
      user: userWithoutPassword,
token,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
};
      } catch (error) {
      logger.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        };
        }
      }

      verifyToken(token) {
        try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
    valid: true,
  userId: decoded.userId,
email: decoded.email,
  };
   } catch (error) {
   logger.warn('Token invalide ou expiré');
  return {
    valid: false,
      error: ERROR_MESSAGES.UNAUTHORIZED,
      };
        }
        }

    _generateToken(user) {
      const payload = {
      userId: user.id,
        email: user.email,
        firstName: user.firstName,
      lastName: user.lastName,
    };

const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE || '24h',
   });

   return token;
  }

      static getInstance() {
      if (!AuthService.instance) {
      new AuthService();
    }
return AuthService.instance;
    }
      }

    const authService = new AuthService();

export default authService;