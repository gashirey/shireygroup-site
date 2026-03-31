import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isOpsRoute = req.nextUrl.pathname.startsWith('/ops')
  const isLoginPage = req.nextUrl.pathname === '/ops/login'

  if (isOpsRoute && !isLoginPage && !user) {
    return NextResponse.redirect(new URL('/ops/login', req.url))
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL('/ops/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/ops/:path*'],
}
