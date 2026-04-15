import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import TransactionForm from '../components/transactions/TransactionForm'
import SummaryComponent from '../components/common/dashboard/SummaryComponent'
import RecommendationsComponent from '../components/common/dashboard/RecommendationsComponent'
import CategoryBreakdownComponent from '../components/common/dashboard/CategoryBreakdownComponent'
import apiClient from '../services/apiClient'

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    indicator: 'balanced',
    monthlyLimit: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [alertVisible, setAlertVisible] = useState(true)

  const loadSummary = async () => {
    try {
      const response = await apiClient.get('/budget/summary')
      if (response.data && response.data.success) {
        setSummary(response.data.data)
        setAlertVisible(true)
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
      setError("Erreur lors de l'ajout de la transaction")
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const response = await apiClient.get('/transactions/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      const date = new Date().toISOString().split('T')[0]
      link.href = url
      link.setAttribute('download', `budgetmaster_export_${date}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError("Erreur lors de l'export CSV")
    } finally {
      setExporting(false)
    }
  }

  const formatAmount = (amount) =>
    new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount)

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container"><p>Chargement...</p></div>
      </div>
    )
  }

  const budgetRemaining = summary.monthlyLimit > 0
    ? summary.monthlyLimit - summary.totalExpenses
    : null

  const isOverBudget = budgetRemaining !== null && budgetRemaining < 0

  return (
    <div>
      <Navbar />
      <div className="container">

        <div className="dashboard-header">
          <div>
            <h2>Tableau de bord</h2>
            <p>Bienvenue dans votre espace budgétaire.</p>
          </div>
          <button onClick={handleExportCSV} className="btn btn-sm" disabled={exporting}>
            {exporting ? 'Export...' : '↓ Exporter CSV'}
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {budgetRemaining !== null && alertVisible && (
          <div className={`alert ${isOverBudget ? 'alert-danger' : 'alert-success'}`}>
            <span>
              {isOverBudget
                ? `⚠ Budget dépassé de ${formatAmount(Math.abs(budgetRemaining))}`
                : `✓ Budget restant ce mois : ${formatAmount(budgetRemaining)}`
              }
            </span>
            <button onClick={() => setAlertVisible(false)} className="btn-close">×</button>
          </div>
        )}

        <div className="section-card">
          <SummaryComponent
            income={summary.totalIncome}
            expenses={summary.totalExpenses}
          />
        </div>

        <div className="dashboard-grid">
          <div className="section-card">
            <RecommendationsComponent
              income={summary.totalIncome}
              expenses={summary.totalExpenses}
            />
          </div>
          <div className="section-card">
            <CategoryBreakdownComponent />
          </div>
        </div>

        <div className="section-card">
          <h3>Ajouter une transaction</h3>
          <TransactionForm onSubmit={handleAddTransaction} />
        </div>

      </div>
    </div>
  )
}

export default DashboardPage