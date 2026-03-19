/**
 * Configuration de la base de données
 * Pour la phase initiale, utilise un stockage JSON en mémoire
 * À remplacer par MongoDB ou PostgreSQL en production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFilePath = path.join(__dirname, '../../data/database.json');

/**
 * Initialise la base de données
 */
function initializeDatabase() {
  // Créer le répertoire data s'il n'existe pas
  const dataDir = path.join(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Si la base n'existe pas, créer la structure
  if (!fs.existsSync(dbFilePath)) {
    const initialData = {
      users: [],
      transactions: [],
      budgets: [],
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2));
  }
}

/**
 * Charge les données de la base
 */
export function loadDatabase() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      initializeDatabase();
    }
    const data = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors du chargement de la base de données:', error);
    return { users: [], transactions: [], budgets: [] };
  }
}

/**
 * Sauvegarde les données dans la base
 */
export function saveDatabase(data) {
  try {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la base de données:', error);
  }
}

/**
 * Réinitialise la base de données
 */
export function resetDatabase() {
  const initialData = {
    users: [],
    transactions: [],
    budgets: [],
  };
  saveDatabase(initialData);
  return initialData;
}

// Initialiser au chargement du module
initializeDatabase();
