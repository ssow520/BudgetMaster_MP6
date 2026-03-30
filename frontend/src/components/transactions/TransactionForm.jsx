import React, { useState } from 'react'

const CATEGORIES = [
  'Alimentation',
  'Logement',
  'Transport',
  'Loisirs',
  'Santé',
  'Éducation',
  'Salaire',
  'Bonus',
  'Autre',
]

const TransactionForm = ({ onSubmit }) => {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    onSubmit({
      type,
      amount: parseFloat(amount),
      category: category || 'Autre',
      description,
      date: new Date().toISOString(),
    })

    setAmount('')
    setCategory('')
    setDescription('')
  }

  return (
    <div>
      <h3>Ajouter une transaction</h3>
      <form onSubmit={handleSubmit} className="transaction-form">
        <select
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Revenu</option>
          <option value="expense">Dépense</option>
        </select>

        <input
          type="number"
          className="form-control"
          placeholder="Montant ($)"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Catégorie (optionnel)</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="btn">
          Ajouter
        </button>
      </form>
    </div>
  )
}

export default TransactionForm