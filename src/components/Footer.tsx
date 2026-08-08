import { Github, Linkedin, Mail } from "lucide-react";

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
  { label: "GitHub", href: "https://github.com/EletroLaix", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marino-andriani/", icon: Linkedin },
  { label: "X", href: "https://x.com/andriani_marino", icon: XIcon },
  { label: "Email", href: "mailto:Marino-Andriani@live.it", icon: Mail },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass-bar border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-foreground">Marino Andriani</p>
            <p className="mt-1 text-sm text-muted-foreground">Software engineer focused on automation and web.</p>
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
            © {year} Marino Andriani.
          </p>
        </div>
      </div>
    </footer>
  );
}
