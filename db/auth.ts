import { getUser, type User } from '@netlify/identity'

// The scientific review team mailbox is always an admin; others get the role in the Netlify UI.
export const ADMIN_EMAIL = 'midadsupport@gmail.com'

export const isAdmin = (u: Pick<User, 'email' | 'roles'> | null | undefined) =>
  !!u && (u.roles?.includes('admin') || u.email?.toLowerCase() === ADMIN_EMAIL)

export async function requireAdmin() {
  const user = await getUser()
  return isAdmin(user) ? user : null
}
