import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { usePrefs } from '@/lib/prefs'
import { ItemCard, PageHeader } from '@/components/ui'
import { concepts, conceptById, items } from '@/data/fixtures'

export const Route = createFileRoute('/graph')({
  validateSearch: (s: Record<string, unknown>): { c?: string } => ({ c: typeof s.c === 'string' ? s.c : undefined }),
  component: Graph,
})

const W = 760
const H = 560

function Graph() {
  const { t, lang } = usePrefs()
  const { c = 'ilm' } = Route.useSearch()
  const navigate = useNavigate({ from: '/graph' })
  const selected = conceptById(c) ?? concepts[0]

  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>()
    concepts.forEach((k, i) => {
      const a = (i / concepts.length) * Math.PI * 2 - Math.PI / 2
      const r = i % 2 ? 225 : 185
      m.set(k.id, { x: W / 2 + Math.cos(a) * r * 1.25, y: H / 2 + Math.sin(a) * r })
    })
    return m
  }, [])

  const edges = useMemo(() => {
    const seen = new Set<string>()
    const out: [string, string][] = []
    for (const k of concepts)
      for (const r of k.related) {
        const key = [k.id, r].sort().join('|')
        if (!seen.has(key) && pos.has(r)) {
          seen.add(key)
          out.push([k.id, r])
        }
      }
    return out
  }, [pos])

  const neighbours = new Set(edges.filter(([a, b]) => a === selected.id || b === selected.id).flat())
  const linked = items.filter((i) => i.concepts.includes(selected.id))
  const counts = (id: string) => items.filter((i) => i.concepts.includes(id)).length
  const pick = (id: string) => navigate({ search: { c: id }, replace: true })
  const center = pos.get(selected.id)!

  return (
    <div>
      <PageHeader title={t.graph.title} lead={t.graph.lead} />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="card pat tl p-3 sm:p-5">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={t.graph.title}>
            {edges.map(([a, b]) => {
              const p = pos.get(a)!
              const q = pos.get(b)!
              const on = a === selected.id || b === selected.id
              return <line key={a + b} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={on ? 'var(--pr)' : 'var(--bd)'} strokeWidth={on ? 2.5 : 1.2} strokeOpacity={on ? 0.9 : 0.8} />
            })}
            {linked.slice(0, 10).map((it, i) => {
              const a = (i / Math.min(linked.length, 10)) * Math.PI * 2
              const x = center.x + Math.cos(a) * 62
              const y = center.y + Math.sin(a) * 62
              return (
                <g key={it.id}>
                  <line x1={center.x} y1={center.y} x2={x} y2={y} stroke="var(--ac)" strokeDasharray="3 3" />
                  <circle cx={x} cy={y} r={6} fill="var(--ac)" />
                </g>
              )
            })}
            {concepts.map((k) => {
              const p = pos.get(k.id)!
              const isSel = k.id === selected.id
              const isNb = neighbours.has(k.id)
              const r = 16 + Math.min(counts(k.id), 10) * 1.6
              return (
                <g key={k.id} onClick={() => pick(k.id)} className="cursor-pointer" tabIndex={0} role="button" aria-label={k.label[lang]} onKeyDown={(e) => e.key === 'Enter' && pick(k.id)}>
                  <circle cx={p.x} cy={p.y} r={r + (isSel ? 6 : 0)} fill={isSel ? 'var(--pr)' : isNb ? 'var(--prs)' : 'var(--sf)'} stroke={isSel || isNb ? 'var(--pr)' : 'var(--bd)'} strokeWidth={2} className="transition-all" />
                  <text x={p.x} y={p.y + r + (isSel ? 24 : 18)} textAnchor="middle" fontSize={isSel ? 15 : 13} fontWeight={isSel ? 700 : 500} fill={isSel ? 'var(--pr)' : 'var(--tx)'} style={{ fontFamily: 'var(--font)' }}>
                    {k.label[lang]}
                  </text>
                  <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={isSel ? 'var(--sf)' : 'var(--mu)'}>
                    {counts(k.id)}
                  </text>
                </g>
              )
            })}
          </svg>
          <div className="flex gap-5 px-2 pt-2 text-xs text-mu">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-pr bg-prs" /> {t.graph.legendConcept}</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-ac" /> {t.graph.legendText}</span>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="band">
            <p className="m-0 text-xs font-semibold text-mu">{t.ui.concepts}</p>
            <h2 className="t2 mt-1 text-pr">{selected.label[lang]}</h2>
            <p className="mt-4 mb-2 text-xs font-semibold text-mu">{t.graph.related}</p>
            <div className="flex flex-wrap gap-2">
              {selected.related.map((r) => (
                <button key={r} onClick={() => pick(r)} className="rounded-full border border-bd bg-sf px-3 py-1 text-sm hover:border-pr hover:text-pr">
                  {conceptById(r)?.label[lang]}
                </button>
              ))}
            </div>
          </div>
          <p className="m-0 text-sm font-semibold text-mu">
            {t.graph.texts} ({linked.length})
          </p>
          <div className="space-y-4 max-h-[720px] overflow-y-auto pe-1">
            {linked.map((it) => (
              <ItemCard key={it.id} item={it} compact />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
