import { db } from '$lib/db';
import { venues, concerts, users } from '$lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);

	const venue = await db
		.select({ venue: venues, creatorName: users.username })
		.from(venues)
		.innerJoin(users, eq(venues.createdBy, users.id))
		.where(eq(venues.id, id))
		.get();

	if (!venue) error(404, 'Koncertstedet findes ikke');

	const concertList = await db
		.select()
		.from(concerts)
		.where(eq(concerts.venueId, id))
		.orderBy(desc(concerts.dateTime))
		.all();

	return { venue: venue.venue, creatorName: venue.creatorName, concerts: concertList };
};
