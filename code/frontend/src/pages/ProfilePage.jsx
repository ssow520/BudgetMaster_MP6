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

        <div className="section-card">
          <h2>Profil</h2>
          <p>Informations de votre compte.</p>
        </div>

        <div className="section-card">
          <h3>Informations personnelles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Prénom</p>
              <p style={{ fontSize: '15px', fontWeight: '500' }}>{user?.firstName || '—'}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Nom</p>
              <p style={{ fontSize: '15px', fontWeight: '500' }}>{user?.lastName || '—'}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email</p>
              <p style={{ fontSize: '15px', fontWeight: '500' }}>{user?.email || '—'}</p>
            </div>
          </div>
        </div>

        <div className="section-card">
          <h3>Budget mensuel</h3>
          {currentLimit > 0 ? (
            <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
              Limite actuelle :&nbsp;
              <span style={{ color: 'var(--accent-light)', fontWeight: '600' }}>
                {formatAmount(currentLimit)}
              </span>
            </p>
          ) : (
            <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
              Aucun budget mensuel défini.
            </p>
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
            />
            <button
              type="submit"
              className="btn"
              style={{ width: 'auto', padding: '12px 24px' }}
            >
              Définir le budget
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default ProfilePage