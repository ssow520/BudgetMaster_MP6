/**
 * BudgetContext - Contexte React pour le budget
 * Implémente le pattern Observer pour les mises à jour budgétaires
 */

import React, { createContext, useState, useCallback, useRef } from 'react';
import { budgetAPI } from '../services/api/budgetAPI.js';
import { BudgetObserver, budgetObservable } from '../services/Observer.js';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  // Charger les données budgétaires
  const loadBudgetData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryRes, breakdownRes, recommendationsRes] = await Promise.all([
        budgetAPI.getSummary(),
        budgetAPI.getCategoryBreakdown(),
        budgetAPI.getRecommendations(),
      ]);

      if (summaryRes.success) {
        setSummary(summaryRes.data.summary);
        // Notifier les observateurs
        budgetObservable.notify('budget.updated', summaryRes.data.summary);
      }

      if (breakdownRes.success) {
        setBreakdown(breakdownRes.data.breakdown);
      }

      if (recommendationsRes.success) {
        setRecommendations(recommendationsRes.data.recommendations);
      }
    } catch (err) {
      setError('Erreur lors du chargement du budget');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // S'abonner aux changements
  const subscribe = useCallback((callback) => {
    const observer = new BudgetObserver(callback);
    budgetObservable.attach(observer);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        budgetObservable.detach(observerRef.current);
      }
    };
  }, []);

  const value = {
    summary,
    breakdown,
    recommendations,
    isLoading,
    error,
    loadBudgetData,
    subscribe,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};
