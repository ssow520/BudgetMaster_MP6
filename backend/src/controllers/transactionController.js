import TransactionService from '../services/transactionService.js';
import BudgetFacade from '../services/BudgetFacade.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

const facade = BudgetFacade.getInstance();

export const create = async (req, res) => {
  try {
    // MODIF : logs temporaires pour voir ce que le backend reçoit
    console.log('USER =', req.user);
    console.log('BODY =', req.body);

    const result = await facade.addTransactionWithNotifications(
        req.user.userId,
        req.body
    );

    // MODIF : log temporaire pour voir le vrai résultat retourné
    console.log('RESULT CREATE =', result);

    // MODIF : si la façade dit que ça a échoué, on renvoie une vraie erreur
    // avant tu renvoyais toujours 201, même quand la création échouait
    if (!result?.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: result?.message || 'Erreur lors de la création de la transaction'
      });
    }

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
    // MODIF : appel direct à la méthode statique
    // avant : TransactionService.getInstance().getAll(...)
    const result = TransactionService.getAll(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.count ?? 0,
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
    // MODIF : appel direct à la méthode statique
    const result = TransactionService.getIncome(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.count ?? 0,
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
    // MODIF : appel direct à la méthode statique
    const result = TransactionService.getExpense(req.user.userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      count: result.count ?? 0,
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

    // MODIF : même logique de sécurité que pour create
    if (!result?.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: result?.message || 'Erreur lors de la mise à jour de la transaction'
      });
    }

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

    // MODIF : même logique de sécurité que pour create
    if (!result?.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: result?.message || 'Erreur lors de la suppression de la transaction'
      });
    }

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