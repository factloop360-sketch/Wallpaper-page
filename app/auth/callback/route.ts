import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // Note: In Next.js 15+, cookies() is a promise. Await is safe and future-proof.
    const cookieStore = await cookies() 
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // Catch block handles edge cases where Next.js tries to set a cookie from a server component
              console.error("Cookie setting error:", error)
            }
          },
        },
      }
    )
    
    // Exchange the code for a secure session cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Supabase Code Exchange Error:", error.message)
    }
  }

  // Redirect to an error page or back to login if the code exchange fails
  return NextResponse.redirect(`${origin}/admin-login?error=auth-failed`)
}