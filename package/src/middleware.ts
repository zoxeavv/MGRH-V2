import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseMiddlewareClient } from './lib/supabase/server';

const publicPaths = ['/authentication/login', '/authentication/register'];

const protectedPrefix = ['/', '/clients', '/offers', '/templates', '/settings'];

const isProtectedPath = (pathname: string) => {
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return false;
  }

  return protectedPrefix.some((path) => {
    if (path === '/' && pathname === '/') {
      return true;
    }
    if (path === '/') {
      return false;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  });
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/authentication/login';
    redirectUrl.searchParams.set('redirectTo', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/', '/clients/:path*', '/offers/:path*', '/templates/:path*', '/settings/:path*'],
};

