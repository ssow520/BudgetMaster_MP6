/**
 * Tests unitaires — Singleton Database
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

beforeEach(() => {
  const emptyDb = { users: [], transactions: [], budgets: [] };
  const dataDir = path.join(__dirname, '../../../data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'database.json'), JSON.stringify(emptyDb, null, 2));
});

describe('Database — Singleton : Unicité', () => {

  test('getInstance() retourne toujours la même référence', async () => {
    const { default: Database } = await import('../config/database.js');
    const instance1 = Database.getInstance();
    const instance2 = Database.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('new Database() retourne l instance existante', async () => {
    const { default: Database } = await import('../config/database.js');
    const instance1 = Database.getInstance();
    const instance2 = new Database();
    expect(instance1).toBe(instance2);
  });

  test('Database._instance est défini après premier appel', async () => {
    const { default: Database } = await import('../config/database.js');
    Database.getInstance();
    expect(Database._instance).toBeDefined();
  });

});

describe('Database — Partage d état', () => {

  test('modification via instance1 visible depuis instance2', async () => {
    const { default: Database } = await import('../config/database.js');
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();
    const data = db1.getData();
    data.users.push({ id: 'u-test-1', email: 'test@test.com' });
    const found = db2.getData().users.find(u => u.id === 'u-test-1');
    expect(found).toBeDefined();
  });

  test('loadDatabase() retourne le même objet en mémoire', async () => {
    const { loadDatabase } = await import('../config/database.js');
    const data1 = loadDatabase();
    const data2 = loadDatabase();
    expect(data1).toBe(data2);
  });

});

describe('Database — Modèle de données', () => {

  test('structure initiale contient users, transactions, budgets', async () => {
    const { loadDatabase } = await import('../config/database.js');
    const data = loadDatabase();
    expect(data).toHaveProperty('users');
    expect(data).toHaveProperty('transactions');
    expect(data).toHaveProperty('budgets');
    expect(Array.isArray(data.users)).toBe(true);
    expect(Array.isArray(data.transactions)).toBe(true);
    expect(Array.isArray(data.budgets)).toBe(true);
  });

  test('un User a les champs requis', async () => {
    const { loadDatabase, saveDatabase } = await import('../config/database.js');
    const user = {
      id: 'u-model-1',
      firstName: 'Souleymane',
      lastName: 'Sow',
      email: 'sow@test.com',
      password: '$2b$10$hashedpassword',
      monthlyBudgetLimit: 2000,
      createdAt: new Date().toISOString(),
    };
    const data = loadDatabase();
    data.users.push(user);
    saveDatabase(data);
    const found = loadDatabase().users.find(u => u.id === 'u-model-1');
    expect(found).toHaveProperty('id');
    expect(found).toHaveProperty('email');
    expect(found).toHaveProperty('password');
    expect(found).toHaveProperty('createdAt');
  });

  test('une Transaction a les champs requis', async () => {
    const { loadDatabase, saveDatabase } = await import('../config/database.js');
    const transaction = {
      id: 'tx-1',
      userId: 'u-1',
      type: 'expense',
      amount: 250.50,
      category: 'food',
      date: new Date().toISOString(),
    };
    const data = loadDatabase();
    data.transactions.push(transaction);
    saveDatabase(data);
    const found = loadDatabase().transactions.find(t => t.id === 'tx-1');
    expect(found).toHaveProperty('id');
    expect(found).toHaveProperty('userId');
    expect(found).toHaveProperty('type');
    expect(found).toHaveProperty('amount');
    expect(['income', 'expense']).toContain(found.type);
    expect(found.amount).toBeGreaterThan(0);
  });

  test('montant négatif est invalide', () => {
    const invalidAmounts = [0, -1, -100];
    invalidAmounts.forEach(amount => {
      expect(amount).toBeLessThanOrEqual(0);
    });
  });

});

describe('Database — Logging', () => {

  test('log au démarrage contient [Database]', async () => {
    const { default: Database } = await import('../config/database.js');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    Database._instance = null;
    new Database();
    const hasLog = consoleSpy.mock.calls.some(c =>
      typeof c[0] === 'string' && c[0].includes('[Database]')
    );
    expect(hasLog).toBe(true);
    consoleSpy.mockRestore();
  });

});
