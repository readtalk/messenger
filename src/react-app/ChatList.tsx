export default function ChatList({ onOpenProfile }: { onOpenProfile: (id: string) => void }) {
  return (
    <div className="chat-list">
      <div className="empty">
        <img src="/assets/envelope.svg" alt="Empty" />
        <p>No chats yet</p>
      </div>
    </div>
  )
}
