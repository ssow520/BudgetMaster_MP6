/**
 * AuthContext - Contexte React pour l'authentification
 * Permet à tous les composants d'accéder aux informations d'authentification
 */

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/AuthService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialiser l'état d'authentification
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
    return result;
  };

  const register = async (firstName, lastName, email, password) => {
    setIsLoading(true);
    const result = await authService.register(firstName, lastName, email, password);

    if (result.success) {
      setUser(result.data.user);
    }

    setIsLoading(false);
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    const result = await authService.logout();

    setUser(null);
    setIsAuthenticated(false);

    setIsLoading(false);
    return result;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
