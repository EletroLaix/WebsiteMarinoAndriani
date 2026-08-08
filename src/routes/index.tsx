import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marino Andriani — Software Engineer" },
      { name: "description", content: "Portfolio of Marino Andriani, a software engineer passionate about automation, embedded systems, and clean web experiences." },
      { property: "og:title", content: "Marino Andriani — Software Engineer" },
      { property: "og:description", content: "Portfolio of Marino Andriani, a software engineer passionate about automation, embedded systems, and clean web experiences." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <CTA />
    </>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_50%)] opacity-10" />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="max-w-3xl lg:col-span-8">
            <p className="text-sm font-medium text-primary">{t.home.role}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.home.greeting} <span className="gradient-text">Marino Andriani</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {t.home.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                {t.home.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                {t.home.about}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[12rem] lg:col-span-4 lg:max-w-[14rem]">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border/50 bg-surface ring-glow">
              <img
                src="/assets/images/marino-andriani.jpg"
                alt={t.home.portraitAlt}
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

function CTA() {
  const { t } = useI18n();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t.home.ctaTitle}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {t.home.ctaText}
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          <Mail className="h-4 w-4" />
          {t.home.ctaButton}
        </Link>
      </div>
    </section>
  );
}
