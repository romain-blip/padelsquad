import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext({})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#ef5350' : 'var(--color-dark)',
          color: 'white', padding: '11px 22px',
          borderRadius: 11, fontSize: 14, fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'toastIn 0.3s ease', zIndex: 9999,
          maxWidth: '90vw', textAlign: 'center',
        }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
