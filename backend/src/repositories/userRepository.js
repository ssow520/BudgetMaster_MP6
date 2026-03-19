/**
 * UserRepository
 * Gère l'accès aux données utilisateur
 */

import { loadDatabase, saveDatabase } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
  /**
   * Crée un nouvel utilisateur
   */
  static create(userData) {
    const db = loadDatabase();
    const newUser = {
      id: uuidv4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, // Déjà hashé par AuthService
      monthlyBudgetLimit: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDatabase(db);
    return newUser;
  }

  /**
   * Trouve un utilisateur par email
   */
  static findByEmail(email) {
    const db = loadDatabase();
    return db.users.find((user) => user.email === email);
  }

  /**
   * Trouve un utilisateur par ID
   */
  static findById(id) {
    const db = loadDatabase();
    return db.users.find((user) => user.id === id);
  }

  /**
   * Met à jour un utilisateur
   */
  static update(id, updates) {
    const db = loadDatabase();
    const userIndex = db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    db.users[userIndex] = {
      ...db.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveDatabase(db);
    return db.users[userIndex];
  }

  /**
   * Supprime un utilisateur
   */
  static delete(id) {
    const db = loadDatabase();
    const userIndex = db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    db.users.splice(userIndex, 1);
    saveDatabase(db);
    return true;
  }

  /**
   * Obtient tous les utilisateurs (admin)
   */
  static findAll() {
    const db = loadDatabase();
    return db.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Vérifie si un email existe
   */
  static emailExists(email) {
    const db = loadDatabase();
    return db.users.some((user) => user.email === email);
  }

  /**
   * Obtient les informations publiques d'un utilisateur
   */
  static findPublicProfile(id) {
    const user = this.findById(id);
    if (!user) {
      return null;
    }
    const { password, ...publicData } = user;
    return publicData;
  }
}

export default UserRepository;
