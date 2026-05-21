import { useBorrowings, useReturn, useRenew } from '@/hooks/useCirculation'
import { BookCover } from '@/components/BookCover'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function BorrowingsPage() {
  const { data: borrowings, isLoading } = useBorrowings()
  const returnMutation = useReturn()
  const renewMutation = useRenew()

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#8a8478' }}>Loading…</div>

  const active = borrowings?.filter((b) => b.status === 'active') ?? []

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>My Borrowings</h1>

      {!active.length ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#8a8478' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
          <div>No active borrowings.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {active.map((b) => {
            const daysLeft = Math.ceil((new Date(b.dueDate).getTime() - Date.now()) / 86400000)
            const overdue = daysLeft < 0
            const urgent = daysLeft <= 3 && !overdue
            return (
              <div key={b.borrowingId} style={{ background: '#fff', borderRadius: 14, padding: 16, border: `1px solid ${overdue ? '#c0392b' : urgent ? '#e6a817' : '#e8dfc8'}`, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 80, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <BookCover title={b.workTitle} coverUrl={b.coverUrl} height={110} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{b.workTitle}</div>
                  {b.lenderName && <div style={{ fontSize: 12, color: '#8a8478', marginBottom: 6 }}>Lent by {b.lenderName}</div>}
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#5a5647', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span>📅 Borrowed: {fmtDate(b.borrowedAt)}</span>
                    <span>📋 Due: {fmtDate(b.dueDate)}</span>
                    <span>🔄 Renewals: {b.renewalsCount}/2</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: overdue ? '#c0392b' : urgent ? '#e6a817' : '#2d7d46' }}>
                    {overdue ? `⚠️ ${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <button onClick={() => returnMutation.mutate(b.borrowingId)} disabled={returnMutation.isPending} style={{ background: '#546b41', color: '#fff8ec', border: 'none', borderRadius: 20, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Return</button>
                  {b.renewalsCount < 2 && (
                    <button onClick={() => renewMutation.mutate({ id: b.borrowingId, days: 7 })} disabled={renewMutation.isPending} style={{ background: 'transparent', color: '#546b41', border: '1.5px solid #546b41', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Renew +7d</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
