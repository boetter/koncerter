CREATE TABLE `concert_genres` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`concert_id` integer NOT NULL,
	`genre` text NOT NULL,
	`added_by` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`concert_id`) REFERENCES `concerts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `concert_genres_concert_genre_idx` ON `concert_genres` (`concert_id`,`genre`);
