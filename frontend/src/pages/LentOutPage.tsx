import { useLentOut } from '@/hooks/useCirculation'
import { BookCover } from '@/components/BookCover'
import { LevelBadge } from '@/components/LevelBadge'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function LentOutPage() {
  const { data, isLoading } = useLentOut()

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#8a8478' }}>Loading…</div>

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>Lent Out</h1>

      {!data?.length ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#8a8478' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
          <div>No books currently lent out.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map((l) => {
            const daysLeft = Math.ceil((new Date(l.dueDate).getTime() - Date.now()) / 86400000)
            const overdue = daysLeft < 0
            return (
              <div key={l.borrowingId} style={{ background: '#fff', borderRadius: 14, padding: 16, border: `1px solid ${overdue ? '#c0392b' : '#e8dfc8'}`, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <BookCover title={l.workTitle} coverUrl={l.coverUrl} height={110} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{l.workTitle}</div>
                  <div style={{ fontSize: 12, color: '#5a5647', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Borrowed by: <strong>{l.lenderName ?? '—'}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#5a5647' }}>
                    <span>📅 Lent: {fmtDate(l.borrowedAt)}</span>
                    <span>📋 Due: {fmtDate(l.dueDate)}</span>
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 700, fontSize: 13, color: overdue ? '#c0392b' : daysLeft <= 3 ? '#e6a817' : '#2d7d46' }}>
                    {overdue ? `⚠️ ${Math.abs(daysLeft)} days overdue!` : `${daysLeft} days to return`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
