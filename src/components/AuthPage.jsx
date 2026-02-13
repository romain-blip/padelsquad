import { useState } from 'react'
import { useAuth } from '../lib/auth'
import { Spinner } from './UI'

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState('login') // login | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        await signUp(email, password)
        setSuccess('Check tes mails pour confirmer ton compte ! 📧')
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      const msg = err.message
      if (msg.includes('Invalid login')) setError('Email ou mot de passe incorrect')
      else if (msg.includes('already registered')) setError('Cet email est déjà utilisé')
      else if (msg.includes('Password should be')) setError('Le mot de passe doit faire au moins 6 caractères')
      else setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-dark)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: 380,
        animation: 'slideUp 0.5s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 12, animation: 'float 3s ease infinite' }}>
            🎾
          </span>
          <h1 style={{
            color: 'white', fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: 0,
          }}>
            PadelSquad
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginTop: 6 }}>
            Trouve ton match. Remplis le terrain.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '28px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', background: '#f5f5f5', borderRadius: 10,
            padding: 3, marginBottom: 24,
          }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setSuccess(null) }}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? 'var(--color-dark)' : '#999',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
                marginBottom: 5, fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1px solid #e0e0e0', fontSize: 15,
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 12, fontWeight: 600, color: '#888',
                marginBottom: 5, fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: '1px solid #e0e0e0', fontSize: 15,
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fce4ec', color: '#c62828', padding: '10px 14px',
                borderRadius: 10, fontSize: 13, marginBottom: 14, fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px',
                borderRadius: 10, fontSize: 13, marginBottom: 14, fontWeight: 500,
              }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', background: 'var(--color-dark)',
                color: 'white', border: 'none', borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
              }}
            >
              {loading && <Spinner size={18} />}
              {mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '20px 0', color: '#ccc', fontSize: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: '#eee' }} />
            <span>ou</span>
            <div style={{ flex: 1, height: 1, background: '#eee' }} />
          </div>

          {/* Google */}
          <button
            onClick={() => signInWithGoogle()}
            style={{
              width: '100%', padding: '12px', background: 'white',
              border: '1px solid #e0e0e0', borderRadius: 12,
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              color: '#333', transition: 'all 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>
        </div>
      </div>
    </div>
  )
}
