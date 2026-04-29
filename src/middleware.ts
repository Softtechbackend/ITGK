import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register'];
  
  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Protected routes - check for authentication
  const token = request.cookies.get('sb-auth-token')?.value;
  
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/applications') || pathname.startsWith('/analytics') || pathname.startsWith('/referrals'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
