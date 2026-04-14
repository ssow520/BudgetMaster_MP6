import React from 'react'

const RecommendationsComponent = ({ income = 0, expenses = 0 }) => {
  const balance = income - expenses

  let title = 'Budget stable'
  let message = 'Votre budget est équilibré ce mois-ci.'
  let recommendationClass = 'recommendation neutral'

  if (balance > 0) {
    title = 'Bonne gestion'
    message = 'Vos dépenses sont inférieures à vos revenus. Continuez sur cette lancée.'
    recommendationClass = 'recommendation positive'
  } else if (balance < 0) {
    title = 'Attention'
    message = 'Vos dépenses dépassent vos revenus ce mois-ci. Essayez de réduire les dépenses non essentielles.'
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