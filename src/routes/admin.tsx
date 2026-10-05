import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Inbox, Mail, RotateCcw, Send, X } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { PageHeader } from '@/components/ui'
import { AdminGate } from '@/components/AdminGate'

export const Route = createFileRoute('/admin')({ component: () => <AdminGate><Admin /></AdminGate> })

type Status = 'open' | 'answered' | 'closed'
type Question = { id: number; question: string; lang: string; contactEmail: string | null; userEmail: string | null; status: Status; answer: string | null; answeredBy: string | null; createdAt: string }

function Admin() {
  const { t, lang } = usePrefs()
  const [rows, setRows] = useState<Question[] | null>(null)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState<Status | 'all'>('open')

  const load = () => {
    setError(false)
    fetch('/api/questions')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setRows)
      .catch(() => setError(true))
  }
  useEffect(load, [])

  const update = async (id: number, status: Status, answer?: string) => {
    const r = await fetch('/api/questions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status, answer }) })
    if (r.ok) {
      const row = (await r.json()) as Question
      setRows((rs) => rs?.map((q) => (q.id === id ? row : q)) ?? null)
    }
  }

  const count = (s: Status) => rows?.filter((q) => q.status === s).length ?? 0
  const shown = rows?.filter((q) => filter === 'all' || q.status === filter) ?? []
  const chip = (active: boolean) => `shrink-0 rounded-full border px-3 py-1.5 text-sm ${active ? 'border-pr bg-prs text-pr font-semibold' : 'border-bd bg-sf text-mu hover:text-tx'}`
  const fmtDate = (d: string) => new Date(d).toLocaleString(lang === 'ar' ? 'ar-EG' : lang, { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div>
      <PageHeader title={t.admin.title} lead={t.admin.lead}>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/review" className="btn btn-pr"><ClipboardCheck size={16} /> {t.admin.toReview}</Link>
          <div className="steps !mt-0">
            <span>{t.admin.open}: {count('open')}</span>
            <span>{t.admin.answered}: {count('answered')}</span>
          </div>
        </div>
      </PageHeader>

      <h2 className="t3 mb-3 flex items-center gap-2"><Inbox size={18} className="text-pr" /> {t.admin.questions}</h2>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(['open', 'answered', 'closed', 'all'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={chip(filter === s)}>{t.admin[s]}</button>
        ))}
      </div>

      {error && (
        <div className="emp">
          <p className="bd">{t.admin.loadError}</p>
          <button onClick={load} className="btn btn-gh"><RotateCcw size={16} /> {t.quran.retry}</button>
        </div>
      )}
      {!error && rows === null && <p className="text-mu">…</p>}
      {rows && shown.length === 0 && <div className="emp"><p className="bd">{t.admin.empty}</p></div>}

      <div className="grid gap-4 xl:grid-cols-2">
        {shown.map((q) => (
          <QuestionCard key={q.id} q={q} onUpdate={update} fmtDate={fmtDate} />
        ))}
      </div>
    </div>
  )
}

function QuestionCard({ q, onUpdate, fmtDate }: { q: Question; onUpdate: (id: number, s: Status, a?: string) => Promise<void>; fmtDate: (d: string) => string }) {
  const { t } = usePrefs()
  const [answer, setAnswer] = useState(q.answer ?? '')
  const [busy, setBusy] = useState(false)
  const contact = q.contactEmail || q.userEmail
  const run = async (s: Status, a?: string) => {
    setBusy(true)
    await onUpdate(q.id, s, a)
    setBusy(false)
  }
  const badge = { open: 'bg-acs text-warn', answered: 'bg-prs text-pr', closed: 'bg-bg2 text-mu' }[q.status]

  return (
    <article className="card p-4 sm:p-5 fade-up">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-mu">
        <span dir="ltr">#{q.id} · {q.lang.toUpperCase()} · {fmtDate(q.createdAt)}</span>
        <span className={`rounded-full px-2 py-0.5 font-bold ${badge}`}>{t.admin[q.status]}</span>
      </div>
      <p className="m-0 text-[17px] font-semibold leading-7" dir="auto">{q.question}</p>
      {contact && (
        <a href={`mailto:${contact}?subject=${encodeURIComponent('MIDAD · ' + q.question.slice(0, 60))}`} className="mt-2 inline-flex items-center gap-1.5 text-sm text-pr hover:underline" dir="ltr">
          <Mail size={14} /> {contact}
        </a>
      )}
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} placeholder={t.admin.answer} className="field mt-3 resize-y text-sm" dir="auto" />
      {q.answeredBy && <p className="m-0 mt-1 text-[11px] text-mu">{t.admin.reviewedBy} <span dir="ltr">{q.answeredBy}</span></p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={busy || !answer.trim()} onClick={() => run('answered', answer)} className="btn btn-pr !py-2 disabled:opacity-50">
          <Send size={15} className="rtl:-scale-x-100" /> {t.admin.save}
        </button>
        {q.status === 'open' ? (
          <button disabled={busy} onClick={() => run('closed', answer)} className="btn btn-gh !py-2"><X size={15} /> {t.admin.close}</button>
        ) : (
          <button disabled={busy} onClick={() => run('open', answer)} className="btn btn-gh !py-2"><RotateCcw size={15} /> {t.admin.reopen}</button>
        )}
        {q.status === 'answered' && <CheckCircle2 size={20} className="self-center text-pr" />}
      </div>
    </article>
  )
}
