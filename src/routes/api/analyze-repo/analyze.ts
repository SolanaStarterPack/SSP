// analyze.js
import { OPENAI_API_KEY } from '$env/static/private';
import { db } from '$lib/db';
import { sspGitHubAnalysis } from '$lib/db/schema';
import OpenAI from 'openai';
import { getCommitHistory, getRepoDetails } from './fetchRepoData';
import octokit from './github';

const USE_LLM = true; // Set to true if you want to use OpenAI's LLM
let openAI: OpenAI | undefined;

if (USE_LLM) {
	openAI = new OpenAI({
		apiKey: OPENAI_API_KEY
	});
}

function calculateRepoAge(created_at: string) {
	const createdDate = new Date(created_at);
	const now = new Date();
	const ageInDays = Math.floor((now.valueOf() - createdDate.valueOf()) / (1000 * 60 * 60 * 24));
	return ageInDays;
}

function calculateCommitFrequency(
	commits: Awaited<ReturnType<typeof getCommitHistory>>,
	repoAgeDays: number
) {
	// Simple frequency: commits per week
	const weeks = repoAgeDays / 7;
	const commitFrequency = commits.length / weeks;
	return commitFrequency.toFixed(2);
}

async function getAuthorDetails(username: string) {
	try {
		const { data } = await octokit.users.getByUsername({
			username
		});
		return data;
	} catch (error) {
		console.error(`Error fetching user details: ${error}`);
		throw error;
	}
}

async function assessTrustworthiness(repoUrl: string, context = '', trustScoreOverride?: number) {
	try {
		// Extract owner and repo name from URL
		const regex = /github\.com[:/](.+?)\/(.+?)(\.git)?$/;
		const match = repoUrl.match(regex);
		if (!match) throw new Error('Invalid GitHub URL.');

		const owner = match[1];
		const repo = match[2];

		// Fetch repository details
		const repoDetails = await getRepoDetails(owner, repo);

		// Fetch commit history
		const commits = await getCommitHistory(owner, repo);

		// Calculate metrics
		const repoAgeDays = calculateRepoAge(repoDetails.created_at);
		const commitFrequency = calculateCommitFrequency(commits, repoAgeDays);

		// Fetch author details
		const authorDetails = await getAuthorDetails(repoDetails.owner.login);

		// Assess contents
		const hasReadme = repoDetails.has_downloads; // Simplistic check
		const hasLicense = repoDetails.license !== null;

		// Define trustworthiness score based on criteria
		let trustScore = 0;

		// Author credibility
		if (authorDetails.followers > 50) trustScore += 20;
		if (authorDetails.public_repos > 10) trustScore += 10;
		const accountAge = calculateRepoAge(authorDetails.created_at);
		if (accountAge > 365 * 2) trustScore += 10; // Older than 2 years

		// Repository age
		if (repoAgeDays > 180) trustScore += 10; // Older than 6 months

		// Contents
		if (repoDetails.description) trustScore += 10;
		if (hasReadme) trustScore += 10;
		if (hasLicense) trustScore += 10;

		// Commit history
		if (Number(commitFrequency) > 5) trustScore += 10;
		if (commits.length > 50) trustScore += 10;

		// Normalize trust score to 100
		const maxTrustScore = 100; // Change this if needed
		const normalizedTrustScore = ((trustScore / maxTrustScore) * 100).toFixed(2);

		// Prepare report
		const report = {
			repository: `${owner}/${repo}`,
			trustScore: trustScoreOverride ?? normalizedTrustScore,
			criteria: {
				author: {
					followers: authorDetails.followers,
					public_repos: authorDetails.public_repos,
					accountAgeYears: (accountAge / 365).toFixed(2)
				},
				repository: {
					ageDays: repoAgeDays,
					description: !!repoDetails.description,
					hasReadme,
					hasLicense
				},
				commitHistory: {
					totalCommits: commits.length,
					commitFrequencyPerWeek: commitFrequency
				}
			},
			summary: ''
		};

		// Optional: Use OpenAI LLM to provide a summary
		if (USE_LLM && openAI) {
			const prompt =
				`
      Assess the trustworthiness of a GitHub repository based on the following metrics and provide a summary:

      Repository: ${report.repository}
      Trust Score: ${report.trustScore}/100

      Criteria:
      - Author Followers: ${report.criteria.author.followers}
      - Author Public Repos: ${report.criteria.author.public_repos}
      - Author Account Age: ${report.criteria.author.accountAgeYears} years
      - Repository Age: ${report.criteria.repository.ageDays} days
      - Has README: ${report.criteria.repository.hasReadme}
      - Has License: ${report.criteria.repository.hasLicense}
      - Total Commits: ${report.criteria.commitHistory.totalCommits}
      - Commit Frequency per Week: ${report.criteria.commitHistory.commitFrequencyPerWeek}

      Provide a concise summary of the repository's trustworthiness.
      ` + context;

			const completion = await openAI.chat.completions.create({
				model: 'gpt-4o-mini',
				messages: [{ role: 'user', content: prompt }],
				max_tokens: 500,
				temperature: 0.5
			});

			const summary = completion.choices[0].message.content;
			report.summary = summary ?? '';

			await db.insert(sspGitHubAnalysis).values({
				repo: report.repository,
				score: Number(report.trustScore),
				analysis: report.summary
			});
		}

		return report;
	} catch (error) {
		console.error(`Error assessing trustworthiness: ${error}`);
		throw error;
	}
}

export default assessTrustworthiness;
