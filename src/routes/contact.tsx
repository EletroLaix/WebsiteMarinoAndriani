import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Marino Andriani" },
      { name: "description", content: "Get in touch with Marino Andriani for collaborations, opportunities, or just to say hi." },
      { property: "og:title", content: "Contact — Marino Andriani" },
      { property: "og:description", content: "Get in touch with Marino Andriani for collaborations, opportunities, or just to say hi." },
    ],
  }),
  component: ContactPage,
});

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const social = [
  { label: "GitHub", href: "https://github.com/EletroLaix", icon: Github, handle: "EletroLaix" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marino-andriani/", icon: Linkedin, handle: "marino-andriani" },
  { label: "X", href: "https://x.com/andriani_marino", icon: XIcon, handle: "@andriani_marino" },
  { label: "Email", href: "mailto:Marino-Andriani@live.it", icon: Mail, handle: "Marino-Andriani@live.it" },
];

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(t.contact.success);
      setForm({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">{t.contact.kicker}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.contact.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.contact.subtitle}
          </p>

          <div className="mt-8 space-y-4">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:ring-glow"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground group-hover:text-primary">{item.handle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                {t.contact.name}
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t.contact.namePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                {t.contact.email}
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t.contact.emailPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground">
                {t.contact.message}
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t.contact.messagePlaceholder}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? t.contact.sending : (
                <>
                  {t.contact.send} <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
