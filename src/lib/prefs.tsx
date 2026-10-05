import { createContext, useContext, useEffect, useState } from 'react'
import { dictionaries, dirOf, type Dict, type Lang } from './i18n'

export type Theme = 'light' | 'dark'

type Prefs = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
  dir: 'rtl' | 'ltr'
  theme: Theme
  toggleTheme: () => void
  largeText: boolean
  setLargeText: (v: boolean) => void
  signOpen: boolean
  setSignOpen: (v: boolean) => void
  signText: string | null
  signThis: (text: string) => void
}

const PrefsContext = createContext<Prefs | null>(null)

// Runs before hydration (inlined in <head>) so the saved theme/language apply without a flash.
export const prefsBootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('midad-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.dataset.theme=t;var l=localStorage.getItem('midad-lang')||'ar';d.lang=l;d.dir=l==='ar'?'rtl':'ltr';if(localStorage.getItem('midad-large')==='1')d.classList.add('a11y-large');}catch(e){}})();`

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar')
  const [theme, setTheme] = useState<Theme>('light')
  const [largeText, setLargeTextState] = useState(false)
  const [signOpen, setSignOpen] = useState(false)
  const [signText, setSignText] = useState<string | null>(null)

  useEffect(() => {
    const d = document.documentElement
    const l = (localStorage.getItem('midad-lang') as Lang | null) ?? 'ar'
    if (l in dictionaries) setLangState(l)
    setTheme(d.dataset.theme === 'dark' ? 'dark' : 'light')
    setLargeTextState(d.classList.contains('a11y-large'))
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('midad-lang', l)
    document.documentElement.lang = l
    document.documentElement.dir = dirOf(l)
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('midad-theme', next)
    document.documentElement.dataset.theme = next
  }

  const setLargeText = (v: boolean) => {
    setLargeTextState(v)
    localStorage.setItem('midad-large', v ? '1' : '0')
    document.documentElement.classList.toggle('a11y-large', v)
  }

  const signThis = (text: string) => {
    setSignText(text)
    setSignOpen(true)
  }

  return (
    <PrefsContext.Provider
      value={{
        lang,
        setLang,
        t: dictionaries[lang],
        dir: dirOf(lang),
        theme,
        toggleTheme,
        largeText,
        setLargeText,
        signOpen,
        setSignOpen,
        signText,
        signThis,
      }}
    >
      {children}
    </PrefsContext.Provider>
  )
}

export function usePrefs() {
  const ctx = useContext(PrefsContext)
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider')
  return ctx
}
