/**
 * TransactionController
 * Traite les requêtes liées aux transactions
 */

import TransactionService from '../services/transactionService.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Crée une nouvelle transaction
 */
export const create = (req, res) => {
  try {
    const result = TransactionService.create(req.user.userId, req.body);

    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(result);
    }

    return res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la création de la transaction',
    });
  }
};

/**
 * Obtient toutes les transactions de l'utilisateur
 */
export const getAll = (req, res) => {
  try {
    const result = TransactionService.getAll(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des transactions',
    });
  }
};

/**
 * Obtient les revenus de l'utilisateur
 */
export const getIncome = (req, res) => {
  try {
    const result = TransactionService.getIncome(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des revenus',
    });
  }
};

/**
 * Obtient les dépenses de l'utilisateur
 */
export const getExpense = (req, res) => {
  try {
    const result = TransactionService.getExpense(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des dépenses',
    });
  }
};

/**
 * Met à jour une transaction
 */
export const update = (req, res) => {
  try {
    const { id } = req.params;
    const result = TransactionService.update(id, req.user.userId, req.body);

    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(result);
    }

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la transaction',
    });
  }
};

/**
 * Supprime une transaction
 */
export const delete_ = (req, res) => {
  try {
    const { id } = req.params;
    const result = TransactionService.delete(id, req.user.userId);

    if (!result.success) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(result);
    }

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la suppression de la transaction',
    });
  }
};

/**
 * Filtre les transactions
 */
export const filter = (req, res) => {
  try {
    const result = TransactionService.filter(req.user.userId, req.query);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors du filtrage des transactions',
    });
  }
};
