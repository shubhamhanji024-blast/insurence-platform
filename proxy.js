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

export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('gn_session')?.value;
  const payload = token ? parseJwtPayload(token) : null;
  const isTokenValid = payload && (!payload.exp || payload.exp * 1000 > Date.now());
  const userRole = (payload?.role || '').toUpperCase();
  const isAdmin = isTokenValid && userRole === 'ADMIN';

  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isUserAuthRoute = pathname === '/login' || pathname === '/register';

  // 1. Direct /admin/login access -> Unified /login redirect
  if (isAdminLogin) {
    const target = isAdmin ? '/admin/dashboard' : '/login';
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 2. Admin Routes Protection (/admin, /admin/*)
  if (isAdminRoute) {
    // Unauthenticated -> redirect to single /login portal
    if (!isTokenValid) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname + search);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res;
    }

    // Authenticated but non-admin -> deny access, send to user dashboard
    if (!isAdmin) {
      const res = NextResponse.redirect(new URL('/dashboard', request.url));
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res;
    }

    // Admin root -> redirect to /admin/dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res;
  }

  // 3. User Dashboard Protection (/dashboard, /dashboard/*)
  if (isDashboardRoute) {
    if (!isTokenValid) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname + search);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res;
    }

    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res;
  }

  // 4. Authenticated users opening /login or /register
  if (isUserAuthRoute && isTokenValid) {
    const rawRedirect = request.nextUrl.searchParams.get('redirectTo') || request.nextUrl.searchParams.get('redirect');
    // Open redirect prevention: only allow same-origin relative paths (must start with /)
    const isSafeRedirect =
      rawRedirect &&
      rawRedirect.startsWith('/') &&
      !rawRedirect.startsWith('//') &&
      rawRedirect !== '/login' &&
      rawRedirect !== '/register' &&
      rawRedirect !== '/admin/login';
    const target = isSafeRedirect
      ? rawRedirect
      : isAdmin
      ? '/admin/dashboard'
      : '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/admin',
    '/login',
    '/register',
  ],
};

export default proxy;
