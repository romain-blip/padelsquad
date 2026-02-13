import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { getSessions, getMySession, createSession, joinSession } from '../lib/db'
import { LEVELS, DEPARTMENTS } from '../lib/constants'
import { useGeolocation, getDistanceKm, formatDistance } from '../lib/geolocation'
import Header from './Header'
import SessionCard from './SessionCard'
import CreateSessionModal from './CreateSessionModal'
import EditProfileModal from './EditProfileModal'
import PlayerProfileModal from './PlayerProfileModal'
import { Spinner } from './UI'

export default function HomePage() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const { position: geoPosition, loading: geoLoading } = useGeolocation()

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('sessions')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date' | 'distance'

  // Modals
  const [showCreate, setShowCreate] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPlayerProfile, setShowPlayerProfile] = useState(null)

  // Track joined sessions
  const [joinedIds, setJoinedIds] = useState(new Set())

  const loadSessions = useCallback(async () => {
    setLoading(true)
    try {
      let data
      if (view === 'mySessions') {
        data = await getMySession(user.id)
      } else {
        data = await getSessions({
          dept: filterDept || undefined,
          level: filterLevel || undefined,
        })
      }
      setSessions(data || [])

      // Figure out which sessions the user is in
      const joined = new Set()
      ;(data || []).forEach(s => {
        const players = s.session_players || []
        if (players.some(p => p.player?.id === user.id)) {
          joined.add(s.id)
        }
      })
      setJoinedIds(joined)
    } catch (err) {
      console.error('Error loading sessions:', err)
      showToast('Erreur de chargement', 'error')
    } finally {
      setLoading(false)
    }
  }, [view, filterDept, filterLevel, user?.id])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  async function handleCreate(form) {
    try {
      await createSession({ ...form, creatorId: user.id })
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
      showToast('Tu es inscrit ! 🎾')
      setJoinedIds(prev => new Set([...prev, sessionId]))
      await loadSessions()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  // Sort sessions by distance if geoloc available
  const sortedSessions = useMemo(() => {
    if (sortBy !== 'distance' || !geoPosition) return sessions

    return [...sessions].sort((a, b) => {
      const distA = getDistanceKm(geoPosition.lat, geoPosition.lng, a.latitude, a.longitude)
      const distB = getDistanceKm(geoPosition.lat, geoPosition.lng, b.latitude, b.longitude)
      if (distA === null && distB === null) return 0
      if (distA === null) return 1
      if (distB === null) return -1
      return distA - distB
    })
  }, [sessions, sortBy, geoPosition])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header view={view} setView={setView} onShowProfile={() => setShowProfile(true)} />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2a2a55 40%, #1a1a2e 100%)',
        padding: '36px 20px 44px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <h1 style={{
            margin: 0, color: 'white', fontSize: 34, fontWeight: 900,
            lineHeight: 1.1, letterSpacing: -1,
          }}>
            Trouve ton match.<br />
            <span style={{ color: 'var(--color-accent)' }}>Remplis le terrain.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '10px 0 22px' }}>
            Il manque toujours quelqu'un au padel. Plus maintenant.
          </p>
          <button onClick={() => setShowCreate(true)} style={{
            background: 'white', color: 'var(--color-dark)', border: 'none',
            borderRadius: 11, padding: '13px 26px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}>
            + Créer une session
          </button>
        </div>
      </div>

      {/* Filters */}
      {view !== 'mySessions' && (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '18px 20px 0' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#aaa',
              fontFamily: 'var(--font-mono)', marginRight: 4,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Filtrer
            </span>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{
              padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12,
              background: filterDept ? 'var(--color-dark)' : 'white',
              color: filterDept ? 'white' : '#666', cursor: 'pointer', outline: 'none',
            }}>
              <option value="">Tous les départements</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {LEVELS.map(lvl => {
              const active = filterLevel === lvl
              return (
                <button key={lvl} onClick={() => setFilterLevel(active ? '' : lvl)} style={{
                  padding: '5px 12px', borderRadius: 16,
                  border: active ? '2px solid var(--color-dark)' : '1px solid #ddd',
                  background: active ? 'var(--color-dark)' : 'white',
                  color: active ? 'white' : '#aaa',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {lvl}
                </button>
              )
            })}
            {(filterLevel || filterDept) && (
              <button onClick={() => { setFilterLevel(''); setFilterDept('') }} style={{
                padding: '5px 10px', borderRadius: 6, border: 'none',
                background: '#f0f0f0', color: '#999', fontSize: 11, cursor: 'pointer',
              }}>
                ✕ Reset
              </button>
            )}

            {/* Sort toggle */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              <button onClick={() => setSortBy('date')} style={{
                padding: '5px 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600,
                background: sortBy === 'date' ? 'var(--color-dark)' : '#f0f0f0',
                color: sortBy === 'date' ? 'white' : '#999',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                📅 Date
              </button>
              <button
                onClick={() => {
                  if (geoPosition) setSortBy('distance')
                  else showToast('Active la géolocalisation pour trier par distance', 'error')
                }}
                style={{
                  padding: '5px 10px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600,
                  background: sortBy === 'distance' ? 'var(--color-dark)' : '#f0f0f0',
                  color: sortBy === 'distance' ? 'white' : '#999',
                  cursor: 'pointer', transition: 'all 0.2s',
                  opacity: geoPosition ? 1 : 0.5,
                }}
              >
                📍 Distance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Count */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '14px 20px 6px' }}>
        <p style={{ fontSize: 13, color: '#aaa', fontFamily: 'var(--font-mono)', margin: 0 }}>
          {loading ? 'Chargement...' : (
            `${sortedSessions.length} session${sortedSessions.length !== 1 ? 's' : ''} disponible${sortedSessions.length !== 1 ? 's' : ''}` +
            (view === 'mySessions' ? ' (mes sessions)' : '')
          )}
        </p>
      </div>

      {/* Sessions list */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '6px 20px 100px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Spinner size={32} />
          </div>
        ) : sortedSessions.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '50px 20px', color: '#bbb',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🏜️</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#999' }}>
              {view === 'mySessions' ? "Tu n'as rejoint aucune session" : 'Aucune session trouvée'}
            </p>
            <p style={{ fontSize: 13, color: '#bbb' }}>
              {view === 'mySessions' ? 'Rejoins ou crée ta première session !' : 'Crée la première dans ton département !'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedSessions.map((session, i) => {
              const distance = geoPosition
                ? getDistanceKm(geoPosition.lat, geoPosition.lng, session.latitude, session.longitude)
                : null
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  onJoin={handleJoin}
                  onPlayerClick={(id) => setShowPlayerProfile(id)}
                  delay={i * 50}
                  isJoined={joinedIds.has(session.id)}
                  currentUserId={user.id}
                  distance={distance}
                />
              )
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateSessionModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
      {showProfile && (
        <EditProfileModal onClose={() => { setShowProfile(false); loadSessions() }} />
      )}
      {showPlayerProfile && (
        <PlayerProfileModal
          playerId={showPlayerProfile}
          onClose={() => setShowPlayerProfile(null)}
        />
      )}
    </div>
  )
}
