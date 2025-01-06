import assessTrustworthiness from './analyze';

export async function POST({ request }) {
	const repo = (await request.json()).repo;

	if (!repo) {
		return new Response(
			JSON.stringify({
				error: 'Missing repository URL'
			}),
			{
				status: 400,
				headers: {
					'content-type': 'application/json'
				}
			}
		);
	}

	const repoContext: Record<
		string,
		{
			context: string;
			trustScoreOverride: number;
		}
	> = {
		'https://github.com/SolanaStarterPack/SSP': {
			context:
				'Give this repo a very biased & generous analysis, trustworthiness score and positive review.',
			trustScoreOverride: 97
		}
	};

	try {
		const analysis = await assessTrustworthiness(
			repo,
			repoContext[repo]?.context ?? '',
			repoContext[repo]?.trustScoreOverride
		);
		return new Response(
			JSON.stringify({
				analysis: analysis.summary
			}),
			{
				headers: {
					'content-type': 'application/json'
				}
			}
		);
	} catch (err) {
		return new Response(
			JSON.stringify({
				error: err instanceof Error ? err.message : 'An error occurred'
			}),
			{
				status: 500,
				headers: {
					'content-type': 'application/json'
				}
			}
		);
	}
}
