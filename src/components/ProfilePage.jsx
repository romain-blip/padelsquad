import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { getRankFromSessions, getLevelLabel } from '../lib/constants'
import EditProfileModal from './EditProfileModal'
import PlayerProfileModal from './PlayerProfileModal'
import LegalModal from './LegalModal'

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const [showEdit, setShowEdit] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const [showLegal, setShowLegal] = useState(false)

  const rank = getRankFromSessions(profile?.sessions_played || 0)

  return (
    <>
      {/* Header */}
      <div style={{
        background: 'var(--color-dark)', padding: '36px 22px 32px', textAlign: 'center',
        borderRadius: '0 0 32px 32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--court-pattern)', opacity: 0.5 }} />
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(232,106,58,0.2), transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%', margin: '0 auto 14px',
            background: profile?.avatar_url
              ? `url(${profile.avatar_url}) center/cover`
              : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, color: 'white', fontWeight: 800,
            boxShadow: '0 8px 24px rgba(232,106,58,0.4)',
            border: '4px solid rgba(255,255,255,0.15)',
          }}>
            {!profile?.avatar_url && (profile?.name?.[0]?.toUpperCase() || '?')}
          </div>
          <h2 style={{ margin: 0, color: 'white', fontSize: 22, fontWeight: 800 }}>
            {profile?.name || 'Joueur'}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
            <span style={{
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)',
              padding: '5px 14px', borderRadius: 14, fontSize: 12, fontWeight: 600,
            }}>
              Niv. {profile?.level_num || '?'} · {getLevelLabel(profile?.level_num || 5)}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)',
              padding: '5px 14px', borderRadius: 14, fontSize: 12, fontWeight: 600,
            }}>
              📍 {profile?.dept || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', padding: '18px 22px 12px', gap: 10 }}>
        {[
          { value: String(profile?.sessions_played || 0), label: 'Sessions', grad: 'linear-gradient(135deg, var(--color-leaf-bg), white)' },
          { value: '⭐ —', label: 'Note', grad: 'linear-gradient(135deg, var(--color-accent-light), white)' },
          { value: rank.emoji, label: rank.label, grad: 'linear-gradient(135deg, var(--color-sand), white)' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: s.grad, borderRadius: 18, padding: '18px 8px',
            textAlign: 'center', border: '1px solid var(--color-sand)',
            animation: `fadeUp 0.4s ease ${i * 80}ms both`,
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-dark)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div style={{ padding: '4px 22px' }}>
        {[
          { icon: '✏️', label: 'Modifier mon profil', action: () => setShowEdit(true) },
          { icon: '📷', label: 'Changer ma photo', action: () => setShowEdit(true) },
          { icon: '🎯', label: `Type de jeu : ${profile?.play_style || 'Non défini'}`, action: () => setShowEdit(true) },
          { icon: '⭐', label: 'Mes avis', action: () => setShowReviews(true) },
          { icon: '📄', label: 'Mentions légales', action: () => setShowLegal(true) },
          { icon: '🚪', label: 'Se déconnecter', danger: true, action: signOut },
        ].map((item, i) => (
          <div key={i} onClick={item.action} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0',
            borderBottom: '1px solid var(--color-sand)', cursor: 'pointer',
            animation: `slideIn 0.3s ease ${i * 40}ms both`,
          }}>
            <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{item.icon}</span>
            <span style={{
              fontSize: 14, fontWeight: 600,
              color: item.danger ? 'var(--color-accent)' : 'var(--color-dark)',
            }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--color-muted)', fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>

      {showEdit && <EditProfileModal onClose={() => setShowEdit(false)} />}
      {showReviews && <PlayerProfileModal playerId={user.id} onClose={() => setShowReviews(false)} />}
      {showLegal && <LegalModal onClose={() => setShowLegal(false)} />}
    </>
  )
}
