import type { Config } from '@netlify/functions'
import { desc } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { reviewDecisions } from '../../db/schema.js'
import { requireAdmin } from '../../db/auth.js'

export default async (req: Request) => {
  const admin = await requireAdmin()
  if (!admin) return Response.json({ error: 'forbidden' }, { status: 403 })

  if (req.method === 'GET') {
    const rows = await db.select().from(reviewDecisions).orderBy(desc(reviewDecisions.createdAt))
    return Response.json(rows)
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => ({}))
    const decision = body.decision === 'rejected' ? 'rejected' : 'approved'
    if (typeof body.taskId !== 'string' || !body.taskId) return Response.json({ error: 'taskId required' }, { status: 400 })
    const [row] = await db
      .insert(reviewDecisions)
      .values({ taskId: body.taskId.slice(0, 50), decision, reviewerEmail: admin.email ?? null })
      .returning()
    return Response.json(row, { status: 201 })
  }

  return new Response('Method not allowed', { status: 405 })
}

export const config: Config = { path: '/api/reviews' }
