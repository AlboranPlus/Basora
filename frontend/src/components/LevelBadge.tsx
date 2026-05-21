import { LEVEL_INFO } from '@/types'

const STYLES: Record<number, { background: string; color: string }> = {
  1: { background: '#f0f0f0', color: '#555' },
  2: { background: '#f2ece0', color: '#6b5c3e' },
  3: { background: '#e8f0fe', color: '#1a5fbd' },
  4: { background: '#1a1a2e', color: '#d4af37' },
}

interface Props { level: number }

export function LevelBadge({ level }: Props) {
  const info = LEVEL_INFO[Math.min(level - 1, 3)]
  const style = STYLES[level] ?? STYLES[1]
  return (
    <span style={{ ...style, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
      {info.icon} {info.name}
    </span>
  )
}
