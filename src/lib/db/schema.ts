import { sql } from 'drizzle-orm';
import { integer, text, sqliteTable, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: text('expires_at').notNull()
});

export const venues = sqliteTable('venues', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	address: text('address').notNull(),
	websiteUrl: text('website_url'),
	createdBy: integer('created_by')
		.notNull()
		.references(() => users.id),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const concerts = sqliteTable(
	'concerts',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		venueId: integer('venue_id')
			.notNull()
			.references(() => venues.id),
		artistName: text('artist_name').notNull(),
		dateTime: text('date_time').notNull(),
		description: text('description'),
		ticketUrl: text('ticket_url'),
		createdBy: integer('created_by')
			.notNull()
			.references(() => users.id),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
	},
	(t) => [uniqueIndex('concerts_venue_datetime_idx').on(t.venueId, t.dateTime)]
);

export const attendances = sqliteTable(
	'attendances',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: integer('user_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		concertId: integer('concert_id')
			.notNull()
			.references(() => concerts.id, { onDelete: 'cascade' }),
		status: text('status', { enum: ['forventer', 'var_der'] }).notNull(),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
	},
	(t) => [uniqueIndex('attendances_user_concert_idx').on(t.userId, t.concertId)]
);

export const concertGenres = sqliteTable(
	'concert_genres',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		concertId: integer('concert_id')
			.notNull()
			.references(() => concerts.id, { onDelete: 'cascade' }),
		genre: text('genre').notNull(),
		addedBy: integer('added_by')
			.notNull()
			.references(() => users.id),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
	},
	(t) => [uniqueIndex('concert_genres_concert_genre_idx').on(t.concertId, t.genre)]
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type Concert = typeof concerts.$inferSelect;
export type Attendance = typeof attendances.$inferSelect;
export type ConcertGenre = typeof concertGenres.$inferSelect;
