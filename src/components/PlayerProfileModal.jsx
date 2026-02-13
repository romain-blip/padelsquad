import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { getPlayerReviews, getPlayerRating, submitReview, getProfile } from '../lib/db'
import { formatDate } from '../lib/constants'
import { Modal, Stars, RatingBadge, LevelBadge, Spinner } from './UI'

export default function PlayerProfileModal({ playerId, onClose }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [player, setPlayer] = useState(null)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState({ rating: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewStars, setReviewStars] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isOwnProfile = user?.id === playerId

  useEffect(() => {
    loadData()
  }, [playerId])

  async function loadData() {
    setLoading(true)
    try {
      const [profileData, reviewsData, ratingData] = await Promise.all([
        getProfile(playerId),
        getPlayerReviews(playerId),
        getPlayerRating(playerId),
      ])
      setPlayer(profileData)
      setReviews(reviewsData || [])
      setRating(ratingData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmitReview() {
    if (!reviewStars) return
    setSubmitting(true)
    try {
      await submitReview({
        reviewerId: user.id,
        reviewedId: playerId,
        stars: reviewStars,
        text: reviewText,
      })
      showToast('Avis envoyé ! ⭐')
      setShowReviewForm(false)
      setReviewStars(0)
      setReviewText('')
      await loadData() // Refresh
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Modal onClose={onClose}>
        <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
          <Spinner size={32} />
        </div>
      </Modal>
    )
  }

  if (!player) {
    return (
      <Modal onClose={onClose}>
        <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
          Joueur introuvable
        </div>
      </Modal>
    )
  }

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-dark) 0%, #2d2d5e 100%)',
        padding: '28px 24px 20px', textAlign: 'center', position: 'relative',
        borderRadius: '20px 20px 0 0',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)',
          margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, color: 'white', fontWeight: 700,
        }}>
          {player.name?.[0] || '?'}
        </div>
        <h2 style={{ margin: 0, color: 'white', fontSize: 20, fontWeight: 700 }}>
          {player.name}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          {player.level && <LevelBadge level={player.level} small />}
          {player.dept && (
            <span style={{
              background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)',
              padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
            }}>
              📍 {player.dept}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(255,255,255,0.15)', border: 'none', width: 28, height: 28,
          borderRadius: '50%', cursor: 'pointer', color: 'white', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>
      </div>

      {/* Rating summary */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        padding: '16px 24px', borderBottom: '1px solid #f0f0f0',
      }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-dark)', fontFamily: 'var(--font-mono)' }}>
          {rating.rating > 0 ? rating.rating.toFixed(1) : '—'}
        </span>
        <div>
          <Stars rating={rating.rating} size={18} />
          <span style={{ fontSize: 12, color: '#999', fontFamily: 'var(--font-mono)' }}>
            {rating.count} avis
          </span>
        </div>
      </div>

      {/* Reviews list */}
      <div style={{ padding: '16px 24px', maxHeight: 250, overflowY: 'auto' }}>
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={r.id || i} style={{
              padding: '12px 0',
              borderBottom: i < reviews.length - 1 ? '1px solid #f5f5f5' : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#888',
                  }}>
                    {r.reviewer?.name?.[0] || '?'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-dark)' }}>
                    {r.reviewer?.name || 'Anonyme'}
                  </span>
                </div>
                <Stars rating={r.stars} size={11} />
              </div>
              {r.text && (
                <p style={{ margin: '4px 0 0 32px', fontSize: 13, color: '#666', lineHeight: 1.4 }}>
                  {r.text}
                </p>
              )}
              <span style={{
                display: 'block', marginLeft: 32, marginTop: 4,
                fontSize: 11, color: '#bbb', fontFamily: 'var(--font-mono)',
              }}>
                {r.created_at ? formatDate(r.created_at.split('T')[0]) : ''}
              </span>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: 14, padding: '12px 0' }}>
            Pas encore d'avis
          </p>
        )}
      </div>

      {/* Leave review (not for own profile) */}
      {!isOwnProfile && (
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid #f0f0f0' }}>
          {!showReviewForm ? (
            <button onClick={() => setShowReviewForm(true)} style={{
              width: '100%', padding: '12px', background: '#f8f7f4',
              border: '1px solid #e8e8e8', borderRadius: 10,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', color: 'var(--color-dark)',
            }}>
              Laisser un avis ✍️
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Ta note :</span>
                <Stars rating={reviewStars} size={22} interactive onRate={setReviewStars} />
              </div>
              <textarea
                placeholder="Un mot sur ce joueur..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: '1px solid #ddd', fontSize: 14, resize: 'none', height: 70,
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setShowReviewForm(false)} style={{
                  flex: 1, padding: '10px', background: '#f5f5f5', border: 'none',
                  borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#888',
                }}>
                  Annuler
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewStars || submitting}
                  style={{
                    flex: 2, padding: '10px',
                    background: reviewStars > 0 ? 'var(--color-dark)' : '#ddd',
                    color: 'white', border: 'none', borderRadius: 8, fontSize: 13,
                    fontWeight: 700, cursor: reviewStars > 0 ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  {submitting && <Spinner size={14} />}
                  Envoyer ★
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
