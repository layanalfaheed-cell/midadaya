import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, Copy, KeyRound } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { PageHeader } from '@/components/ui'

export const Route = createFileRoute('/developers')({ component: Developers })

const endpoints = [
  { m: 'GET', p: '/v1/search?q={query}&status=verified&lang=en', d: { ar: 'بحث دلالي في النصوص', en: 'Semantic search across texts', id: 'Pencarian semantik di seluruh teks' } },
  { m: 'GET', p: '/v1/items/{id}', d: { ar: 'عنصر واحد مع المصدر وحالة التحقق', en: 'A single item with source & verification', id: 'Satu item beserta sumber & verifikasi' } },
  { m: 'GET', p: '/v1/concepts/{id}/graph', d: { ar: 'العلاقات المرتبطة بمفهوم', en: 'Relationships around a concept', id: 'Relasi di sekitar sebuah konsep' } },
  { m: 'GET', p: '/v1/sources', d: { ar: 'قائمة المصادر', en: 'List of sources', id: 'Daftar sumber' } },
  { m: 'POST', p: '/v1/assistant', d: { ar: 'سؤال المساعد مع الإحالات', en: 'Ask the assistant with citations', id: 'Tanya asisten dengan rujukan' } },
] as const

const request = `const res = await fetch(
  "https://api.midad.app/v1/search?q=gentleness&status=verified&lang=en",
  { headers: { Authorization: "Bearer <MIDAD_API_KEY>" } }
)
const { results } = await res.json()`

const response = `{
  "results": [
    {
      "id": "h-015",
      "type": "hadith",
      "text_ar": "إن الله رفيق يحب الرفق في الأمر كله",
      "translation": "Allah is Gentle and loves gentleness in all matters.",
      "source": { "id": "bukhari", "name": "Sahih al-Bukhari", "ref": "6927" },
      "grade": "sahih",
      "verification": {
        "status": "verified",
        "reviewed_by": "reviewer:hadith-17",
        "reviewed_at": "2026-09-12"
      },
      "concepts": ["rahmah", "yusr"]
    }
  ]
}`

function Developers() {
  const { t, lang } = usePrefs()
  return (
    <div>
      <PageHeader title={t.dev.title} lead={t.dev.lead}>
        <div className="steps">
          {t.dev.principles.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <h2 className="t3 mb-4">{t.dev.endpoints}</h2>
          <ul className="m-0 list-none space-y-3 p-0">
            {endpoints.map((e) => (
              <li key={e.p} className="card p-4">
                <div dir="ltr" className="flex items-center gap-3 font-mono text-[13px]">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${e.m === 'GET' ? 'bg-prs text-pr' : 'bg-acs text-ac'}`}>{e.m}</span>
                  <span className="truncate text-tx">{e.p}</span>
                </div>
                <p className="m-0 mt-2 text-sm text-mu">{e.d[lang]}</p>
              </li>
            ))}
          </ul>
          <div className="band mt-6 flex items-start gap-3 text-sm">
            <KeyRound className="shrink-0 text-ac" size={20} />
            <span>{t.dev.keyNote}</span>
          </div>
        </section>

        <section className="space-y-5">
          <Code title={t.dev.example} code={request} />
          <Code title={t.dev.response} code={response} />
        </section>
      </div>
    </div>
  )
}

function Code({ title, code }: { title: string; code: string }) {
  const { t } = usePrefs()
  const [copied, setCopied] = useState(false)
  return (
    <div className="overflow-hidden rounded-2xl border border-bd bg-[#10201a]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-[#a5b1a4]">
        <span className="font-semibold">{title}</span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="flex items-center gap-1.5 hover:text-white"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t.ui.copied : t.ui.copy}
        </button>
      </div>
      <pre dir="ltr" className="m-0 overflow-x-auto p-4 text-[13px] leading-6 text-[#d9e8dc]">
        <code>{code}</code>
      </pre>
    </div>
  )
}
