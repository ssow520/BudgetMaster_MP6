import React, { useState } from 'react'

const TransactionForm = ({ onSubmit }) => {
    const [type, setType] = useState('expense')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const transaction = {
            type,
            amount,
            category,
            description,
        }

        onSubmit(transaction)

        setAmount('')
        setCategory('')
        setDescription('')
    }

    return (
        <div>
            <h3>Add Transaction</h3>

            <form onSubmit={handleSubmit} className="transaction-form">
                <select
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <input
                    type="text"
                    className="form-control"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button type="submit" className="btn">
                    Add Transaction
                </button>
            </form>
        </div>
    )
}

export default TransactionForm