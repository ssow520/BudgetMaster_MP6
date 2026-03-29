import React from 'react'

const SummaryComponent = ({ income = 0, expenses = 0 }) => {
    const balance = income - expenses

    return (
        <div className="summary-grid">
            <div className="summary-card income-card">
                <h4>Total Income</h4>
                <p>${income}</p>
            </div>

            <div className="summary-card expense-card">
                <h4>Total Expenses</h4>
                <p>${expenses}</p>
            </div>

            <div className="summary-card balance-card">
                <h4>Balance</h4>
                <p>${balance}</p>
            </div>
        </div>
    )
}

export default SummaryComponent