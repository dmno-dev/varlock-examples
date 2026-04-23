'use client';

import { ENV } from 'varlock/env';

export default function ClientLeakPage() {
  return (
    <main>
      <h2>Testing CLIENT leak detection</h2>
      <p>This page should fail to build - the page content includes a sensitive config item</p>

      *DISABLED TO ALLOW BUILD TO SUCCEED*
      {/* <pre>{ ENV.SECRET_FOO }</pre> */}
    </main>
  );
}
