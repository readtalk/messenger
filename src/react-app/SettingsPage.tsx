import { useAuth } from "./auth/AuthContext"

export default function SettingsPage({ onBack }: { onBack: () => void }) {
  const { user, logout } = useAuth()

  const items = [
    { title: "Account", desc: "Privacy, security, change number" },
    { title: "Chats", desc: "Theme, wallpapers, chat settings" },
    { title: "Notifications", desc: "Message, group & call tones" },
    { title: "Storage and data", desc: "Network usage, auto-download" },
  ]

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button onClick={onBack}>←</button>
        <h2>Settings</h2>
      </header>

      <div className="settings-profile" onClick={() => {}}>
        <div className="avatar">{user?.display_name[0] || "U"}</div>
        <div>
          <h3>{user?.display_name}</h3>
          <p>{user?.email}</p>
        </div>
      </div>

      {items.map(it => (
        <div className="settings-item" key={it.title}>
          <div>
            <p>{it.title}</p>
            <small>{it.desc}</small>
          </div>
        </div>
      ))}

      <div className="settings-item" onClick={logout}>
        <p style={{ color: "red" }}>Log out</p>
      </div>
    </div>
  )
}
