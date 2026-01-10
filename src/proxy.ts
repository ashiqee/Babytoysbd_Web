// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Helper to generate unique user ID
function generateUserId() {
  const buffer = new Uint8Array(16);
  crypto.getRandomValues(buffer);
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;
  const hex = Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return [
    hex.substr(0, 8),
    hex.substr(8, 4),
    hex.substr(12, 4),
    hex.substr(16, 4),
    hex.substr(20, 12),
  ].join('-');
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") ?? "http://localhost:8081";

  // Create response object
  const response = NextResponse.next();

  if (!req.cookies.has('FPID')) {
  response.cookies.set({
    name: 'FPID',
    value: generateUserId(),
    maxAge: 63072000,
    path: '/',
    domain: '.babytoysbd.com',
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
  });
}

// Handle preflight OPTIONS
if (req.method === "OPTIONS") {
  const preflight = NextResponse.next();
  preflight.headers.set("Access-Control-Allow-Origin", origin);
  preflight.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  preflight.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  preflight.headers.set("Access-Control-Max-Age", "86400");
  return preflight;
}

  // Normal response
  
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // --- Optional: Auth for protected routes ---
  const isProtectedRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/customer') ||
    pathname.startsWith('/manager');

  if (isProtectedRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.redirect(new URL('/', req.url));

    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    if (pathname.startsWith('/customer') && token.role !== 'customer') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    if (pathname.startsWith('/manager') && token.role !== 'manager') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return response;
}

// ✅ Matcher excludes static assets and API routes
export const config = {
  matcher: ['/api/:path*'],
};
