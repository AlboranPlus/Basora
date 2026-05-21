import { useState } from 'react'

const FALLBACK_COLORS = ['#dcccac', '#546b41', '#99ad7a', '#e8dfc8', '#b2c299', '#657d4e', '#8b7355', '#6b8e6b']

interface Props {
  title: string
  coverUrl?: string | null
  isbn?: string | null
  height?: number
  colorSeed?: string
}

export function BookCover({ title, coverUrl, isbn, height = 180, colorSeed }: Props) {
  const [imgFailed, setImgFailed] = useState(false)

  const src = coverUrl ?? (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : null)
  const bgColor = FALLBACK_COLORS[(colorSeed ?? title).charCodeAt(0) % FALLBACK_COLORS.length]

  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={title}
        style={{ width: '100%', height, objectFit: 'cover', display: 'block' }}
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div style={{ height, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <span style={{ fontSize: 36, opacity: 0.35 }}>📖</span>
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', padding: '0 10px' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
      </div>
    </div>
  )
}
