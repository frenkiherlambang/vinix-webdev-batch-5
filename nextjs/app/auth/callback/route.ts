import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/supabase/env'

function safeRedirectPath(next: string | null, origin: string) {
  if (!next) return '/'

  try {
    const url = new URL(next, origin)
    if (url.origin !== origin) return '/'

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const siteUrl = getSiteUrl(origin)
  const code = searchParams.get('code')
  const next = safeRedirectPath(searchParams.get('next'), origin)

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=auth`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${siteUrl}/login?error=auth`)
  }

  return NextResponse.redirect(`${siteUrl}${next}`)
}
