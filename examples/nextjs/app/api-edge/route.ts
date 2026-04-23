import { ENV } from 'varlock/env';

export const runtime = 'edge';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = new URLSearchParams(url.searchParams);

  return Response.json({
    PUBLIC_FOO: ENV.PUBLIC_FOO,
    ...query.get('leak') && {
      SECRET_FOO: ENV.SECRET_FOO,
    },
  });
}
