import type { UserLoginEvent, UserSignupEvent } from '@netlify/functions'

const ADMIN_EMAIL = 'midadsupport@gmail.com'

// Grants the review-team mailbox the admin role on signup/login; everyone else is a reader.
function withRoles(user: UserSignupEvent['user']) {
  const roles = new Set<string>(user.appMetadata?.roles ?? [])
  if (user.email?.toLowerCase() === ADMIN_EMAIL) roles.add('admin')
  else if (!roles.size) roles.add('reader')
  return { user: { ...user, appMetadata: { ...user.appMetadata, roles: [...roles] } } }
}

export default {
  userSignup: (event: UserSignupEvent) => withRoles(event.user),
  userLogin: (event: UserLoginEvent) => withRoles(event.user),
}
