import { useWorks } from '@/hooks/useWorks'
import { useBorrowings, useLentOut } from '@/hooks/useCirculation'
import { BookCard } from '@/components/BookCard'
import { StarRating } from '@/components/StarRating'
import { useNavigate } from 'react-router-dom'

export function DiscoverPage() {
  const navigate = useNavigate()
  const { data: works, isLoading } = useWorks({ page: 0, size: 8 })
  const { data: borrowings } = useBorrowings()
  const { data: lentOut } = useLentOut()

  const borrowedWorkIds = new Set(borrowings?.map((b) => b.workId))

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: '#8a8478' }}>Loading…</div>

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 20 }}>Recommended Books</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
        {works?.content.map((work) => (
          <BookCard
            key={work.workId}
            work={work}
            isBorrowed={borrowedWorkIds.has(work.workId)}
            onClick={() => navigate(`/works/${work.workId}`)}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {/* Lent to Friends */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: '1px solid #e8dfc8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Lent to Friends</h2>
          {lentOut?.length ? lentOut.map((l) => {
            const daysLeft = Math.ceil((new Date(l.dueDate).getTime() - Date.now()) / 86400000)
            return (
              <div key={l.borrowingId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5ecd8' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{l.lenderName ?? 'Unknown'}</div>
                  <div style={{ fontSize: 11, color: '#5a5647' }}>{l.workTitle}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: daysLeft < 0 ? '#c0392b' : daysLeft <= 3 ? '#e6a817' : '#2d7d46' }}>
                  {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                </div>
              </div>
            )
          }) : <div style={{ color: '#8a8478', fontSize: 13 }}>No active loans</div>}
        </div>

        {/* Recent Reviews placeholder */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 18, border: '1px solid #e8dfc8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent Borrower Reviews</h2>
          <div style={{ color: '#8a8478', fontSize: 13 }}>Reviews from your borrowers appear here.</div>
        </div>
      </div>
    </>
  )
}
