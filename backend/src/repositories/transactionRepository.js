/**
 * TransactionRepository
 * Gère l'accès aux données des transactions
 */

import { loadDatabase, saveDatabase } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class TransactionRepository {
  /**
   * Crée une nouvelle transaction
   */
  static create(transactionData) {
    const db = loadDatabase();
    const newTransaction = {
      id: uuidv4(),
      userId: transactionData.userId,
      type: transactionData.type, // 'income' ou 'expense'
      amount: transactionData.amount,
      category: transactionData.category || null,
      frequency: transactionData.frequency,
      description: transactionData.description || '',
      date: transactionData.date,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.transactions.push(newTransaction);
    saveDatabase(db);
    return newTransaction;
  }

  /**
   * Trouve une transaction par ID
   */
  static findById(id) {
    const db = loadDatabase();
    return db.transactions.find((transaction) => transaction.id === id);
  }

  /**
   * Obtient toutes les transactions d'un utilisateur
   */
  static findByUserId(userId) {
    const db = loadDatabase();
    return db.transactions
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Obtient toutes les transactions de revenus d'un utilisateur
   */
  static findIncomeByUserId(userId) {
    const db = loadDatabase();
    return db.transactions
      .filter((transaction) => transaction.userId === userId && transaction.type === 'income')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Obtient toutes les transactions de dépenses d'un utilisateur
   */
  static findExpenseByUserId(userId) {
    const db = loadDatabase();
    return db.transactions
      .filter((transaction) => transaction.userId === userId && transaction.type === 'expense')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Met à jour une transaction
   */
  static update(id, updates) {
    const db = loadDatabase();
    const transactionIndex = db.transactions.findIndex(
      (transaction) => transaction.id === id
    );

    if (transactionIndex === -1) {
      return null;
    }

    db.transactions[transactionIndex] = {
      ...db.transactions[transactionIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveDatabase(db);
    return db.transactions[transactionIndex];
  }

  /**
   * Supprime une transaction
   */
  static delete(id) {
    const db = loadDatabase();
    const transactionIndex = db.transactions.findIndex(
      (transaction) => transaction.id === id
    );

    if (transactionIndex === -1) {
      return false;
    }

    db.transactions.splice(transactionIndex, 1);
    saveDatabase(db);
    return true;
  }

  /**
   * Obtient les transactions dans une période pour un utilisateur
   */
  static findByUserIdAndDateRange(userId, startDate, endDate) {
    const db = loadDatabase();
    return db.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.userId === userId &&
        transactionDate >= new Date(startDate) &&
        transactionDate <= new Date(endDate)
      );
    });
  }

  /**
   * Obtient les dépenses par catégorie pour un utilisateur dans une période
   */
  static getExpensesByCategory(userId, startDate, endDate) {
    const transactions = this.findByUserIdAndDateRange(userId, startDate, endDate);
    const expenses = transactions.filter((t) => t.type === 'expense');

    const byCategory = {};
    expenses.forEach((expense) => {
      const cat = expense.category || 'other';
      byCategory[cat] = (byCategory[cat] || 0) + expense.amount;
    });

    return byCategory;
  }

  /**
   * Calcule le total des revenus pour un utilisateur dans une période
   */
  static calculateTotalIncome(userId, startDate, endDate) {
    const transactions = this.findByUserIdAndDateRange(userId, startDate, endDate);
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Calcule le total des dépenses pour un utilisateur dans une période
   */
  static calculateTotalExpense(userId, startDate, endDate) {
    const transactions = this.findByUserIdAndDateRange(userId, startDate, endDate);
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }
}

export default TransactionRepository;
