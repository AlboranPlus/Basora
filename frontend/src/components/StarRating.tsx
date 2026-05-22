import { useState } from 'react'

interface Props {
  score: number
  max?: number
  size?: number
  interactive?: boolean
  onRate?: (score: number) => void
}

export function StarRating(props: Props) {
  const [hover, setHover] = useState(0)

  const effective = props.interactive
    ? (hover || props.score)
    : props.score

  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: props.max ?? 5 }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: props.size ?? 14,
            color: effective > i ? '#e6a817' : '#dcccac',
            cursor: props.interactive ? 'pointer' : 'default',
            lineHeight: 1
          }}
          onClick={() => props.interactive && props.onRate?.(i + 1)}
          onMouseEnter={() => props.interactive && setHover(i + 1)}
          onMouseLeave={() => props.interactive && setHover(0)}
        >
          {effective > i ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}