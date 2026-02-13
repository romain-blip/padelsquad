import { useState } from 'react'
import { formatDate } from '../lib/constants'

export default function SessionCard({ session, onJoin, onPlayerClick, onOpenDetail, delay = 0, isJoined, currentUserId, distance }) {
  const [hovered, setHovered] = useState(false)

  const players = session.session_players || []
  const acceptedPlayers = players.filter(p => p.status === 'accepted' || !p.status)
  const spotsTaken = acceptedPlayers.length
  const spotsLeft = session.spots_total - spotsTaken
  const urgent = spotsLeft === 1
  const full = spotsLeft <= 0
  const creator = session.creator
  const pendingCount = players.filter(p => p.status === 'pending').length
  const isCreator = creator?.id === currentUserId || session.creator_id === currentUserId

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: 20, padding: '20px',
        boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.07)' : '0 2px 12px rgba(0,0,0,0.03)',
        border: urgent ? '2px solid var(--color-accent)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        animation: `fadeUp 0.4s ease ${delay}ms both`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle green corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 80, height: 80,
        background: 'radial-gradient(circle at 100% 0%, var(--color-leaf-bg), transparent 70%)',
        borderRadius: '0 20px 0 0',
      }} />

      {/* Urgent tag */}
      {urgent && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'var(--color-accent)', color: 'white',
          fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
          animation: 'pulse 2s ease infinite', letterSpacing: 0.3,
        }}>
          🔥 Dernière place
        </div>
      )}

      {/* Pending requests badge for creator */}
      {isCreator && pendingCount > 0 && (
        <div
          onClick={(e) => { e.stopPropagation(); onOpenDetail?.(session) }}
          style={{
            position: 'absolute', top: 14, right: urgent ? 130 : 14,
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
            color: 'white',
            fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
            cursor: 'pointer', animation: 'pulse 2s ease infinite',
          }}
        >
          {pendingCount} demande{pendingCount > 1 ? 's' : ''} 🔔
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {/* City + club */}
        <h3 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 800, color: 'var(--color-dark)' }}>
          {session.city}
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--color-muted)', fontWeight: 500 }}>
          {session.club} {creator ? `· par ${creator.name}` : ''}
        </p>

        {/* Info pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{
            background: 'var(--color-sand)', padding: '5px 11px', borderRadius: 10,
            fontSize: 12, fontWeight: 700, color: '#555',
          }}>
            {formatDate(session.date)} · {session.time?.slice(0, 5)}
          </span>
          {session.duration && (
            <span style={{
              background: 'var(--color-sand)', padding: '5px 11px', borderRadius: 10,
              fontSize: 12, fontWeight: 700, color: '#555',
            }}>
              {session.duration >= 60 ? `${Math.floor(session.duration / 60)}h${session.duration % 60 || ''}` : `${session.duration}min`}
            </span>
          )}
          {(session.level_min || session.level_max) && (
            <span style={{
              background: 'var(--color-accent-light)', padding: '5px 11px', borderRadius: 10,
              fontSize: 12, fontWeight: 700, color: 'var(--color-accent)',
            }}>
              Niv. {session.level_min || 1}–{session.level_max || 10}
            </span>
          )}
          {distance !== null && distance !== undefined && (
            <span style={{
              background: 'var(--color-leaf-bg)', padding: '5px 11px', borderRadius: 10,
              fontSize: 12, fontWeight: 700, color: 'var(--color-leaf)',
            }}>
              {distance < 1 ? '< 1' : distance} km
            </span>
          )}
        </div>

        {/* Bottom: players + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: session.spots_total }).map((_, i) => {
              const player = acceptedPlayers[i]?.player
              return (
                <div
                  key={i}
                  onClick={() => player && onPlayerClick?.(player.id)}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: player
                      ? (player.avatar_url ? `url(${player.avatar_url}) center/cover` : `hsl(${(player.name?.charCodeAt(0) || 0) * 7 % 360}, 42%, 52%)`)
                      : 'transparent',
                    border: player ? '2.5px solid white' : `2px dashed var(--color-sand)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginLeft: i > 0 ? -9 : 0, zIndex: 10 - i,
                    cursor: player ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                  }}
                  title={player?.name}
                >
                  {player && !player.avatar_url ? (
                    <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{player.name?.[0]}</span>
                  ) : !player ? (
                    <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>?</span>
                  ) : null}
                </div>
              )
            })}
            <span style={{ fontSize: 12, color: 'var(--color-muted)', marginLeft: 8, fontWeight: 500 }}>
              {spotsLeft > 1 ? `${spotsLeft} places` : spotsLeft === 1 ? '' : 'Complet'}
            </span>
          </div>

          {/* Action button */}
          {(() => {
            const myRequest = players.find(p => p.player?.id === currentUserId)
            if (myRequest?.status === 'accepted' || isJoined || isCreator) {
              return (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{
                    background: 'var(--color-success-bg)', color: 'var(--color-success)', borderRadius: 12,
                    padding: '9px 14px', fontSize: 12, fontWeight: 700,
                  }}>Inscrit ✓</div>
                  <button onClick={(e) => { e.stopPropagation(); onOpenDetail?.(session) }} style={{
                    background: 'var(--color-dark)', color: 'white', border: 'none',
                    borderRadius: 12, padding: '9px 14px', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer',
                  }}>{isCreator ? '⚙️ Gérer' : '💬 Chat'}</button>
                </div>
              )
            }
            if (myRequest?.status === 'pending') {
              return (
                <div style={{
                  background: 'var(--color-accent-light)', color: 'var(--color-accent)',
                  borderRadius: 12, padding: '9px 14px', fontSize: 12, fontWeight: 700,
                }}>En attente ⏳</div>
              )
            }
            if (myRequest?.status === 'rejected') {
              return (
                <div style={{
                  background: '#FEE', color: '#c62828', borderRadius: 12,
                  padding: '9px 14px', fontSize: 12, fontWeight: 700,
                }}>Refusé</div>
              )
            }
            if (!full) {
              return (
                <button onClick={(e) => { e.stopPropagation(); onJoin?.(session.id) }} style={{
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                  color: 'white', border: 'none', borderRadius: 12,
                  padding: '10px 18px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 14px rgba(232,106,58,0.3)',
                  transition: 'transform 0.15s',
                }}>Rejoindre</button>
              )
            }
            return null
          })()}
        </div>
      </div>
    </div>
  )
}
