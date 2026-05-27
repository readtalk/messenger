const API_URL = '/api'

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}
