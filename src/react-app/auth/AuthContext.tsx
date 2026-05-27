import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  display_name: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("readtalk_token")
    if (!token) {
      setLoading(false)
      return
    }
    fetch("https://auth.readtalk.workers.dev/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
     .then(r => r.ok? r.json() : null)
     .then(u => {
        setUser(u)
        setLoading(false)
      })
     .catch(() => setLoading(false))
  }, [])

  const login = (token: string) => {
    localStorage.setItem("readtalk_token", token)
    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem("readtalk_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
