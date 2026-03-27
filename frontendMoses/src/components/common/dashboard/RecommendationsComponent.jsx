import React from 'react'

const RecommendationsComponent = ({ income = 0, expenses = 0 }) => {
    const balance = income - expenses

    let title = 'Budget Status'
    let message = 'Your budget is stable.'
    let recommendationClass = 'recommendation neutral'

    if (balance > 0) {
        title = 'Good Job'
        message = 'You are spending less than you earn. Keep maintaining this healthy budget balance.'
        recommendationClass = 'recommendation positive'
    } else if (balance < 0) {
        title = 'Warning'
        message = 'Your expenses are higher than your income. Try reducing non-essential spending.'
        recommendationClass = 'recommendation negative'
    }

    return (
        <div className={recommendationClass}>
            <h3>{title}</h3>
            <p>{message}</p>
        </div>
    )
}

export default RecommendationsComponent