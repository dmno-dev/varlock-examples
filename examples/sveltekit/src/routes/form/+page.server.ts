import type { Actions, PageServerLoad } from './$types';
import { ENV } from 'varlock/env';

export const load: PageServerLoad = () => {
	return { GREETING: ENV.GREETING };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '');
		const leak = form.get('leak') === 'on';

		console.log('form action - SECRET_ITEM (server-only):', ENV.SECRET_ITEM);

		return {
			success: true,
			greeting: `${ENV.GREETING} ${name || 'world'}`,
			// when the leak toggle is on, the action tries to return a sensitive value
			// as part of its result — varlock's response leak scanner should catch it
			...(leak && { leakedSecret: ENV.SECRET_ITEM }),
		};
	},
};
