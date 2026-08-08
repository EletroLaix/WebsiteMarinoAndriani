import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Code2, ExternalLink, Github, Search, Star } from "lucide-react";
import { getGitHubProjects } from "@/lib/github.functions";
import { githubProjectsQueryOptions } from "./index";

export const Route = createFileRoute("/work")({
  loader: ({ context }) => context.queryClient.ensureQueryData(githubProjectsQueryOptions),
  head: () => ({
    meta: [
      { title: "Work — Marino Andriani" },
      { name: "description", content: "A selection of projects and open source work by Marino Andriani." },
      { property: "og:title", content: "Work — Marino Andriani" },
      { property: "og:description", content: "A selection of projects and open source work by Marino Andriani." },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const { data: projects } = useSuspenseQuery(githubProjectsQueryOptions);
  const [query, setQuery] = useState("");

  const filtered = projects.filter((project) => {
    const q = query.toLowerCase();
    return (
      project.name.toLowerCase().includes(q) ||
      (project.description || "").toLowerCase().includes(q) ||
      (project.language || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <p className="text-sm font-medium text-primary">Portfolio</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Things I've built
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        A mix of side projects, experiments, and open-source repositories pulled straight from my GitHub profile.
      </p>

      <div className="mt-10">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <article
            key={project.id}
            className="flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:ring-glow"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Open project on GitHub"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-foreground">{project.name}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              {project.description || "No description provided."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {project.language && (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {project.language}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {project.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <Github className="h-3.5 w-3.5" />
                {project.forks_count}
              </span>
              <span className="ml-auto">Updated {new Date(project.updated_at).toLocaleDateString()}</span>
            </div>

            {project.topics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center text-muted-foreground">
          No projects match "{query}".
        </div>
      )}
    </div>
  );
}
