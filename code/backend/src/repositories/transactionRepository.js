import { loadDatabase, saveDatabase } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class TransactionRepository {
  static create(transactionData) {
    const db = loadDatabase();
    const newTransaction = {
      id: uuidv4(),
      userId: transactionData.userId,
      type: transactionData.type,
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

  static findById(id) {
    const db = loadDatabase();
    return db.transactions.find((t) => t.id === id);
  }

  static findByUserId(userId) {
    const db = loadDatabase();
    return db.transactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static findIncomeByUserId(userId) {
    const db = loadDatabase();
    return db.transactions
      .filter((t) => t.userId === userId && t.type === 'income')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static findExpenseByUserId(userId) {
    const db = loadDatabase();
    return db.transactions
      .filter((t) => t.userId === userId && t.type === 'expense')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  static update(id, updates) {
    const db = loadDatabase();
    const index = db.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }
    db.transactions[index] = {
      ...db.transactions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(db);
    return db.transactions[index];
  }

  static delete(id) {
    const db = loadDatabase();
    const index = db.transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      return false;
    }
    db.transactions.splice(index, 1);
    saveDatabase(db);
    return true;
  }

  static findByUserIdAndDateRange(userId, startDate, endDate) {
    const db = loadDatabase();
    return db.transactions.filter((t) => {
      const date = new Date(t.date);
      return (
        t.userId === userId &&
        date >= new Date(startDate) &&
        date <= new Date(endDate)
      );
    });
  }

  static getExpensesByCategory(userId, startDate, endDate) {
    const transactions = this.findByUserIdAndDateRange(userId, startDate, endDate);
    const byCategory = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category || 'other';
        byCategory[cat] = (byCategory[cat] || 0) + t.amount;
      });
    return byCategory;
  }

  static calculateTotalIncome(userId, startDate, endDate) {
    return this.findByUserIdAndDateRange(userId, startDate, endDate)
      .filter((t) => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  }

  static calculateTotalExpense(userId, startDate, endDate) {
    return this.findByUserIdAndDateRange(userId, startDate, endDate)
      .filter((t) => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  }
}

export default TransactionRepository;
