import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { readingProgress } from '../../db/schema.js'

const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)

// Reading streak for signed-in readers. The client sends its local calendar date so streaks follow the reader's day.
export default async (req: Request) => {
  const user = await getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const [current] = await db.select().from(readingProgress).where(eq(readingProgress.userId, user.id))

  if (req.method === 'GET') return Response.json(current ?? null)

  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}))
    if (!isDate(body.today)) return Response.json({ error: 'today required' }, { status: 400 })
    const surah = Number(body.surah) || null
    const prev = current?.lastDate
    let { streak = 0, best = 0, totalDays = 0 } = current ?? {}
    if (prev !== body.today) {
      streak = prev && dayDiff(prev, body.today) === 1 ? streak + 1 : 1
      totalDays += 1
      best = Math.max(best, streak)
    }
    const values = { userId: user.id, streak, best, totalDays, lastDate: body.today, lastSurah: surah ?? current?.lastSurah ?? null, updatedAt: new Date() }
    const [row] = await db.insert(readingProgress).values(values).onConflictDoUpdate({ target: readingProgress.userId, set: values }).returning()
    return Response.json(row)
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = { path: '/api/progress' }
