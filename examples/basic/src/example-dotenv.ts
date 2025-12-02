import 'dotenv/config'; // will be replaced with varlock!

// See the root package.json file to see how it's swapped
// check out https://varlock.dev/guides/migrate-from-dotenv/ for more details

import { logEnv } from './log-env.ts';

if (!process.env.SENSITIVE_ITEM) {
  throw new Error('no env vars have been loaded :( dotenv replacement is not working');
}

logEnv();

process.exit(0);
