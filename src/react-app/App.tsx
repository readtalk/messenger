import { createContext, useContext, useEffect, useState } from "react"
// Assets
import MenuDotsVertical from "./assets/menu-dots-vertical.svg"
import SearchIcon from "./assets/search.svg"
import EnvelopeIcon from "./assets/envelope.svg"
import UserAddIcon from "./assets/plus-small.svg"
import BubbleDiscussionIcon from "./assets/bubble-discussion.svg"
import CameraIcon from "./assets/at.svg"
import UsersIcon from "./assets/users.svg"
import PhoneCallIcon from "./assets/phone-call.svg"
import "./App.css"

// Types
type User = { id: string; email: string; display_name: string }
type AuthContextType = { user: User | null; loading: boolean; login: () => void; logout: () => void }

// AuthContext
const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: { children: React.ReactNode }) {
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
     .then(u => { setUser(u); setLoading(false) })
     .catch(() => setLoading(false))
  }, [])

  const login = () => {
    const authUrl = `https://auth.readtalk.workers.dev/authorize?client_id=messenger&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=code`
    window.location.href = authUrl
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

const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}

// Components
function SettingsPage({ onBack }: { onBack: () => void }) {
  const { user, logout } = useAuth()
  const items = [
    { title: "Account", desc: "Privacy, security, change number" },
    { title: "Chats", desc: "Theme, wallpapers, chat settings" },
    { title: "Notifications", desc: "Message, group & call tones" },
    { title: "Storage and data", desc: "Network usage, auto-download" },
  ]
  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack}>←</button>
        <h2>Settings</h2>
      </header>
      <div className="profile-row">
        <div className="avatar">{user?.display_name[0] || "U"}</div>
        <div>
          <h3>{user?.display_name}</h3>
          <p>{user?.email}</p>
        </div>
      </div>
      {items.map(it => (
        <div className="list-item" key={it.title}>
          <div>
            <p>{it.title}</p>
            <small>{it.desc}</small>
          </div>
        </div>
      ))}
      <div className="list-item" onClick={logout}>
        <p style={{ color: "red" }}>Log out</p>
      </div>
    </div>
  )
}

function ProfilePage({ onBack }: { onBack: () => void }) {
  const { user } = useAuth()
  return (
    <div className="page">
      <header className="page-header">
        <button onClick={onBack}>←</button>
      </header>
      <div className="profile-info">
        <div className="avatar large">{user?.display_name[0] || "U"}</div>
        <h2>{user?.display_name}</h2>
        <p>{user?.email}</p>
      </div>
    </div>
  )
}

function SearchResults({ results }: { results: User[] }) {
  if (results.length === 0) return <div className="empty">No results</div>
  return (
    <div className="list">
      {results.map(r => (
        <div className="list-item" key={r.id}>
          <div className="avatar">{r.display_name[0]}</div>
          <div>
            <p>{r.display_name}</p>
            <small>{r.email}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChatList() {
  return (
    <div className="list">
      <div className="empty">
        <img src={EnvelopeIcon} alt="Empty" />
        <p>No chats yet</p>
      </div>
    </div>
  )
}

// Main App
function AppContent() {
  const { user, loading, login, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [page, setPage] = useState<'home' | 'settings' | 'profile'>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('readtalk_theme') as 'light' | 'dark' | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark'? '#111b21' : '#ffffff')
    }
  }, [theme])

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([])
      return
    }
    const timeout = setTimeout(() => {
      fetch(`https://auth.readtalk.workers.dev/api/search?q=${searchQuery}`)
       .then(r => r.json())
       .then(setSearchResults)
       .catch(() => setSearchResults([]))
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const toggleTheme = () => {
    const newTheme = theme === 'light'? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('readtalk_theme', newTheme)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (page === 'settings') return <SettingsPage onBack={() => setPage('home')} />
  if (page === 'profile') return <ProfilePage onBack={() => setPage('home')} />

  return (
    <div className={`app-layout ${theme}`}>
      <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-header-title">READTalk</h1>
        </div>
        <div className="app-header-right">
          {user && (
            <span className="app-user-info">
              {user.display_name} | {user.email.split("@")[0]}
            </span>
          )}
          <button className="app-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <img src={MenuDotsVertical} alt="Menu" />
          </button>
          {showMenu && (
            <div className="app-dropdown">
              <button onClick={() => setShowMenu(false)}>New group</button>
              <button onClick={() => setShowMenu(false)}>New community</button>
              <button onClick={() => setShowMenu(false)}>New broadcast</button>
              <button onClick={() => setShowMenu(false)}>Linked devices</button>
              <button onClick={() => setShowMenu(false)}>Starred</button>
              <button onClick={() => setShowMenu(false)}>Mark all as read</button>
              <div className="divider"></div>
              <button onClick={() => { setShowMenu(false); setPage('settings') }}>Settings</button>
              <button onClick={toggleTheme}>{theme === 'light'? 'Dark mode' : 'Light mode'}</button>
              {user? (
                <button onClick={logout}>Logout</button>
              ) : (
                <button onClick={login}>Login</button>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="app-search-container">
        <div className="app-search-box">
          <img src={SearchIcon} alt="Search" className="app-search-icon" />
          <input
            type="text"
            placeholder="Search name or message..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="app-search-input"
          />
        </div>
      </div>

      <div className="app-main">
        <aside className="app-sidebar">
          {searchQuery? <SearchResults results={searchResults} /> : <ChatList />}
        </aside>
        <main className="app-content">
          <p>Welcome {user?.display_name || 'Guest'}</p>
        </main>
      </div>

      <nav className="app-bottom-nav">
        <button className={`app-bottom-tab ${activeTab === "chat"? "active" : ""}`} onClick={() => setActiveTab("chat")}>
          <img src={BubbleDiscussionIcon} alt="Chat" className="app-bottom-icon" />
          <span>Chat</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "updates"? "active" : ""}`} onClick={() => setActiveTab("updates")}>
          <img src={CameraIcon} alt="Updates" className="app-bottom-icon" />
          <span>Updates</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "communities"? "active" : ""}`} onClick={() => setActiveTab("communities")}>
          <img src={UsersIcon} alt="Communities" className="app-bottom-icon" />
          <span>Communities</span>
        </button>
        <button className={`app-bottom-tab ${activeTab === "calls"? "active" : ""}`} onClick={() => setActiveTab("calls")}>
          <img src={PhoneCallIcon} alt="Calls" className="app-bottom-icon" />
          <span>Calls</span>
        </button>
      </nav>

      <button className="app-fab">
        <img src={UserAddIcon} alt="Add" />
      </button>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
