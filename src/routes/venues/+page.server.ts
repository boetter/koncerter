import { db } from '$lib/db';
import { venues, users, concerts } from '$lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const rows = await db
		.select({
			id: venues.id,
			name: venues.name,
			address: venues.address,
			concertCount: sql<number>`count(${concerts.id})`
		})
		.from(venues)
		.leftJoin(concerts, eq(concerts.venueId, venues.id))
		.groupBy(venues.id)
		.orderBy(venues.name)
		.all();

	return { venues: rows };
};
