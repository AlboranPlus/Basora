import { useState } from 'react'

interface Props {
  score?: number
  max?: number
  size?: number
  interactive?: boolean
  onRate?: (score: number) => void
}

export function StarRating({ score = 0, max = 5, size = 14, interactive = false, onRate }: Props) {
  const [hover, setHover] = useState(0)
  const effective = interactive ? hover : score

  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{ fontSize: size, color: effective > i ? '#e6a817' : '#dcccac', cursor: interactive ? 'pointer' : 'default', lineHeight: 1 }}
          onClick={() => interactive && onRate?.(i + 1)}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          {effective > i ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}
