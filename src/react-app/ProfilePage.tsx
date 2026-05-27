export default function ProfilePage({ userId, onBack }: { userId: string, onBack: () => void }) {
  // Dummy data dulu. Nanti fetch /api/user/:id
  const isMe = true
  const user = { name: "You", email: "you@mail.com" }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button onClick={onBack}>←</button>
      </header>

      <div className="profile-info">
        <div className="avatar large">{user.name[0]}</div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>

      {!isMe && (
        <button className="profile-message-btn">Message</button>
      )}
    </div>
  )
}
