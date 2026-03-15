// =============================================================================
// VRIKSHAM - Next.js Middleware
// =============================================================================
// Route protection middleware that runs on the Edge runtime.
// Redirects unauthenticated users away from protected routes and
// authenticated users away from auth-only pages (login, register).
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

// -----------------------------------------------------------------------------
// Route Definitions
// -----------------------------------------------------------------------------

/** Routes that require an authenticated session (token cookie present). */
const protectedRoutes = ['/dashboard'];

/** Routes only accessible to non-authenticated users (redirects to dashboard if logged in). */
const authRoutes = ['/login', '/register', '/forgot-password'];

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const token = request.cookies.get('vriksham-token')?.value;
  const { pathname } = request.nextUrl;

  // -------------------------------------------------------------------------
  // Authenticated user visiting auth pages -> redirect to dashboard
  // -------------------------------------------------------------------------
  if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url));
  }

  // -------------------------------------------------------------------------
  // Unauthenticated user visiting protected pages -> redirect to login
  // -------------------------------------------------------------------------
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // -------------------------------------------------------------------------
  // Add security headers to all matched routes
  // -------------------------------------------------------------------------
  const response = NextResponse.next();

  // Prevent MIME-type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Enable XSS protection in older browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// -----------------------------------------------------------------------------
// Matcher Configuration
// -----------------------------------------------------------------------------
// Only run middleware on these paths for optimal performance.
// Static assets, images, and _next internals are excluded by default.
// -----------------------------------------------------------------------------

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password'],
};
