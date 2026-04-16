import type { RequestHandler } from './$types';
import { ENV } from 'varlock/env';

export const GET: RequestHandler = ({ url }) => {
	// logging a sensitive value on the server is allowed, output will be redacted
	console.log('api route - SECRET_ITEM:', ENV.SECRET_ITEM);

	const leak = url.searchParams.has('leak');

	return Response.json({
		GREETING: ENV.GREETING,
		// adding ?leak will include a sensitive value in the response body,
		// which varlock's response leak scanner should catch
		...(leak && { leakedSecret: ENV.SECRET_ITEM }),
	});
};
