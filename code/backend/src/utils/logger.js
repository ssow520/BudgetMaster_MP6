class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = ['debug', 'info', 'warn', 'error'];
  }

  debug(message, data = null) {
    if (this.levels.indexOf(this.level) <= 0) {
      console.log(`[DEBUG] ${this._getTimestamp()} ${message}`, data || '');
    }
  }

  info(message, data = null) {
    if (this.levels.indexOf(this.level) <= 1) {
      console.log(`[INFO] ${this._getTimestamp()} ${message}`, data || '');
    }
  }

  warn(message, data = null) {
    if (this.levels.indexOf(this.level) <= 2) {
      console.warn(`[WARN] ${this._getTimestamp()} ${message}`, data || '');
    }
  }

  error(message, error = null) {
    console.error(`[ERROR] ${this._getTimestamp()} ${message}`, error || '');
  }

  _getTimestamp() {
    return new Date().toISOString();
  }
}

const logger = new Logger(process.env.LOG_LEVEL || 'info');
export default logger;
