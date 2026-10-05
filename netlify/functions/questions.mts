import type { Config } from '@netlify/functions'
import { getUser } from '@netlify/identity'
import { desc, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { questions } from '../../db/schema.js'
import { requireAdmin } from '../../db/auth.js'

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export default async (req: Request) => {
  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}))
    const question = clip(body.question, 2000)
    if (question.length < 2) return Response.json({ error: 'question required' }, { status: 400 })
    const user = await getUser()
    const [row] = await db
      .insert(questions)
      .values({
        question,
        lang: ['ar', 'en', 'id'].includes(body.lang) ? body.lang : 'ar',
        contactEmail: clip(body.email, 200) || user?.email || null,
        userId: user?.id ?? null,
        userEmail: user?.email ?? null,
      })
      .returning({ id: questions.id })
    return Response.json(row, { status: 201 })
  }

  const admin = await requireAdmin()
  if (!admin) return Response.json({ error: 'forbidden' }, { status: 403 })

  if (req.method === 'GET') {
    const rows = await db.select().from(questions).orderBy(desc(questions.createdAt)).limit(200)
    return Response.json(rows)
  }

  if (req.method === 'PATCH') {
    const body = await req.json().catch(() => ({}))
    const id = Number(body.id)
    const status = ['open', 'answered', 'closed'].includes(body.status) ? body.status : 'answered'
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })
    const [row] = await db
      .update(questions)
      .set({ status, answer: clip(body.answer, 5000) || null, answeredBy: admin.email ?? null, answeredAt: new Date() })
      .where(eq(questions.id, id))
      .returning()
    return Response.json(row)
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = { path: '/api/questions' }
