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
  const payload = token ? parseJwtPayload(token) : null;
  const isTokenValid = payload && (!payload.exp || payload.exp * 1000 > Date.now());
  const isAdmin = isTokenValid && payload.role === 'ADMIN';

  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isUserAuthRoute = pathname === '/login' || pathname === '/register';

  // 1. Admin Login Route
  if (isAdminLogin) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Admin Routes Protection (/admin, /admin/*)
  if (isAdminRoute) {
    // Unauthenticated -> redirect to /admin/login
    if (!isTokenValid) {
      const redirectUrl = new URL('/admin/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname + search);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res;
    }

    // Authenticated but non-admin -> deny access, send to user dashboard
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
      rawRedirect !== '/register';
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
