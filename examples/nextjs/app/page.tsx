
import { ENV } from 'varlock/env';

console.log('log in top of page fn', {
  'varlock env is set?': !!process.env.__VARLOCK_ENV,
  SECRET_FOO: process.env.SECRET_FOO,
  NEXT_PUBLIC_FOO: process.env.NEXT_PUBLIC_FOO,
  PUBLIC_FOO: process.env.PUBLIC_FOO,
  OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE,
  SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE: process.env.SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE,
});

export default function Home() {

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
        <h2>No leak on this page</h2>
        <ul>
          {/* <li>NEXT_PUBLIC_FOO = { process.env.NEXT_PUBLIC_FOO } / { ENV.NEXT_PUBLIC_FOO }</li>
          <li>PUBLIC_FOO = { process.env.PUBLIC_FOO } / { ENV.NEXT_PUBLIC_FOO }</li>
          <li>DEFAULT_FROM_SCHEMA = { process.env.DEFAULT_FROM_SCHEMA } / { ENV.NEXT_PUBLIC_FOO }</li>
          <li>OVERRIDE_FROM_ENV_SPECIFIC_FILE = { process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE } / { ENV.NEXT_PUBLIC_FOO }</li>
          <li>OVERRIDE_FROM_UI = { process.env.OVERRIDE_FROM_UI } / { ENV.NEXT_PUBLIC_FOO }</li> */}

          {/* <li>SECRET_FOO: {process.env.SECRET_FOO} / {ENV.SECRET_FOO}</li> */}
          <li>NEXT_PUBLIC_FOO: {process.env.NEXT_PUBLIC_FOO} / {ENV.NEXT_PUBLIC_FOO}</li>
          <li>PUBLIC_FOO: {process.env.PUBLIC_FOO} / {ENV.PUBLIC_FOO}</li>
          <li>OVERRIDE_FROM_ENV_SPECIFIC_FILE: {process.env.OVERRIDE_FROM_ENV_SPECIFIC_FILE} / {ENV.OVERRIDE_FROM_ENV_SPECIFIC_FILE}</li>
          {/* <li>SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE: {process.env.SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE} / {ENV.SECRET_OVERRIDE_FROM_ENV_SPECIFIC_FILE}</li> */}
        </ul>

        <ul>
          {/* <li>PUBLIC_FOO = { ENV.PUBLIC_FOO }</li> */}
          {/* <li>SECRET_FOO = { ENV.SECRET_FOO }</li> */}
        </ul>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        testing env vars in nextjs
      </footer>
    </div>
  );
}
