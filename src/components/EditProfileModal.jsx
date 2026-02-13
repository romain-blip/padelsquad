import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { LEVELS, DEPARTMENTS, getLevelColor } from '../lib/constants'
import { Modal, Spinner, RatingBadge } from './UI'

export default function EditProfileModal({ onClose }) {
  const { profile, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: profile?.name || '',
    city: profile?.city || '',
    level: profile?.level || 'Intermédiaire',
    dept: profile?.dept || '',
  })
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await updateProfile(form)
      showToast('Profil mis à jour ✓')
      onClose()
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: '28px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--color-dark)' }}>
            Mon Profil
          </h2>
          <button onClick={onClose} style={{
            background: '#f5f5f5', border: 'none', width: 30, height: 30, borderRadius: '50%',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1a2e, #4a4a8e)',
            margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, color: 'white', fontWeight: 700, border: '3px solid #e8e8e8',
          }}>
            {form.name ? form.name[0].toUpperCase() : '?'}
          </div>
        </div>

        {/* Fields */}
        {[
          { key: 'name', label: 'Prénom', placeholder: 'Ton prénom' },
          { key: 'city', label: 'Ville', placeholder: 'Ta ville' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
              marginBottom: 5, fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>{label}</label>
            <input
              placeholder={placeholder} value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid #e0e0e0', fontSize: 15,
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 5, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Département</label>
          <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #e0e0e0', fontSize: 14, background: 'white',
            }}>
            <option value="">Sélectionne ton département</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 8, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Niveau</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LEVELS.map(lvl => {
              const c = getLevelColor(lvl)
              const active = form.level === lvl
              return (
                <button key={lvl} onClick={() => setForm({ ...form, level: lvl })} style={{
                  padding: '6px 14px', borderRadius: 20,
                  border: active ? `2px solid ${c.dot}` : '1px solid #ddd',
                  background: active ? c.bg : 'white', color: active ? c.text : '#aaa',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {lvl}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', background: 'var(--color-dark)',
            color: 'white', border: 'none', borderRadius: 12,
            fontSize: 16, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading && <Spinner size={16} />}
          Enregistrer ✓
        </button>
      </div>
    </Modal>
  )
}
