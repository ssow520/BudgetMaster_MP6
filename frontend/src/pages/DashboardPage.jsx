import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import TransactionForm from '../components/transactions/TransactionForm'
import SummaryComponent from '../components/common/dashboard/SummaryComponent'
import RecommendationsComponent from '../components/common/dashboard/RecommendationsComponent'
import apiClient from '../services/apiClient'

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    indicator: 'balanced',
    recommendations: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSummary = async () => {
    try {
      const response = await apiClient.get('/budget/summary')
      if (response.data && response.data.success) {
        setSummary(response.data.data)
      }
    } catch (err) {
      setError('Erreur lors du chargement du tableau de bord')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  const handleAddTransaction = async (transaction) => {
    try {
      await apiClient.post('/transactions', transaction)
      await loadSummary()
    } catch (err) {
      setError('Erreur lors de l\'ajout de la transaction')
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="section-card">
          <h2>Tableau de bord</h2>
          <p>Bienvenue dans votre espace budgétaire.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="section-card">
          <SummaryComponent
            income={summary.totalIncome}
            expenses={summary.totalExpenses}
          />
        </div>

        <div className="section-card">
          <RecommendationsComponent
            income={summary.totalIncome}
            expenses={summary.totalExpenses}
          />
        </div>

        <div className="section-card">
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage