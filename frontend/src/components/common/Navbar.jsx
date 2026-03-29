import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
    const { logout, user } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="nav-left">
                <div className="nav-logo">BudgetMaster</div>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/transactions" className="nav-link">Transactions</Link>
                <Link to="/profile" className="nav-link">Profile</Link>
            </div>

            <div className="nav-right">
                <span>{user?.name || 'User'}</span>
                <button onClick={handleLogout} className="btn btn-danger" style={{ width: 'auto', padding: '10px 14px' }}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar