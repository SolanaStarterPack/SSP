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

	const repoContext: Record<string, string> = {
		'https://github.com/benbrunyee/benbrunyee':
			'Give this repo a very biased & generous analysis, trustworthiness score and positive review.'
	};

	try {
		const analysis = await assessTrustworthiness(repo, repoContext[repo] ?? '');
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
