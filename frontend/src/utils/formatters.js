/**
 * Formatters - Utilitaires de formatage
 */

/**
 * Formate un nombre en devise
 */
export const formatCurrency = (amount, locale = 'fr-CA', currency = 'CAD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formate une date
 */
export const formatDate = (date, locale = 'fr-CA', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  };

  return new Date(date).toLocaleDateString(locale, defaultOptions);
};

/**
 * Formate une date pour input HTML
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Formate une date relative (ex: "Il y a 2 jours")
 */
export const formatRelativeDate = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now - target;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

  return formatDate(date);
};

/**
 * Formate un nombre avec séparateurs
 */
export const formatNumber = (num, decimals = 0) => {
  return new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Ajoute la classe CSS basée sur le solde
 */
export const getBalanceClass = (balance) => {
  if (balance > 0) return 'text-success';
  if (balance < 0) return 'text-danger';
  return 'text-secondary';
};

/**
 * Obtient la couleur basée sur le solde
 */
export const getBalanceColor = (balance) => {
  if (balance > 0) return '#28a745'; // Vert
  if (balance < 0) return '#dc3545'; // Rouge
  return '#6c757d'; // Gris
};

/**
 * Obtient l'icône basée sur le type de transaction
 */
export const getTransactionIcon = (type) => {
  return type === 'income' ? '➕' : '➖';
};

/**
 * Obtient la classe CSS basée sur le type
 */
export const getTransactionClass = (type) => {
  return type === 'income' ? 'text-success' : 'text-danger';
};
