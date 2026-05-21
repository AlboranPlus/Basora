import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useWorks } from '@/hooks/useWorks'
import { useBorrowings } from '@/hooks/useCirculation'
import { BookCard } from '@/components/BookCard'

const SUBJECTS = ['Science Fiction', 'Fantasy', 'Classic', 'Dystopia', 'Mystery', 'Adventure', 'Philosophy', 'Historical']

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [subject, setSubject] = useState<string | undefined>()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useWorks({ q: q || undefined, subject, page })
  const { data: borrowings } = useBorrowings()
  const borrowedWorkIds = new Set(borrowings?.map((b) => b.workId))

  useEffect(() => { setQ(searchParams.get('q') ?? '') }, [searchParams])

  return (
    <>
      <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 16 }}>
        Search {q && <span style={{ fontSize: 14, color: '#8a8478', fontWeight: 400 }}>for "{q}"</span>}
      </h1>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {SUBJECTS.map((s) => (
          <button key={s}
            onClick={() => setSubject(subject === s ? undefined : s)}
            style={{ padding: '4px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: subject === s ? '#546b41' : '#e8dfc8', color: subject === s ? '#fff8ec' : '#5a5647', transition: 'all 0.2s' }}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#8a8478' }}>Searching…</div>
      ) : !data?.content.length ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#8a8478' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
          <div>No books found. Try a different query.</div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 20 }}>
            {data.content.map((work) => (
              <BookCard key={work.workId} work={work} isBorrowed={borrowedWorkIds.has(work.workId)} onClick={() => navigate(`/works/${work.workId}`)} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <button disabled={page === 0} onClick={() => setPage(page - 1)} style={{ padding: '6px 14px', borderRadius: 10, border: '1px solid #dcccac', background: '#fff', cursor: 'pointer' }}>← Prev</button>
              <span style={{ padding: '6px 14px', fontSize: 13, color: '#5a5647' }}>Page {page + 1} / {data.totalPages}</span>
              <button disabled={page >= data.totalPages - 1} onClick={() => setPage(page + 1)} style={{ padding: '6px 14px', borderRadius: 10, border: '1px solid #dcccac', background: '#fff', cursor: 'pointer' }}>Next →</button>
            </div>
          )}
        </>
      )}
    </>
  )
}
