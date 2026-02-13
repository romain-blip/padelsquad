import { useState } from 'react'
import { AuthProvider, useAuth } from './lib/auth'
import { ToastProvider } from './lib/toast'
import { Spinner } from './components/UI'
import AuthPage from './components/AuthPage'
import Onboarding from './components/Onboarding'
import WelcomePage from './components/WelcomePage'
import ExplorePage from './components/ExplorePage'
import MyMatchesPage from './components/MyMatchesPage'
import MessagesPage from './components/MessagesPage'
import ProfilePage from './components/ProfilePage'
import BottomNav from './components/BottomNav'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [tab, setTab] = useState('explore')

  const isWelcome = window.location.pathname === '/welcome' ||
    window.location.hash.includes('type=signup') ||
    window.location.hash.includes('type=email')

  if (isWelcome && !loading) return <WelcomePage />

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-dark)', flexDirection: 'column', gap: 16,
      }}>
        <span style={{ fontSize: 48, animation: 'float 3s ease infinite' }}>🎾</span>
        <Spinner size={28} />
      </div>
    )
  }

  if (!user) return <AuthPage />
  if (!profile?.name) return <Onboarding />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: 85 }}>
      {tab === 'explore' && <ExplorePage />}
      {tab === 'sessions' && <MyMatchesPage />}
      {tab === 'messages' && <MessagesPage />}
      {tab === 'profile' && <ProfilePage />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  )
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
