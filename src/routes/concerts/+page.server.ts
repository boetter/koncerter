import { db } from '$lib/db';
import { concerts, venues, attendances } from '$lib/db/schema';
import { eq, asc, desc, gte, lt, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const now = new Date().toISOString();

	const upcoming = await db
		.select({
			concert: concerts,
			venueName: venues.name,
			attendanceCount: sql<number>`count(${attendances.id})`
		})
		.from(concerts)
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.leftJoin(attendances, eq(attendances.concertId, concerts.id))
		.where(gte(concerts.dateTime, now))
		.groupBy(concerts.id)
		.orderBy(asc(concerts.dateTime))
		.all();

	const past = await db
		.select({
			concert: concerts,
			venueName: venues.name,
			attendanceCount: sql<number>`count(${attendances.id})`
		})
		.from(concerts)
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.leftJoin(attendances, eq(attendances.concertId, concerts.id))
		.where(lt(concerts.dateTime, now))
		.groupBy(concerts.id)
		.orderBy(desc(concerts.dateTime))
		.all();

	return { upcoming, past };
};
