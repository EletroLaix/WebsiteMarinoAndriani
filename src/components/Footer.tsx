import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const social = [
  { label: "GitHub", href: "https://github.com/EletroLaix", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marino-andriani/", icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com/andriani_marino", icon: Twitter },
  { label: "Email", href: "mailto:marino.andriani@outlook.com", icon: Mail },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-foreground">Marino Andriani</p>
            <p className="mt-1 text-sm text-muted-foreground">Software developer passionate about programming.</p>
          </div>

          <div className="flex items-center gap-2">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={item.label}
              >
                <item.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {year} Marino Andriani. Built with React & TanStack Start.
          </p>
        </div>
      </div>
    </footer>
  );
}
