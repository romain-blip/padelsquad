const TABS = [
  { id: 'explore', label: 'Explorer', emoji: '🔍' },
  { id: 'sessions', label: 'Mes matchs', emoji: '🎾' },
  { id: 'messages', label: 'Messages', emoji: '💬' },
  { id: 'profile', label: 'Profil', emoji: '👤' },
]

export default function BottomNav({ tab, setTab }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 600,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--color-sand)',
      display: 'flex', padding: '6px 8px 14px', zIndex: 100,
      borderRadius: '20px 20px 0 0',
    }}>
      {TABS.map(t => {
        const active = tab === t.id
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 0', position: 'relative',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: active ? 'var(--color-dark)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
            }}>
              <span style={{
                fontSize: 17,
                filter: active ? 'brightness(10)' : 'grayscale(0.6) opacity(0.5)',
                transition: 'all 0.2s',
              }}>{t.emoji}</span>
            </div>
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              color: active ? 'var(--color-dark)' : 'var(--color-muted)',
              transition: 'all 0.2s',
            }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
