import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BookMarked } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { PageHeader } from '@/components/ui'
import { sources, type SourceType } from '@/data/fixtures'

export const Route = createFileRoute('/sources')({ component: Sources })

const order: SourceType[] = ['quran', 'hadith', 'tafsir', 'fiqh', 'sirah', 'adab']

function Sources() {
  const { t, lang } = usePrefs()
  const [type, setType] = useState<SourceType | null>(null)
  const fmt = (v: number) => v.toLocaleString(lang === 'ar' ? 'ar-EG' : lang)
  const list = sources.filter((s) => !type || s.type === type)

  return (
    <div>
      <PageHeader title={t.sources.title} lead={t.sources.lead}>
        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setType(null)} className={`rounded-full border px-4 py-1.5 text-sm ${!type ? 'border-pr bg-prs text-pr font-semibold' : 'border-bd bg-sf text-mu'}`}>
            {t.ui.all}
          </button>
          {order.map((o) => (
            <button key={o} onClick={() => setType(o)} className={`rounded-full border px-4 py-1.5 text-sm ${type === o ? 'border-pr bg-prs text-pr font-semibold' : 'border-bd bg-sf text-mu'}`}>
              {t.sources.types[o]}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <article key={s.id} className="card p-5 flex gap-4 hover:border-pr/50 transition-colors">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-acs text-ac">
              <BookMarked size={22} />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-[11px] font-semibold text-mu">{t.sources.types[s.type]}</p>
              <h2 className="t3 mt-0.5">{s.name[lang]}</h2>
              {s.died && (
                <p className="m-0 mt-1 text-sm text-mu">
                  {s.author[lang]} ({t.ui.died} {fmt(s.died)} {t.ui.hijri})
                </p>
              )}
              <p className="m-0 mt-3 text-sm font-bold text-pr">
                {fmt(s.items)} {t.ui.items}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
