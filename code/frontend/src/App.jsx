import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionListPage from './pages/TransactionListPage'
import ProfilePage from './pages/ProfilePage'

import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
    return (
        <Routes>

            {/* Redirection automatique */}
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <TransactionListPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            {/* Redirection si route inconnue */}
            <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
    )
}

export default App