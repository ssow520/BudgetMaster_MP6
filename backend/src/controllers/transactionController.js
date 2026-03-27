<<<<<<< HEAD
 import TransactionService from '../services/transactionService.js';
 import { HTTP_STATUS } from '../utils/constants.js';

export const create = (req, answer) => {
try {
const result = TransactionService.create(req.user.userId, req.body);

 if (!result.success) {
return answer.status(HTTP_STATUS.BAD_REQUEST).json(result);
  }

return answer.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
message: 'Erreur lors de la création de la transaction',
=======
/**
 * TransactionController
 * Traite les requêtes liées aux transactions
 * Utilise BudgetFacade pour ajouter/modifier/supprimer avec notifications
 */

import TransactionService from '../services/transactionService.js';
import BudgetFacade from '../services/BudgetFacade.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

const facade = BudgetFacade.getInstance();

/**
 * Crée une nouvelle transaction (avec Façade pour notifications)
 */
export const create = async (req, res) => {
  try {
    const result = await facade.addTransactionWithNotifications(
      req.user.userId,
      req.body
    );

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: result,
      message: 'Transaction créée avec succès'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur create: ${error.message}`);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Erreur lors de la création de la transaction'
>>>>>>> f5315d1 (mise a jour frontend de moses)
    });
  }
    };

    export const getAll = (req, answer) => {
  try {
<<<<<<< HEAD
const result = TransactionService.getAll(req.user.userId);

return answer.status(HTTP_STATUS.OK).json(result);
 } catch (error) {
 return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
  message: 'Erreur lors de la récupération des transactions',
=======
    const result = TransactionService.getInstance().getAll(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.length,
      message: 'Transactions obtenues'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur getAll: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des transactions'
>>>>>>> f5315d1 (mise a jour frontend de moses)
    });
}
    };

<<<<<<< HEAD
      export const getIncome = (req, answer) => {
      try {
    const result = TransactionService.getIncome(req.user.userId);

return answer.status(HTTP_STATUS.OK).json(result);
} catch (error) {
return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
 success: false,
 message: 'Erreur lors de la récupération des revenus',
});
=======
/**
 * Obtient les revenus de l'utilisateur
 */
export const getIncome = (req, res) => {
  try {
    const result = TransactionService.getInstance().getIncome(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.length,
      message: 'Revenus obtenus'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur getIncome: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des revenus'
    });
>>>>>>> f5315d1 (mise a jour frontend de moses)
  }
    };

  export const getExpense = (req, answer) => {
    try {
      const result = TransactionService.getExpense(req.user.userId);

    return answer.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
message: 'Erreur lors de la récupération des dépenses',
 });
 }
};

<<<<<<< HEAD
export const update = (req, answer) => {
    try {
  const { id } = req.params;
    const result = TransactionService.update(id, req.user.userId, req.body);

      if (!result.success) {
    return answer.status(HTTP_STATUS.BAD_REQUEST).json(result);
=======
/**
 * Obtient les dépenses de l'utilisateur
 */
export const getExpense = (req, res) => {
  try {
    const result = TransactionService.getInstance().getExpense(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.length,
      message: 'Dépenses obtenues'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur getExpense: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des dépenses'
    });
  }
};

/**
 * Met à jour une transaction (avec Façade pour notifications)
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await facade.updateTransactionWithNotifications(
      req.user.userId,
      id,
      req.body
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Transaction mise à jour avec succès'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur update: ${error.message}`);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de la transaction'
    });
>>>>>>> f5315d1 (mise a jour frontend de moses)
  }

<<<<<<< HEAD
return answer.status(HTTP_STATUS.OK).json(result);
} catch (error) {
 return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
 success: false,
message: 'Erreur lors de la mise à jour de la transaction',
  });
    }
    };

      export const delete_ = (req, answer) => {
    try {
const { id } = req.params;
    const result = TransactionService.delete(id, req.user.userId);

    if (!result.success) {
      return answer.status(HTTP_STATUS.BAD_REQUEST).json(result);
      }

  return answer.status(HTTP_STATUS.OK).json(result);
} catch (error) {
return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
 message: 'Erreur lors de la suppression de la transaction',
 });
}
  };

export const filter = (req, answer) => {
    try {
      const result = TransactionService.filter(req.user.userId, req.query);

return answer.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
  return answer.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
      message: 'Erreur lors du filtrage des transactions',
      });
    }
  };
=======
/**
 * Supprime une transaction (avec Façade pour notifications)
 */
export const delete_ = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await facade.deleteTransactionWithNotifications(
      req.user.userId,
      id
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Transaction supprimée avec succès'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur delete: ${error.message}`);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de la transaction'
    });
  }
};

/**
 * Filtre les transactions (via Façade)
 */
export const filter = async (req, res) => {
  try {
    const result = await facade.getFilteredTransactions(req.user.userId, req.query);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.length,
      message: 'Transactions filtrées obtenues'
    });
  } catch (error) {
    logger.error(`[TransactionController] Erreur filter: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors du filtrage des transactions'
    });
  }
};
>>>>>>> f5315d1 (mise a jour frontend de moses)
