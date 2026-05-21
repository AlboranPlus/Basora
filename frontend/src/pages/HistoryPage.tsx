import { useHistory } from '@/hooks/useCirculation'
import { BookCover } from '@/components/BookCover'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function HistoryPage() {
  const { data, isLoading } = useHistory()

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#8a8478' }}>Loading…</div>

  const onTime = data?.filter((b) => !b.overdue).length ?? 0

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>Borrowing History</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {[['📚', data?.length ?? 0, 'Total Borrows'], ['✅', onTime, 'On Time'], ['⚠️', (data?.length ?? 0) - onTime, 'Late Returns']].map(([icon, n, label]) => (
          <div key={String(label)} style={{ background: '#fff', borderRadius: 12, padding: '14px 22px', border: '1px solid #e8dfc8', textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{n}</div>
            <div style={{ fontSize: 12, color: '#5a5647' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data?.map((b) => (
          <div key={b.borrowingId} style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', border: '1px solid #e8dfc8', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
              <BookCover title={b.workTitle} coverUrl={b.coverUrl} height={70} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{b.workTitle}</div>
              <div style={{ fontSize: 12, color: '#5a5647' }}>
                {fmtDate(b.borrowedAt)} → {b.returnedAt ? fmtDate(b.returnedAt) : '—'}
              </div>
            </div>
            <div style={{ fontSize: 20 }}>{b.overdue ? '⚠️' : '✅'}</div>
          </div>
        ))}
      </div>
    </>
  )
}
