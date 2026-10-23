import { createClient } from './server'

/**
 * Verify the signed-in user from the access token.
 * Returns null when there is no valid session.
 */
export async function getSessionClaims() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error) return null

  return data?.claims ?? null
}
