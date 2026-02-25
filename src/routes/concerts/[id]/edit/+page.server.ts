import { db } from '$lib/db';
import { concerts, venues } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import { copenhagenToUTC } from '$lib/format';
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

	const concert = await db.select().from(concerts).where(eq(concerts.id, Number(params.id))).get();
	if (!concert) error(404, 'Koncerten findes ikke');
	if (concert.createdBy !== locals.user.id) error(403, 'Du kan kun redigere dine egne koncerter');

	const venueList = await db.select({ id: venues.id, name: venues.name }).from(venues).orderBy(venues.name).all();

	return { concert, venues: venueList };
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		if (!locals.user) redirect(302, '/login');

		const concert = await db.select().from(concerts).where(eq(concerts.id, Number(params.id))).get();
		if (!concert) error(404);
		if (concert.createdBy !== locals.user.id) error(403);

		const data = await request.formData();
		const venueId = Number(data.get('venue_id'));
		const artistName = String(data.get('artist_name') ?? '').trim();
		const dateTime = String(data.get('date_time') ?? '').trim();
		const description = String(data.get('description') ?? '').trim() || null;
		const ticketUrl = String(data.get('ticket_url') ?? '').trim() || null;

		if (!venueId || !artistName || !dateTime) {
			return fail(400, { error: 'Sted, artistnavn og dato er påkrævede.', venueId, artistName, dateTime, description, ticketUrl });
		}
		if (ticketUrl && !isValidUrl(ticketUrl)) {
			return fail(400, { error: 'Billet-URL er ugyldig.', venueId, artistName, dateTime, description, ticketUrl });
		}

		const dt = copenhagenToUTC(dateTime);

		try {
			await db
				.update(concerts)
				.set({ venueId, artistName, dateTime: dt, description, ticketUrl })
				.where(eq(concerts.id, Number(params.id)));
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('UNIQUE')) {
				return fail(400, { error: 'Der er allerede en koncert på dette sted på det tidspunkt.', venueId, artistName, dateTime, description, ticketUrl });
			}
			throw e;
		}

		redirect(302, `/concerts/${params.id}`);
	},

	delete: async ({ params, locals }) => {
		if (!locals.user) redirect(302, '/login');

		const concert = await db.select().from(concerts).where(eq(concerts.id, Number(params.id))).get();
		if (!concert) error(404);
		if (concert.createdBy !== locals.user.id) error(403);

		await db.delete(concerts).where(eq(concerts.id, Number(params.id)));
		redirect(302, '/concerts');
	}
};
