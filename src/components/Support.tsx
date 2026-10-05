import { useEffect, useRef, useState } from 'react'
import { Headset, Send, X } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { autoReply } from '@/lib/support'

type Msg = { from: 'user' | 'bot'; text: string }

export function SupportChat({ embedded = false }: { embedded?: boolean }) {
  const { t } = usePrefs()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [msgs, typing])

  const send = (text: string) => {
    const v = text.trim()
    if (!v) return
    setMsgs((m) => [...m, { from: 'user', text: v }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setMsgs((m) => [...m, { from: 'bot', text: autoReply(v, t) }])
      setTyping(false)
    }, 700)
  }

  return (
    <div className={`flex flex-col ${embedded ? 'h-[520px]' : 'h-[min(460px,65dvh)]'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <Bubble from="bot" text={t.support.hello} />
        {msgs.map((m, i) => (
          <Bubble key={i} {...m} />
        ))}
        {typing && (
          <div className="flex gap-1 px-4 py-3 w-16 rounded-2xl bg-bg2" aria-label="…">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 rounded-full bg-mu animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-2">
        {t.support.quick.map((q) => (
          <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-bd bg-bg3 px-3 py-1 text-xs text-tx hover:border-pr hover:text-pr">
            {q}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex gap-2 border-t border-bd p-3"
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.support.placeholder} className="field !py-2.5" />
        <button type="submit" className="btn btn-pr !px-4" aria-label={t.ui.send}>
          <Send size={16} className="rtl:-scale-x-100" />
        </button>
      </form>
    </div>
  )
}

function Bubble({ from, text }: Msg) {
  const mine = from === 'user'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <p className={`m-0 max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${mine ? 'bg-pr text-sf' : 'bg-bg2 text-tx'}`}>{text}</p>
    </div>
  )
}

export function SupportWidget() {
  const { t } = usePrefs()
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-4 end-4 z-40 sm:bottom-5 sm:end-5">
      {open && (
        <div className="card mb-3 w-[min(calc(100vw-2rem),380px)] overflow-hidden shadow-2xl fade-up">
          <div className="flex items-center justify-between bg-pr px-4 py-3 text-sf">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sf/15">
                <Headset size={18} />
              </span>
              <div>
                <p className="m-0 text-sm font-bold">{t.support.title}</p>
                <p className="m-0 text-[11px] opacity-80">{t.support.online}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-sf/15" aria-label={t.ui.close}>
              <X size={18} />
            </button>
          </div>
          <SupportChat />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="ms-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-pr text-sf shadow-xl hover:bg-pr2 transition-colors"
        aria-label={t.support.title}
        title={t.support.title}
      >
        {open ? <X size={22} /> : <Headset size={22} />}
      </button>
    </div>
  )
}
