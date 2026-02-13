import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './lib/toast'
import { Spinner } from './components/UI'
import AuthPage from './components/AuthPage'
import Onboarding from './components/Onboarding'
import HomePage from './components/HomePage'
import WelcomePage from './components/WelcomePage'

function AppContent() {
  const { user, profile, loading } = useAuth()

  // Check if we're on the welcome page (after email confirmation)
  const isWelcome = window.location.pathname === '/welcome' ||
    window.location.hash.includes('type=signup') ||
    window.location.hash.includes('type=email')

  if (isWelcome && !loading) {
    return <WelcomePage />
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-dark)', flexDirection: 'column', gap: 16,
      }}>
        <span style={{ fontSize: 48, animation: 'float 3s ease infinite' }}>🏸</span>
        <Spinner size={28} />
      </div>
    )
  }

  // Not logged in → Auth page
  if (!user) return <AuthPage />

  // Logged in but no profile → Onboarding
  if (!profile?.name) return <Onboarding />

  // Logged in with profile → Home
  return <HomePage />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}
