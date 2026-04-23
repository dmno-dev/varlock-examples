
import { ENV } from 'varlock/env';

export const dynamic = 'force-dynamic';

console.log('log in top of page fn', {
  'varlock env is set?': !!process.env.__VARLOCK_ENV,
  SECRET_FOO: process.env.SECRET_FOO,
  NEXT_PUBLIC_FOO: process.env.NEXT_PUBLIC_FOO,
  PUBLIC_FOO: process.env.PUBLIC_FOO,
  OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE,
  SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env.SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE,
});

export default async function Home({ searchParams }: { searchParams: Promise<{ leak?: string }> }) {
  const { leak } = await searchParams;

  const now = new Date().toISOString();

  console.log('log within page component fn', {
    'varlock env is set?': !!process.env.__VARLOCK_ENV,
    SECRET_FOO: process.env.SECRET_FOO,
    NEXT_PUBLIC_FOO: process.env.NEXT_PUBLIC_FOO,
    PUBLIC_FOO: process.env.PUBLIC_FOO,
    OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE,
    SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env.SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE,
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h2>Dynamic page</h2>
        <p>{ now }</p>
        <ul>
          <li>NEXT_PUBLIC_FOO: {process.env.NEXT_PUBLIC_FOO} / {ENV.NEXT_PUBLIC_FOO}</li>
          <li>PUBLIC_FOO: {process.env.PUBLIC_FOO} / {ENV.PUBLIC_FOO}</li>
          <li>OVERRIDE_FROM_ENV_SPECIFIC_FILE: {process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE} / {ENV.OVERRIDE_FROM_ENV_SPECIFIC_FILE}</li>
        </ul>

        {leak !== undefined && (
          <div>
            <h3>Leaked secrets</h3>
            <ul>
              <li>SECRET_FOO: {process.env.SECRET_FOO} / {ENV.SECRET_FOO}</li>
              <li>SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE: {ENV.SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE}</li>
            </ul>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        testing env vars in nextjs
      </footer>
    </div>
  );
}

