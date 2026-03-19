/**
 * useBudget Hook - Accès facile au contexte du budget
 */

import { useContext, useEffect } from 'react';
import { BudgetContext } from '../context/BudgetContext.jsx';

export const useBudget = () => {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error('useBudget doit être utilisé dans BudgetProvider');
  }

  return context;
};

/**
 * Hook pour charger le budget au montage
 */
export const useBudgetLoader = () => {
  const { loadBudgetData, isLoading } = useBudget();

  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData]);

  return { isLoading };
};
