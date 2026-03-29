import BudgetFacade from '../services/BudgetFacade.js';
import BudgetService from '../services/budgetService.js';
import UserService from '../services/userService.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

const facade = BudgetFacade.getInstance();

export const getSummary = async (req, res) => {
  try {
    const result = await facade.getDashboardSummary(req.user.userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Résumé budgétaire obtenu'
    });
  } catch (error) {
    logger.error(`[BudgetController] Erreur getSummary: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération du résumé budgétaire',
      error: error.message
    });
  }
};

export const getCategoryBreakdown = async (req, res) => {
  try {
    const result = await facade.getCategoryBreakdown(req.user.userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Répartition des dépenses obtenue'
    });
  } catch (error) {
    logger.error(`[BudgetController] Erreur getCategoryBreakdown: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération de la répartition des dépenses',
      error: error.message
    });
  }
};

export const getRecommendations = (req, res) => {
  try {
    const result = BudgetService.getInstance().getRecommendations(req.user.userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Recommandations obtenues'
    });
  } catch (error) {
    logger.error(`[BudgetController] Erreur getRecommendations: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des recommandations',
      error: error.message
    });
  }
};

export const setMonthlyLimit = async (req, res) => {
  try {
    const { monthlyLimit } = req.body;
    if (!monthlyLimit || monthlyLimit <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Le budget mensuel doit être positif',
      });
    }
    const result = await facade.setMonthlyBudgetLimit(req.user.userId, monthlyLimit);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Budget mensuel défini avec succès'
    });
  } catch (error) {
    logger.error(`[BudgetController] Erreur setMonthlyLimit: ${error.message}`);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message || 'Erreur lors de la définition du budget mensuel'
    });
  }
};

export const getMonthlyLimit = (req, res) => {
  try {
    const result = UserService.getInstance().getMonthlyBudget(req.user.userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Budget mensuel obtenu'
    });
  } catch (error) {
    logger.error(`[BudgetController] Erreur getMonthlyLimit: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération du budget mensuel',
      error: error.message
    });
  }
};

export const getComprehensiveReport = async (req, res) => {
  try {
    const result = await facade.getComprehensiveReport(req.user.userId);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result,
      message: 'Rapport complet généré'
    });
  } catch (error) {
    logger.error(`[BudgetController] Erreur getComprehensiveReport: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la génération du rapport',
      error: error.message
    });
  }
};

export const exportToCSV = async (req, res) => {
  try {
    const userId = req.user.userId;
    const csv = await facade.exportTransactionsAsCSV(userId);
    const filename = `budgetmaster_export_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    logger.info(`[BudgetController] Fichier CSV exporté pour user: ${userId}`);
    return res.send(csv);
  } catch (error) {
    logger.error(`[BudgetController] Erreur exportToCSV: ${error.message}`);
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de l\'export des données',
      error: error.message
    });
  }
};
