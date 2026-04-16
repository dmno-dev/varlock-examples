import type { PageServerLoad } from './$types';
import { ENV } from 'varlock/env';

export const load: PageServerLoad = ({ url }) => {
	// logging a sensitive value on the server is allowed, but will be redacted in output
	console.log('server loader - SECRET_ITEM:', ENV.SECRET_ITEM);

	const leak = url.searchParams.has('leak');

	return {
		message: 'loaded from +page.server.ts',
		GREETING: ENV.GREETING,
		// adding ?leak will include a sensitive value in the loader's returned data,
		// which is serialized into the page response and caught by varlock's leak scanner
		...(leak && { leakedSecret: ENV.SECRET_ITEM }),
	};
};
