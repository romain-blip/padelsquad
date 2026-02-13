import { useState, useRef } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { supabase } from '../lib/supabase'
import { DEPARTMENTS, PLAY_STYLES, getLevelNumColor, getLevelLabel } from '../lib/constants'
import { Modal, Spinner } from './UI'
import CityInput from './CityInput'

export default function EditProfileModal({ onClose }) {
  const { user, profile, updateProfile } = useAuth()
  const { showToast } = useToast()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: profile?.name || '',
    city: profile?.city || '',
    level_num: profile?.level_num || 5,
    play_style: profile?.play_style || '',
    dept: profile?.dept || '',
    avatar_url: profile?.avatar_url || '',
  })
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const levelColor = getLevelNumColor(form.level_num)

  async function handleUploadAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast('Photo trop lourde (max 2 Mo)', 'error')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path)
      // Add cache buster to force refresh
      setForm(prev => ({ ...prev, avatar_url: publicUrl + '?t=' + Date.now() }))
      showToast('Photo mise à jour ✓')
    } catch (err) {
      showToast('Erreur upload: ' + err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleCitySelect(city) {
    const matchingDept = DEPARTMENTS.find(d => d.startsWith(city.deptCode))
    setForm(prev => ({
      ...prev,
      city: city.name,
      dept: matchingDept || prev.dept,
    }))
  }

  async function handleSave() {
    setLoading(true)
    try {
      await updateProfile({
        ...form,
        level: getLevelLabel(form.level_num),
      })
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

        {/* Avatar with change */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 8px',
              background: form.avatar_url
                ? `url(${form.avatar_url}) center/cover`
                : 'linear-gradient(135deg, var(--color-dark), #4a4a8e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '3px solid #e8e8e8',
              position: 'relative', overflow: 'hidden',
              transition: 'opacity 0.2s',
            }}
          >
            {!form.avatar_url && !uploading && (
              <span style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>
                {form.name?.[0]?.toUpperCase() || '?'}
              </span>
            )}
            {uploading && <Spinner size={24} />}
            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.4)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
            >
              <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>CHANGER</span>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadAvatar}
            style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} style={{
            background: 'none', border: 'none', color: '#1565c0',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            📷 Changer la photo
          </button>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 5, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Prénom</label>
          <input
            placeholder="Ton prénom" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #e0e0e0', fontSize: 15,
            }}
          />
        </div>

        {/* City with autocomplete */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 5, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Ville</label>
          <CityInput
            value={form.city}
            onChange={(val) => setForm({ ...form, city: val })}
            onCitySelect={handleCitySelect}
            placeholder="Ta ville"
          />
        </div>

        {/* Department */}
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

        {/* Level 1-10 */}
        <div style={{ marginBottom: 14 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 8, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Niveau</label>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px', background: '#fafaf8', borderRadius: 10,
          }}>
            <span style={{
              fontSize: 28, fontWeight: 900, color: levelColor.text,
              fontFamily: 'var(--font-mono)', minWidth: 32, textAlign: 'center',
            }}>
              {form.level_num}
            </span>
            <div style={{ flex: 1 }}>
              <input
                type="range" min="1" max="10" value={form.level_num}
                onChange={(e) => setForm({ ...form, level_num: parseInt(e.target.value) })}
                style={{
                  width: '100%', height: 6, appearance: 'none', borderRadius: 3,
                  background: `linear-gradient(to right, ${levelColor.dot} ${(form.level_num - 1) / 9 * 100}%, #e0e0e0 ${(form.level_num - 1) / 9 * 100}%)`,
                  outline: 'none', cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 11, color: levelColor.text, fontWeight: 600 }}>
                {getLevelLabel(form.level_num)}
              </span>
            </div>
          </div>
        </div>

        {/* Play style */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
            marginBottom: 8, fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>Type de jeu</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PLAY_STYLES.map(ps => {
              const active = form.play_style === ps.value
              return (
                <button key={ps.value}
                  onClick={() => setForm({ ...form, play_style: active ? '' : ps.value })}
                  style={{
                    padding: '7px 14px', borderRadius: 20,
                    border: active ? '2px solid var(--color-dark)' : '1px solid #ddd',
                    background: active ? '#f0f0ff' : 'white',
                    color: active ? 'var(--color-dark)' : '#aaa',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  {ps.label}
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
