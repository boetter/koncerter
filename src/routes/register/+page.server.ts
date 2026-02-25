import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { createSession, setSessionCookie } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const username = String(data.get('username') ?? '').trim();
		const email = String(data.get('email') ?? '').trim().toLowerCase();
		const password = String(data.get('password') ?? '');
		const confirm = String(data.get('confirm') ?? '');

		if (!username || !email || !password) {
			return fail(400, { error: 'Alle felter er påkrævede.', username, email });
		}
		if (password !== confirm) {
			return fail(400, { error: 'Adgangskoderne stemmer ikke overens.', username, email });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Adgangskoden skal være mindst 8 tegn.', username, email });
		}

		const existing = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get();
		if (existing) {
			return fail(400, { error: 'E-mailadressen er allerede i brug.', username, email });
		}

		const existingUsername = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.get();
		if (existingUsername) {
			return fail(400, { error: 'Brugernavnet er allerede taget.', username, email });
		}

		const passwordHash = await bcrypt.hash(password, 12);
		const [user] = await db
			.insert(users)
			.values({ username, email, passwordHash })
			.returning();

		const sessionId = await createSession(user.id);
		setSessionCookie(event, sessionId);

		redirect(302, '/');
	}
};
