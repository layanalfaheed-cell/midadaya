import { useEffect, useMemo, useState } from 'react'
import { FileText, Hand, Pause, Play, RotateCcw, TextSelect, Type, X } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { cdn } from './ui'

const strip = (s: string) => s.replace(/[«»"“”﴿﴾()[\].,،:؛!?]/g, ' ').replace(/[ً-ْٰ]/g, '')

export function SignPanel() {
  const { t, signOpen, setSignOpen, signText, largeText, setLargeText } = usePrefs()
  const [text, setText] = useState(t.sign.sample)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)
  const [idx, setIdx] = useState(0)
  const [letter, setLetter] = useState(0)

  useEffect(() => {
    if (signText) setText(signText)
  }, [signText])
  useEffect(() => {
    if (!signText) setText(t.sign.sample)
  }, [t.sign.sample, signText])

  const words = useMemo(() => strip(text).split(/\s+/).filter(Boolean), [text])

  const restart = () => {
    setIdx(0)
    setLetter(0)
    setPlaying(true)
  }
  useEffect(restart, [text, signText])
  useEffect(() => {
    if (signOpen) restart()
  }, [signOpen])

  // Each word is held long enough to fingerspell its letters one by one, then the next word starts.
  const current = words[idx] ?? ''
  const letters = [...current]
  useEffect(() => {
    if (!signOpen || !playing || words.length === 0) return
    const step = 420 / speed
    const id = setTimeout(() => {
      if (letter < letters.length) setLetter((l) => l + 1)
      else {
        setLetter(0)
        setIdx((i) => (i + 1) % words.length)
      }
    }, letter < letters.length ? step : step * 2)
    return () => clearTimeout(id)
  }, [signOpen, playing, speed, words.length, letter, letters.length])

  const fromPage = () => {
    const main = document.getElementById('main')
    const parts = [...(main?.querySelectorAll('h1, h2, p') ?? [])].map((el) => el.textContent?.trim() ?? '').filter((x) => x.length > 2)
    if (parts.length) setText(parts.slice(0, 6).join('. '))
  }
  const fromSelection = () => {
    const sel = window.getSelection()?.toString().trim()
    if (sel) setText(sel)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSignOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSignOpen])

  if (!signOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal aria-label={t.sign.title}>
      <button className="absolute inset-0 bg-black/45" onClick={() => setSignOpen(false)} aria-label={t.ui.close} />
      <div className="card relative w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-b-none sm:rounded-2xl shadow-2xl fade-up">
        <div className="flex items-center justify-between border-b border-bd px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-prs text-pr">
              <Hand size={20} />
            </span>
            <div>
              <h2 className="t3 m-0">{t.sign.title}</h2>
              <p className="m-0 text-xs text-mu">{t.sign.lead}</p>
            </div>
          </div>
          <button onClick={() => setSignOpen(false)} className="p-2 rounded-lg hover:bg-bg2" aria-label={t.ui.close}>
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[1fr_1.1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-bd bg-acs">
            <img
              src={cdn('/img/signer.png', 640)}
              alt={t.sign.title}
              className={`block w-full aspect-[4/3] md:aspect-square object-cover ${playing ? 'signing' : ''}`}
              style={{ animationDuration: `${1.4 / speed}s` }}
            />
            <div className="absolute top-3 start-3 flex items-center gap-2 rounded-full bg-sf/90 px-3 py-1 text-xs font-semibold text-pr">
              <span className={`h-2 w-2 rounded-full ${playing ? 'bg-ok animate-pulse' : 'bg-mu'}`} />
              {t.sign.playing}
            </div>
            <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/70 px-4 py-2 text-center text-white">
              <span className="text-2xl font-bold" key={idx}>{current}</span>
              <span className="mt-1 block text-[11px] opacity-75">{t.sign.word} {idx + 1} {t.sign.of} {words.length}</span>
            </div>
            <div className="absolute top-3 end-3 grid h-16 w-16 place-items-center rounded-2xl bg-sf/95 text-pr shadow-lg">
              <span key={`${idx}-${letter}`} className="sign-pop flex flex-col items-center">
                <Hand size={26} style={{ transform: `rotate(${((letters[Math.max(0, letter - 1)] ?? ' ').charCodeAt(0) % 7) * 12 - 36}deg)` }} />
                <b className="text-lg leading-none">{letters[Math.max(0, letter - 1)] ?? ''}</b>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-mu mb-2">{t.sign.captions}</p>
              <p className="m-0 flex flex-wrap gap-1 rounded-xl bg-bg2 p-3 leading-8 text-lg">
                {words.map((w, i) => (
                  <button key={i} onClick={() => { setIdx(i); setLetter(0) }} className={`rounded px-1 transition-colors ${i === idx ? 'bg-pr text-sf' : 'hover:bg-bd'}`}>
                    {w}
                  </button>
                ))}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-mu mb-2">{t.sign.fingerspell}</p>
              <div className="flex flex-wrap gap-1.5" dir="auto">
                {letters.map((ch, i) => (
                  <span key={`${idx}-${i}`} className={`flex w-11 flex-col items-center gap-0.5 rounded-lg border py-1.5 transition-colors ${i === letter - 1 ? 'border-pr bg-prs scale-110' : i < letter ? 'border-bd bg-bg3' : 'border-bd bg-bg3 opacity-40'}`}>
                    <Hand size={18} className="text-pr" style={{ transform: `rotate(${(ch.charCodeAt(0) % 7) * 12 - 36}deg)` }} />
                    <span className="text-sm font-bold">{ch}</span>
                  </span>
                ))}
              </div>
            </div>

            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.sign.input} rows={2} className="field resize-none" />
            <div className="flex flex-wrap gap-2">
              <button onClick={fromPage} className="btn btn-gh !px-3 !py-2 text-xs"><FileText size={15} /> {t.sign.usePage}</button>
              <button onClick={fromSelection} className="btn btn-gh !px-3 !py-2 text-xs"><TextSelect size={15} /> {t.sign.useSelection}</button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setPlaying((p) => !p)} className="btn btn-pr">
                {playing ? <Pause size={16} /> : <Play size={16} />}
                {playing ? t.sign.pause : t.sign.play}
              </button>
              <button onClick={restart} className="btn btn-gh !px-3" aria-label={t.sign.restart} title={t.sign.restart}>
                <RotateCcw size={16} />
              </button>
              <label className="flex items-center gap-2 text-sm text-mu">
                {t.sign.speed}
                <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-lg border border-bd bg-sf px-2 py-1 text-tx">
                  {[0.5, 0.75, 1, 1.5].map((s) => (
                    <option key={s} value={s}>{s}×</option>
                  ))}
                </select>
              </label>
              <button onClick={() => setLargeText(!largeText)} className={`btn btn-gh !px-3 ${largeText ? '!border-pr !text-pr' : ''}`} aria-pressed={largeText}>
                <Type size={16} /> {t.sign.largeText}
              </button>
            </div>
            <p className="m-0 text-xs text-mu">{t.sign.hint}</p>
            <p className="m-0 text-xs text-mu">{t.sign.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
