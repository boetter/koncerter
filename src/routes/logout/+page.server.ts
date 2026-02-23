import { deleteSession } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		await deleteSession(event);
		redirect(302, '/');
	}
};
