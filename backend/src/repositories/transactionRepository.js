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
  return db.transactions.find((transaction) => transaction.id === id);
}

   static findByUserId(userId) {
  const db = loadDatabase();
    return db.transactions
    .filter((transaction) => transaction.userId === userId)
  .sort((a, b) => new Date(b.date) - new Date(a.date));
}

   static findIncomeByUserId(userId) {
  const db = loadDatabase();
    return db.transactions
    .filter((transaction) => transaction.userId === userId && transaction.type === 'income')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
      }

  static findExpenseByUserId(userId) {
   const db = loadDatabase();
   return db.transactions
  .filter((transaction) => transaction.userId === userId && transaction.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

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

      static calculateTotalIncome(userId, startDate, endDate) {
    const transactions = this.findByUserIdAndDateRange(userId, startDate, endDate);
  return transactions
.filter((t) => t.type === 'income')
  .reduce((total, t) => total + t.amount, 0);
   }

    static calculateTotalExpense(userId, startDate, endDate) {
    const transactions = this.findByUserIdAndDateRange(userId, startDate, endDate);
return transactions
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + t.amount, 0);
      }
      }

export default TransactionRepository;