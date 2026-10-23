type SupabaseConfig = {
  url: string
  key: string
}

/**
 * Read lazily so `next build` can compile without secrets, and so the error
 * points at the missing variable instead of a cryptic fetch failure.
 */
/**
 * Public origin used for auth redirects. Falls back to the request origin so
 * localhost and preview deployments work without extra configuration.
 */
export function getSiteUrl(fallback: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()

  if (configured) return configured.replace(/\/$/, '')

  return fallback
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and ' +
        'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) ' +
        'to .env.local. See README.md for the Google provider setup.'
    )
  }

  return { url, key }
}
