import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { getSessions, createSession, joinSession } from '../lib/db'
import { notifyJoinRequest } from '../lib/notifications'
import { DEPARTMENTS } from '../lib/constants'
import { useGeolocation, getDistanceKm } from '../lib/geolocation'
import SessionCard from './SessionCard'
import SessionDetailModal from './SessionDetailModal'
import CreateSessionModal from './CreateSessionModal'
import PlayerProfileModal from './PlayerProfileModal'
import { Spinner } from './UI'

export default function ExplorePage() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const { position: geoPosition } = useGeolocation()

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDept, setFilterDept] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [search, setSearch] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [showPlayer, setShowPlayer] = useState(null)

  const [joinedIds, setJoinedIds] = useState(new Set())

  const loadSessions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getSessions({ dept: filterDept || undefined })
      setSessions(data || [])
      const joined = new Set()
      ;(data || []).forEach(s => {
        if ((s.session_players || []).some(p => p.player?.id === user.id)) joined.add(s.id)
      })
      setJoinedIds(joined)
    } catch (err) {
      console.error(err)
      showToast('Erreur de chargement', 'error')
    } finally {
      setLoading(false)
    }
  }, [filterDept, user?.id])

  useEffect(() => { loadSessions() }, [loadSessions])

  const sortedSessions = useMemo(() => {
    // Filter out full sessions
    let available = sessions.filter(s => {
      const accepted = (s.session_players || []).filter(p => p.status === 'accepted' || !p.status)
      return accepted.length < s.spots_total
    })

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      available = available.filter(s =>
        s.city?.toLowerCase().includes(q) ||
        s.club?.toLowerCase().includes(q) ||
        s.creator?.name?.toLowerCase().includes(q) ||
        s.dept?.toLowerCase().includes(q)
      )
    }

    if (sortBy !== 'distance' || !geoPosition) return available
    return [...available].sort((a, b) => {
      const dA = getDistanceKm(geoPosition.lat, geoPosition.lng, a.latitude, a.longitude)
      const dB = getDistanceKm(geoPosition.lat, geoPosition.lng, b.latitude, b.longitude)
      if (dA === null && dB === null) return 0
      if (dA === null) return 1
      if (dB === null) return -1
      return dA - dB
    })
  }, [sessions, sortBy, geoPosition, search])

  async function handleCreate(form) {
    try {
      await createSession({ ...form, creatorId: user.id, levelMin: form.levelMin, levelMax: form.levelMax })
      showToast('Session créée ! 🔥')
      await loadSessions()
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
      throw err
    }
  }

  async function handleJoin(sessionId) {
    try {
      await joinSession(sessionId, user.id)
      showToast('Demande envoyée ! ⏳')
      notifyJoinRequest(sessionId, profile?.name || 'Un joueur')
      await loadSessions()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{
        background: 'var(--color-dark)', padding: '20px 22px 28px',
        position: 'relative', overflow: 'hidden', borderRadius: '0 0 28px 28px',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--court-pattern)', opacity: 0.5 }} />
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 160, height: 160,
          background: 'radial-gradient(circle, rgba(232,106,58,0.2), transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: -0.5 }}>
              Padel<span style={{ color: 'var(--color-accent)' }}>Squad</span>
            </h1>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: profile?.avatar_url
                ? `url(${profile.avatar_url}) center/cover`
                : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 14,
              boxShadow: '0 4px 14px rgba(232,106,58,0.4)',
            }}>
              {!profile?.avatar_url && (profile?.name?.[0] || '?')}
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 18px', fontWeight: 500 }}>
            Il manque toujours quelqu'un. Plus maintenant. 🎾
          </p>

          {/* Search */}
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: 14,
            padding: '2px 16px', display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontSize: 14, opacity: 0.4 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ville, club, joueur..."
              style={{
                flex: 1, background: 'none', border: 'none', color: 'white',
                fontSize: 14, padding: '10px 0', outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
                width: 20, height: 20, color: 'white', fontSize: 11, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Sort + filter */}
      <div style={{ padding: '16px 22px 6px', display: 'flex', gap: 8, alignItems: 'center' }}>
        {[
          { id: 'date', label: '📅 Bientôt' },
          { id: 'distance', label: '📍 Près de moi' },
        ].map(s => (
          <button key={s.id} onClick={() => {
            if (s.id === 'distance' && !geoPosition) {
              showToast('Active la géolocalisation', 'error')
              return
            }
            setSortBy(s.id)
          }} style={{
            padding: '8px 16px', borderRadius: 24, border: 'none',
            background: sortBy === s.id ? 'var(--color-dark)' : 'white',
            color: sortBy === s.id ? 'white' : 'var(--color-muted)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: sortBy === s.id ? '0 4px 12px rgba(22,48,32,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
            transition: 'all 0.25s',
            opacity: s.id === 'distance' && !geoPosition ? 0.5 : 1,
          }}>
            {s.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{
          padding: '8px 12px', borderRadius: 20, border: `1.5px solid var(--color-sand)`,
          background: filterDept ? 'var(--color-dark)' : 'white',
          color: filterDept ? 'white' : 'var(--color-muted)',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          <option value="">Tous depts</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Count */}
      <div style={{ padding: '6px 22px 4px' }}>
        <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {loading ? 'Chargement...' : `${sortedSessions.length} session${sortedSessions.length !== 1 ? 's' : ''} disponible${sortedSessions.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: '6px 22px 20px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        ) : sortedSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🏜️</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-muted)' }}>Aucune session trouvée</p>
            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>Crée la première dans ton département !</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedSessions.map((session, i) => {
              const dist = geoPosition ? getDistanceKm(geoPosition.lat, geoPosition.lng, session.latitude, session.longitude) : null
              return (
                <SessionCard
                  key={session.id} session={session} delay={i * 80}
                  onJoin={handleJoin}
                  onPlayerClick={id => setShowPlayer(id)}
                  onOpenDetail={s => setShowDetail(s)}
                  isJoined={joinedIds.has(session.id)}
                  currentUserId={user.id}
                  distance={dist}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <div onClick={() => setShowCreate(true)} style={{
        position: 'fixed', bottom: 94, right: 22,
        background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
        color: 'white', borderRadius: 18, padding: '15px 24px',
        fontSize: 14, fontWeight: 700,
        boxShadow: '0 8px 28px rgba(232,106,58,0.4)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        animation: 'float 4s ease infinite', zIndex: 50,
      }}>
        <span style={{ fontSize: 18 }}>+</span> Créer
      </div>

      {/* Modals */}
      {showCreate && <CreateSessionModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {showDetail && (
        <SessionDetailModal
          session={showDetail}
          onClose={() => setShowDetail(null)}
          onRefresh={loadSessions}
        />
      )}
      {showPlayer && <PlayerProfileModal playerId={showPlayer} onClose={() => setShowPlayer(null)} />}
    </>
  )
}
