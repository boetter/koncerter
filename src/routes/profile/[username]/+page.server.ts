import { db } from '$lib/db';
import { attendances, concerts, venues, users } from '$lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const profileUser = await db
		.select({ id: users.id, username: users.username })
		.from(users)
		.where(eq(users.username, params.username))
		.get();

	if (!profileUser) error(404, 'Brugeren findes ikke');

	const myAttendances = await db
		.select({ attendance: attendances, concert: concerts, venueName: venues.name })
		.from(attendances)
		.innerJoin(concerts, eq(attendances.concertId, concerts.id))
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.where(eq(attendances.userId, profileUser.id))
		.orderBy(desc(concerts.dateTime))
		.all();

	const now = new Date().toISOString();
	const upcoming = myAttendances.filter((r) => r.concert.dateTime > now);
	const past = myAttendances.filter((r) => r.concert.dateTime <= now);

	return { profileUser, upcoming, past };
};
