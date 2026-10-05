import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, PartyPopper, Pencil, X } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { PageHeader, StatusBadge } from '@/components/ui'
import { items, reviewQueue, sourceById } from '@/data/fixtures'

export const Route = createFileRoute('/review')({ component: Review })

type Decision = 'approved' | 'rejected'

function Review() {
  const { t, lang } = usePrefs()
  const [decisions, setDecisions] = useState<Record<string, Decision>>({})
  const pending = reviewQueue.filter((r) => !decisions[r.id])
  const done = reviewQueue.filter((r) => decisions[r.id])
  const decide = (id: string, d: Decision) => setDecisions((s) => ({ ...s, [id]: d }))

  return (
    <div>
      <PageHeader title={t.review.title} lead={t.review.lead}>
        <div className="steps">
          <span>{t.review.queue}: {pending.length}</span>
          <span>{t.review.done}: {done.length}</span>
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          {pending.length === 0 && (
            <div className="emp">
              <PartyPopper className="mx-auto mb-3 text-pr" size={32} />
              <p className="bd">{t.review.empty}</p>
            </div>
          )}
          {pending.map((r) => {
            const it = items.find((i) => i.id === r.itemId)!
            const pct = Math.round(r.confidence * 100)
            return (
              <article key={r.id} className="card p-5 sm:p-6 fade-up">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="rounded-md bg-acs px-2 py-0.5 text-xs font-bold text-warn">{t.review.kind[r.kind]}</span>
                  <StatusBadge status={it.status} />
                </div>
                <p className="quote m-0 !text-xl">{it.ar}</p>
                <p className="m-0 mt-1 text-xs text-mu">
                  {t.review.from} {sourceById(it.source)?.name[lang]} · {it.ref}
                </p>
                <div className="mt-4 rounded-xl border border-dashed border-ai/40 bg-bg3 p-4">
                  <p className="m-0 text-xs font-semibold text-ai">{t.review.extracted}</p>
                  <p className="m-0 mt-1 font-semibold">{r.proposal[lang]}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-mu">
                    {t.review.confidence}
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-bd">
                      <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: pct > 80 ? 'var(--ok)' : pct > 65 ? 'var(--ac)' : 'var(--warn)' }} />
                    </span>
                    <span dir="ltr" className="font-bold text-tx">{pct}%</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => decide(r.id, 'approved')} className="btn btn-pr"><Check size={16} /> {t.review.approve}</button>
                  <button className="btn btn-gh"><Pencil size={16} /> {t.review.edit}</button>
                  <button onClick={() => decide(r.id, 'rejected')} className="btn btn-gh hover:!text-warn hover:!border-warn"><X size={16} /> {t.review.reject}</button>
                </div>
              </article>
            )
          })}
        </section>

        <aside className="band self-start space-y-3">
          <p className="tk h">{t.review.done}</p>
          {done.length === 0 && <p className="m-0 text-sm text-mu">—</p>}
          {done.map((r) => (
            <div key={r.id} className="flex items-start justify-between gap-2 rounded-lg bg-sf p-3 text-sm">
              <span>{r.proposal[lang]}</span>
              <span className={`shrink-0 text-xs font-bold ${decisions[r.id] === 'approved' ? 'text-ok' : 'text-warn'}`}>
                {decisions[r.id] === 'approved' ? t.review.approved : t.review.rejected}
              </span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}
