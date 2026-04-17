// you DO NOT need the @varlock/cloudflare-integration/init import

// USE THIS!
import { ENV } from 'varlock/env';

// still works, but not recommended
import { env } from 'cloudflare:workers';

export default {
  fetch(request: Request) {
    const url = new URL(request.url);
    const triggerLeak = url.searchParams.has('leak');

    // test log redaction
    console.log('Should be redacted:', ENV.SENSITIVE_ITEM);

    return new Response(JSON.stringify({
      message: `Varlock example with Cloudflare workers + vite`,

      'Public item': {
        'ENV.ITEM1 - using varlock (recommended)': ENV.ITEM1,
        'env.ITEM1 - using CF env (still works)': env.ITEM1,
      },
      'Non existant key': {
        'ENV.BAD_KEY (varlock)': '✅ would trigger an error',
        
        'env.BAD_KEY (cf)': '⛔️ silently returns undefined',
      },

      'Sensitive key': {
        'ENV.SENSITIVE_ITEM (varlock)': '✅ triggers leak prevention',
        
        // varlock catches it even if not using ENV, so we can't show it, but it would leak
        'env.SENSITIVE_ITEM (cf)': '⛔️ leaks!',

        // add ?leak to the URL to trigger leak prevention
        ...(triggerLeak && { leak: ENV.SENSITIVE_ITEM }),
      },

      'Auto-detected vars': {
        VARLOCK_ENV: ENV.VARLOCK_ENV || '-empty-',
        VARLOCK_IS_CI: ENV.VARLOCK_IS_CI || '-empty-',
        VARLOCK_BRANCH: ENV.VARLOCK_BRANCH || '-empty-',
        VARLOCK_PR_NUMBER: ENV.VARLOCK_PR_NUMBER || '-empty-',
        VARLOCK_COMMIT_SHA: ENV.VARLOCK_COMMIT_SHA || '-empty-',
        VARLOCK_COMMIT_SHA_SHORT: ENV.VARLOCK_COMMIT_SHA_SHORT || '-empty-',
        VARLOCK_PLATFORM: ENV.VARLOCK_PLATFORM || '-empty-',
        VARLOCK_BUILD_URL: ENV.VARLOCK_BUILD_URL || '-empty-',
        VARLOCK_REPO: ENV.VARLOCK_REPO || '-empty-',
      },
      

      links: {
        'go here to test leak': `${request.url}?leak`,
      },


      
      
    }));
  }
};