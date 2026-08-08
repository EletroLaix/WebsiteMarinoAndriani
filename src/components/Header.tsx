import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const t = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 380);
    return () => clearTimeout(t);
  }, [open, mounted]);

  return (
    <>
    <header className="glass-bar sticky top-0 z-50 border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="gradient-text">MA</span>
          <span className="hidden font-bold text-foreground sm:inline">Marino Andriani</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://github.com/EletroLaix"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/marino-andriani/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative h-10 w-10 rounded-md p-2 text-muted-foreground transition-colors duration-300 hover:bg-accent hover:text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <Menu
            className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ease-out ${
              open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            className={`absolute inset-0 m-auto h-6 w-6 transition-all duration-300 ease-out ${
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
            }`}
          />
        </button>
      </div>

    </header>

      {mounted && (
        <div
          className={`mobile-menu-overlay ${
            closing ? "is-closing" : "is-opening"
          } fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col md:hidden`}
        >
          <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
            {nav.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                style={{ animationDelay: closing ? `${i * 40}ms` : `${60 + i * 70}ms` }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-foreground" }}
                className="mobile-menu-item text-5xl font-bold tracking-tight transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div
            className="mobile-menu-item flex items-center gap-3 border-t border-border/50 px-8 py-6"
            style={{ animationDelay: closing ? "0ms" : "300ms" }}
          >
            <a
              href="https://github.com/EletroLaix"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/marino-andriani/"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
