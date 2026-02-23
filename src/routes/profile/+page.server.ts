import { db } from '$lib/db';
import { attendances, concerts, venues } from '$lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');

	const myAttendances = await db
		.select({ attendance: attendances, concert: concerts, venueName: venues.name })
		.from(attendances)
		.innerJoin(concerts, eq(attendances.concertId, concerts.id))
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.where(eq(attendances.userId, locals.user.id))
		.orderBy(desc(concerts.dateTime))
		.all();

	const expecting = myAttendances.filter((r) => r.attendance.status === 'forventer');
	const attended = myAttendances.filter((r) => r.attendance.status === 'var_der');

	return { expecting, attended };
};
