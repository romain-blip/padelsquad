import { useState } from 'react'
import { formatDate } from '../lib/constants'
import { LevelBadge, RatingBadge } from './UI'

export default function SessionCard({ session, onJoin, onPlayerClick, delay = 0, isJoined, currentUserId, distance }) {
  const [hovered, setHovered] = useState(false)

  const players = session.session_players || []
  const acceptedPlayers = players.filter(p => p.status === 'accepted' || !p.status)
  const spotsTaken = acceptedPlayers.length
  const spotsLeft = session.spots_total - spotsTaken
  const urgent = spotsLeft === 1
  const full = spotsLeft <= 0
  const creator = session.creator
  const pendingCount = players.filter(p => p.status === 'pending').length

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: 16, padding: '22px 24px',
        boxShadow: hovered ? '0 8px 32px rgba(26,26,46,0.12)' : '0 2px 12px rgba(0,0,0,0.04)',
        border: urgent ? '2px solid var(--color-danger)' : '1px solid #eee',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        animation: `slideUp 0.5s ease ${delay}ms both`,
        position: 'relative', overflow: 'hidden',
      }}
    >
      {urgent && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)', color: 'white',
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
          fontFamily: 'var(--font-mono)', animation: 'pulse 2s ease infinite',
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          Dernière place
        </div>
      )}

      {/* City + Level */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--color-dark)' }}>
            {session.city}
          </h3>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#aaa', fontFamily: 'var(--font-mono)' }}>
            {session.club}
          </p>
        </div>
        <LevelBadge level={session.level} />
      </div>

      {/* Creator */}
      {creator && (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
            padding: '8px 10px', background: '#fafaf8', borderRadius: 10,
            cursor: 'pointer',
          }}
          onClick={() => onPlayerClick?.(creator.id)}
        >
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e, #3d3d6e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: 'white', fontWeight: 700, flexShrink: 0,
          }}>
            {creator.name?.[0] || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-dark)' }}>
              {creator.name}
            </span>
            <span style={{ fontSize: 12, color: '#aaa', marginLeft: 6 }}>organisateur</span>
          </div>
        </div>
      )}

      {/* Date + Time + Duration + Dept */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 16, fontSize: 13, color: '#666', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span style={{ fontWeight: 600 }}>{formatDate(session.date)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ fontWeight: 600 }}>{session.time?.slice(0, 5)}</span>
          {session.duration && (
            <span style={{
              background: '#f0f0f0', padding: '1px 6px', borderRadius: 6,
              fontSize: 11, fontWeight: 600, color: '#888',
            }}>
              {session.duration >= 60 ? `${Math.floor(session.duration / 60)}h${session.duration % 60 ? session.duration % 60 : ''}` : `${session.duration}min`}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span style={{ fontWeight: 500, color: '#888' }}>{session.dept}</span>
        </div>
        {distance !== null && distance !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#eef', borderRadius: 12, padding: '2px 8px',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1565c0' }}>
              {distance < 1 ? '< 1' : distance} km
            </span>
          </div>
        )}
        {(session.level_min || session.level_max) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: '#fff3e0', borderRadius: 12, padding: '2px 8px',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#e65100' }}>
              Niv. {session.level_min || 1}-{session.level_max || 10}
            </span>
          </div>
        )}
      </div>

      {/* Spots + Join */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Player circles — only show accepted players */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: session.spots_total }).map((_, i) => {
            const acceptedPlayers = players.filter(p => p.status === 'accepted' || !p.status)
            const player = acceptedPlayers[i]?.player
            return (
              <div
                key={i}
                onClick={() => player && onPlayerClick?.(player.id)}
                style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: player ? 'var(--color-dark)' : 'transparent',
                  border: player ? '2px solid var(--color-dark)' : '2px dashed #ccc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  cursor: player ? 'pointer' : 'default',
                }}
                title={player?.name}
              >
                {player ? (
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>
                    {player.name?.[0]}
                  </span>
                ) : (
                  <span style={{ color: '#ccc', fontSize: 16, fontWeight: 300 }}>?</span>
                )}
              </div>
            )
          })}
          <span style={{ fontSize: 12, color: '#999', marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
            {spotsLeft > 0 ? `${spotsLeft} place${spotsLeft > 1 ? 's' : ''}` : 'Complet'}
          </span>
        </div>

        {/* Action button */}
        {(() => {
          const myRequest = players.find(p => p.player?.id === currentUserId)
          if (myRequest?.status === 'accepted' || isJoined) {
            return (
              <div style={{
                background: '#e8f5e9', color: '#2e7d32', borderRadius: 10,
                padding: '10px 18px', fontSize: 13, fontWeight: 700,
              }}>
                Inscrit ✓
              </div>
            )
          }
          if (myRequest?.status === 'pending') {
            return (
              <div style={{
                background: '#fff3e0', color: '#e65100', borderRadius: 10,
                padding: '10px 18px', fontSize: 13, fontWeight: 700,
              }}>
                En attente ⏳
              </div>
            )
          }
          if (myRequest?.status === 'rejected') {
            return (
              <div style={{
                background: '#fce4ec', color: '#c62828', borderRadius: 10,
                padding: '10px 14px', fontSize: 12, fontWeight: 700,
              }}>
                Refusé
              </div>
            )
          }
          if (!full) {
            return (
              <button
                onClick={() => onJoin?.(session.id)}
                style={{
                  background: hovered ? 'var(--color-dark)' : '#2d2d4e',
                  color: 'white', border: 'none', borderRadius: 10,
                  padding: '10px 16px', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                Demander à rejoindre 🏸
              </button>
            )
          }
          return null
        })()}
      </div>
    </div>
  )
}
