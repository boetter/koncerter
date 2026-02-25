import { db } from '$lib/db';
import { concerts, venues, users, attendances, concertGenres } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.id);

	const row = await db
		.select({ concert: concerts, venue: venues, creatorName: users.username })
		.from(concerts)
		.innerJoin(venues, eq(concerts.venueId, venues.id))
		.innerJoin(users, eq(concerts.createdBy, users.id))
		.where(eq(concerts.id, id))
		.get();

	if (!row) error(404, 'Koncerten findes ikke');

	const allAttendances = await db
		.select({ attendance: attendances, username: users.username })
		.from(attendances)
		.innerJoin(users, eq(attendances.userId, users.id))
		.where(eq(attendances.concertId, id))
		.all();

	const expecting = allAttendances.filter((a) => a.attendance.status === 'forventer');
	const attended = allAttendances.filter((a) => a.attendance.status === 'var_der');

	const myAttendance = locals.user
		? allAttendances.find((a) => a.attendance.userId === locals.user!.id)?.attendance ?? null
		: null;

	const genres = await db
		.select({ genre: concertGenres.genre })
		.from(concertGenres)
		.where(eq(concertGenres.concertId, id))
		.orderBy(concertGenres.genre)
		.all();

	return {
		concert: row.concert,
		venue: row.venue,
		creatorName: row.creatorName,
		expecting,
		attended,
		myAttendance,
		genres: genres.map((g) => g.genre)
	};
};

export const actions: Actions = {
	attend: async ({ params, locals, request }) => {
		if (!locals.user) redirect(302, '/login');

		const concertId = Number(params.id);
		const data = await request.formData();
		const status = String(data.get('status'));

		if (status !== 'forventer' && status !== 'var_der') {
			return fail(400, { error: 'Ugyldig status' });
		}

		const existing = await db
			.select()
			.from(attendances)
			.where(eq(attendances.concertId, concertId))
			.all();
		const mine = existing.find((a) => a.userId === locals.user!.id);

		if (mine) {
			await db
				.update(attendances)
				.set({ status: status as 'forventer' | 'var_der' })
				.where(eq(attendances.id, mine.id));
		} else {
			await db.insert(attendances).values({
				userId: locals.user.id,
				concertId,
				status: status as 'forventer' | 'var_der'
			});
		}

		return {};
	},

	unattend: async ({ params, locals }) => {
		if (!locals.user) redirect(302, '/login');

		const concertId = Number(params.id);
		const existing = await db
			.select()
			.from(attendances)
			.where(eq(attendances.concertId, concertId))
			.all();
		const mine = existing.find((a) => a.userId === locals.user!.id);

		if (mine) {
			await db.delete(attendances).where(eq(attendances.id, mine.id));
		}

		return {};
	},

	addGenre: async ({ params, locals, request }) => {
		if (!locals.user) redirect(302, '/login');

		const concertId = Number(params.id);
		const data = await request.formData();
		const genre = String(data.get('genre') ?? '').trim().toLowerCase();

		if (!genre) return fail(400, { genreError: 'Angiv en genre' });
		if (genre.length > 30) return fail(400, { genreError: 'Genre må maks. være 30 tegn' });

		try {
			await db.insert(concertGenres).values({
				concertId,
				genre,
				addedBy: locals.user.id
			});
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : '';
			if (!msg.includes('UNIQUE')) throw e;
		}

		return {};
	}
};
