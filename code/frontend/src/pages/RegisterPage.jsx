import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await authService.register({ firstName, lastName, email, password })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la création du compte')
    }
  }

  return (
    <div className="page-center">
      <div className="form-card">
        <h2>Créer un compte</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              className="form-control"
              placeholder="Entrez votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              placeholder="Entrez votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              className="form-control"
              placeholder="Créez un mot de passe (8 caractères min)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">Créer le compte</button>
        </form>
        <p className="text-center mt-15">
          Déjà un compte ? <Link to="/login" className="link-text">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage