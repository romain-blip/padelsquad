import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { LEVELS, DEPARTMENTS, getLevelColor } from '../lib/constants'
import { Spinner } from './UI'

export default function Onboarding() {
  const { updateProfile } = useAuth()
  const { showToast } = useToast()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [level, setLevel] = useState('')
  const [dept, setDept] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFinish() {
    if (!name || !level || !dept) return
    setLoading(true)
    try {
      await updateProfile({ name, level, dept, city })
      showToast('Bienvenue dans la squad ! 🏸')
    } catch (err) {
      showToast('Erreur: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    // Step 0: Name
    <div key="name" style={{ animation: 'slideUp 0.3s ease' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--color-dark)' }}>
        Comment tu t'appelles ? 👋
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
        Ton prénom sera visible par les autres joueurs
      </p>
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
        onKeyDown={(e) => e.key === 'Enter' && name && setStep(1)}
      />
      <button
        onClick={() => setStep(1)}
        disabled={!name}
        style={{
          width: '100%', marginTop: 16, padding: '14px',
          background: name ? 'var(--color-dark)' : '#e0e0e0',
          color: 'white', border: 'none', borderRadius: 12,
          fontSize: 16, fontWeight: 700, cursor: name ? 'pointer' : 'default',
        }}
      >
        Suivant →
      </button>
    </div>,

    // Step 1: Level
    <div key="level" style={{ animation: 'slideUp 0.3s ease' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: 'var(--color-dark)' }}>
        Ton niveau ? 🎯
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
        Ça aide à trouver des matchs équilibrés
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEVELS.map(lvl => {
          const c = getLevelColor(lvl)
          const active = level === lvl
          const descriptions = {
            'Débutant': 'Je débute, je veux progresser tranquille',
            'Intermédiaire': 'Je maîtrise les bases, je joue régulièrement',
            'Avancé': 'Bon niveau, je cherche de la compétition',
            'Compétition': 'Niveau tournoi, je joue pour gagner',
          }
          return (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              style={{
                padding: '14px 16px', borderRadius: 12,
                border: active ? `2px solid ${c.dot}` : '2px solid #eee',
                background: active ? c.bg : 'white',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
                transform: active ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={{ fontWeight: 700, color: active ? c.text : '#333', fontSize: 15 }}>
                {lvl}
              </div>
              <div style={{ fontSize: 12, color: active ? c.text : '#999', marginTop: 2 }}>
                {descriptions[lvl]}
              </div>
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button onClick={() => setStep(0)} style={{
          flex: 1, padding: '12px', background: '#f5f5f5', border: 'none',
          borderRadius: 10, fontSize: 14, cursor: 'pointer', color: '#888',
        }}>
          ← Retour
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!level}
          style={{
            flex: 2, padding: '12px',
            background: level ? 'var(--color-dark)' : '#e0e0e0',
            color: 'white', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 700, cursor: level ? 'pointer' : 'default',
          }}
        >
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
      <div style={{ marginBottom: 14 }}>
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
          marginBottom: 5, fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          Ville (optionnel)
        </label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="ex: Montpellier"
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 10,
            border: '2px solid #e0e0e0', fontSize: 15,
          }}
        />
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
          disabled={!dept || loading}
          style={{
            flex: 2, padding: '12px',
            background: dept ? 'var(--color-dark)' : '#e0e0e0',
            color: 'white', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 700,
            cursor: dept && !loading ? 'pointer' : 'default',
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
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Progress */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 32, justifyContent: 'center',
        }}>
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
