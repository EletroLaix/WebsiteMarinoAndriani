import { createFileRoute } from "@tanstack/react-router";
import { Code2, Database, Globe, Layout, Server, Terminal } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Marino Andriani" },
      { name: "description", content: "Learn more about Marino Andriani, software developer, skills and background." },
      { property: "og:title", content: "About — Marino Andriani" },
      { property: "og:description", content: "Learn more about Marino Andriani, software developer, skills and background." },
    ],
  }),
  component: AboutPage,
});

const skills = [
  { label: "Frontend", icon: Layout, items: "React, TypeScript, Angular, Tailwind CSS" },
  { label: "Backend", icon: Server, items: "Node.js, REST APIs, Databases" },
  { label: "Languages", icon: Code2, items: "C#, JavaScript, TypeScript, Python" },
  { label: "Data", icon: Database, items: "SQL, PostgreSQL, data modeling" },
  { label: "Web", icon: Globe, items: "HTML, CSS, responsive design, accessibility" },
  { label: "Tools", icon: Terminal, items: "Git, GitHub, VS Code, CI/CD" },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-border/50 bg-surface ring-glow">
            <img
              src="/assets/images/marino-andriani.jpg"
              alt="Marino Andriani portrait"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="text-sm font-medium text-primary">About me</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Developer, builder, problem solver
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              I'm Marino Andriani, a software developer with a deep passion for programming. I enjoy turning complex problems into simple, beautiful, and reliable software.
            </p>
            <p>
              My background spans frontend frameworks, backend services, and data-driven applications. I care about writing clean code, creating intuitive user interfaces, and shipping products that actually help people.
            </p>
            <p>
              When I'm not coding, I keep exploring new technologies, refining my workflows, and looking for the next challenge to level up.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/marino-andriani/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              LinkedIn profile
            </a>
            <a
              href="mailto:marino.andriani@outlook.com"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Email me
            </a>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <p className="text-sm font-medium text-primary">Skills</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">What I work with</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <skill.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{skill.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{skill.items}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
