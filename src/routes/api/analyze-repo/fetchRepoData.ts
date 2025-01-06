import octokit from './github';

async function getRepoDetails(owner: string, repo: string) {
	try {
		const { data } = await octokit.repos.get({
			owner,
			repo
		});
		return data;
	} catch (error) {
		console.error(`Error fetching repository details: ${error}`);
		throw error;
	}
}

async function getCommitHistory(owner: string, repo: string, per_page = 50) {
	try {
		const commits = await octokit.paginate(octokit.repos.listCommits, {
			owner,
			repo,
			per_page
		});
		return commits;
	} catch (error) {
		console.error(`Error fetching commit history: ${error}`);
		throw error;
	}
}

export { getCommitHistory, getRepoDetails };
