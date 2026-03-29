import React, { useState } from 'react'
import Navbar from '../components/common/Navbar'
import TransactionForm from '../components/transactions/TransactionForm'
import SummaryComponent from '../components/common/dashboard/SummaryComponent'
import RecommendationsComponent from "../components/common/dashboard/RecommendationsComponent"

const DashboardPage = () => {
    const [income, setIncome] = useState(2500)
    const [expenses, setExpenses] = useState(1200)

    const handleAddTransaction = (transaction) => {
        console.log(transaction)

        const amount = Number(transaction.amount)

        if (transaction.type === 'income') {
            setIncome((prev) => prev + amount)
        } else {
            setExpenses((prev) => prev + amount)
        }
    }

    return (
        <div>
            <Navbar />

            <div className="container">
                <div className="section-card">
                    <h2>Dashboard</h2>
                    <p>Welcome to your budget dashboard.</p>
                </div>

                <div className="section-card">
                    <SummaryComponent income={income} expenses={expenses} />
                </div>

                <div className="section-card">
                    <RecommendationsComponent income={income} expenses={expenses} />
                </div>

                <div className="section-card">
                    <TransactionForm onSubmit={handleAddTransaction} />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage