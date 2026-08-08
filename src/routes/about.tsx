import { createFileRoute } from "@tanstack/react-router";
import { Code2, Cpu, Database, Globe, GraduationCap, Layout, Server, Terminal, Wrench } from "lucide-react";

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

const skills = [
  { label: "Languages", icon: Code2, items: "C/C++, Python, C#, JavaScript" },
  { label: "Industrial automation", icon: Cpu, items: "IEC 61131-3 (LD, ST, FBD), PLC B&R, embedded C/C++" },
  { label: "Web", icon: Layout, items: "React, TypeScript, Angular, HTML, CSS, Tailwind CSS" },
  { label: "Backend & Data", icon: Server, items: "Node.js, REST APIs, SQL, PostgreSQL, JSON, XML" },
  { label: "Tools & OS", icon: Terminal, items: "Git, GitHub, VS Code, Visual Studio, Automation Studio, Linux, Windows" },
  { label: "Design & CAD", icon: Wrench, items: "SolidWorks, AutoCAD, Altium Designer, KiCad" },
];

const experience = [
  {
    company: "Roboze SPA",
    roles: [
      { title: "Head of software engineering", period: "Jul 2023 — present", description: "Managing the software team with SCRUM and DevOps, optimizing development processes." },
      { title: "Automation engineer", period: "Dec 2020 — present", description: "Software development for industrial 3D printers using B&R PLCs and IEC languages." },
      { title: "IT Manager", period: "Jun 2018 — Jun 2022", description: "Managing and scaling company IT infrastructure and network." },
      { title: "Embedded programmer", period: "Jun 2016 — present", description: "Firmware development for Atmel ATmega/SAM MCUs in C/C++ and electronic design." },
    ],
  },
  {
    company: "Circolo Arci Carlo Cafiero",
    roles: [
      { title: "Teacher", period: "Mar 2017 — May 2017", description: "Electronics courses using open-source PCB software and Atmel/Arduino programming." },
    ],
  },
  {
    company: "Apulia Makers 3D",
    roles: [
      { title: "Teacher", period: "Apr 2016", description: "Programming and electronics basics for beginners, with hands-on projects." },
    ],
  },
];

const education = [
  { title: "Politecnico di Bari", detail: "Computer and Automation Engineering (2014 — not completed)", icon: GraduationCap },
  { title: "ITIS Ferraris Molfetta", detail: "Mechanical technician diploma (2009 — 2014)", icon: GraduationCap },
  { title: "B&R Academy", detail: "Automation Diploma: IEC Programming (2020) and Motion (2020)", icon: Cpu },
  { title: "SolidWorks", detail: "ASSOCIATE Mechanical Design (2021) and PROFESSIONAL ADVANCED Drawing Tools (2021)", icon: Wrench },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="mx-auto aspect-square w-full max-w-[14rem] overflow-hidden rounded-2xl border border-border/50 bg-surface ring-glow lg:max-w-none">
            <img
              src="/assets/images/marino-andriani.jpg"
              alt="Marino Andriani portrait"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="lg:col-span-9">
          <p className="text-sm font-medium text-primary">About me</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Software engineer, builder, problem solver
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              I'm Marino Andriani, a software engineer based in Italy with a deep passion for programming and automation. I enjoy turning complex problems into simple, reliable, and elegant software.
            </p>
            <p>
              Currently Head of Software Engineering at Roboze SPA, I lead the software team using SCRUM and DevOps practices while still contributing hands-on to industrial automation, embedded systems, and web development.
            </p>
            <p>
              My background spans PLC programming, embedded C/C++, full-stack web technologies, and IT infrastructure. I care about clean code, intuitive interfaces, and products that actually help people.
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
              href="mailto:Marino-Andriani@live.it"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Email me
            </a>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <p className="text-sm font-medium text-primary">Experience</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">Where I've worked</h2>
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
        <p className="text-sm font-medium text-primary">Education</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">What I studied</h2>
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
