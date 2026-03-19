/**
 * BudgetController
 * Traite les requêtes liées au budget et au dashboard
 */

import BudgetService from '../services/budgetService.js';
import UserService from '../services/userService.js';
import TransactionRepository from '../repositories/transactionRepository.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Obtient un résumé budgétaire
 */
export const getSummary = (req, res) => {
  try {
    const result = BudgetService.getSummary(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération du résumé budgétaire',
    });
  }
};

/**
 * Obtient la répartition des dépenses par catégorie
 */
export const getCategoryBreakdown = (req, res) => {
  try {
    const result = BudgetService.getCategoryBreakdown(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération de la répartition des dépenses',
    });
  }
};

/**
 * Obtient les recommandations budgétaires
 */
export const getRecommendations = (req, res) => {
  try {
    const result = BudgetService.getRecommendations(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération des recommandations',
    });
  }
};

/**
 * Définit le budget mensuel
 */
export const setMonthlyLimit = (req, res) => {
  try {
    const { monthlyLimit } = req.body;

    if (!monthlyLimit || monthlyLimit <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Le budget mensuel doit être positif',
      });
    }

    const result = BudgetService.setMonthlyLimit(req.user.userId, monthlyLimit);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la définition du budget mensuel',
    });
  }
};

/**
 * Obtient le budget mensuel courant
 */
export const getMonthlyLimit = (req, res) => {
  try {
    const result = UserService.getMonthlyBudget(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la récupération du budget mensuel',
    });
  }
};

/**
 * Obtient un rapport complet du budget
 */
export const getComprehensiveReport = (req, res) => {
  try {
    const result = BudgetService.getComprehensiveReport(req.user.userId);

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de la génération du rapport',
    });
  }
};

/**
 * Exporte les données en CSV
 */
export const exportToCSV = (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = TransactionRepository.findByUserId(userId);

    // Créer le contenu CSV
    let csv = 'Date,Type,Montant,Catégorie,Fréquence,Description\n';

    transactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString('fr-CA');
      const type = t.type === 'income' ? 'Revenu' : 'Dépense';
      const amount = t.amount.toFixed(2);
      const category = t.category || 'N/A';
      const frequency = t.frequency;
      const description = (t.description || '').replace(/,/g, ';'); // Échapper les virgules

      csv += `${date},${type},${amount},${category},${frequency},"${description}"\n`;
    });

    // Définir les headers pour le téléchargement
    const filename = `budgetmaster_export_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.send(csv);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_ERROR).json({
      success: false,
      message: 'Erreur lors de l\'export des données',
    });
  }
};
