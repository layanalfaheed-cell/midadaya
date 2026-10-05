import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Flame, Hand, Languages, RotateCcw, Search, Trophy } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { useAuth } from '@/lib/auth'

export const Route = createFileRoute('/quran')({
  validateSearch: (s: Record<string, unknown>): { s?: number } => {
    const n = Number(s.s)
    return { s: Number.isInteger(n) && n >= 1 && n <= 114 ? n : undefined }
  },
  component: Quran,
})

// Text comes verbatim from the Tanzil-verified Uthmani edition (Madinah Mushaf, Hafs) via AlQuran.cloud.
const API = 'https://api.alquran.cloud/v1'
const TRANSLATION = { en: 'en.sahih', id: 'id.indonesian' } as const
// Compared without diacritics because mark ordering can differ between encodings.
const bare = (w: string) => w.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').replace(/ٱ/g, 'ا')
const BASMALA_BARE = ['بسم', 'الله', 'الرحمن', 'الرحيم']

type SurahMeta = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: 'Meccan' | 'Medinan' }
type Ayah = { n: number; text: string; tr?: string }
type Streak = { streak: number; best: number; totalDays: number; lastDate: string | null; lastSurah: number | null }

const emptyStreak: Streak = { streak: 0, best: 0, totalDays: 0, lastDate: null, lastSurah: null }
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
const toArabicDigits = (n: number) => n.toLocaleString('ar-EG')

let surahCache: SurahMeta[] | null = null

// Guests keep their streak on this device; signed-in readers sync it to their account.
function useStreak() {
  const { user, ready } = useAuth()
  const [s, setS] = useState<Streak>(emptyStreak)

  useEffect(() => {
    if (!ready) return
    const local = JSON.parse(localStorage.getItem('midad-streak') ?? 'null') as Streak | null
    if (local) setS(local)
    if (!user) return
    fetch('/api/progress')
      .then((r) => (r.ok ? r.json() : null))
      .then((remote: Streak | null) => remote && setS(remote))
      .catch(() => undefined)
  }, [user, ready])

  const mark = useCallback(
    (surah: number) => {
      const today = localDate()
      setS((cur) => {
        if (cur.lastDate === today) return { ...cur, lastSurah: surah }
        const streak = cur.lastDate && dayDiff(cur.lastDate, today) === 1 ? cur.streak + 1 : 1
        const next = { streak, best: Math.max(cur.best, streak), totalDays: cur.totalDays + 1, lastDate: today, lastSurah: surah }
        localStorage.setItem('midad-streak', JSON.stringify(next))
        return next
      })
      if (user) {
        fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ today, surah }) }).catch(() => undefined)
      }
    },
    [user],
  )

  const today = localDate()
  const alive = !!s.lastDate && dayDiff(s.lastDate, today) <= 1
  return { ...s, current: alive ? s.streak : 0, doneToday: s.lastDate === today, mark, signedIn: !!user }
}

