type ClaimsLike = {
  email?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

export function getDisplayName(claims: ClaimsLike): string {
  const metadata = claims.user_metadata ?? {}
  const fullName =
    typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof metadata.name === 'string'
        ? metadata.name
        : null

  return fullName ?? claims.email ?? 'your account'
}

export function getInitial(name: string): string {
  const cleaned = name.replace(/@.*$/, '').trim()
  return (cleaned[0] ?? 'V').toUpperCase()
}

export function getSignInMethod(claims: ClaimsLike): string {
  const provider = claims.app_metadata?.provider

  if (provider === 'google') return 'Google'
  if (provider === 'email') return 'Email'

  return 'Email or Google'
}
