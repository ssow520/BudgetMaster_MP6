/**
 * AuthService - Pattern SINGLETON
 * Assure une seule instance du service d'authentification
 * Gère la création de comptes, la connexion et la génération de tokens JWT
 */

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

  /**
   * Enregistre un nouvel utilisateur
   */
  async register(userData) {
    try {
      // Valider les données
      const { error, value } = validateRegistration(userData);
      if (error) {
        return {
          success: false,
          errors: formatValidationErrors(error.details),
          message: 'Validation échouée',
        };
      }

      // Vérifier si l'email existe déjà
      if (UserRepository.emailExists(value.email)) {
        return {
          success: false,
          message: ERROR_MESSAGES.EMAIL_ALREADY_USED,
          errors: { email: ERROR_MESSAGES.EMAIL_ALREADY_USED },
        };
      }

      // Hasher le mot de passe
      const hashedPassword = await bcryptjs.hash(value.password, this.saltRounds);

      // Créer l'utilisateur
      const newUser = UserRepository.create({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: hashedPassword,
      });

      logger.info(`Nouvel utilisateur enregistré: ${newUser.email}`);

      // Retourner l'utilisateur sans le mot de passe
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

  /**
   * Authentifie un utilisateur et retourne un token JWT
   */
  async login(email, password) {
    try {
      // Valider les données
      const { error, value } = validateLogin({ email, password });
      if (error) {
        return {
          success: false,
          errors: formatValidationErrors(error.details),
          message: 'Validation échouée',
        };
      }

      // Trouver l'utilisateur
      const user = UserRepository.findByEmail(value.email);
      if (!user) {
        logger.warn(`Tentative de connexion avec email inexistant: ${value.email}`);
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        };
      }

      // Vérifier le mot de passe
      const passwordMatch = await bcryptjs.compare(value.password, user.password);
      if (!passwordMatch) {
        logger.warn(`Tentative de connexion avec mot de passe incorrect: ${value.email}`);
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        };
      }

      // Générer le token JWT
      const token = this._generateToken(user);

      logger.info(`Connexion réussie: ${user.email}`);

      // Retourner l'utilisateur et le token sans le mot de passe
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

  /**
   * Vérifie et décode un token JWT
   */
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

  /**
   * Génère un token JWT
   * @private
   */
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

  /**
   * Obtient l'instance unique du service
   * @static
   */
  static getInstance() {
    if (!AuthService.instance) {
      new AuthService();
    }
    return AuthService.instance;
  }
}

// Créer et exporter l'instance unique
const authService = new AuthService();

export default authService;
