import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import apiClient from '../../../services/apiClient'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

const CategoryBreakdownComponent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBreakdown = async () => {
      try {
        const response = await apiClient.get('/budget/category-breakdown')
        if (response.data && response.data.success) {
          setData(response.data.data || [])
        }
      } catch (err) {
        // silencieux
      } finally {
        setLoading(false)
      }
    }
    loadBreakdown()
  }, [])

  if (loading) return <p>Chargement...</p>

  if (data.length === 0) {
    return <p>Aucune dépense enregistrée ce mois-ci.</p>
  }

  const chartData = data.map(item => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }))

  const formatAmount = (amount) =>
    new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="section-card">
          <p><strong>{item.name}</strong></p>
          <p>{formatAmount(item.value)}</p>
          <p>{item.percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <h3>Répartition des dépenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percentage }) => `${name} (${percentage}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryBreakdownComponent