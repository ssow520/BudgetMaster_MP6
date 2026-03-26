 import UserRepository from '../repositories/userRepository.js';
 import logger from '../utils/logger.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class UserService {

static getProfile(userId) {
try {
  const user = UserRepository.findPublicProfile(userId);
   if (!user) {
   return {
  success: false,
    message: ERROR_MESSAGES.USER_NOT_FOUND,
      };
      }

          return {
          success: true,
        user,
      };
} catch (error) {
      logger.error('Erreur lors de la récupération du profil:', error);
        return {
        success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    };
      }
      }

      static updateProfile(userId, updates) {
    try {
  const user = UserRepository.update(userId, updates);
if (!user) {
  return {
   success: false,
   message: ERROR_MESSAGES.USER_NOT_FOUND,
  };
    }

      const { password, ...userWithoutPassword } = user;
        logger.info(`Profil utilisateur mis à jour: ${userId}`);

          return {
        success: true,
      user: userWithoutPassword,
};
      } catch (error) {
      logger.error('Erreur lors de la mise à jour du profil:', error);
return {
      success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        };
      }
    }

        static setMonthlyBudget(userId, monthlyLimit) {
        try {
      const user = UserRepository.update(userId, { monthlyBudgetLimit: monthlyLimit });
    if (!user) {
  return {
success: false,
  message: ERROR_MESSAGES.USER_NOT_FOUND,
   };
   }

    logger.info(`Budget mensuel défini pour ${userId}: ${monthlyLimit}`);

      return {
        success: true,
          monthlyBudgetLimit: user.monthlyBudgetLimit,
          };
        } catch (error) {
      logger.error('Erreur lors de la définition du budget mensuel:', error);
return {
      success: false,
message: ERROR_MESSAGES.SERVER_ERROR,
      };
        }
        }

      static getMonthlyBudget(userId) {
      try {
        const user = UserRepository.findById(userId);
        if (!user) {
      return {
    success: false,
  message: ERROR_MESSAGES.USER_NOT_FOUND,
};
  }

   return {
  success: true,
    monthlyBudgetLimit: user.monthlyBudgetLimit,
      };
      } catch (error) {
        logger.error('Erreur lors de la récupération du budget mensuel:', error);
          return {
          success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      };
}
      }
        }

      export default UserService;