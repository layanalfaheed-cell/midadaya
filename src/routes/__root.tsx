import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { PrefsProvider, prefsBootScript } from '@/lib/prefs'
import { AuthProvider } from '@/lib/auth'
import { Header, Footer } from '@/components/Header'
import { SupportWidget } from '@/components/Support'
import { SignPanel } from '@/components/SignPanel'

import '../styles.css'

const siteName = 'مِداد MIDAD — المعرفة الإسلامية الموثوقة'
const siteDescription =
  'MIDAD is a smart infrastructure for trusted Islamic knowledge: semantic search, a knowledge graph, an AI assistant and a unified API — every item linked to its source and verification status.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: siteName },
      { name: 'description', content: siteDescription },
      { name: 'theme-color', content: '#1e5c42' },
      { property: 'og:title', content: siteName },
      { property: 'og:description', content: siteDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/img/midad-logo.jpeg' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'icon', type: 'image/png', href: '/img/midad-mark.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Amiri+Quran&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsBootScript }} />
        <HeadContent />
      </head>
      <body>
        <PrefsProvider>
          <AuthProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 btn btn-pr">
            ↓
          </a>
          <Header />
          <main id="main" className="mx-auto max-w-7xl px-3 pt-5 sm:px-6 sm:pt-8 overflow-x-clip">
            {children}
          </main>
          <Footer />
          <SupportWidget />
          <SignPanel />
          </AuthProvider>
        </PrefsProvider>
        <Scripts />
      </body>
    </html>
  )
}
