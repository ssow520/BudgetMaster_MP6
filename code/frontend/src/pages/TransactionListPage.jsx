import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import apiClient from '../services/apiClient'

const CATEGORIES = [
  'Alimentation', 'Logement', 'Transport', 'Loisirs',
  'Santé', 'Éducation', 'Salaire', 'Bonus', 'Autre',
]

const CATEGORY_ICONS = {
  'Alimentation': '🍔',
  'Logement': '🏠',
  'Transport': '🚗',
  'Loisirs': '🎮',
  'Santé': '💊',
  'Éducation': '📚',
  'Salaire': '💰',
  'Bonus': '🎁',
  'Autre': '📦',
}

const TABS = [
  { key: 'all', label: 'Toutes' },
  { key: 'income', label: 'Revenus' },
  { key: 'expense', label: 'Dépenses' },
]

const TransactionListPage = () => {
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [editForm, setEditForm] = useState({ amount: '', description: '', category: '' })

  const loadTransactions = async () => {
    try {
      const response = await apiClient.get('/transactions')
      if (response.data && response.data.success) {
        setTransactions(response.data.data.transactions || [])
      }
    } catch (err) {
      setError('Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return
    try {
      await apiClient.delete(`/transactions/${id}`)
      setTransactions(transactions.filter(t => t.id !== id))
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction)
    setEditForm({
      amount: transaction.amount,
      description: transaction.description || '',
      category: transaction.category || '',
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      await apiClient.put(`/transactions/${editingTransaction.id}`, {
        amount: parseFloat(editForm.amount),
        description: editForm.description,
        category: editForm.category,
      })
      setEditingTransaction(null)
      loadTransactions()
    } catch (err) {
      setError('Erreur lors de la modification')
    }
  }

  const handleReset = () => {
    setFilterCategory('')
    setFilterStartDate('')
    setFilterEndDate('')
    setActiveTab('all')
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('fr-CA')

  const formatAmount = (amount) =>
    new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount)

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'income' && t.type !== 'income') return false
    if (activeTab === 'expense' && t.type !== 'expense') return false
    if (filterCategory && t.category !== filterCategory) return false
    if (filterStartDate && new Date(t.date) < new Date(filterStartDate)) return false
    if (filterEndDate && new Date(t.date) > new Date(filterEndDate)) return false
    return true
  })

  const total = filteredTransactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount
  }, 0)

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
          <h2>Transactions</h2>
          <p>{filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="section-card">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={activeTab === tab.key ? 'btn' : 'btn btn-outline'}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="section-card">
          <h3>Filtres</h3>
          <select
            className="form-control"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="date"
            className="form-control"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            placeholder="Date début"
          />
          <input
            type="date"
            className="form-control"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            placeholder="Date fin"
          />
          <button onClick={handleReset} className="btn btn-outline">
            Réinitialiser
          </button>
        </div>

        <div className="section-card">
          <p>
            Total : <strong>{formatAmount(Math.abs(total))}</strong>
          </p>
        </div>

        {editingTransaction && (
          <div className="section-card">
            <h3>Modifier la transaction</h3>
            <form onSubmit={handleEditSubmit} className="transaction-form">
              <input
                type="number"
                className="form-control"
                placeholder="Montant"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                min="0.01"
                step="0.01"
                required
              />
              <select
                className="form-control"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option value="">Catégorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
              <div>
                <button type="submit" className="btn">Sauvegarder</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setEditingTransaction(null)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="section-card">
          {filteredTransactions.length === 0 ? (
            <p>Aucune transaction pour ces critères.</p>
          ) : (
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Montant</th>
                    <th>Catégorie</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t.id}>
                      <td>{formatDate(t.date)}</td>
                      <td>{t.type === 'income' ? 'Revenu' : 'Dépense'}</td>
                      <td>{t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}</td>
                      <td>{t.category ? `${CATEGORY_ICONS[t.category] || ''} ${t.category}` : '—'}</td>
                      <td>{t.description || '—'}</td>
                      <td>
                        <button onClick={() => handleEditClick(t)} className="btn">Modifier</button>
                        <button onClick={() => handleDelete(t.id)} className="btn btn-danger">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default TransactionListPage