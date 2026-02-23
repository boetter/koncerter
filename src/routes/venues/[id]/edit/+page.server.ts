import { db } from '$lib/db';
import { venues } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

function isValidUrl(s: string) {
	try {
		new URL(s);
		return true;
	} catch {
		return false;
	}
}

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');

	const venue = await db.select().from(venues).where(eq(venues.id, Number(params.id))).get();
	if (!venue) error(404, 'Koncertstedet findes ikke');
	if (venue.createdBy !== locals.user.id) error(403, 'Du kan kun redigere dine egne steder');

	return { venue };
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		if (!locals.user) redirect(302, '/login');

		const venue = await db.select().from(venues).where(eq(venues.id, Number(params.id))).get();
		if (!venue) error(404);
		if (venue.createdBy !== locals.user.id) error(403);

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

		await db
			.update(venues)
			.set({ name, address, websiteUrl })
			.where(eq(venues.id, Number(params.id)));

		redirect(302, `/venues/${params.id}`);
	},

	delete: async ({ params, locals }) => {
		if (!locals.user) redirect(302, '/login');

		const venue = await db.select().from(venues).where(eq(venues.id, Number(params.id))).get();
		if (!venue) error(404);
		if (venue.createdBy !== locals.user.id) error(403);

		await db.delete(venues).where(eq(venues.id, Number(params.id)));
		redirect(302, '/venues');
	}
};
