import { StarRating } from './StarRating'
import { BookCover } from './BookCover'
import type { WorkSummary } from '@/types'

interface Props {
  work: WorkSummary
  isBorrowed?: boolean
  onClick?: () => void
}

export function BookCard({ work, isBorrowed, onClick }: Props) {
  const available = work.availableCopies > 0

  const statusStyle = isBorrowed
    ? { background: '#fdecea', color: '#c0392b', border: '1px solid #c0392b' }
    : available
    ? { background: '#546b41', color: '#fff8ec' }
    : { background: '#f2ece0', color: '#8a8478' }

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #e8dfc8',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(84,107,65,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <BookCover title={work.title} coverUrl={work.coverUrl} colorSeed={work.workId} />
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, lineHeight: 1.3 }}>{work.title}</div>
        <div style={{ fontSize: 12, color: '#5a5647', marginBottom: 8 }}>{work.authors.join(', ')}</div>
        <StarRating score={work.avgRating ?? 0} />
        <div style={{ marginTop: 8, padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textAlign: 'center', ...statusStyle }}>
          {isBorrowed ? 'Borrowed' : available ? `Available (${work.availableCopies})` : 'Unavailable'}
        </div>
      </div>
    </div>
  )
}
