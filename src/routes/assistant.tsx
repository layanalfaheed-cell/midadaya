import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { BookOpen, Bot, Send, Sparkles, User } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { StatusBadge } from '@/components/ui'
import { searchItems, sourceById, type Item } from '@/data/fixtures'

export const Route = createFileRoute('/assistant')({ component: Assistant })

type Msg = { role: 'user' | 'assistant'; text: string; cites?: Item[]; fallback?: boolean }

// Retrieval-only stub: answers are assembled from approved fixture texts.
// A later milestone replaces this with an LLM (via Netlify AI Gateway) grounded on the same retrieval.
function answer(q: string): { cites: Item[]; fallback: boolean } {
  const hits = searchItems(q)
  const verified = hits.filter((h) => h.item.status === 'verified')
  if (verified.length) return { cites: verified.slice(0, 3).map((h) => h.item), fallback: false }
  return { cites: (hits.length ? hits : searchItems('علم')).slice(0, 2).map((h) => h.item), fallback: true }
}

function Assistant() {
  const { t, lang } = usePrefs()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [msgs, busy])

  const ask = (text: string) => {
    const v = text.trim()
    if (!v || busy) return
    setMsgs((m) => [...m, { role: 'user', text: v }])
    setInput('')
    setBusy(true)
    setTimeout(() => {
      const { cites, fallback } = answer(v)
      setMsgs((m) => [...m, { role: 'assistant', text: fallback ? t.assistant.fallback : t.assistant.intro, cites, fallback }])
      setBusy(false)
    }, 1100)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="card flex h-[calc(100vh-140px)] min-h-[560px] flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-bd px-5 py-4 pat">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-pr text-sf">
            <Bot size={22} />
          </span>
          <div>
            <h1 className="t3 m-0">{t.assistant.title}</h1>
            <p className="m-0 text-xs text-mu">{t.assistant.lead}</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <Bubble role="assistant" text={t.assistant.hello} />
          {msgs.length === 0 && (
            <div className="grid gap-2 sm:grid-cols-2 pt-2">
              {t.assistant.suggestions.map((s) => (
                <button key={s} onClick={() => ask(s)} className="card flex items-center gap-2 p-3 text-start text-sm hover:border-pr hover:text-pr">
                  <Sparkles size={15} className="text-ac shrink-0" /> {s}
                </button>
              ))}
            </div>
          )}
          {msgs.map((m, i) => (
            <Bubble key={i} {...m} />
          ))}
          {busy && <p className="m-0 flex items-center gap-2 text-sm text-mu"><Bot size={16} className="animate-pulse" /> {t.assistant.thinking}</p>}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="border-t border-bd p-4"
        >
          <div className="flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.assistant.placeholder} className="field" />
            <button className="btn btn-pr !px-5" disabled={busy} aria-label={t.ui.send}>
              <Send size={16} className="rtl:-scale-x-100" />
            </button>
          </div>
          <p className="m-0 mt-2 text-[11px] text-mu">{t.assistant.disclaimer}</p>
        </form>
      </section>

      <aside className="space-y-4">
        <div className="band">
          <p className="tk h mb-3"><BookOpen size={14} /> {t.assistant.sourcesUsed}</p>
          {(() => {
            const all = msgs.flatMap((m) => m.cites ?? [])
            const ids = [...new Set(all.map((c) => c.source))]
            if (!ids.length) return <p className="m-0 text-sm text-mu">—</p>
            return (
              <ul className="m-0 list-none space-y-2 p-0">
                {ids.map((id) => (
                  <li key={id} className="flex items-center justify-between rounded-lg bg-sf px-3 py-2 text-sm">
                    <span className="font-semibold">{sourceById(id)?.name[lang]}</span>
                    <span className="text-mu">{all.filter((c) => c.source === id).length}</span>
                  </li>
                ))}
              </ul>
            )
          })()}
        </div>
        <div className="band text-sm text-mu leading-6">{t.assistant.disclaimer}</div>
      </aside>
    </div>
  )
}

function Bubble({ role, text, cites }: Msg) {
  const { t, lang } = usePrefs()
  const mine = role === 'user'
  return (
    <div className={`flex gap-3 fade-up ${mine ? 'flex-row-reverse' : ''}`}>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${mine ? 'bg-ac text-sf' : 'bg-prs text-pr'}`}>
        {mine ? <User size={16} /> : <Bot size={16} />}
      </span>
      <div className={`max-w-[88%] space-y-3 ${mine ? 'text-end' : ''}`}>
        <p className={`m-0 inline-block rounded-2xl px-4 py-3 text-[15px] leading-7 ${mine ? 'bg-pr text-sf' : 'bg-bg2 text-tx'}`}>{text}</p>
        {cites?.map((c, i) => {
          const src = sourceById(c.source)
          return (
            <div key={c.id} className="card p-4 text-start">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-pr">[{i + 1}] {src?.name[lang]} · {c.ref}</span>
                <StatusBadge status={c.status} />
              </div>
              <p className="quote m-0 !text-xl">{c.ar}</p>
              {lang !== 'ar' && <p className="m-0 mt-1 text-sm text-mu italic">{c.tr[lang]}</p>}
              {c.grade && <p className="m-0 mt-2 text-xs text-mu">{t.ui.grade}: {c.grade[lang]}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
