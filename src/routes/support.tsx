import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle2, Headset, Mail } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { PageHeader } from '@/components/ui'
import { SupportChat } from '@/components/Support'
import { SUPPORT_EMAIL, submitForm } from '@/lib/auth'

export const Route = createFileRoute('/support')({ component: Support })

function Support() {
  const { t } = usePrefs()
  const [sent, setSent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')

  return (
    <div>
      <PageHeader title={t.support.title} lead={t.support.hello} />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="flex items-center gap-3 bg-pr px-5 py-4 text-sf">
            <Headset size={20} />
            <div>
              <p className="m-0 font-bold">{t.support.title}</p>
              <p className="m-0 text-xs opacity-80">{t.support.online}</p>
            </div>
          </div>
          <SupportChat embedded />
        </section>

        <div className="space-y-8">
          <section>
            <h2 className="t3 mb-4">{t.support.faqTitle}</h2>
            <div className="space-y-3">
              {t.support.faq.map((f) => (
                <details key={f.q} className="card group p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold">
                    {f.q}
                    <span className="text-pr text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="bd mt-3 text-[15px]">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="band">
            <h2 className="t3 mb-1 flex items-center gap-2"><Mail size={18} className="text-pr" /> {t.support.contactTitle}</h2>
            <p className="m-0 mb-4 text-sm text-mu">
              {t.support.contactLead}{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-pr hover:underline" dir="ltr">{SUPPORT_EMAIL}</a>
            </p>
            {sent ? (
              <p className="m-0 flex items-center gap-2 font-semibold text-pr">
                <CheckCircle2 size={20} /> {t.support.sent}
              </p>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
                  setState('sending')
                  try {
                    await submitForm('contact', { ...data, subject: `MIDAD · ${data.name ?? ''}` })
                    setSent(true)
                    setState('idle')
                  } catch {
                    setState('error')
                  }
                }}
                className="space-y-3"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p hidden>
                  <input name="bot-field" />
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required name="name" placeholder={t.support.name} className="field" />
                  <input required type="email" name="email" placeholder={t.support.email} className="field" />
                </div>
                <textarea required name="message" rows={4} placeholder={t.support.message} className="field resize-none" />
                <button className="btn btn-pr" disabled={state === 'sending'}>{state === 'sending' ? t.support.sending : t.support.submit}</button>
                {state === 'error' && <p className="m-0 text-sm text-warn">{t.support.sendError}</p>}
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
