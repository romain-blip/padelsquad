import { useState, useRef } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { supabase } from '../lib/supabase'
import { DEPARTMENTS, PLAY_STYLES, getLevelNumColor, getLevelLabel } from '../lib/constants'
import { Spinner } from './UI'
import CityInput from './CityInput'

export default function Onboarding() {
  const { user, updateProfile, signOut } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [levelNum, setLevelNum] = useState(5)
  const [playStyle, setPlayStyle] = useState('')
  const [dept, setDept] = useState('')
  const [city, setCity] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const levelColor = getLevelNumColor(levelNum)

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

      setAvatarUrl(publicUrl)
    } catch (err) {
      showToast('Erreur upload: ' + err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  function handleCitySelect(c) {
    setCity(c.name)
    const matchingDept = DEPARTMENTS.find(d => d.startsWith(c.deptCode))
    if (matchingDept) setDept(matchingDept)
  }

  async function handleFinish() {
    if (!name || !dept || !avatarUrl) return
    setLoading(true)
    try {
      await updateProfile({
        name,
        level_num: levelNum,
        play_style: playStyle || null,
        dept,
        city,
        avatar_url: avatarUrl,
        // Keep old level field for backward compat
        level: getLevelLabel(levelNum),
      })
      showToast('Bienvenue dans la squad ! 🎾')
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    // Step 0: Name + Photo
    <div key="name" style={{ animation: 'slideUp 0.3s ease' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--color-dark)' }}>
        Qui es-tu ? 👋
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
        Ton prénom et ta photo seront visibles par les autres joueurs
      </p>

      {/* Avatar upload */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            width: 88, height: 88, borderRadius: '50%', margin: '0 auto 10px',
            background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'linear-gradient(135deg, #e0e0e0, #ccc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: '3px solid #e8e8e8',
            transition: 'all 0.2s',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {!avatarUrl && !uploading && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>📷</div>
              <div style={{ fontSize: 9, color: '#888', fontWeight: 600, marginTop: 2 }}>AJOUTER</div>
            </div>
          )}
          {uploading && <Spinner size={24} />}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadAvatar}
          style={{ display: 'none' }} />
        <p style={{ fontSize: 11, color: avatarUrl ? 'var(--color-success)' : '#e65100', fontWeight: 600 }}>
          {avatarUrl ? 'Photo ajoutée ✓' : 'Photo obligatoire'}
        </p>
      </div>

      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ton prénom"
        style={{
          width: '100%', padding: '14px 16px', borderRadius: 12,
          border: '2px solid #e0e0e0', fontSize: 18, fontWeight: 600,
          textAlign: 'center',
        }}
        onKeyDown={(e) => e.key === 'Enter' && name && avatarUrl && setStep(1)}
      />
      <button
        onClick={() => setStep(1)}
        disabled={!name || !avatarUrl}
        style={{
          width: '100%', marginTop: 16, padding: '14px',
          background: name && avatarUrl ? 'var(--color-dark)' : '#e0e0e0',
          color: 'white', border: 'none', borderRadius: 12,
          fontSize: 16, fontWeight: 700, cursor: name && avatarUrl ? 'pointer' : 'default',
        }}
      >
        Suivant →
      </button>
    </div>,

    // Step 1: Level 1-10 + Play Style
    <div key="level" style={{ animation: 'slideUp 0.3s ease' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--color-dark)' }}>
        Ton niveau ? 🎯
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
        De 1 (je découvre) à 10 (niveau compétition)
      </p>

      {/* Level slider */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontSize: 48, fontWeight: 900, color: levelColor.text,
          fontFamily: 'var(--font-mono)',
        }}>
          {levelNum}
        </div>
        <div style={{
          display: 'inline-block', padding: '4px 14px', borderRadius: 20,
          background: levelColor.bg, color: levelColor.text,
          fontSize: 13, fontWeight: 700, marginBottom: 16,
        }}>
          {getLevelLabel(levelNum)}
        </div>
        <div style={{ padding: '0 8px' }}>
          <input
            type="range" min="1" max="10" value={levelNum}
            onChange={(e) => setLevelNum(parseInt(e.target.value))}
            style={{
              width: '100%', height: 6, appearance: 'none', borderRadius: 3,
              background: `linear-gradient(to right, ${levelColor.dot} ${(levelNum - 1) / 9 * 100}%, #e0e0e0 ${(levelNum - 1) / 9 * 100}%)`,
              outline: 'none', cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#bbb', marginTop: 4 }}>
            <span>1 - Débutant</span>
            <span>10 - Expert</span>
          </div>
        </div>
      </div>

      {/* Play style */}
      <p style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 8 }}>
        Type de jeu <span style={{ color: '#bbb', fontWeight: 400 }}>(optionnel)</span>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {PLAY_STYLES.map(ps => {
          const active = playStyle === ps.value
          return (
            <button
              key={ps.value}
              onClick={() => setPlayStyle(active ? '' : ps.value)}
              style={{
                padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                border: active ? '2px solid var(--color-dark)' : '2px solid #eee',
                background: active ? '#f0f0ff' : 'white',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14 }}>{ps.label}</span>
              <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{ps.desc}</span>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: '12px', background: '#f5f5f5', border: 'none',
          borderRadius: 10, fontSize: 14, cursor: 'pointer', color: '#888',
        }}>
          ← Retour
        </button>
        <button onClick={() => setStep(2)} style={{
          flex: 2, padding: '12px', background: 'var(--color-dark)',
          color: 'white', border: 'none', borderRadius: 10,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          Suivant →
        </button>
      </div>
    </div>,

    // Step 2: Location
    <div key="location" style={{ animation: 'slideUp 0.3s ease' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--color-dark)' }}>
        Tu joues où ? 📍
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
        Pour te montrer les sessions près de chez toi
      </p>

      <div style={{ marginBottom: 14 }}>
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
          marginBottom: 5, fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          Ville
        </label>
        <CityInput
          value={city}
          onChange={setCity}
          onCitySelect={handleCitySelect}
          placeholder="ex: Montpellier"
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
          marginBottom: 5, fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          Département
        </label>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 10,
            border: '2px solid #e0e0e0', fontSize: 15, background: 'white',
          }}
        >
          <option value="">Choisis ton département</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => setStep(1)} style={{
          flex: 1, padding: '12px', background: '#f5f5f5', border: 'none',
          borderRadius: 10, fontSize: 14, cursor: 'pointer', color: '#888',
        }}>
          ← Retour
        </button>
        <button
          onClick={handleFinish}
          disabled={!dept || !avatarUrl || loading}
          style={{
            flex: 2, padding: '12px',
            background: dept && avatarUrl ? 'var(--color-dark)' : '#e0e0e0',
            color: 'white', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 700,
            cursor: dept && avatarUrl && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading && <Spinner size={16} />}
          C'est parti ! 🚀
        </button>
      </div>
    </div>,
  ]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 24,
    }}>
      {/* Logout button */}
      <button onClick={signOut} style={{
        position: 'absolute', top: 16, right: 16,
        background: '#f5f5f5', border: 'none', borderRadius: 8,
        padding: '8px 14px', fontSize: 12, fontWeight: 600,
        color: '#999', cursor: 'pointer',
      }}>
        Se déconnecter
      </button>

      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, justifyContent: 'center' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: i <= step ? 40 : 24, height: 5, borderRadius: 3,
              background: i <= step ? 'var(--color-dark)' : '#ddd',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
        {steps[step]}
      </div>
    </div>
  )
}
