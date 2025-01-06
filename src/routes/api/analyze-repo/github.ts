// github.js
import { GITHUB_TOKEN } from '$env/static/private';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
	auth: GITHUB_TOKEN
});

export default octokit;
