import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

const Navbar = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime')
    if (!loginTime) return

    const elapsed = Date.now() - parseInt(loginTime)
    const remaining = SESSION_DURATION - elapsed

    if (remaining <= 0) {
      handleLogout()
      return
    }

    const timer = setTimeout(() => {
      handleLogout()
    }, remaining)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('loginTime')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-logo">BudgetMaster</div>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/transactions" className="nav-link">Transactions</Link>
        <Link to="/profile" className="nav-link">Profil</Link>
      </div>
      <div className="nav-right">
        <span>{user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}</span>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ width: 'auto', padding: '10px 14px' }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

export default Navbar