import { Link } from '@tanstack/react-router'
import { Hand, Menu, Moon, Sun, X, Languages } from 'lucide-react'
import { useState } from 'react'
import { usePrefs } from '@/lib/prefs'
import { LANGS, type Lang } from '@/lib/i18n'
import { Logo } from './ui'

const links = [
  { to: '/explore', key: 'explore' },
  { to: '/graph', key: 'graph' },
  { to: '/assistant', key: 'assistant' },
  { to: '/sources', key: 'sources' },
  { to: '/review', key: 'review' },
  { to: '/developers', key: 'developers' },
  { to: '/support', key: 'support' },
] as const

export function Header() {
  const { t, lang, setLang, theme, toggleTheme, setSignOpen } = usePrefs()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-bd bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden xl:flex items-center gap-1" aria-label="main">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-mu hover:text-pr hover:bg-bg2"
              activeProps={{ className: '!text-pr bg-prs' }}
            >
              {t.nav[l.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setSignOpen(true)} className="btn btn-gh !px-3 !py-2" aria-label={t.ui.signLang} title={t.ui.signLang}>
            <Hand size={17} />
            <span className="hidden md:inline">{t.ui.signLang}</span>
          </button>

          <label className="relative flex items-center">
            <span className="sr-only">{t.ui.language}</span>
            <Languages size={16} className="pointer-events-none absolute start-3 text-mu" aria-hidden />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="appearance-none rounded-full border border-bd bg-sf ps-9 pe-3 py-2 text-sm font-semibold text-tx cursor-pointer hover:border-pr"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.short} · {l.label}
                </option>
              ))}
            </select>
          </label>

          <button onClick={toggleTheme} className="btn btn-gh !p-2.5" aria-label={t.ui.theme} title={theme === 'dark' ? t.ui.light : t.ui.dark}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button onClick={() => setOpen(true)} className="xl:hidden btn btn-gh !p-2.5" aria-label={t.ui.menu}>
            <Menu size={17} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal>
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-label={t.ui.close} />
          <aside className="absolute inset-y-0 end-0 w-72 bg-sf border-s border-bd p-5 flex flex-col gap-1 fade-up">
            <div className="flex items-center justify-between mb-4">
              <span className="t3">{t.ui.menu}</span>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-bg2" aria-label={t.ui.close}>
                <X size={18} />
              </button>
            </div>
            <Link to="/" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-medium hover:bg-bg2" activeOptions={{ exact: true }} activeProps={{ className: 'bg-prs text-pr' }}>
              {t.nav.home}
            </Link>
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-medium hover:bg-bg2" activeProps={{ className: 'bg-prs text-pr' }}>
                {t.nav[l.key]}
              </Link>
            ))}
          </aside>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  const { t } = usePrefs()
  return (
    <footer className="mt-24 border-t border-bd bg-bg2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo size={44} />
          <p className="bd max-w-md text-sm">{t.footer.about}</p>
        </div>
        <div>
          <h3 className="t3 mb-3 text-base">{t.footer.product}</h3>
          <ul className="space-y-2 text-sm text-mu list-none p-0 m-0">
            {links.slice(0, 5).map((l) => (
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
          </ul>
        </div>
      </div>
      <div className="border-t border-bd py-5 text-center text-xs text-mu">
        © {new Date().getFullYear()} {t.brand} · {t.footer.rights}
      </div>
    </footer>
  )
}
