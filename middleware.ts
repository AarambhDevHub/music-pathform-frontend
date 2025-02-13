import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token');

  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if ((pathname === '/' || isPublicPath) && token) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register'],
};
