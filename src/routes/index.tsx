import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Code2, ExternalLink, Github, Star } from "lucide-react";
import { getGitHubProjects } from "@/lib/github.functions";
import { GitHubRepo } from "@/lib/github.functions";

export const githubProjectsQueryOptions = queryOptions({
  queryKey: ["github-projects"],
  queryFn: () => getGitHubProjects(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(githubProjectsQueryOptions),
  head: () => ({
    meta: [
      { title: "Marino Andriani — Software Developer" },
      { name: "description", content: "Portfolio of Marino Andriani, a software developer passionate about building clean, performant web experiences." },
      { property: "og:title", content: "Marino Andriani — Software Developer" },
      { property: "og:description", content: "Portfolio of Marino Andriani, a software developer passionate about building clean, performant web experiences." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: projects } = useSuspenseQuery(githubProjectsQueryOptions);
  const featured = projects.slice(0, 3);

  return (
    <>
      <Hero />
      <FeaturedProjects projects={featured} />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_50%)] opacity-10" />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Software Developer</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Hi, I'm <span className="gradient-text">Marino Andriani</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Passionate about programming and building clean, performant web experiences. I turn ideas into products with modern tools and thoughtful design.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                View my work
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border/50 bg-surface ring-glow">
              <img
                src="/assets/images/marino-andriani.jpg"
                alt="Marino Andriani portrait"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects({ projects }: { projects: GitHubRepo[] }) {
  return (
    <section className="border-t border-border/50 bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Latest work</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Featured projects</h2>
          </div>
          <Link
            to="/work"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            See all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/work" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            See all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: GitHubRepo }) {
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:ring-glow">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Code2 className="h-5 w-5" />
        </div>
        <a
          href={project.html_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-md p-2 text-muted-foreground opacity-60 transition-opacity hover:bg-accent hover:text-foreground hover:opacity-100"
          aria-label="Open project on GitHub"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">{project.name}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {project.description || "No description provided."}
      </p>

      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
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
        </div>
        <span>{new Date(project.updated_at).getFullYear()}</span>
      </div>
    </article>
  );
}

function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Have a project in mind?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          I'm always open to discussing new opportunities, interesting ideas, or collaborations.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          <Github className="h-4 w-4" />
          Let's talk
        </Link>
      </div>
    </section>
  );
}
