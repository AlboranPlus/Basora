import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LevelBadge } from './LevelBadge'

const NAV = [
  { to: '/',          icon: '🔍', label: 'Discover',      section: 'MAIN' },
  { to: '/shelves',   icon: '📚', label: 'My Shelves',    section: 'MAIN' },
  { to: '/search',    icon: '🔎', label: 'Search',        section: 'MAIN' },
  { to: '/borrowings',icon: '📥', label: 'My Borrowings', section: 'BORROWING' },
  { to: '/lent',      icon: '📤', label: 'Lent Out',      section: 'BORROWING' },
  { to: '/history',   icon: '🕐', label: 'History',       section: 'BORROWING' },
  { to: '/profile',   icon: '👤', label: 'Profile',       section: 'ACCOUNT' },
  { to: '/reviews',   icon: '⭐', label: 'Reviews',       section: 'ACCOUNT' },
  { to: '/settings',  icon: '⚙️', label: 'Settings',      section: 'ACCOUNT' },
] as const

const SECTIONS = ['MAIN', 'BORROWING', 'ACCOUNT'] as const

interface Props { children: React.ReactNode }

export function Layout({ children }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const { member, loadMe } = useAuth()
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => { if (!member) loadMe() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Lato', 'Segoe UI', sans-serif", background: '#fff8ec', color: '#2c2a1e', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#546b41', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #657d4e' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#fff8ec', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700 }}>
            <div style={{ width: 34, height: 34, background: '#99ad7a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📖</div>
            Basora
          </Link>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          {SECTIONS.map((sec) => (
            <div key={sec} style={{ paddingTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: '#ccd9b5', padding: '0 18px 6px', textTransform: 'uppercase' }}>{sec}</div>
              {NAV.filter((i) => i.section === sec).map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link key={item.to} to={item.to} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 18px', textDecoration: 'none',
                    color: active ? '#fff8ec' : '#ccd9b5', background: active ? '#657d4e' : 'transparent',
                    fontSize: 14, fontWeight: active ? 600 : 400, transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#657d4e88' }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ width: 18, textAlign: 'center' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {member && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #657d4e' }}>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#99ad7a', color: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div>
                <div style={{ fontSize: 13, color: '#fff8ec', fontWeight: 600 }}>{member.firstName} {member.lastName}</div>
                <LevelBadge level={member.level} />
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #e8dfc8', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <form onSubmit={handleSearch} style={{ flex: 1, position: 'relative', maxWidth: 520 }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#8a8478' }}>🔍</span>
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search books, authors, subjects…"
              style={{ width: '100%', padding: '9px 16px 9px 40px', border: '1.5px solid #dcccac', borderRadius: 20, fontSize: 14, background: '#fff8ec', color: '#2c2a1e', outline: 'none', boxSizing: 'border-box' }}
              onFocus={(e) => (e.target.style.borderColor = '#546b41')}
              onBlur={(e) => (e.target.style.borderColor = '#dcccac')}
            />
          </form>
          <Link to="/" style={{ background: '#546b41', color: '#fff8ec', border: 'none', borderRadius: 20, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>Home</Link>
          {member?.level && member.level >= 2 && (
            <Link to="/lend" style={{ background: 'transparent', color: '#546b41', border: '1.5px solid #546b41', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>Lend</Link>
          )}
          {member ? (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#546b41', color: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
              {member.firstName[0]}{member.lastName[0]}
            </div>
          ) : (
            <Link to="/login" style={{ fontSize: 13, fontWeight: 600, color: '#546b41', textDecoration: 'none' }}>Log in</Link>
          )}
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#fff8ec' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
