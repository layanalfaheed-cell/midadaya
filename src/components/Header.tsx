import { Link } from '@tanstack/react-router'
import { Hand, Menu, Moon, Sun, X, Languages, LogIn, LogOut, ShieldCheck, UserRound, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePrefs } from '@/lib/prefs'
import { SUPPORT_EMAIL, useAuth } from '@/lib/auth'
import { LANGS, type Lang } from '@/lib/i18n'
import { Logo } from './ui'

const links = [
  { to: '/', key: 'home' },
  { to: '/explore', key: 'explore' },
  { to: '/quran', key: 'quran' },
  { to: '/assistant', key: 'assistant' },
  { to: '/graph', key: 'graph' },
  { to: '/sources', key: 'sources' },
  { to: '/developers', key: 'developers' },
  { to: '/support', key: 'support' },
] as const

const adminLinks = [
  { to: '/admin', key: 'admin' },
  { to: '/review', key: 'review' },
] as const

// Opens the interpreter with whatever the reader has selected on the page, if anything.
function useSignButton() {
  const { signThis, setSignOpen } = usePrefs()
  return () => {
    const sel = typeof window !== 'undefined' ? window.getSelection()?.toString().trim() : ''
    if (sel) signThis(sel)
    else setSignOpen(true)
  }
}

function LangSelect({ full = false }: { full?: boolean }) {
  const { t, lang, setLang } = usePrefs()
  return (
    <label className={`relative flex items-center ${full ? 'w-full' : ''}`}>
      <span className="sr-only">{t.ui.language}</span>
      <Languages size={16} className="pointer-events-none absolute start-3 text-mu" aria-hidden />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className={`appearance-none rounded-full border border-bd bg-sf ps-9 pe-3 py-2 text-sm font-semibold text-tx cursor-pointer hover:border-pr ${full ? 'w-full' : ''}`}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {full ? `${l.short} · ${l.label}` : l.short}
          </option>
        ))}
      </select>
    </label>
  )
}

