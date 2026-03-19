/**
 * Constants - Constantes de l'application frontend
 */

export const APP_NAME = 'BudgetMaster';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_TYPES_LABEL = {
  income: 'Revenu',
  expense: 'Dépense',
};

export const EXPENSE_CATEGORIES = {
  HOUSING: 'housing',
  FOOD: 'food',
  TRANSPORT: 'transport',
  UTILITIES: 'utilities',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  EDUCATION: 'education',
  OTHER: 'other',
};

export const EXPENSE_CATEGORIES_LABEL = {
  housing: 'Logement',
  food: 'Alimentation',
  transport: 'Transport',
  utilities: 'Services',
  entertainment: 'Loisirs',
  health: 'Santé',
  education: 'Éducation',
  other: 'Autre',
};

export const FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ONE_TIME: 'one_time',
};

export const FREQUENCIES_LABEL = {
  daily: 'Journalière',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuelle',
  one_time: 'Unique',
};

export const FILTER_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  ALL: 'all',
};

export const STORAGE_KEYS = {
  TOKEN: 'budgetmaster_token',
  USER: 'budgetmaster_user',
  BUDGET_CACHE: 'budgetmaster_budget_cache',
};

export const LOCAL_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'danger',
  WARNING: 'warning',
  INFO: 'info',
};

export const TOAST_DURATION = 3000; // 3 secondes
