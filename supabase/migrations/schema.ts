import { pgTable, serial, varchar, text, integer, date } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const sspGitHubAnalysis = pgTable('sspGitHubAnalysis', {
	id: serial().primaryKey().notNull(),
	repo: varchar({ length: 100 }).notNull(),
	analysis: text().notNull(),
	score: integer().notNull(),
	createdAt: date().defaultNow().notNull()
});
