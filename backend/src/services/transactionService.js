 import TransactionRepository from '../repositories/transactionRepository.js';
 import UserRepository from '../repositories/userRepository.js';
import NotificationService from './notificationService.js';
import logger from '../utils/logger.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, EVENT_TYPES } from '../utils/constants.js';
import { validateTransaction } from '../utils/validators.js';

class TransactionService {

static create(userId, transactionData) {
try {

   const { error, value } = validateTransaction(transactionData);
   if (error) {
  return {
    success: false,
      message: 'Validation échouée',
      errors: error.details.map((d) => d.message),
      };
        }

          const transaction = TransactionRepository.create({
        userId,
      type: value.type,
amount: value.amount,
      category: value.category,
      frequency: value.frequency,
        description: value.description,
        date: value.date,
        });

        NotificationService.notify(EVENT_TYPES.TRANSACTION_ADDED, {
        transaction,
      userId,
});

      logger.info(
        `Transaction créée: ${transaction.id} (${value.type} - ${value.amount})`
        );

return {
      success: true,
        transaction,
      message: SUCCESS_MESSAGES.TRANSACTION_ADDED,
};
      } catch (error) {
        logger.error('Erreur lors de la création de la transaction:', error);
        return {
        success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
    };
      }
      }

      static getById(transactionId, userId) {
    try {
  const transaction = TransactionRepository.findById(transactionId);

  if (!transaction || transaction.userId !== userId) {
   return {
   success: false,
  message: ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
    };
      }

      return {
        success: true,
          transaction,
          };
        } catch (error) {
      logger.error('Erreur lors de la récupération de la transaction:', error);
return {
      success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        };
      }
    }

        static getAll(userId) {
        try {
      const transactions = TransactionRepository.findByUserId(userId);

  return {
success: true,
  transactions,
   count: transactions.length,
   };
  } catch (error) {
    logger.error('Erreur lors de la récupération des transactions:', error);
      return {
success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
        };
        }
        }

      static getIncome(userId) {
      try {
        const transactions = TransactionRepository.findIncomeByUserId(userId);

      return {
    success: true,
  transactions,
count: transactions.length,
  };
   } catch (error) {
   logger.error('Erreur lors de la récupération des revenus:', error);
  return {
    success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
};
      }
        }

      static getExpense(userId) {
    try {
      const transactions = TransactionRepository.findExpenseByUserId(userId);

        return {
        success: true,
      transactions,
    count: transactions.length,
  };
} catch (error) {
  logger.error('Erreur lors de la récupération des dépenses:', error);
   return {
   success: false,
  message: ERROR_MESSAGES.SERVER_ERROR,
    };
      }
}

        static update(transactionId, userId, updates) {
        try {
      const transaction = TransactionRepository.findById(transactionId);

      if (!transaction || transaction.userId !== userId) {
      return {
        success: false,
        message: ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
      };
    }

const updatedTransaction = TransactionRepository.update(transactionId, updates);

   NotificationService.notify(EVENT_TYPES.TRANSACTION_UPDATED, {
  transaction: updatedTransaction,
    userId,
      });

      logger.info(`Transaction mise à jour: ${transactionId}`);

          return {
          success: true,
        transaction: updatedTransaction,
      message: SUCCESS_MESSAGES.TRANSACTION_UPDATED,
};
      } catch (error) {
logger.error('Erreur lors de la mise à jour de la transaction:', error);
      return {
      success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
        };
      }
}

      static delete(transactionId, userId) {
        try {
        const transaction = TransactionRepository.findById(transactionId);

      if (!transaction || transaction.userId !== userId) {
    return {
      success: false,
      message: ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
        };
        }

    TransactionRepository.delete(transactionId);

  NotificationService.notify(EVENT_TYPES.TRANSACTION_DELETED, {
   transactionId,
   userId,
  });

      logger.info(`Transaction supprimée: ${transactionId}`);

      return {
        success: true,
          message: SUCCESS_MESSAGES.TRANSACTION_DELETED,
          };
        } catch (error) {
      logger.error('Erreur lors de la suppression de la transaction:', error);
return {
      success: false,
message: ERROR_MESSAGES.SERVER_ERROR,
      };
      }
        }

static filter(userId, filters) {
      try {
let transactions = TransactionRepository.findByUserId(userId);

        if (filters.type && filters.type !== 'all') {
      transactions = transactions.filter((t) => t.type === filters.type);
    }

        if (filters.category) {
        transactions = transactions.filter((t) => t.category === filters.category);
      }

if (filters.startDate && filters.endDate) {
  const startDate = new Date(filters.startDate);
   const endDate = new Date(filters.endDate);
   transactions = transactions.filter((t) => {
  const tDate = new Date(t.date);
    return tDate >= startDate && tDate <= endDate;
      });
}

      return {
        success: true,
      transactions,
count: transactions.length,
      };
      } catch (error) {
        logger.error('Erreur lors du filtrage des transactions:', error);
      return {
success: false,
      message: ERROR_MESSAGES.SERVER_ERROR,
      };
        }
        }
        }

          export default TransactionService;