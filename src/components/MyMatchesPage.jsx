import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { getMySession } from '../lib/db'
import { formatDate } from '../lib/constants'
import SessionDetailModal from './SessionDetailModal'
import { Spinner } from './UI'

export default function MyMatchesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await getMySession(user.id)
      setSessions(data || [])
    } catch (err) {
      showToast('Erreur', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user.id])

  return (
    <>
      <div style={{ padding: '24px 22px 12px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--color-dark)', letterSpacing: -0.5 }}>
          Mes matchs 🎾
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 13, margin: '6px 0 0', fontWeight: 500 }}>
          Tes prochaines sessions
        </p>
      </div>

      <div style={{ padding: '4px 22px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🎾</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-muted)' }}>Aucune session</p>
            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Rejoins ou crée ta première session !</p>
          </div>
        ) : sessions.map((s, i) => {
          const players = s.session_players || []
          const accepted = players.filter(p => p.status === 'accepted' || !p.status)
          const pending = players.filter(p => p.status === 'pending')
          const isCreator = s.creator?.id === user.id || s.creator_id === user.id
          const myStatus = players.find(p => p.player?.id === user.id)?.status

          return (
            <div key={s.id} onClick={() => setShowDetail(s)} style={{
              background: 'white', borderRadius: 18, padding: '18px 20px',
              marginBottom: 10, cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              animation: `fadeUp 0.4s ease ${i * 80}ms both`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--color-dark)' }}>{s.city}</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-muted)' }}>{s.club}</p>
                </div>
                <span style={{
                  padding: '5px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                  background: (isCreator || myStatus === 'accepted') ? 'var(--color-success-bg)' : 'var(--color-accent-light)',
                  color: (isCreator || myStatus === 'accepted') ? 'var(--color-success)' : 'var(--color-accent)',
                }}>
                  {isCreator ? 'Organisateur 👑' : myStatus === 'accepted' ? 'Confirmé ✓' : 'En attente ⏳'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--color-sand)', padding: '5px 11px', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#555' }}>
                  {formatDate(s.date)} · {s.time?.slice(0, 5)}
                </span>
                <span style={{ background: 'var(--color-sand)', padding: '5px 11px', borderRadius: 10, fontSize: 12, fontWeight: 600, color: '#555' }}>
                  {accepted.length}/{s.spots_total} joueurs
                </span>
                {isCreator && pending.length > 0 && (
                  <span style={{
                    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                    color: 'white', padding: '5px 11px', borderRadius: 10,
                    fontSize: 12, fontWeight: 700, animation: 'pulse 2s ease infinite',
                  }}>
                    {pending.length} demande{pending.length > 1 ? 's' : ''} 🔔
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showDetail && (
        <SessionDetailModal session={showDetail} onClose={() => setShowDetail(null)} onRefresh={load} />
      )}
    </>
  )
}
