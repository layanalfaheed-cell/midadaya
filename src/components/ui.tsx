import { Link } from '@tanstack/react-router'
import { BadgeCheck, Bot, Copy, Check, Hand, Hourglass, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { usePrefs } from '@/lib/prefs'
import { conceptById, sourceById, type Item, type Status } from '@/data/fixtures'

export const cdn = (path: string, w: number) => `/.netlify/images?url=${encodeURIComponent(path)}&w=${w}&fm=webp`

export function Logo({ size = 40 }: { size?: number }) {
  const { t } = usePrefs()
  return (
    <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={t.brand}>
      <img src={cdn('/img/midad-mark.png', size * 2)} alt="" width={size} height={Math.round(size * 1.2)} className="lk app" style={{ width: size, height: 'auto' }} />
      <span className="leading-tight">
        <span className="block text-lg font-bold text-pr">{t.brand}</span>
        <span className="hidden sm:block text-[11px] text-mu max-w-[220px] truncate">{t.tagline}</span>
      </span>
    </Link>
  )
}

const statusStyle: Record<Status, { cls: string; Icon: typeof BadgeCheck }> = {
  verified: { cls: 'bg-prs text-pr border-pr/30', Icon: BadgeCheck },
  in_review: { cls: 'bg-acs text-warn border-warn/30', Icon: Hourglass },
  ai_extracted: { cls: 'bg-bg2 text-ai border-ai/30', Icon: Bot },
}

export function StatusBadge({ status }: { status: Status }) {
  const { t } = usePrefs()
  const { cls, Icon } = statusStyle[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon size={14} aria-hidden />
      {t.status[status]}
    </span>
  )
}

export function PageHeader({ title, lead, children }: { title: string; lead: string; children?: React.ReactNode }) {
  return (
    <section className="hero pat mb-8 fade-up">
      <h1 className="t2 text-tx">{title}</h1>
      <p className="bd mt-3 max-w-2xl">{lead}</p>
      {children}
    </section>
  )
}

export function ItemCard({ item, compact = false }: { item: Item; compact?: boolean }) {
  const { t, lang, signThis } = usePrefs()
  const [copied, setCopied] = useState(false)
  const src = sourceById(item.source)
  const translation = lang === 'ar' ? null : item.tr[lang]
  const typeLabel = t.ui[item.type]

  const copy = () => {
    const text = `${item.ar}\n${translation ?? ''}\n— ${src?.name[lang]} ${item.ref}`
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article className="card p-5 sm:p-6 flex flex-col gap-4 hover:border-pr/50 transition-colors">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-mu">
          <span className="rounded-md bg-bg2 px-2 py-0.5 font-semibold text-tx">{typeLabel}</span>
          <span dir="ltr">#{item.id}</span>
        </div>
        <StatusBadge status={item.status} />
      </header>

      <p className="quote text-tx m-0">{item.ar}</p>
      {translation && <p className="bd m-0 text-[15px] italic">{translation}</p>}

      {!compact && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-mu text-xs">{t.ui.source}</dt>
            <dd className="m-0 font-semibold flex items-center gap-1.5">
              <BookOpen size={14} className="text-ac" aria-hidden /> {src?.name[lang]}
            </dd>
          </div>
          <div>
            <dt className="text-mu text-xs">{t.ui.reference}</dt>
            <dd className="m-0 font-semibold">
              {item.ref}
              {item.alsoIn && <span className="text-mu font-normal"> · {item.alsoIn}</span>}
            </dd>
          </div>
          {item.narrator && (
            <div>
              <dt className="text-mu text-xs">{t.ui.narrator}</dt>
              <dd className="m-0">{item.narrator[lang]}</dd>
            </div>
          )}
          {item.grade && (
            <div>
              <dt className="text-mu text-xs">{t.ui.grade}</dt>
              <dd className="m-0">{item.grade[lang]}</dd>
            </div>
          )}
        </dl>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-bd pt-3">
        <div className="flex flex-wrap gap-1.5">
          {item.concepts.map((c) => (
            <Link key={c} to="/graph" search={{ c }} className="rounded-full border border-bd bg-bg3 px-2.5 py-0.5 text-xs text-mu hover:text-pr hover:border-pr">
              {conceptById(c)?.label[lang]}
            </Link>
          ))}
        </div>
        <div className="flex gap-1">
          <button onClick={() => signThis(translation ?? item.ar)} className="p-2 rounded-lg text-mu hover:text-pr hover:bg-bg2" title={t.ui.signLang} aria-label={t.ui.signLang}>
            <Hand size={16} />
          </button>
          <button onClick={copy} className="p-2 rounded-lg text-mu hover:text-pr hover:bg-bg2" title={copied ? t.ui.copied : t.ui.copy} aria-label={t.ui.copy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </footer>
    </article>
  )
}
