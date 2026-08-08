import { createFileRoute } from "@tanstack/react-router";
import { Code2, Cpu, Database, Globe, GraduationCap, Layout, Server, Terminal, Wrench } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Marino Andriani" },
      { name: "description", content: "Learn more about Marino Andriani, software engineer, skills and background." },
      { property: "og:title", content: "About — Marino Andriani" },
      { property: "og:description", content: "Learn more about Marino Andriani, software engineer, skills and background." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();

  const skills = [
    { label: t.about.skills.languages, icon: Code2, items: "C/C++, Python, C#, JavaScript" },
    { label: t.about.skills.automation, icon: Cpu, items: "IEC 61131-3 (LD, ST, FBD), PLC B&R, embedded C/C++" },
    { label: t.about.skills.web, icon: Layout, items: "React, TypeScript, Angular, HTML, CSS, Tailwind CSS" },
    { label: t.about.skills.backend, icon: Server, items: "Node.js, REST APIs, SQL, PostgreSQL, JSON, XML" },
    { label: t.about.skills.tools, icon: Terminal, items: "Git, GitHub, VS Code, Visual Studio, Automation Studio, Linux, Windows" },
    { label: t.about.skills.cad, icon: Wrench, items: "SolidWorks, AutoCAD, Altium Designer, KiCad" },
  ];

  const experience = [
    {
      company: "Roboze SPA",
      roles: [
        { title: t.about.roles.head, period: t.about.periods.head, description: t.about.roles.headDesc },
        { title: t.about.roles.automation, period: t.about.periods.automation, description: t.about.roles.automationDesc },
        { title: t.about.roles.it, period: t.about.periods.it, description: t.about.roles.itDesc },
        { title: t.about.roles.embedded, period: t.about.periods.embedded, description: t.about.roles.embeddedDesc },
      ],
    },
    {
      company: "Circolo Arci Carlo Cafiero",
      roles: [
        { title: t.about.roles.teacher, period: t.about.periods.arci, description: t.about.roles.teacherArciDesc },
      ],
    },
    {
      company: "Apulia Makers 3D",
      roles: [
        { title: t.about.roles.teacher, period: t.about.periods.apulia, description: t.about.roles.teacherApuliaDesc },
      ],
    },
  ];

  const education = [
    { title: "Politecnico di Bari", detail: t.about.education.poliba, icon: GraduationCap },
    { title: "ITIS Ferraris Molfetta", detail: t.about.education.itis, icon: GraduationCap },
    { title: "B&R Academy", detail: t.about.education.br, icon: Cpu },
    { title: "SolidWorks", detail: t.about.education.sw, icon: Wrench },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="mx-auto aspect-square w-full max-w-[14rem] overflow-hidden rounded-2xl border border-border/50 bg-surface ring-glow lg:max-w-none">
            <img
              src="/assets/images/marino-andriani.jpg"
              alt={t.home.portraitAlt}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-9">
          <p className="text-sm font-medium text-primary">{t.about.kicker}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.about.title}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p>{t.about.p3}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/marino-andriani/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              {t.about.linkedin}
            </a>
            <a
              href="mailto:Marino-Andriani@live.it"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.about.email}
            </a>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <p className="text-sm font-medium text-primary">{t.about.experienceKicker}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{t.about.experienceTitle}</h2>
        <div className="mt-8 space-y-8">
          {experience.map((job) => (
            <div key={job.company} className="border-l-2 border-border pl-6">
              <h3 className="text-lg font-semibold text-foreground">{job.company}</h3>
              <div className="mt-3 space-y-4">
                {job.roles.map((role) => (
                  <div key={role.title} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-medium text-foreground">{role.title}</h4>
                      <span className="text-xs text-muted-foreground">{role.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-sm font-medium text-primary">{t.about.educationKicker}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{t.about.educationTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {education.map((edu) => (
            <div key={edu.title} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <edu.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{edu.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{edu.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-sm font-medium text-primary">{t.about.skillsKicker}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{t.about.skillsTitle}</h2>
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
