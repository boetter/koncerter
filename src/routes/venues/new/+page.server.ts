import { db } from '$lib/db';
import { venues } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	return {};
};

function isValidUrl(s: string) {
	try {
		new URL(s);
		return true;
	} catch {
		return false;
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/login');

		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const address = String(data.get('address') ?? '').trim();
		const websiteUrl = String(data.get('website_url') ?? '').trim() || null;

		if (!name || !address) {
			return fail(400, { error: 'Navn og adresse er påkrævede.', name, address, websiteUrl });
		}
		if (websiteUrl && !isValidUrl(websiteUrl)) {
			return fail(400, { error: 'Hjemmeside-URL er ugyldig.', name, address, websiteUrl });
		}

		const [venue] = await db
			.insert(venues)
			.values({ name, address, websiteUrl, createdBy: locals.user.id })
			.returning();

		redirect(302, `/venues/${venue.id}`);
	}
};
