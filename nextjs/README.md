# Vinix Canteen (Next.js)

Campus canteen pre-order app. This package is the Next.js app; the product
prototype lives in `../proto`.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication (Supabase + Google + email)

Sign-in uses Supabase Auth. Students can continue with Google or create an
account with an email and password. The session is kept in cookies by
`@supabase/ssr`; `proxy.ts` refreshes it on every request and protects app
routes.

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Copy credentials** from *Project Settings → API* into `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

   Older projects expose an **anon key** instead; set
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` in that case.

3. **Create a Google OAuth client** in Google Cloud Console → *APIs & Services →
   Credentials → Create credentials → OAuth client ID (Web application)*.
   Add this authorized redirect URI:

   ```
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

4. **Enable Google** in the Supabase dashboard → *Authentication → Providers →
   Google*, and paste the client ID and secret.
5. **Add redirect URLs** in *Authentication → URL Configuration*:

   ```
   http://localhost:3000/auth/callback
   https://your-production-domain/auth/callback
   ```

   When the app runs behind a proxy, or the public domain differs from the
   request origin, set `NEXT_PUBLIC_SITE_URL` in `.env.local` to that domain.
   It must match one of the URLs above.

6. **Check email sign-up** in *Authentication → Providers → Email*. It is on by
default. With **Confirm email** enabled, Supabase sends a confirmation link
that returns to `/auth/callback`; with it disabled, sign-up signs the student
in right away.

### How the flow works

- `/login` → **Continue with Google** → Supabase → Google → `/auth/callback`,
  where the code is exchanged for a cookie session.
- `/login` → email + password → **Sign in** calls `signInWithPassword` in the
  browser, so the session cookie is set without a redirect.
- `/login` → **Sign up** calls `signUp` with `emailRedirectTo=/auth/callback`.
  The student confirms the email, then the callback exchanges the code.
- `/` is protected by `proxy.ts` (optimistic redirect) and by
  `getSessionClaims()` (verified token) in the page.
- Sign out is a Server Action in `app/auth/actions.ts`.

Key files:

| File | Purpose |
| --- | --- |
| `lib/supabase/client.ts` | Browser client for Client Components |
| `lib/supabase/server.ts` | Cookie-bound client for Server Components, Actions, Route Handlers |
| `lib/supabase/proxy.ts` | Session refresh + route protection |
| `app/auth/callback/route.ts` | OAuth code exchange |
| `app/login/page.tsx` | Sign-in screen |

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # production server
pnpm lint     # eslint
```
