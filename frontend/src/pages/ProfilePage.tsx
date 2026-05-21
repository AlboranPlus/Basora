import { useAuth } from '@/hooks/useAuth'
import { LevelBadge } from '@/components/LevelBadge'
import { LEVEL_INFO } from '@/types'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const { member, logout } = useAuth()
  const navigate = useNavigate()

  if (!member) return <div style={{ padding: 40, textAlign: 'center', color: '#8a8478' }}>Loading…</div>

  const levelIdx = Math.min(member.level - 1, 3)
  const currentLevelInfo = LEVEL_INFO[levelIdx]
  const nextLevelInfo = LEVEL_INFO[levelIdx + 1]
  const onTimeRate = member.totalBorrows > 0 ? Math.round((member.onTimeReturns / member.totalBorrows) * 100) : 100

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>My Profile</h1>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e8dfc8', display: 'flex', gap: 18, alignItems: 'flex-start', flex: '1 1 300px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#546b41', color: '#fff8ec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 4 }}>{member.firstName} {member.lastName}</div>
            <div style={{ fontSize: 13, color: '#8a8478', marginBottom: 10 }}>{member.email}</div>
            <LevelBadge level={member.level} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: '1 1 240px' }}>
          {[['📚', member.totalBorrows, 'Total Borrows'], ['✅', member.onTimeReturns, 'On-time Returns'], ['📊', `${onTimeRate}%`, 'Return Rate'], ['⭐', member.borrowerRating?.toFixed(1) ?? '—', 'Your Rating']].map(([icon, val, label]) => (
            <div key={String(label)} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e8dfc8', textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: 11, color: '#5a5647' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8dfc8', marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Level Progress</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {LEVEL_INFO.map((lvl) => {
            const active = member.level === lvl.level
            const done = member.level > lvl.level
            return (
              <div key={lvl.level} style={{ flex: 1, textAlign: 'center', padding: '12px 6px', borderRadius: 10, background: done ? '#e8f5ec' : active ? '#546b41' : '#f5ecd8', border: `2px solid ${done ? '#2d7d46' : active ? '#546b41' : '#dcccac'}`, transition: 'all 0.2s' }}>
                <div style={{ fontSize: 20 }}>{lvl.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: done ? '#2d7d46' : active ? '#fff8ec' : '#8a8478', marginBottom: 2 }}>{lvl.name}</div>
                <div style={{ fontSize: 10, color: active ? '#ccd9b5' : '#8a8478' }}>{lvl.minBorrows}–{lvl.maxBorrows === Infinity ? '∞' : lvl.maxBorrows}</div>
                {done && <div style={{ fontSize: 10, color: '#2d7d46', marginTop: 2 }}>✓</div>}
                {active && <div style={{ fontSize: 10, color: '#ccd9b5', marginTop: 2 }}>Current</div>}
              </div>
            )
          })}
        </div>
        {nextLevelInfo && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#5a5647' }}>
            <strong>Next level:</strong> {nextLevelInfo.minBorrows - member.totalBorrows} more borrows to reach {nextLevelInfo.name}
          </div>
        )}
      </div>

      {/* Perks */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #e8dfc8', marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Your Level Perks</h2>
        {currentLevelInfo.perks.map((perk) => (
          <div key={perk} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 13 }}>
            <span style={{ color: '#99ad7a', fontWeight: 700 }}>✓</span> {perk}
          </div>
        ))}
      </div>

      <button onClick={() => { logout(); navigate('/login') }} style={{ background: 'transparent', color: '#c0392b', border: '1.5px solid #c0392b', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Log out</button>
    </>
  )
}
