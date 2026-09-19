import { NextResponse } from 'next/server';

function parseJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('gn_session')?.value;

  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // 1. Unauthenticated users trying to access protected user/admin routes
  if (isDashboardRoute || isAdminRoute) {
    if (!token) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname + search);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }

    // If token exists, check if expired
    const payload = parseJwtPayload(token);
    if (payload && payload.exp && payload.exp * 1000 <= Date.now()) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname + search);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set({
        name: 'gn_session',
        value: '',
        path: '/',
        maxAge: 0,
      });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return response;
    }
  }

  // 2. Authenticated users opening /login or /register
  if (isAuthRoute && token) {
    const payload = parseJwtPayload(token);
    if (payload && (!payload.exp || payload.exp * 1000 > Date.now())) {
      const rawRedirect = request.nextUrl.searchParams.get('redirectTo') || request.nextUrl.searchParams.get('redirect');
      const target =
        rawRedirect && rawRedirect !== '/' && rawRedirect !== '/login' && rawRedirect !== '/register'
          ? rawRedirect
          : '/dashboard';
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // Prevent caching of protected pages
  if (isDashboardRoute || isAdminRoute) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
