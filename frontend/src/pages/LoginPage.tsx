import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #dcccac', borderRadius: 10, fontSize: 14, color: '#2c2a1e', background: '#fff8ec', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ minHeight: '100vh', background: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lato', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 36, maxWidth: 380, width: '90%', border: '1px solid #e8dfc8', boxShadow: '0 4px 24px rgba(84,107,65,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: '#546b41', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 12px' }}>📖</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Basora</h1>
          <p style={{ color: '#8a8478', fontSize: 13, marginTop: 4 }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          {error && <div style={{ color: '#c0392b', fontSize: 12, marginBottom: 10 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: '#546b41', color: '#fff8ec', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#5a5647' }}>
          No account? <Link to="/register" style={{ color: '#546b41', fontWeight: 700 }}>Register</Link>
        </div>
      </div>
    </div>
  )
}