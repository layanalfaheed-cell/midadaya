import { useState } from 'react'
import { CheckCircle2, Mail, Send, UsersRound } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { SUPPORT_EMAIL, submitForm, useAuth } from '@/lib/auth'

// Shown whenever a question has no verified answer: stores it for the admin and emails the review team.
export function EscalateCard({ question }: { question: string }) {
  const { t, lang } = usePrefs()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const send = async () => {
    setState('sending')
    const contact = email.trim() || user?.email || ''
    const results = await Promise.allSettled([
      fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang, email: contact }),
      }).then((r) => {
        if (!r.ok) throw new Error(String(r.status))
      }),
      submitForm('review-question', { question, lang, email: contact, subject: 'MIDAD · سؤال بلا جواب / Unanswered question' }),
    ])
    setState(results.some((r) => r.status === 'fulfilled') ? 'sent' : 'error')
  }

  return (
    <div className="card border-ac/50 bg-acs/40 p-4 text-start">
      <p className="m-0 flex items-center gap-2 font-bold text-tx">
        <UsersRound size={18} className="text-ac shrink-0" /> {t.escalate.title}
      </p>
      {state === 'sent' ? (
        <p className="m-0 mt-2 flex items-start gap-2 text-sm font-semibold text-pr">
          <CheckCircle2 size={18} className="shrink-0" /> {t.escalate.sent}
        </p>
      ) : (
        <>
          <p className="m-0 mt-1 text-sm text-mu leading-6">{t.escalate.lead}</p>
          <p className="m-0 mt-2 rounded-lg bg-sf px-3 py-2 text-sm">«{question}»</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="mt-3 flex flex-col gap-2 sm:flex-row"
          >
            {!user && (
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.escalate.email} className="field !py-2.5 sm:flex-1" dir="ltr" />
            )}
            <button className="btn btn-pr shrink-0" disabled={state === 'sending'}>
              <Send size={16} className="rtl:-scale-x-100" /> {state === 'sending' ? t.escalate.sending : t.escalate.submit}
            </button>
          </form>
          {state === 'error' && <p className="m-0 mt-2 text-sm text-warn">{t.escalate.error}</p>}
        </>
      )}
      <p className="m-0 mt-3 flex flex-wrap items-center gap-1.5 text-xs text-mu">
        <Mail size={13} /> {t.escalate.team}:
        <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-pr hover:underline" dir="ltr">{SUPPORT_EMAIL}</a>
      </p>
    </div>
  )
}
