import TransactionService from '../services/transactionService.js';
import BudgetFacade from '../services/BudgetFacade.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

const facade = BudgetFacade.getInstance();

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
    });
  }
};

export const getAll = (req, res) => {
  try {
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
    });
  }
};

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
  }
};

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
  }
};

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
