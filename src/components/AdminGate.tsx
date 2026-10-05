import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { usePrefs } from '@/lib/prefs'
import { useAuth } from '@/lib/auth'

// UI gate for admin pages; the /api endpoints enforce the same rule server-side.
export function AdminGate({ children }: { children: React.ReactNode }) {
  const { t } = usePrefs()
  const { ready, isAdmin } = useAuth()
  if (!ready) return <p className="py-20 text-center text-mu">…</p>
  if (!isAdmin)
    return (
      <div className="emp mx-auto max-w-lg fade-up">
        <Lock className="mx-auto mb-3 text-pr" size={32} />
        <p className="t3 mb-2">{t.auth.adminOnly}</p>
        <p className="bd">{t.auth.adminOnlyLead}</p>
        <Link to="/login" search={{ as: 'admin' }} className="btn btn-pr">{t.auth.goLogin}</Link>
      </div>
    )
  return <>{children}</>
}
