import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { ItemCard, PageHeader } from '@/components/ui'
import { exampleQueries, searchItems, sourceById, type ItemType, type Status } from '@/data/fixtures'

export const Route = createFileRoute('/explore')({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: typeof s.q === 'string' ? s.q : undefined }),
  component: Explore,
})

const types: ItemType[] = ['hadith', 'ayah', 'athar']
const statuses: Status[] = ['verified', 'in_review', 'ai_extracted']

function Explore() {
  const { t, lang } = usePrefs()
  const { q = '' } = Route.useSearch()
  const navigate = useNavigate({ from: '/explore' })
  const [input, setInput] = useState(q)
  const [type, setType] = useState<ItemType | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [source, setSource] = useState<string | null>(null)

  useEffect(() => setInput(q), [q])

  const ranked = useMemo(() => searchItems(q), [q])
  const results = ranked.filter(({ item }) => (!type || item.type === type) && (!status || item.status === status) && (!source || item.source === source))
  const sourceIds = [...new Set(ranked.map((r) => r.item.source))]
  const hasFilters = type || status || source

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? 'border-pr bg-prs text-pr font-semibold' : 'border-bd bg-sf text-mu hover:text-tx'}`

  return (
    <div>
      <PageHeader title={t.explore.title} lead={t.explore.lead}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate({ search: { q: input || undefined } })
          }}
          className="mt-6 flex gap-2 rounded-full border border-bd bg-sf p-1.5 max-w-2xl focus-within:border-pr"
        >
          <Search size={18} className="ms-3 self-center text-mu shrink-0" aria-hidden />
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.explore.placeholder} className="flex-1 min-w-0 bg-transparent px-1 outline-none placeholder:text-mu" autoFocus />
          <button className="btn btn-pr">{t.ui.search}</button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="tk"><Sparkles size={14} className="text-ac" /> {t.explore.semantic}</span>
          {exampleQueries.map((e) => (
            <button key={e.en} onClick={() => navigate({ search: { q: e[lang] } })} className="rounded-full bg-bg2 px-3 py-1 text-mu hover:text-pr">
              {e[lang]}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          <p className="tk h"><SlidersHorizontal size={14} /> {t.explore.filters}</p>
          <Group label={t.explore.byType}>
            <button className={chip(!type)} onClick={() => setType(null)}>{t.ui.all}</button>
            {types.map((v) => (
              <button key={v} className={chip(type === v)} onClick={() => setType(v)}>{t.ui[v]}</button>
            ))}
          </Group>
          <Group label={t.explore.byStatus}>
            <button className={chip(!status)} onClick={() => setStatus(null)}>{t.ui.all}</button>
            {statuses.map((v) => (
              <button key={v} className={chip(status === v)} onClick={() => setStatus(v)}>{t.status[v]}</button>
            ))}
          </Group>
          <Group label={t.explore.bySource}>
            <button className={chip(!source)} onClick={() => setSource(null)}>{t.ui.all}</button>
            {sourceIds.map((v) => (
              <button key={v} className={chip(source === v)} onClick={() => setSource(v)}>{sourceById(v)?.name[lang]}</button>
            ))}
          </Group>
        </aside>

        <section>
          <p className="mb-4 text-sm text-mu">
            {results.length.toLocaleString(lang === 'ar' ? 'ar-EG' : lang)} {t.ui.results}
            {q && <> · «{q}»</>}
          </p>
          {results.length === 0 ? (
            <div className="emp">
              <p className="t3 mb-2">{t.ui.noResults}</p>
              <p className="bd">{t.ui.noResultsHint}</p>
              {hasFilters && (
                <button className="btn btn-gh" onClick={() => { setType(null); setStatus(null); setSource(null) }}>{t.ui.clear}</button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {results.map(({ item }) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-mu">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
