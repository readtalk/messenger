import { Hono } from "hono"

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get("/api/profile/me", async (c) => {
  const authHeader = c.req.header("Authorization")
  if (!authHeader) return c.json({ error: "Unauthorized" }, 401)

  // Panggil /userinfo di repo 2 OpenAuth
  const authRes = await fetch("https://auth.readtalk.workers.dev/userinfo", {
    headers: { Authorization: authHeader }
  })

  if (!authRes.ok) return c.json({ error: "Invalid token" }, 401)

  const claims = await authRes.json()
  // claims.isinya: { sub: "user_id", email: "..." }

  // Ambil profil dari D1 repo 1
  let profile = await c.env.DB.prepare(
    "SELECT user_id, display_name, photo_url, about FROM users_profile WHERE user_id =?"
  ).bind(claims.sub).first()

  // Kalau belum ada, bikin row kosong
  if (!profile) {
    await c.env.DB.prepare(
      "INSERT INTO users_profile (user_id, display_name) VALUES (?,?)"
    ).bind(claims.sub, claims.email.split('@')[0]).run()

    profile = { user_id: claims.sub, display_name: claims.email.split('@')[0], photo_url: null, about: "" }
  }

  return c.json({
    user_id: claims.sub,
    email: claims.email,
   ...profile
  })
})

export default app
