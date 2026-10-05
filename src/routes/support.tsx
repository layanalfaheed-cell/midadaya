import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle2, Headset, Mail } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { PageHeader } from '@/components/ui'
import { SupportChat } from '@/components/Support'

export const Route = createFileRoute('/support')({ component: Support })

function Support() {
  const { t } = usePrefs()
  const [sent, setSent] = useState(false)

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
            <h2 className="t3 mb-4 flex items-center gap-2"><Mail size={18} className="text-pr" /> {t.support.contactTitle}</h2>
            {sent ? (
              <p className="m-0 flex items-center gap-2 font-semibold text-pr">
                <CheckCircle2 size={20} /> {t.support.sent}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSent(true)
                }}
                className="space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required name="name" placeholder={t.support.name} className="field" />
                  <input required type="email" name="email" placeholder={t.support.email} className="field" />
                </div>
                <textarea required name="message" rows={4} placeholder={t.support.message} className="field resize-none" />
                <button className="btn btn-pr">{t.support.submit}</button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
