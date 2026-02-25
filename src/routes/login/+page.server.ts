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
		const email = String(data.get('email') ?? '').trim().toLowerCase();
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Udfyld e-mail og adgangskode.' });
		}

		const user = await db.select().from(users).where(eq(users.email, email)).get();
		if (!user) {
			return fail(400, { error: 'Forkert e-mail eller adgangskode.' });
		}

		const valid = await bcrypt.compare(password, user.passwordHash);
		if (!valid) {
			return fail(400, { error: 'Forkert e-mail eller adgangskode.' });
		}

		const sessionId = await createSession(user.id);
		setSessionCookie(event, sessionId);

		return {};
	}
};
