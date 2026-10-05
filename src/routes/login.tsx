import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { AuthError } from '@netlify/identity'
import { CheckCircle2, LogIn, LogOut, ShieldCheck, UserPlus, UserRound } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { ADMIN_EMAIL, useAuth } from '@/lib/auth'
import { Logo } from '@/components/ui'

export const Route = createFileRoute('/login')({
  validateSearch: (s: Record<string, unknown>): { as?: 'admin' } => ({ as: s.as === 'admin' ? 'admin' : undefined }),
  component: Login,
})

type Mode = 'in' | 'up'

function Login() {
  const { t } = usePrefs()
  const { as } = Route.useSearch()
  const { user, isAdmin, login, signup, logout, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('in')
  const [admin, setAdmin] = useState(as === 'admin')
  const [email, setEmail] = useState(as === 'admin' ? ADMIN_EMAIL : '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    try {
      if (mode === 'in') {
        const u = await login(email.trim(), password)
        const adminUser = u.roles?.includes('admin') || u.email?.toLowerCase() === ADMIN_EMAIL
        navigate({ to: adminUser ? '/admin' : '/' })
      } else {
        const u = await signup(email.trim(), password, name.trim())
        if (u.confirmedAt) navigate({ to: '/' })
        else setMsg({ ok: true, text: t.auth.checkEmail })
      }
    } catch (err) {
      setMsg({ ok: false, text: err instanceof AuthError && err.status === 401 ? t.auth.invalid : err instanceof AuthError && err.message ? err.message : t.auth.failed })
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    return (
      <div className="mx-auto max-w-md card p-6 sm:p-8 text-center fade-up">
        <CheckCircle2 size={36} className="mx-auto text-pr" />
        <h1 className="t3 mt-3">{t.auth.welcome} {user.name ?? ''}</h1>
        <p className="m-0 mt-1 text-sm text-mu" dir="ltr">{user.email}</p>
        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${isAdmin ? 'bg-acs text-warn' : 'bg-prs text-pr'}`}>{isAdmin ? t.auth.roleAdmin : t.auth.roleReader}</span>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {isAdmin && <Link to="/admin" className="btn btn-pr"><ShieldCheck size={16} /> {t.nav.admin}</Link>}
          <Link to="/quran" className="btn btn-gh">{t.nav.quran}</Link>
          <button onClick={logout} className="btn btn-gh !text-warn"><LogOut size={16} className="rtl:-scale-x-100" /> {t.auth.logout}</button>
        </div>
      </div>
    )
  }

  const tab = (active: boolean) => `flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${active ? 'bg-pr text-sf' : 'text-mu hover:text-tx'}`

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr] fade-up">
      <section className="card p-5 sm:p-8">
        <div className="mb-5 flex justify-center"><Logo size={48} /></div>
        <h1 className="t2 text-center !text-2xl">{admin ? t.auth.adminTitle : t.auth.title}</h1>
        <p className="bd mt-2 text-center text-[15px]">{admin ? t.auth.adminLead : t.auth.lead}</p>

        {!admin && (
          <div className="mt-6 flex gap-1 rounded-full border border-bd bg-bg2 p-1" role="tablist">
            <button role="tab" aria-selected={mode === 'in'} onClick={() => setMode('in')} className={tab(mode === 'in')}>{t.auth.signIn}</button>
            <button role="tab" aria-selected={mode === 'up'} onClick={() => setMode('up')} className={tab(mode === 'up')}>{t.auth.signUp}</button>
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === 'up' && !admin && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.auth.name} className="field" autoComplete="name" />
          )}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.auth.email} className="field" dir="ltr" autoComplete="email" />
          <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.auth.password} className="field" dir="ltr" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} />
          <button className="btn btn-pr w-full" disabled={busy}>
            {mode === 'in' || admin ? <LogIn size={16} className="rtl:-scale-x-100" /> : <UserPlus size={16} />}
            {mode === 'in' || admin ? t.auth.submitIn : t.auth.submitUp}
          </button>
          {msg && <p className={`m-0 text-sm font-semibold ${msg.ok ? 'text-pr' : 'text-warn'}`}>{msg.text}</p>}
        </form>
      </section>

      <div className="space-y-4">
        <section className="band">
          <h2 className="t3 flex items-center gap-2"><UserRound size={18} className="text-pr" /> {t.auth.guest}</h2>
          <p className="bd mt-2 text-[15px]">{t.auth.guestLead}</p>
          <button
            onClick={() => {
              continueAsGuest()
              navigate({ to: '/' })
            }}
            className="btn btn-gh mt-4 w-full"
          >
            {t.auth.guest}
          </button>
        </section>
        <section className="band">
          <h2 className="t3 flex items-center gap-2"><ShieldCheck size={18} className="text-ac" /> {t.auth.adminTitle}</h2>
          <p className="bd mt-2 text-[15px]">{t.auth.adminLead}</p>
          <button
            onClick={() => {
              setAdmin((a) => !a)
              setMode('in')
              setEmail(admin ? '' : ADMIN_EMAIL)
            }}
            className={`btn mt-4 w-full ${admin ? 'btn-pr' : 'btn-gh'}`}
            aria-pressed={admin}
          >
            <ShieldCheck size={16} /> {admin ? t.auth.signIn : t.auth.adminCta}
          </button>
        </section>
      </div>
    </div>
  )
}
