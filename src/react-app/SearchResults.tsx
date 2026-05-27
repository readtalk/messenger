type User = { id: string, name: string, email: string }

export default function SearchResults({ results, onOpenProfile }: { results: User[], onOpenProfile: (id: string) => void }) {
  if (results.length === 0) return <div className="empty">No results</div>

  return (
    <div className="search-results">
      {results.map(r => (
        <div className="search-item" key={r.id} onClick={() => onOpenProfile(r.id)}>
          <div className="avatar">{r.name[0]}</div>
          <div>
            <p>{r.name}</p>
            <small>{r.email}</small>
          </div>
        </div>
      ))}
    </div>
  )
}
