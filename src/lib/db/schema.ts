import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const sspGitHubAnalysis = pgTable('sspGitHubAnalysis', {
	id: serial().primaryKey(),
	repo: varchar({ length: 100 }).notNull(),
	score: integer().notNull(),
	analysis: text().notNull(),
	createdAt: timestamp().notNull().defaultNow()
});
