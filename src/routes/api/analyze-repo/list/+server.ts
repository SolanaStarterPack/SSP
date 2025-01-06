import { db } from '$lib/db';
import { sspGitHubAnalysis } from '$lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
	const analysis = await db
		.select()
		.from(sspGitHubAnalysis)
		.limit(10)
		.orderBy(desc(sspGitHubAnalysis.createdAt));

	return new Response(JSON.stringify({ results: analysis }), {
		headers: {
			'content-type': 'application/json'
		}
	});
}
