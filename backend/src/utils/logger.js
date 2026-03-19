/**
 * Logger - Système de logging centralisé
 */

class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = ['debug', 'info', 'warn', 'error'];
  }

  /**
   * Log de débogage
   */
  debug(message, data = null) {
    if (this.levels.indexOf(this.level) <= 0) {
      console.log(`[DEBUG] ${this._getTimestamp()} ${message}`, data || '');
    }
  }

  /**
   * Log informatif
   */
  info(message, data = null) {
    if (this.levels.indexOf(this.level) <= 1) {
      console.log(`[INFO] ${this._getTimestamp()} ${message}`, data || '');
    }
  }

  /**
   * Log d'avertissement
   */
  warn(message, data = null) {
    if (this.levels.indexOf(this.level) <= 2) {
      console.warn(`[WARN] ${this._getTimestamp()} ${message}`, data || '');
    }
  }

  /**
   * Log d'erreur
   */
  error(message, error = null) {
    console.error(`[ERROR] ${this._getTimestamp()} ${message}`, error || '');
  }

  /**
   * Obtient le timestamp actuel
   */
  _getTimestamp() {
    return new Date().toISOString();
  }
}

// Singleton - Une seule instance du logger
const logger = new Logger(process.env.LOG_LEVEL || 'info');

export default logger;
