import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { getMySession } from '../lib/db'
import SessionDetailModal from './SessionDetailModal'
import { Spinner } from './UI'

export default function MessagesPage() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [openChat, setOpenChat] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await getMySession(user.id)
      // Only show sessions where user is accepted or creator
      const accessible = (data || []).filter(s => {
        const isCreator = s.creator?.id === user.id || s.creator_id === user.id
        const myPlayer = (s.session_players || []).find(p => p.player?.id === user.id)
        return isCreator || myPlayer?.status === 'accepted'
      })
      setSessions(accessible)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [user.id])

  return (
    <>
      <div style={{ padding: '24px 22px 12px' }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: 'var(--color-dark)', letterSpacing: -0.5 }}>
          Messages
        </h1>
      </div>

      <div style={{ padding: '0 22px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>💬</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-muted)' }}>Aucune conversation</p>
            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Rejoins une session pour discuter avec les joueurs !</p>
          </div>
        ) : (
          sessions.map((s, i) => {
            const accepted = (s.session_players || []).filter(p => p.status === 'accepted' || !p.status)
            return (
              <div key={s.id} onClick={() => setOpenChat(s)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0',
                borderBottom: '1px solid var(--color-sand)', cursor: 'pointer',
                animation: `slideIn 0.3s ease ${i * 60}ms both`,
              }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 16,
                  background: 'var(--color-dark)', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 22 }}>🎾</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-dark)' }}>
                    {s.city} · {s.time?.slice(0, 5)}
                  </div>
                  <p style={{
                    margin: '3px 0 0', fontSize: 13, color: 'var(--color-muted)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {accepted.length} joueur{accepted.length > 1 ? 's' : ''} · {s.club}
                  </p>
                </div>
                <span style={{ color: 'var(--color-muted)', fontSize: 16 }}>›</span>
              </div>
            )
          })
        )}
      </div>

      {openChat && (
        <SessionDetailModal
          session={openChat}
          onClose={() => setOpenChat(null)}
          onRefresh={load}
          defaultTab="chat"
        />
      )}
    </>
  )
}
