import { ArrowRight } from "lucide-react";
import { pagePath } from "@/Application/Site";
import { formatPeriod, rolesByStart } from "@/Resources/Content/Experience";
import type { Lang } from "@/Resources/Content/Localized";
import { Profile } from "@/Resources/Content/Profile";
import { dictionary } from "@/Resources/Dictionary";
import { CopyEmailButton } from "@/Interface/Components/CopyEmailButton";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import {
	moveSpotlight,
	resetTilt,
	tiltTowardsPointer,
} from "@/Interface/Components/PointerEffects";

export function HomeView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);
	const milestones = rolesByStart().filter(
		(role) => role.kind === "work" || role.id === "barimakers",
	);

	return (
		<>
			{/* The hero fills the first screen; the rest of the page is revealed by scrolling. */}
			<section className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl content-center items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0">
					<p className="rise font-mono text-sm tracking-wide text-accent">
						{Profile.location.label[lang]}
					</p>
					<h1 className="rise rise-1 mt-5 font-display text-6xl leading-[0.95] font-bold tracking-tighter sm:text-7xl lg:text-8xl">
						Marino
						<br />
						<span className="text-primary">Andriani</span>
					</h1>
					<p className="rise rise-2 mt-7 font-display text-xl font-medium sm:text-2xl">
						{t.home.role}
					</p>
					<p className="rise rise-3 mt-3 text-lg text-muted-foreground">
						{t.home.summary}
					</p>
					<div className="rise rise-4 mt-9 flex flex-wrap gap-3">
						<TransitionLink
							href={pagePath("contact", lang)}
							className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90"
						>
							{t.home.contactAction}
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</TransitionLink>
						<TransitionLink
							href={pagePath("about", lang)}
							className="inline-flex min-h-12 items-center rounded-lg border border-border px-5 text-sm font-semibold text-foreground hover:-translate-y-0.5 hover:border-primary"
						>
							{t.home.aboutAction}
						</TransitionLink>
					</div>
				</div>

				<div
					className="rise rise-2 tilt mx-auto w-full max-w-[340px]"
					onPointerMove={tiltTowardsPointer}
					onPointerLeave={resetTilt}
				>
					<div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_oklch(0.55_0.18_40/0.55)]">
						<div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[11px] tracking-widest text-faint">
							<span>{t.home.profile.toUpperCase()}</span>
							<span className="inline-flex items-center gap-1.5">
								<span
									className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
									aria-hidden="true"
								/>
								{t.home.profileNow.toUpperCase()}
							</span>
						</div>
						<img
							src={Profile.portrait.path}
							alt={t.about.portraitAlt}
							width={340}
							height={300}
							fetchPriority="high"
							className="h-[300px] w-full object-cover"
						/>
						<dl className="px-4 py-1.5 font-mono text-[12.5px]">
							{[
								[t.home.profileRole, "Head of Software Eng."],
								[t.home.profileFocus, t.home.focus],
								[t.home.profileBase, Profile.location.label[lang]],
							].map(([label, value]) => (
								<div
									key={label}
									className="flex justify-between gap-3 border-b border-dashed border-border py-2.5 last:border-0"
								>
									<dt className="text-faint">{label?.toUpperCase()}</dt>
									<dd className="text-right">{value}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
				<h2 className="font-display text-3xl font-bold tracking-tight">
					{t.home.domainsTitle}
				</h2>
				<div className="mt-8 grid gap-5 md:grid-cols-3">
					{t.home.domains.map((domain, index) => (
						<article
							key={domain.title}
							onPointerMove={moveSpotlight}
							className="spotlight flex flex-col gap-3 rounded-2xl border border-border bg-card p-7 hover:-translate-y-1 hover:border-primary/60"
						>
							<p className="font-mono text-xs text-faint">
								{String(index + 1).padStart(2, "0")}
							</p>
							<h3 className="font-display text-2xl font-semibold">{domain.title}</h3>
							<p className="text-muted-foreground">{domain.text}</p>
							<p className="mt-auto pt-3 font-mono text-xs text-faint">
								{domain.tags}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<h2 className="font-display text-3xl font-bold tracking-tight">
						{t.home.experienceTitle}
					</h2>
					<TransitionLink
						href={pagePath("about", lang)}
						className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:text-primary"
					>
						{t.home.details}
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</TransitionLink>
				</div>
				<div className="relative mt-12">
					<div
						className="absolute top-[9px] right-0 left-0 hidden h-0.5 bg-gradient-to-r from-ember to-primary sm:block"
						aria-hidden="true"
					/>
					<ol className="relative grid gap-8 sm:grid-cols-5 sm:gap-6">
						{milestones.map((role) => {
							const current = !role.end;
							return (
								<li key={role.id} className="group">
									<span
										className={
											current && role.id === "head"
												? "block h-5 w-5 rounded-full border-2 border-primary bg-primary shadow-[0_0_0_6px_oklch(0.7_0.19_47/0.18)]"
												: "block h-5 w-5 rounded-full border-2 border-primary bg-background transition-colors group-hover:bg-primary"
										}
										aria-hidden="true"
									/>
									<p className="mt-4 font-mono text-[13px] text-accent">
										{formatPeriod(role, lang)}
									</p>
									<p className="mt-1 font-semibold">{role.title[lang]}</p>
									<p className="text-sm text-muted-foreground">{role.company}</p>
								</li>
							);
						})}
					</ol>
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 pt-16 pb-28 sm:px-6">
				<div className="flex flex-wrap items-center justify-between gap-8 rounded-2xl border border-border bg-card p-8 sm:p-12">
					<div>
						<h2 className="font-display text-3xl font-bold tracking-tight">
							{t.home.contactTitle}
						</h2>
						<p className="mt-2 font-mono text-muted-foreground">{Profile.email}</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<TransitionLink
							href={pagePath("contact", lang)}
							className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90"
						>
							{t.home.contactAction}
						</TransitionLink>
						<CopyEmailButton />
					</div>
				</div>
			</section>
		</>
	);
}