function Quran() {
  const { t, lang, signThis } = usePrefs()
  const { s: param } = Route.useSearch()
  const navigate = useNavigate({ from: '/quran' })
  const streak = useStreak()
  const [list, setList] = useState<SurahMeta[]>(surahCache ?? [])
  const [filter, setFilter] = useState('')
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [showTr, setShowTr] = useState(lang !== 'ar')
  const [reload, setReload] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)
  const readerRef = useRef<HTMLElement>(null)

  const current = param ?? streak.lastSurah ?? 1
  const meta = list.find((m) => m.number === current)
  const trEdition = lang === 'ar' ? null : TRANSLATION[lang]

  useEffect(() => setShowTr(lang !== 'ar'), [lang])

  useEffect(() => {
    if (surahCache) return
    fetch(`${API}/surah`)
      .then((r) => r.json())
      .then((j) => {
        surahCache = j.data
        setList(j.data)
      })
      .catch(() => setState('error'))
  }, [reload])

  useEffect(() => {
    let cancelled = false
    setState('loading')
    setAyahs(null)
    const editions = ['quran-uthmani', ...(showTr && trEdition ? [trEdition] : [])].join(',')
    fetch(`${API}/surah/${current}/editions/${editions}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return
        const [ar, tr] = j.data as { ayahs: { numberInSurah: number; text: string }[] }[]
        // Whitespace-only display fix: waqf marks (ۖ ۗ ۚ ۛ …) are attached to the preceding word so they don't render on a dotted circle.
        const tidy = (x: string) => x.replace(/^\uFEFF/, '').replace(/ ([\u06D6-\u06DC\u06DE])/g, '$1')
        setAyahs(ar.ayahs.map((a, i) => ({ n: a.numberInSurah, text: tidy(a.text), tr: tr?.ayahs[i]?.text })))
        setState('ready')
      })
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
    }
  }, [current, showTr, trEdition, reload])

  // Reaching the end of a surah counts as today's reading.
  useEffect(() => {
    const el = endRef.current
    if (!el || state !== 'ready') return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && streak.mark(current), { threshold: 1 })
    io.observe(el)
    return () => io.disconnect()
  }, [state, current, streak.mark])

  const go = (n: number) => {
    navigate({ search: { s: n } })
    readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase()
    if (!f) return list
    return list.filter((m) => String(m.number) === f || m.name.includes(f) || m.englishName.toLowerCase().includes(f) || m.englishNameTranslation.toLowerCase().includes(f))
  }, [list, filter])

  // The Uthmani edition prefixes the basmala to ayah 1 of every surah except al-Fatihah (where it is ayah 1) and al-Tawbah.
  const shown = useMemo(() => {
    if (!ayahs) return null
    const words = ayahs[0]?.text.split(' ') ?? []
    if (current === 1 || current === 9 || !BASMALA_BARE.every((b, i) => bare(words[i] ?? '') === b)) return { basmala: null, ayahs }
    return { basmala: words.slice(0, 4).join(' '), ayahs: [{ ...ayahs[0], text: words.slice(4).join(' ') }, ...ayahs.slice(1)] }
  }, [ayahs, current])

  const Prev = lang === 'ar' ? ChevronRight : ChevronLeft
  const Next = lang === 'ar' ? ChevronLeft : ChevronRight
  const fmt = (n: number) => (lang === 'ar' ? toArabicDigits(n) : String(n))

  return (
    <div>
      <section className="hero pat mb-6 grid gap-5 fade-up md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h1 className="t2 text-tx flex items-center gap-2"><BookOpen className="text-pr" /> {t.quran.title}</h1>
          <p className="bd mt-2 max-w-2xl">{t.quran.lead}</p>
        </div>
        <StreakCard {...streak} current={streak.current} onMark={() => streak.mark(current)} fmt={String} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card order-last self-start overflow-hidden lg:order-none lg:sticky lg:top-32">
          <div className="border-b border-bd p-3">
            <p className="tk h mb-2">{t.quran.surahs} · {fmt(114)}</p>
            <label className="relative block">
              <Search size={15} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-mu" />
              <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={t.quran.filter} className="field !py-2 ps-9 text-sm" />
            </label>
          </div>
          <ul className="m-0 flex max-h-[38vh] list-none flex-col overflow-y-auto p-1.5 lg:max-h-[calc(100dvh-260px)]">
            {filtered.map((m) => (
              <li key={m.number}>
                <button
                  onClick={() => go(m.number)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start hover:bg-bg2 ${m.number === current ? 'bg-prs text-pr' : ''}`}
                  aria-current={m.number === current}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-bd bg-bg3 text-xs font-bold">{fmt(m.number)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-quote text-lg leading-6">{m.name.replace(/^سُورَةُ\s*/, '')}</span>
                    <span className="block truncate text-[11px] text-mu">
                      {lang === 'ar' ? `${fmt(m.numberOfAyahs)} ${t.quran.ayahs}` : `${m.englishName} · ${m.numberOfAyahs} ${t.quran.ayahs}`}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section ref={readerRef} className="card min-w-0 scroll-mt-32 p-4 sm:p-8">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-bd pb-4">
            <div>
              <h2 className="font-quote text-3xl m-0 text-pr">{meta?.name ?? '…'}</h2>
              {meta && (
                <p className="m-0 mt-1 text-xs text-mu">
                  {lang !== 'ar' && `${meta.englishName} — ${meta.englishNameTranslation} · `}
                  {meta.revelationType === 'Meccan' ? t.quran.meccan : t.quran.medinan} · {fmt(meta.numberOfAyahs)} {t.quran.ayahs}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {trEdition && (
                <button onClick={() => setShowTr((v) => !v)} className={`btn btn-gh !px-3 !py-2 ${showTr ? '!border-pr !text-pr' : ''}`} aria-pressed={showTr}>
                  <Languages size={16} />
                </button>
              )}
              {shown && (
                <button onClick={() => signThis(shown.ayahs.slice(0, 3).map((a) => a.tr ?? a.text).join(' '))} className="btn btn-gh !px-3 !py-2" title={t.ui.signLang} aria-label={t.ui.signLang}>
                  <Hand size={16} />
                </button>
              )}
            </div>
          </header>

          {state === 'loading' && <p className="py-16 text-center text-mu">{t.quran.loading}</p>}
          {state === 'error' && (
            <div className="emp">
              <p className="bd">{t.quran.error}</p>
              <button onClick={() => setReload((r) => r + 1)} className="btn btn-gh"><RotateCcw size={16} /> {t.quran.retry}</button>
            </div>
          )}

          {state === 'ready' && shown && (
            <>
              {shown.basmala && <p className="mushaf m-0 mb-4 !text-center text-pr">{shown.basmala}</p>}
              {showTr && trEdition ? (
                <ol className="m-0 list-none space-y-5 p-0">
                  {shown.ayahs.map((a) => (
                    <li key={a.n} className="border-b border-bd/60 pb-4 last:border-0">
                      <p className="mushaf m-0 !text-start" style={{ textAlignLast: 'auto' }}>
                        {a.text} <span className="an">{toArabicDigits(a.n)}</span>
                      </p>
                      {a.tr && <p className="bd m-0 mt-1 text-[15px]" dir="ltr">{a.n}. {a.tr}</p>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mushaf m-0">
                  {shown.ayahs.map((a) => (
                    <span key={a.n}>
                      {a.text} <span className="an">{toArabicDigits(a.n)}</span>{' '}
                    </span>
                  ))}
                </p>
              )}
              <div ref={endRef} className="h-px" />
            </>
          )}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-bd pt-4">
            <button onClick={() => go(current - 1)} disabled={current <= 1} className="btn btn-gh disabled:opacity-40">
              <Prev size={16} /> {t.quran.prev}
            </button>
            <button onClick={() => go(current + 1)} disabled={current >= 114} className="btn btn-pr disabled:opacity-40">
              {t.quran.next} <Next size={16} />
            </button>
          </footer>
          <p className="m-0 mt-4 text-[11px] text-mu">{t.quran.sourceNote}</p>
        </section>
      </div>
    </div>
  )
}

function StreakCard({ current, best, totalDays, doneToday, signedIn, onMark, fmt }: { current: number; best: number; totalDays: number; doneToday: boolean; signedIn: boolean; onMark: () => void; fmt: (n: number) => string }) {
  const { t } = usePrefs()
  return (
    <div className="card w-full p-4 md:w-80">
      <div className="flex items-center gap-3">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${current ? 'bg-acs text-warn' : 'bg-bg2 text-mu'}`}>
          <Flame size={26} className={doneToday ? 'animate-pulse' : ''} />
        </span>
        <div className="min-w-0">
          <p className="m-0 text-xs text-mu">{t.quran.streak}</p>
          <p className="m-0 text-2xl font-bold">{fmt(current)} <span className="text-sm font-medium text-mu">{t.quran.days}</span></p>
        </div>
        <div className="ms-auto text-end text-[11px] text-mu">
          <p className="m-0 flex items-center justify-end gap-1"><Trophy size={12} /> {t.quran.best}: <b className="text-tx">{fmt(best)}</b></p>
          <p className="m-0">{t.quran.total}: <b className="text-tx">{fmt(totalDays)}</b></p>
        </div>
      </div>
      <div className="mt-3 flex gap-1" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < Math.min(current, 7) ? 'bg-ac' : 'bg-bd'}`} />
        ))}
      </div>
      {doneToday ? (
        <p className="m-0 mt-3 flex items-start gap-1.5 text-xs font-semibold text-pr"><CheckCircle2 size={15} className="shrink-0" /> {t.quran.marked}</p>
      ) : (
        <>
          <p className="m-0 mt-3 text-xs text-mu">{current ? t.quran.keepGoing : t.quran.startToday}</p>
          <button onClick={onMark} className="btn btn-pr mt-2 w-full !py-2">
            <CheckCircle2 size={16} /> {t.quran.markRead}
          </button>
        </>
      )}
      {!signedIn && <p className="m-0 mt-2 text-[11px] text-mu">{t.quran.guestNote}</p>}
    </div>
  )
}
