import { ENV } from 'varlock/env';

export default {
  fetch() {
    console.log('log sensitive item:', ENV.SENSITIVE_ITEM);

    return new Response(JSON.stringify({
      message: `Running in ${navigator.userAgent}!`,
      configItem: ENV.ITEM1,
      // leak: ENV.SENSITIVE_ITEM, // uncomment to trigger leak prevention
    }));
  }
};