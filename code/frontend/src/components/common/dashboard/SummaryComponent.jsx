import React from 'react'

const SummaryComponent = ({ income = 0, expenses = 0 }) => {
  const balance = income - expenses

  const format = (amount) =>
    new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount)

  return (
    <div className="summary-grid">
      <div className="summary-card income-card">
        <h4>Revenus</h4>
        <p>{format(income)}</p>
      </div>
      <div className="summary-card expense-card">
        <h4>Dépenses</h4>
        <p>{format(expenses)}</p>
      </div>
      <div className="summary-card balance-card">
        <h4>Solde</h4>
        <p>{format(balance)}</p>
      </div>
    </div>
  )
}

export default SummaryComponent