import { NextResponse } from "next/server";
import { ENV } from 'varlock/env';


export const runtime = 'nodejs';

console.log('secret foo = '+ENV.SECRET_FOO);
// console.log('secret static = '+ENV.SECRET_STATIC);

export async function GET(request: Request) {
  console.log('secret foo = '+ENV.SECRET_FOO);
  // console.log('secret static = '+ENV.SECRET_STATIC);

  const url = new URL(request.url);
  const query = new URLSearchParams(url.searchParams);

  const r = Response.json({
    PUBLIC_FOO: ENV.PUBLIC_FOO,
    ...query.get('leak') && {
      SECRET_FOO: ENV.SECRET_FOO,
    }
  });

  // console.log(r.constructor);
  // console.log(r.constructor.prototype);
  // console.log(r instanceof Response);
  // console.log(Response, globalThis.Response, (globalThis as any).DmnoPatchedResponse);

  return r;
}
