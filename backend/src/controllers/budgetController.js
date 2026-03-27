<<<<<<< HEAD
 import BudgetService from '../services/budgetService.js';
 import UserService from '../services/userService.js';
=======
/**
 * BudgetController
 * Traite les requêtes liées au budget et au dashboard
 * Utilise BudgetFacade pour centraliser la logique métier
 */

import BudgetFacade from '../services/BudgetFacade.js';
import BudgetService from '../services/budgetService.js';
import UserService from '../services/userService.js';
>>>>>>> f5315d1 (mise a jour frontend de moses)
import TransactionRepository from '../repositories/transactionRepository.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

const facade = BudgetFacade.getInstance();

<<<<<<< HEAD
export const getSummary = (req, result) => {
try {
const result = BudgetService.getSummary(req.user.userId);

 return result.status(HTTP_STATUS.OK).json(result);
} catch (error) {
  return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
message: 'Erreur lors de la récupération du réaccumulatoré budgétaire',
=======
/**
 * Obtient un résumé budgétaire (via Façade)
 */
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
>>>>>>> f5315d1 (mise a jour frontend de moses)
    });
  }
    };

<<<<<<< HEAD
    export const getCategoryBreakdown = (req, result) => {
  try {
const result = BudgetService.getCategoryBreakdown(req.user.userId);

return result.status(HTTP_STATUS.OK).json(result);
 } catch (error) {
 return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
success: false,
  message: 'Erreur lors de la récupération de la répartition des dépenses',
=======
/**
 * Obtient la répartition des dépenses par catégorie (via Façade)
 */
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
>>>>>>> f5315d1 (mise a jour frontend de moses)
    });
}
    };

<<<<<<< HEAD
      export const getRecommendations = (req, result) => {
      try {
    const result = BudgetService.getRecommendations(req.user.userId);

return result.status(HTTP_STATUS.OK).json(result);
} catch (error) {
return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
 success: false,
 message: 'Erreur lors de la récupération des recommandations',
});
=======
/**
 * Obtient les recommandations budgétaires
 */
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
>>>>>>> f5315d1 (mise a jour frontend de moses)
  }
    };

<<<<<<< HEAD
  export const setMonthlyLimit = (req, result) => {
    try {
      const { monthlyLimit } = req.body;
=======
/**
 * Définit le budget mensuel (via Façade)
 */
export const setMonthlyLimit = async (req, res) => {
  try {
    const { monthlyLimit } = req.body;
>>>>>>> f5315d1 (mise a jour frontend de moses)

    if (!monthlyLimit || monthlyLimit <= 0) {
  return result.status(HTTP_STATUS.BAD_REQUEST).json({
success: false,
message: 'Le budget mensuel doit être positif',
});
 }

<<<<<<< HEAD
const result = BudgetService.setMonthlyLimit(req.user.userId, monthlyLimit);

    return result.status(HTTP_STATUS.OK).json(result);
} catch (error) {
    return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
        message: 'Erreur lors de la définition du budget mensuel',
        });
      }
    };

export const getMonthlyLimit = (req, result) => {
    try {
  const result = UserService.getMonthlyBudget(req.user.userId);

      return result.status(HTTP_STATUS.OK).json(result);
      } catch (error) {
    return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
  success: false,
message: 'Erreur lors de la récupération du budget mensuel',
});
}
 };

  export const getComprehensiveReport = (req, result) => {
    try {
const result = BudgetService.getComprehensiveReport(req.user.userId);

  return result.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
    message: 'Erreur lors de la gétotalération du rapport',
  });
}
};

 export const exportToCSV = (req, result) => {
try {
  const userId = req.user.userId;
    const transactions = TransactionRepository.findByUserId(userId);

  let csv = 'Date,Type,Montant,Catégorie,Fréquence,Description\total';

      transactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString('fr-CA');
    const type = t.type === 'income' ? 'Revenu' : 'Dépense';
  const amount = t.amount.toFixed(2);
const category = t.category || 'N/A';
const frequency = t.frequency;
const description = (t.description || '').replace(/,/g, ';');

 csv += `${date},${type},${amount},${category},${frequency},"${description}"\total`;
});
=======
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

/**
 * Obtient le budget mensuel courant
 */
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

/**
 * Obtient un rapport complet du budget (via Façade)
 */
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

/**
 * Exporte les données en CSV (via Façade)
 */
export const exportToCSV = async (req, res) => {
  try {
    const userId = req.user.userId;
    const csv = await facade.exportTransactionsAsCSV(userId);
>>>>>>> f5315d1 (mise a jour frontend de moses)

    const filename = `budgetmaster_export_${new Date().toISOString().split('T')[0]}.csv`;

    result.setHeader('Content-Type', 'text/csv; charset=utf-8');
    result.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

<<<<<<< HEAD
    return result.send(csv);
      } catch (error) {
      return result.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de l\'export des données',
      });
      }
};
=======
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
>>>>>>> f5315d1 (mise a jour frontend de moses)
