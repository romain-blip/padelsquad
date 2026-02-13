import { useEffect, useState } from 'react'

export default function WelcomePage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-dark)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '28px 28px',
      }} />

      <div style={{
        position: 'relative', textAlign: 'center',
        animation: 'slideUp 0.6s ease',
        maxWidth: 420,
      }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h1 style={{
          color: 'white', fontSize: 32, fontWeight: 900, letterSpacing: -1,
          margin: '0 0 12px',
        }}>
          Bienvenue dans la squad !
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6,
          margin: '0 0 32px',
        }}>
          Ton compte est confirmé. Tu vas pouvoir créer des sessions,
          trouver des joueurs et ne plus jamais galérer à remplir un terrain.
        </p>

        <a href="/" style={{
          display: 'inline-block', background: 'white', color: 'var(--color-dark)',
          textDecoration: 'none', padding: '14px 32px', borderRadius: 12,
          fontSize: 16, fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          Commencer à jouer 🏸
        </a>

        <p style={{
          color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 20,
          fontFamily: 'var(--font-mono)',
        }}>
          Redirection automatique dans {countdown}s
        </p>
      </div>
    </div>
  )
}
