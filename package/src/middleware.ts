import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/ssr';
import { clientEnv } from '@/lib/env/client';

const DASHBOARD_PREFIXES = ['/clients', '/offers', '/templates', '/settings'];

const isProtectedPath = (pathname: string) =>
  pathname === '/' || DASHBOARD_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/authentication/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && pathname.startsWith('/authentication')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/clients/:path*', '/offers/:path*', '/templates/:path*', '/settings/:path*'],
};
