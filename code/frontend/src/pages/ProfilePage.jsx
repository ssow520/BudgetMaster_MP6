import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { user } = useAuth()
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [currentLimit, setCurrentLimit] = useState(0)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadBudget = async () => {
    try {
      const response = await apiClient.get('/budget/summary')
      if (response.data && response.data.success) {
        setCurrentLimit(response.data.data.monthlyLimit || 0)
      }
    } catch (err) {
      setError('Erreur lors du chargement du budget')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBudget()
  }, [])

  const handleSetBudget = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await apiClient.post('/budget/set-monthly-limit', {
        monthlyLimit: parseFloat(monthlyLimit),
      })
      setCurrentLimit(parseFloat(monthlyLimit))
      setMonthlyLimit('')
      setSuccess('Budget mensuel mis à jour avec succès.')
    } catch (err) {
      setError('Erreur lors de la définition du budget')
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

  return (
    <div>
      <Navbar />
      <div className="container">

        <div className="dashboard-header">
          <div>
            <h2>Profil</h2>
            <p>Gérez vos informations et votre budget mensuel.</p>
          </div>
        </div>

        <div className="profile-grid">

          <div className="section-card">
            <h3>Informations personnelles</h3>
            <div className="profile-field">
              <label>Prénom</label>
              <p>{user?.firstName || '—'}</p>
            </div>
            <div className="profile-field">
              <label>Nom</label>
              <p>{user?.lastName || '—'}</p>
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{user?.email || '—'}</p>
            </div>
          </div>

          <div className="section-card">
            <h3>Budget mensuel</h3>

            {currentLimit > 0 ? (
              <div className="alert alert-success" style={{ marginBottom: '20px' }}>
                <span>Limite actuelle : <strong>{formatAmount(currentLimit)}</strong></span>
              </div>
            ) : (
              <p style={{ marginBottom: '20px' }}>Aucun budget mensuel défini.</p>
            )}

            {success && <p className="success-text">{success}</p>}
            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSetBudget} className="transaction-form">
              <input
                type="number"
                className="form-control"
                placeholder="Nouveau budget mensuel ($)"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                min="0.01"
                step="0.01"
                required
                style={{ gridColumn: 'span 2' }}
              />
              <button type="submit" className="btn">
                Définir le budget
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage