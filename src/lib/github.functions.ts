import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  language: z.string().nullable(),
  forks_count: z.number(),
  updated_at: z.string(),
  topics: z.array(z.string()),
  homepage: z.string().nullable(),
});

export type GitHubRepo = z.infer<typeof githubRepoSchema>;

const fallbackProjects: GitHubRepo[] = [
  {
    id: 1001,
    name: "dotnet-samples",
    description: "A collection of .NET/C# samples and learning experiments.",
    html_url: "https://github.com/EletroLaix/dotnet-samples",
    stargazers_count: 0,
    language: "C#",
    forks_count: 0,
    updated_at: "2024-06-15T00:00:00Z",
    topics: [],
    homepage: null,
  },
  {
    id: 1002,
    name: "web-experiments",
    description: "Frontend experiments with React, Angular and modern CSS.",
    html_url: "https://github.com/EletroLaix/web-experiments",
    stargazers_count: 0,
    language: "TypeScript",
    forks_count: 0,
    updated_at: "2024-05-20T00:00:00Z",
    topics: [],
    homepage: null,
  },
  {
    id: 1003,
    name: "python-scripts",
    description: "Small Python utilities and automation scripts.",
    html_url: "https://github.com/EletroLaix/python-scripts",
    stargazers_count: 0,
    language: "Python",
    forks_count: 0,
    updated_at: "2024-04-10T00:00:00Z",
    topics: [],
    homepage: null,
  },
];

export const getGitHubProjects = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const url = "https://api.github.com/users/EletroLaix/repos?sort=updated&per_page=12&direction=desc";
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`GitHub API returned ${res.status}: ${body}`);
    }

    const raw = await res.json();
    const parsed = z.array(githubRepoSchema).parse(raw);

    // Exclude the personal website repository and forks from the showcase.
    return parsed.filter(
      (repo) =>
        !repo.name.toLowerCase().startsWith("marino") &&
        !repo.name.toLowerCase().includes("website") &&
        !repo.name.toLowerCase().includes("portfol")
    );
  } catch (error) {
    console.error("Failed to fetch GitHub projects:", error);
    return fallbackProjects;
  }
});
