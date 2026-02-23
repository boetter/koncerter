import { db } from '$lib/db';
import { sessions, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

const SESSION_COOKIE = 'session';
const SESSION_DURATION_DAYS = 30;

export async function createSession(userId: number): Promise<string> {
	const sessionId = randomBytes(32).toString('hex');
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

	await db.insert(sessions).values({
		id: sessionId,
		userId,
		expiresAt: expiresAt.toISOString()
	});

	return sessionId;
}

export async function getSession(event: RequestEvent) {
	const sessionId = event.cookies.get(SESSION_COOKIE);
	if (!sessionId) return null;

	const result = await db
		.select({ session: sessions, user: users })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.get();

	if (!result) return null;

	if (new Date(result.session.expiresAt) < new Date()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return null;
	}

	return result.user;
}

export function setSessionCookie(event: RequestEvent, sessionId: string) {
	event.cookies.set(SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		secure: !process.env.NODE_ENV || process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60
	});
}

export async function deleteSession(event: RequestEvent) {
	const sessionId = event.cookies.get(SESSION_COOKIE);
	if (sessionId) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
	}
	event.cookies.delete(SESSION_COOKIE, { path: '/' });
}
