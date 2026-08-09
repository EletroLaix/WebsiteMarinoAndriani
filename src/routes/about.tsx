import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, ChevronDown, Cpu, GraduationCap, Layers, Server, Terminal, Wrench } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Marino Andriani" },
      {
        name: "description",
        content:
          "Head of Software Engineering at Roboze: industrial automation, embedded systems, career timeline, tech stack and certifications.",
      },
      { property: "og:title", content: "About — Marino Andriani" },
      {
        property: "og:description",
        content:
          "Head of Software Engineering at Roboze: industrial automation, embedded systems, career timeline, tech stack and certifications.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const timeline = [
    {
      company: "Roboze SPA",
      title: t.about.roles.head,
      period: t.about.periods.head,
      description: t.about.roles.headDesc,
      icon: Layers,
    },
    {
      company: "Roboze SPA",
      title: t.about.roles.automation,
      period: t.about.periods.automation,
      description: t.about.roles.automationDesc,
      icon: Server,
    },
    {
      company: "Roboze SPA",
      title: t.about.roles.embedded,
      period: t.about.periods.embedded,
      description: t.about.roles.embeddedDesc,
      icon: Cpu,
    },
    {
      company: "Barimakers · Apulia Makers 3D · Arci",
      title: t.about.roles.teacher,
      period: t.about.periods.teacher,
      description: t.about.roles.teacherDesc,
      icon: GraduationCap,
    },
  ];

  const stack = [
    {
      label: t.about.stack.leadership,
      icon: Layers,
      tags: ["SCRUM / Agile", "DevOps", "Systems Architecture", "IT Management"],
    },
    {
      label: t.about.stack.embedded,
      icon: Cpu,
      tags: ["C / C++", "Atmel ATmega", "Atmel SAM", "Altium Designer", "KiCad"],
    },
    {
      label: t.about.stack.automation,
      icon: Server,
      tags: ["B&R Automation Studio", "IEC 61131-3 (ST, LD, FBD)", "Motion Control"],
    },
    {
      label: t.about.stack.languages,
      icon: Terminal,
      tags: ["Python", "C#", "JavaScript", "Linux (Debian, Arch, Kali)"],
    },
    { label: t.about.stack.cad, icon: Wrench, tags: ["SolidWorks", "AutoCAD"] },
  ];

  const certifications = [
    { title: t.about.certs.swTitle, detail: t.about.certs.swDesc, icon: Award },
    { title: t.about.certs.brTitle, detail: t.about.certs.brDesc, icon: Award },
  ];

  const education = [
    { title: "Politecnico di Bari", detail: t.about.education.poliba, icon: GraduationCap },
    { title: "ITIS Ferraris Molfetta", detail: t.about.education.itis, icon: GraduationCap },
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
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t.about.title}</h1>
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

        <div className="mt-8 relative border-l border-border/70 pl-6 sm:pl-8">
          {timeline.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={`${item.company}-${item.title}`} className="relative pb-4 last:pb-0">
                <span
                  className={`absolute -left-[calc(1.5rem+5px)] top-6 h-2.5 w-2.5 rounded-full border transition-colors sm:-left-[calc(2rem+5px)] ${
                    isOpen ? "border-primary bg-primary" : "border-border bg-surface"
                  }`}
                />
                <div
                  className={`rounded-xl border bg-card transition-colors ${
                    isOpen ? "border-primary/40" : "border-border hover:border-primary/25"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-4 p-5 text-left"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-foreground">{item.title}</span>
                        <span className="font-mono text-xs text-muted-foreground">{item.period}</span>
                      </span>
                      <span className="mt-1 block text-sm text-primary">{item.company}</span>
                    </span>
                    <ChevronDown
                      className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[4.25rem] text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-sm font-medium text-primary">{t.about.stackKicker}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{t.about.stackTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((group) => (
            <div
              key={group.label}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <group.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{group.label}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="text-sm font-medium text-primary">{t.about.certKicker}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{t.about.certTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div
              key={cert.title}
              className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <cert.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{cert.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cert.detail}</p>
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
            <div
              key={edu.title}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <edu.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{edu.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{edu.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
