import React, { useState, useEffect } from 'react'
import apiClient from '../../../services/apiClient'

const RecommendationsComponent = ({ income = 0, expenses = 0 }) => {
  const [visible, setVisible] = useState(true)
  const [topCategory, setTopCategory] = useState(null)

  useEffect(() => {
    const loadBreakdown = async () => {
      try {
        const response = await apiClient.get('/budget/category-breakdown')
        if (response.data && response.data.success && response.data.data.length > 0) {
          setTopCategory(response.data.data[0])
        }
      } catch (err) {
        console.error('Error fetching category breakdown:', err)
      }
    }
    loadBreakdown()
  }, [expenses])

  if (!visible) return null

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
    if (topCategory) {
      message += ` Votre catégorie la plus dépensière est ${topCategory.category} (${topCategory.percentage}% des dépenses).`
    }
    recommendationClass = 'recommendation negative'
  }

  return (
    <div className={recommendationClass}>
      <button onClick={() => setVisible(false)} className="btn-close" aria-label="Fermer">
        ×
      </button>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

export default RecommendationsComponent