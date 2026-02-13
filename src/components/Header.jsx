import { useAuth } from '../lib/auth'

export default function Header({ view, setView, onShowProfile }) {
  const { profile, signOut } = useAuth()

  return (
    <div style={{
      background: 'var(--color-dark)', padding: '0 20px',
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        maxWidth: 800, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        height: 58,
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => setView('sessions')}
        >
          <span style={{ fontSize: 24, animation: 'float 3s ease infinite' }}>🏸</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
            PadelSquad
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            onClick={() => setView(view === 'mySessions' ? 'sessions' : 'mySessions')}
            style={{
              background: view === 'mySessions' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', borderRadius: 8, padding: '7px 12px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {view === 'mySessions' ? '← Toutes' : 'Mes sessions'}
          </button>

          <button
            onClick={onShowProfile}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white', borderRadius: 8, padding: '7px 10px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>
              {profile?.name?.[0]?.toUpperCase() || '?'}
            </div>
            {profile?.name?.split(' ')[0] || 'Profil'}
          </button>

          <button
            onClick={signOut}
            title="Déconnexion"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '7px 8px',
              fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
