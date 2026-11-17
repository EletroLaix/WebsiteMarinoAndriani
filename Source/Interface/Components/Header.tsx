import { useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { alternatePath, isPagePublished, normalizePath, pagePath } from "@/Application/Site";
import { cn } from "@/Application/Utilities";
import { Profile } from "@/Resources/Content/Profile";
import { useDictionary, useLang } from "@/Interface/Hooks/UseLanguage";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import { ScrambleText } from "@/Interface/Components/ScrambleText";

export function Header() {
	const lang = useLang();
	const t = useDictionary();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const current = normalizePath(pathname);
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [closing, setClosing] = useState(false);

	const nav = [
		{ label: t.nav.home, href: pagePath("home", lang) },
		{ label: t.nav.about, href: pagePath("about", lang) },
		...(isPagePublished("passions")
			? [{ label: t.nav.passions, href: pagePath("passions", lang) }]
			: []),
		{ label: t.nav.contact, href: pagePath("contact", lang) },
	];
	const isActive = (href: string) =>
		href === pagePath("home", lang) ? current === href : current.startsWith(href);

	useEffect(() => {
		if (open) {
			setMounted(true);
			setClosing(false);
			return;
		}
		if (!mounted) return;
		setClosing(true);
		const timer = setTimeout(() => {
			setMounted(false);
			setClosing(false);
		}, 380);
		return () => clearTimeout(timer);
	}, [open, mounted]);

	const otherLang = lang === "it" ? "en" : "it";
	const languageSwitch = (
		<TransitionLink
			href={alternatePath(pathname, otherLang)}
			hrefLang={otherLang}
			aria-label={t.nav.switchLanguage}
			title={t.nav.switchLanguage}
			onClick={() => setOpen(false)}
			className="inline-flex min-h-10 items-center rounded-md px-2 font-mono text-xs text-faint hover:text-foreground"
		>
			<span className={cn(lang === "it" && "text-foreground")}>IT</span>
			<span className="px-1">/</span>
			<span className={cn(lang === "en" && "text-foreground")}>EN</span>
		</TransitionLink>
	);

	return (
		<>
			<header className="glass-bar sticky top-0 z-50 border-b border-border/60">
				<div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
					<TransitionLink
						href={pagePath("home", lang)}
						className="brand flex items-center gap-3 text-foreground"
					>
						<img
							src={Profile.icon.path}
							alt=""
							width={40}
							height={40}
							className="brand-eye h-10 w-10"
						/>
						<span className="font-display text-[17px] font-semibold tracking-tight">
							{Profile.name}
						</span>
					</TransitionLink>

					<nav aria-label={t.nav.label} className="hidden items-center gap-1 md:flex">
						{nav.map((item) => (
							<TransitionLink
								key={item.href}
								href={item.href}
								aria-current={isActive(item.href) ? "page" : undefined}
								className={cn(
									"border-b-2 px-3.5 py-2 font-mono text-[13px] font-medium tracking-wide uppercase",
									isActive(item.href)
										? "border-primary text-foreground"
										: "border-transparent text-muted-foreground hover:text-foreground",
								)}
							>
								<ScrambleText text={item.label} />
							</TransitionLink>
						))}
						<span className="mx-2 h-5 w-px bg-border" aria-hidden="true" />
						{languageSwitch}
					</nav>

					<div className="flex items-center gap-1 md:hidden">
						{languageSwitch}
						<button
							type="button"
							onClick={() => setOpen((value) => !value)}
							aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
							aria-expanded={open}
							className="relative h-11 w-11 rounded-md text-muted-foreground hover:text-foreground"
						>
							<Menu
								className={cn(
									"absolute inset-0 m-auto h-6 w-6 transition-all duration-300",
									open ? "rotate-90 scale-75 opacity-0" : "opacity-100",
								)}
							/>
							<X
								className={cn(
									"absolute inset-0 m-auto h-6 w-6 transition-all duration-300",
									open ? "opacity-100" : "-rotate-90 scale-75 opacity-0",
								)}
							/>
						</button>
					</div>
				</div>
			</header>

			{mounted && (
				<div
					className={cn(
						"mobile-menu-overlay fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col md:hidden",
						closing ? "is-closing" : "is-opening",
					)}
				>
					<nav
						aria-label={t.nav.label}
						className="flex flex-1 flex-col justify-center gap-2 px-8"
					>
						{nav.map((item, index) => (
							<TransitionLink
								key={item.href}
								href={item.href}
								onClick={() => setOpen(false)}
								style={{
									animationDelay: closing
										? `${index * 40}ms`
										: `${60 + index * 70}ms`,
								}}
								className={cn(
									"mobile-menu-item font-display text-5xl font-bold tracking-tight",
									isActive(item.href) ? "text-primary" : "text-foreground",
								)}
							>
								{item.label}
							</TransitionLink>
						))}
					</nav>
					<p className="mobile-menu-item border-t border-border/60 px-8 py-6 font-mono text-xs text-faint">
						{Profile.location.label[lang]} · {Profile.email}
					</p>
				</div>
			)}
		</>
	);
}
