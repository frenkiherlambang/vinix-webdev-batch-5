import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig } from './env'

const AUTH_PATHS = ['/login', '/auth']

function isPublicPath(pathname: string) {
  return AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

function redirectWithSession(
  request: NextRequest,
  sessionResponse: NextResponse,
  pathname: string,
  search?: string
) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = search ?? ''

  const response = NextResponse.redirect(url)

  sessionResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie)
  })

  for (const header of ['cache-control', 'expires', 'pragma']) {
    const value = sessionResponse.headers.get(header)
    if (value) response.headers.set(header, value)
  }

  return response
}

/**
 * Refresh the Supabase session on every request and apply optimistic route
 * protection. Pages still verify the user themselves.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, key } = getSupabaseConfig()

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({ request })

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })

        Object.entries(headers).forEach(([header, headerValue]) => {
          response.headers.set(header, headerValue)
        })
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  const { pathname, search } = request.nextUrl

  if (!claims && !isPublicPath(pathname)) {
    const next = search ? `${pathname}${search}` : pathname
    return redirectWithSession(
      request,
      response,
      '/login',
      `?next=${encodeURIComponent(next)}`
    )
  }

  if (claims && pathname === '/login') {
    return redirectWithSession(request, response, '/')
  }

  return response
}
