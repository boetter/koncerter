import { db } from '$lib/db';
import { concerts, venues } from '$lib/db/schema';
import { fail, redirect } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) redirect(302, '/login');

	const venueList = await db.select({ id: venues.id, name: venues.name }).from(venues).orderBy(venues.name).all();
	const preselectedVenueId = url.searchParams.get('venue') ?? '';

	return { venues: venueList, preselectedVenueId };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) redirect(302, '/login');

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

		// Convert Copenhagen local datetime-local input to UTC ISO string
		const dt = copenhagenToUTC(dateTime);

		try {
			const [concert] = await db
				.insert(concerts)
				.values({ venueId, artistName, dateTime: dt, description, ticketUrl, createdBy: locals.user.id })
				.returning();
			redirect(302, `/concerts/${concert.id}`);
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (msg.includes('UNIQUE')) {
				return fail(400, { error: 'Der er allerede en koncert på dette sted på det tidspunkt.', venueId, artistName, dateTime, description, ticketUrl });
			}
			throw e;
		}
	}
};
