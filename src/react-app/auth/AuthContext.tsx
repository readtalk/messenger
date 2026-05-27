import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getProfile } from './api'

type User = { user_id: string; email: string; display_name: string }

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('rt_token'))
  const [loading, setLoading] = useState(true)

  // Ambil token dari URL setelah redirect dari auth.readtalk.workers.dev
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    if (tokenFromUrl) {
      login(tokenFromUrl)
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Kalau ada token, fetch profile user
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    getProfile(token)
     .then(setUser)
     .catch(() => logout())
     .finally(() => setLoading(false))
  }, [token])

  const login = (newToken: string) => {
    localStorage.setItem('rt_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('rt_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
