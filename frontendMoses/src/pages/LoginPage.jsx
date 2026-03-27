import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const data = await authService.login(email, password)
            login(data.user, data.token)
            navigate('/dashboard')
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="page-center">
            <div className="form-card">
                <h2>Connexion</h2>

                {error && <p className="error-text">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn">Login</button>
                </form>

                <p className="text-center mt-15">
                    No account? <Link to="/register" className="link-text">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage