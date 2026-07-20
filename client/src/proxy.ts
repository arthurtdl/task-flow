import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Try's to get the cookie from Refresh Token
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  const { pathname } = request.nextUrl;

  // Cases where user try's to reach the default route
  if (pathname === '/') {
    if (refreshToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is not authenticated, then redirect to login
  if (!refreshToken && pathname.startsWith('/dashboard')) {
    // Redireciona imediatamente para a tela de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated user try's to go to login page, redirect to dashboard
  if (refreshToken && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Affected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
};