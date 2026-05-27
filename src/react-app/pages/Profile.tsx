// src/pages/Profile.tsx
import { useState } from 'react';

export default function Profile() {
  const [displayname, setDisplayname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/set-displayname', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ displayname })
    });

    if (res.ok) {
      window.location.href = '/chat';
    } else {
      const text = await res.text();
      setError(text || 'Failed to set displayname');
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>Set your @displayname</h1>
      <p>This is how people will find you on READTalk.</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="readtalk"
          value={displayname}
          onChange={(e) => setDisplayname(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          minLength={3}
          maxLength={20}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      
      <small>Only letters, numbers, and underscore. 3-20 characters.</small>
    </div>
  );
}
