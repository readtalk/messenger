import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = { user_id: string; email: string; display_name: string }

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Ambil userId & email dari URL setelah redirect dari repo 2
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const userId = params.get('userId')
    const email = params.get('email')
    const auth = params.get('authentication')

    if (userId && email && auth === 'true') {
      setUser({
        user_id: userId,
        email: email,
        display_name: email.split('@')[0] // repo 2 nggak kirim display_name
      })
      localStorage.setItem('rt_user', JSON.stringify({ user_id: userId, email }))
      window.history.replaceState({}, '', '/')
      setLoading(false)
      return
    }

    // Cek localStorage kalau udah pernah login
    const saved = localStorage.getItem('rt_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('rt_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
