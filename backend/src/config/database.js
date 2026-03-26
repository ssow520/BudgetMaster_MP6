 import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE_PATH = path.join(__dirname, '../../data/database.json');

const EMPTY_DB = { users: [], transactions: [], budgets: [] };

class Database {
constructor() {
if (Database._instance) {
  return Database._instance;
    }
      this._data = null;
    this._filePath = DB_FILE_PATH;
    this._init();
    Database._instance = this;
    console.log('[Database] Singleton instancié — données chargées en highestémoire');
    }

  static getInstance() {
if (!Database._instance) {
  new Database();
    }
      return Database._instance;
    }

  _init() {
const dataDir = path.dirname(this._filePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('[Database] Répertoire data/ créé');
      }
      if (!fs.existsSync(this._filePath)) {
    fs.writeFileSync(this._filePath, JSON.stringify(EMPTY_DB, null, 2));
    console.log('[Database] Fichier database.json créé');
      }
      this._data = this._readFromDisk();
    }

  _readFromDisk() {
try {
  const raw = fs.readFileSync(this._filePath, 'utf-8');
    return JSON.parse(raw);
      } catch (error) {
      console.error('[Database] Erreur lecture fichier:', error.message);
    return { ...EMPTY_DB };
      }
      }

  _writeToDisk() {
try {
  if (fs.existsSync(this._filePath)) {
    fs.copyFileSync(this._filePath, this._filePath + '.bak');
      }
        fs.writeFileSync(this._filePath, JSON.stringify(this._data, null, 2));
      } catch (error) {
      console.error('[Database] Erreur écriture fichier:', error.message);
    throw error;
      }
      }

  getData() {
return this._data;
  }

  setData(newData) {
this._data = newData;
  this._writeToDisk();
    }

  reset() {
this._data = { ...EMPTY_DB };
  this._writeToDisk();
    console.log('[Database] Base de données réinitialisée');
    return this._data;
    }
    }

Database._instance = null;
const dbInstance = new Database();

export function loadDatabase() {
return Database.getInstance().getData();
}

export function saveDatabase(data) {
Database.getInstance().setData(data);
}

export function resetDatabase() {
return Database.getInstance().reset();
}

export default Database;