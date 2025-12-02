import type { PageServerLoad } from './$types';
import { ENV } from 'varlock/env';

export const load: PageServerLoad = () => {
	console.log('secret item:', ENV.SECRET_ITEM);
	console.log('loader fn')
	return {
		message: 'message from server only loader',
		// leak: ENV.SECRET_ITEM,
	};
};