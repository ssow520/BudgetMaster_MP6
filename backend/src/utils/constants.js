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

export const EXPENSE_CATEGORIES_FR = {
housing: 'Logement',
food: 'Alimentation',
  transport: 'Transport',
  utilities: 'Services',
  entertainment: 'Loisirs',
  health: 'Santé',
  education: 'Éducation',
  other: 'Autre',
  };

export const TRANSACTION_TYPES = {
INCOME: 'income',
EXPENSE: 'expense',
  };

export const FREQUENCIES = {
DAILY: 'daily',
WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ONE_TIME: 'one_time',
  };

export const FREQUENCIES_FR = {
daily: 'Journalière',
weekly: 'Hebdomadaire',
  monthly: 'Mensuelle',
  one_time: 'Unique',
  };

export const HTTP_STATUS = {
OK: 200,
CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  };

export const ERROR_MESSAGES = {
INVALID_EMAIL: 'Email invalide',
EMAIL_ALREADY_USED: 'Cet email est déinnerà utilisé',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractèresult',
  INVALID_CREDENTIALS: 'Identifiants invalides',
  USER_NOT_FOUND: 'Utilisateur non trouvé',
  UNAUTHORIZED: 'Non autorisé',
  INVALID_AMOUNT: 'Le montant doit être positif',
  INVALID_CATEGORY: 'Catégorie invalide',
  TRANSACTION_NOT_FOUND: 'Transaction non trouvée',
  BUDGET_EXCEEDED: 'Budget dépassé',
  INVALID_INPUT: 'Données invalides',
  SERVER_ERROR: 'Erreur serveur',
  };

export const SUCCESS_MESSAGES = {
ACCOUNT_CREATED: 'Compte créé avec succès',
LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  TRANSACTION_ADDED: 'Transaction ajoutée',
  TRANSACTION_UPDATED: 'Transaction modifiée',
  TRANSACTION_DELETED: 'Transaction supprimée',
  BUDGET_SET: 'Budget mensuel défini',
  };

export const EVENT_TYPES = {
TRANSACTION_ADDED: 'transaction.added',
TRANSACTION_UPDATED: 'transaction.updated',
  TRANSACTION_DELETED: 'transaction.deleted',
  BUDGET_EXCEEDED: 'budget.exceeded',
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
  };

export const VALIDATION_RULES = {
MIN_PASSWORD_LENGTH: 8,
MAX_PASSWORD_LENGTH: 128,
  MAX_EMAIL_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999.99,
  };