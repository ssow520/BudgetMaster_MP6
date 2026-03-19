/**
 * Validators - Validation côté client
 */

/**
 * Valide une adresse email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Valide un mot de passe
 */
export const isValidPassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Valide un montant
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

/**
 * Valide un formulaire d'enregistrement
 */
export const validateRegistration = (data) => {
  const errors = {};

  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = 'Le prénom est requis';
  }

  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'Le nom est requis';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!isValidPassword(data.password)) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire de connexion
 */
export const validateLogin = (data) => {
  const errors = {};

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!data.password) {
    errors.password = 'Le mot de passe est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un formulaire de transaction
 */
export const validateTransaction = (data) => {
  const errors = {};

  if (!data.type) {
    errors.type = 'Le type est requis';
  }

  if (!isValidAmount(data.amount)) {
    errors.amount = 'Le montant doit être un nombre positif';
  }

  if (data.type === 'expense' && !data.category) {
    errors.category = 'La catégorie est requise pour une dépense';
  }

  if (!data.frequency) {
    errors.frequency = 'La fréquence est requise';
  }

  if (!data.date) {
    errors.date = 'La date est requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valide un budget limite
 */
export const validateBudgetLimit = (amount) => {
  return isValidAmount(amount);
};
