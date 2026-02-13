import { useState } from 'react'
import { getLevelColor } from '../lib/constants'

// ============================================================
// STARS
// ============================================================
export function Stars({ rating, size = 14, interactive = false, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => {
        const filled = interactive ? (hover || rating) >= i : rating >= i
        const half = !interactive && !filled && rating >= i - 0.5
        return (
          <span
            key={i}
            onClick={() => interactive && onRate?.(i)}
            onMouseEnter={() => interactive && setHover(i)}
            onMouseLeave={() => interactive && setHover(0)}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fontSize: size, color: filled || half ? 'var(--color-star)' : '#ddd',
              transition: 'color 0.15s, transform 0.15s',
              transform: interactive && hover === i ? 'scale(1.3)' : 'scale(1)',
              userSelect: 'none',
            }}
          >
            {filled ? '★' : half ? '★' : '☆'}
          </span>
        )
      })}
    </div>
  )
}

// ============================================================
// RATING BADGE
// ============================================================
export function RatingBadge({ rating, count, size = 'sm' }) {
  if (!rating) return null
  const isSmall = size === 'sm'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: isSmall ? 4 : 6,
      background: '#fffbf0', border: '1px solid #f5e6c8',
      borderRadius: 20, padding: isSmall ? '2px 8px' : '4px 12px',
    }}>
      <span style={{ color: 'var(--color-star)', fontSize: isSmall ? 12 : 15 }}>★</span>
      <span style={{
        fontSize: isSmall ? 12 : 15, fontWeight: 700, color: 'var(--color-dark)',
        fontFamily: 'var(--font-mono)',
      }}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: isSmall ? 10 : 12, color: '#aaa', fontFamily: 'var(--font-mono)' }}>
          ({count})
        </span>
      )}
    </div>
  )
}

// ============================================================
// LEVEL BADGE
// ============================================================
export function LevelBadge({ level, small = false }) {
  const c = getLevelColor(level)
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: small ? '3px 8px' : '4px 10px',
      borderRadius: 16, fontSize: small ? 10 : 11, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />
      {level}
    </span>
  )
}

// ============================================================
// SPINNER
// ============================================================
export function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '3px solid #eee', borderTopColor: 'var(--color-dark)',
      borderRadius: '50%', animation: 'spin 0.6s linear infinite',
    }} />
  )
}

// ============================================================
// MODAL WRAPPER
// ============================================================
export function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease',
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 440,
        animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

// ============================================================
// INPUT FIELD
// ============================================================
export function InputField({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
          marginBottom: 5, fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          border: '1px solid #e0e0e0', fontSize: 15,
          ...props.style,
        }}
      />
    </div>
  )
}