function AccountMenu() {
  const { t } = usePrefs()
  const { user, guest, isAdmin, logout, ready } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  if (!ready) return <span className="h-9 w-9 rounded-full bg-bg2" aria-hidden />

  if (!user) {
    return (
      <Link to="/login" className="btn btn-gh !px-3 !py-2" title={t.nav.login}>
        {guest ? <UserRound size={17} /> : <LogIn size={17} className="rtl:-scale-x-100" />}
        <span className="hidden sm:inline">{guest ? t.auth.guestBadge : t.nav.login}</span>
      </Link>
    )
  }

  const label = user.name || user.email || ''
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full border border-bd bg-sf p-1 pe-1 sm:pe-3 hover:border-pr" aria-expanded={open} aria-haspopup="menu">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-pr text-xs font-bold text-sf uppercase">{label.slice(0, 1)}</span>
        <span className="hidden sm:inline text-sm font-semibold max-w-[110px] truncate">{isAdmin ? t.auth.roleAdmin : label}</span>
      </button>
      {open && (
        <div role="menu" className="card absolute end-0 top-full mt-2 w-64 p-2 shadow-xl fade-up z-50">
          <div className="px-3 py-2">
            <p className="m-0 text-xs text-mu">{t.auth.signedInAs}</p>
            <p className="m-0 truncate text-sm font-semibold" dir="ltr">{user.email}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${isAdmin ? 'bg-acs text-warn' : 'bg-prs text-pr'}`}>
              {isAdmin ? t.auth.roleAdmin : t.auth.roleReader}
            </span>
          </div>
          {isAdmin &&
            adminLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-bg2">
                <ShieldCheck size={16} className="text-pr" /> {t.nav[l.key]}
              </Link>
            ))}
          <button
            onClick={() => {
              setOpen(false)
              logout()
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-warn hover:bg-bg2"
          >
            <LogOut size={16} className="rtl:-scale-x-100" /> {t.auth.logout}
          </button>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const { t, theme, toggleTheme } = usePrefs()
  const { isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const openSign = useSignButton()
  const nav = isAdmin ? [...links, ...adminLinks] : links

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-bd bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        <Logo />

        <div className="flex items-center gap-1.5">
          <button onClick={openSign} className="btn btn-gh !px-3 !py-2" aria-label={t.ui.signLang} title={t.ui.signLang}>
            <Hand size={17} />
            <span className="hidden lg:inline">{t.ui.signLang}</span>
          </button>
          <div className="hidden md:block">
            <LangSelect />
          </div>
          <button onClick={toggleTheme} className="hidden md:inline-flex btn btn-gh !p-2.5" aria-label={t.ui.theme} title={theme === 'dark' ? t.ui.light : t.ui.dark}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <AccountMenu />
          <button onClick={() => setOpen(true)} className="md:hidden btn btn-gh !p-2.5" aria-label={t.ui.menu} aria-expanded={open}>
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Menu bar (tablet & desktop) */}
      <nav className="hidden md:block border-t border-bd/70 bg-sf/60" aria-label="main">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none]">
          {nav.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === '/' }}
              className="relative shrink-0 whitespace-nowrap px-3 py-2.5 text-sm font-medium text-mu hover:text-pr after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-transparent"
              activeProps={{ className: '!text-pr font-semibold after:!bg-pr' }}
            >
              {t.nav[l.key]}
            </Link>
          ))}
        </div>
      </nav>

      {/* Portalled: the header's backdrop-filter would otherwise become the containing block for this fixed drawer. */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal aria-label={t.ui.menu}>
          <button className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} aria-label={t.ui.close} />
          <aside className="absolute inset-y-0 end-0 flex w-[min(86vw,340px)] flex-col bg-sf border-s border-bd shadow-2xl fade-up">
            <div className="flex items-center justify-between border-b border-bd px-4 py-3">
              <Logo size={34} />
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-bg2" aria-label={t.ui.close}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3" aria-label="mobile">
              {nav.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: l.to === '/' }}
                  className="flex items-center rounded-xl px-4 py-3 font-medium hover:bg-bg2"
                  activeProps={{ className: 'bg-prs text-pr font-semibold' }}
                >
                  {t.nav[l.key]}
                </Link>
              ))}
            </nav>
            <div className="space-y-3 border-t border-bd p-4">
              <LangSelect full />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={toggleTheme} className="btn btn-gh !px-3">
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? t.ui.light : t.ui.dark}
                </button>
                <button
                  onClick={() => {
                    setOpen(false)
                    openSign()
                  }}
                  className="btn btn-gh !px-3"
                >
                  <Hand size={16} /> {t.ui.signLang}
                </button>
              </div>
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="btn btn-gh w-full !text-warn"
                >
                  <LogOut size={16} className="rtl:-scale-x-100" /> {t.auth.logout}
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn btn-pr w-full">
                  <LogIn size={16} className="rtl:-scale-x-100" /> {t.nav.login}
                </Link>
              )}
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </header>
  )
}

export function Footer() {
  const { t } = usePrefs()
  return (
    <footer className="mt-24 border-t border-bd bg-bg2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Logo size={44} />
          <p className="bd max-w-md text-sm">{t.footer.about}</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center gap-2 text-sm font-semibold text-pr hover:underline" dir="ltr">
            <Mail size={15} /> {SUPPORT_EMAIL}
          </a>
        </div>
        <div>
          <h3 className="t3 mb-3 text-base">{t.footer.product}</h3>
          <ul className="space-y-2 text-sm text-mu list-none p-0 m-0">
            {links.slice(1, 6).map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-pr">{t.nav[l.key]}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="t3 mb-3 text-base">{t.footer.help}</h3>
          <ul className="space-y-2 text-sm text-mu list-none p-0 m-0">
            <li><Link to="/developers" className="hover:text-pr">{t.nav.developers}</Link></li>
            <li><Link to="/support" className="hover:text-pr">{t.nav.support}</Link></li>
            <li><Link to="/login" className="hover:text-pr">{t.nav.login}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bd py-5 text-center text-xs text-mu">
        © {new Date().getFullYear()} {t.brand} · {t.footer.rights}
      </div>
    </footer>
  )
}
