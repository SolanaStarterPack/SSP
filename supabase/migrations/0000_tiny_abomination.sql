CREATE TABLE "sspGitHubAnalysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo" varchar(100) NOT NULL,
	"score" integer NOT NULL,
	"analysis" text NOT NULL
);
