import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Try's to get the cookie from Refresh Token
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const userRoleCookie = request.cookies.get('userRole')?.value;
  
  const { pathname } = request.nextUrl;
  const role = (userRoleCookie || 'user').toLowerCase();


  // Cases where user try's to reach the default route
  if (pathname === '/') {
    if (refreshToken) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is not authenticated, then redirect to login
  if (!refreshToken && pathname.startsWith('/dashboard')) {
    // Redireciona imediatamente para a tela de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based route protection and route completion within dashboard
  if (refreshToken && pathname.startsWith('/dashboard')) {
    if (role === 'user' && pathname.startsWith('/dashboard/admin')) {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  // If authenticated user try's to go to login page, redirect to dashboard
  if (refreshToken && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return NextResponse.next();
}

// Affected routes
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
};