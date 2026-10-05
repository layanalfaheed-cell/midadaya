import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Bot, Code2, Database, Hand, Network, Search, ShieldCheck, Sparkles, Users, Workflow, Globe, BookOpen } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { cdn, ItemCard, StatusBadge } from '@/components/ui'
import { exampleQueries, items, stats } from '@/data/fixtures'

export const Route = createFileRoute('/')({ component: Home })

const featureIcons = [Search, Network, Bot, ShieldCheck, Code2, Globe]
const pipelineIcons = [Database, Sparkles, Users, ShieldCheck]

function Home() {
  const { t, lang, dir, signThis } = usePrefs()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight
  const fmt = (v: number) => v.toLocaleString(lang === 'ar' ? 'ar-EG' : lang)
  const featured = ['h-001', 'q-004', 'h-015'].map((id) => items.find((i) => i.id === id)!)

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* Hero */}
      <section className="hero pat grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.25fr_1fr] fade-up">
        <div className="min-w-0">
          <p className="pr0 tk h">
            <span className="h-2 w-2 rounded-full bg-pr" /> {t.home.eyebrow}
          </p>
          <h1 className="t1 text-tx">{t.home.title}</h1>
          <p className="bd mt-5 max-w-xl text-[17px]">{t.home.lead}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              navigate({ to: '/explore', search: { q: q || undefined } })
            }}
            className="mt-7 flex max-w-xl gap-2 rounded-full border border-bd bg-sf p-1.5 focus-within:border-pr focus-within:shadow-[0_0_0_3px_var(--prs)]"
          >
            <Search size={18} className="ms-3 self-center text-mu shrink-0" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.explore.placeholder} className="flex-1 min-w-0 bg-transparent px-1 text-[15px] outline-none placeholder:text-mu" />
            <button className="btn btn-pr">{t.ui.search}</button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {exampleQueries.slice(0, 4).map((e) => (
              <Link key={e.en} to="/explore" search={{ q: e[lang] }} className="rounded-full bg-bg2 px-3 py-1 text-mu hover:text-pr">
                {e[lang]}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/explore" className="btn btn-pr">
              {t.home.ctaExplore} <Arrow size={16} />
            </Link>
            <Link to="/assistant" className="btn btn-gh">
              <Bot size={16} /> {t.home.ctaAsk}
            </Link>
            <Link to="/quran" className="btn btn-gh">
              <BookOpen size={16} /> {t.nav.quran}
            </Link>
          </div>
          <div className="steps">
            {t.home.steps.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="pat tl rad absolute -inset-8" aria-hidden />
          <img src={cdn('/img/midad-logo.png', 720)} alt="MIDAD — مِداد" className="relative mx-auto w-3/4 sm:w-full drop-shadow-xl" width={360} height={356} />
          <div className="card relative mx-auto mt-4 w-full max-w-xs p-4 shadow-xl sm:absolute sm:-bottom-6 sm:start-[-32px] sm:mt-0 sm:w-64">
            <p className="quote m-0 !text-lg !leading-8">«إنما الأعمالُ بالنيات»</p>
            <p className="m-0 mt-1 text-xs text-mu">{t.ui.source}: {lang === 'ar' ? 'صحيح البخاري ١' : 'Sahih al-Bukhari 1'}</p>
            <div className="mt-2">
              <StatusBadge status="verified" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="band grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          [stats.items, t.home.statItems],
          [stats.sources, t.home.statSources],
          [stats.concepts, t.home.statConcepts],
          [stats.reviewers, t.home.statReviewers],
        ].map(([v, label]) => (
          <div key={label as string} className="text-center">
            <p className="m-0 text-3xl font-bold text-pr">{fmt(v as number)}+</p>
            <p className="m-0 mt-1 text-sm text-mu">{label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <div className="max-w-2xl mb-10">
          <h2 className="t2">{t.home.featuresTitle}</h2>
          <p className="bd mt-3">{t.home.featuresLead}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.home.f.map((f, i) => {
            const Icon = featureIcons[i]
            return (
              <div key={f.t} className="card p-6 hover:-translate-y-0.5 hover:border-pr/50 transition-all">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-prs text-pr">
                  <Icon size={21} />
                </span>
                <h3 className="t3">{f.t}</h3>
                <p className="bd mt-2 text-[15px]">{f.d}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pipeline */}
      <section className="hero pat tl">
        <div className="flex items-center gap-3 mb-8">
          <Workflow className="text-pr" />
          <h2 className="t2">{t.home.pipelineTitle}</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-4 list-none p-0 m-0">
          {t.home.pipeline.map((p, i) => {
            const Icon = pipelineIcons[i]
            return (
              <li key={p.t} className="card relative p-5">
                <span className="absolute top-4 end-4 text-4xl font-bold text-bd">{fmt(i + 1)}</span>
                <Icon className="text-ac mb-3" size={24} />
                <h3 className="t3">{p.t}</h3>
                <p className="bd mt-1 text-sm leading-6">{p.d}</p>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Featured */}
      <section>
        <div className="tbr">
          <div>
            <h2 className="t2">{t.home.featuredTitle}</h2>
            <p className="bd mt-2">{t.home.featuredLead}</p>
          </div>
          <Link to="/explore" className="btn btn-gh shrink-0">
            {t.home.seeAll} <Arrow size={16} />
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((it) => (
            <ItemCard key={it.id} item={it} compact />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="rounded-2xl bg-pr p-8 sm:p-12 text-center text-sf pat">
        <ShieldCheck size={36} className="mx-auto mb-4 opacity-90" />
        <h2 className="t2">{t.home.trustTitle}</h2>
        <p className="mx-auto mt-3 max-w-2xl opacity-85 leading-7">{t.home.trustLead}</p>
        <p className="quote mx-auto mt-6 max-w-2xl !text-2xl" dir={lang === 'ar' ? 'rtl' : 'ltr'}>{t.home.ayahTrust}</p>
        <p className="m-0 text-sm opacity-75">{t.home.ayahTrustRef}</p>
      </section>

      {/* Developers + Accessibility */}
      <section className="tr">
        <div className="card p-6 sm:p-8 flex flex-col">
          <Code2 className="text-pr mb-3" />
          <h2 className="t3 !text-2xl">{t.home.devTitle}</h2>
          <p className="bd mt-2">{t.home.devLead}</p>
          <pre dir="ltr" className="mt-5 overflow-x-auto rounded-xl bg-[#10201a] p-4 text-[13px] leading-6 text-[#d9e8dc]">
            <code>
              <span className="text-[#d6b67b]">curl</span> https://api.midad.app/v1/search \{'\n'}
              {'  '}-d <span className="text-[#94d4b0]">'{'{'}"q":"الرفق","status":"verified"{'}'}'</span>
            </code>
          </pre>
          <Link to="/developers" className="btn btn-gh mt-5 self-start">
            {t.home.devCta} <Arrow size={16} />
          </Link>
        </div>
        <div className="card overflow-hidden flex flex-col sm:flex-row">
          <img src={cdn('/img/signer.png', 480)} alt="" className="w-full sm:w-2/5 object-cover aspect-square sm:aspect-auto" loading="lazy" />
          <div className="p-6 sm:p-8 flex flex-col">
            <Hand className="text-pr mb-3" />
            <h2 className="t3 !text-2xl">{t.home.a11yTitle}</h2>
            <p className="bd mt-2">{t.home.a11yLead}</p>
            <button onClick={() => signThis(t.sign.sample)} className="btn btn-pr mt-6 self-start">
              <Hand size={16} /> {t.home.a11yCta}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
