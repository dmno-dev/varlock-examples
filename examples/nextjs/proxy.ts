import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ENV } from 'varlock/env';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // add a public env var as a header to prove proxy can access it
  response.headers.set('x-public-foo', ENV.PUBLIC_FOO || '');

  // if ?proxy-leak param is present, also leak a secret via header
  if (request.nextUrl.searchParams.has('proxy-leak')) {
    response.headers.set('x-secret-foo', ENV.SECRET_FOO || '');
  }

  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
