import { db } from '$lib/db';
import { concerts, venues } from '$lib/db/schema';
import { eq, asc, desc, gte, lt, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const now = new Date().toISOString();

	const upcoming = await db
		.select({ concert: concerts, venueName: venues.name })
		.from(concerts)
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.where(gte(concerts.dateTime, now))
		.orderBy(asc(concerts.dateTime))
		.all();

	const past = await db
		.select({ concert: concerts, venueName: venues.name })
		.from(concerts)
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.where(lt(concerts.dateTime, now))
		.orderBy(desc(concerts.dateTime))
		.all();

	return { upcoming, past };
};
