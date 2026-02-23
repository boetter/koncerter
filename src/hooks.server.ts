import { getSession } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await getSession(event);
	return resolve(event);
};
