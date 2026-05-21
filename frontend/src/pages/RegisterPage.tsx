import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.firstName, form.lastName, form.email, form.password)
      navigate('/')
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #dcccac', borderRadius: 10, fontSize: 14, background: '#fff8ec', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 }

  return (
    <div style={{ minHeight: '100vh', background: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Lato', sans-serif" }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 36, maxWidth: 380, width: '90%', border: '1px solid #e8dfc8' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: '#546b41', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 12px' }}>📖</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, margin: 0 }}>Create Account</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 0 }}>
            <input placeholder="First name" value={form.firstName} onChange={set('firstName')} required style={{ ...inputStyle }} />
            <input placeholder="Last name" value={form.lastName} onChange={set('lastName')} required style={{ ...inputStyle }} />
          </div>
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required style={inputStyle} />
          <input type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={set('password')} required minLength={8} style={inputStyle} />
          {error && <div style={{ color: '#c0392b', fontSize: 12, marginBottom: 10 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', background: '#546b41', color: '#fff8ec', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#5a5647' }}>
          Already have an account? <Link to="/login" style={{ color: '#546b41', fontWeight: 700 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
