import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { pagePath } from "@/Application/Site";
import { formatPeriod, rolesByStart } from "@/Resources/Content/Experience";
import type { Lang } from "@/Resources/Content/Localized";
import { Profile } from "@/Resources/Content/Profile";
import { dictionary } from "@/Resources/Dictionary";
import { CopyEmailButton } from "@/Interface/Components/CopyEmailButton";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import { ScrambleText } from "@/Interface/Components/ScrambleText";
import { PixelatedImage } from "@/Interface/Components/PixelatedImage";
import { resetTilt, tiltTowardsPointer } from "@/Interface/Components/PointerEffects";

export function HomeView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);
	const [activeDomain, setActiveDomain] = useState(0);
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
							className="cut-sm cut-fill inline-flex min-h-12 items-center gap-2 bg-primary px-5 font-mono text-[13px] font-semibold tracking-wide uppercase text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90"
						>
							<ScrambleText text={t.home.contactAction} />
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</TransitionLink>
						<TransitionLink
							href={pagePath("about", lang)}
							className="cut-sm cut-hover inline-flex min-h-12 items-center px-5 font-mono text-[13px] font-semibold tracking-wide uppercase text-foreground hover:-translate-y-0.5"
						>
							<ScrambleText text={t.home.aboutAction} />
						</TransitionLink>
					</div>
				</div>

				{/*
				 * The entrance animation stays on the outer element: its final transform
				 * would otherwise override the tilt. On hover the card follows the pointer,
				 * glitch slices pass over the photo and the values decode from binary.
				 */}
				<div className="rise rise-2 mx-auto w-full max-w-[340px]">
					<div
						className="profile-card tilt"
						data-scramble-trigger
						onPointerMove={tiltTowardsPointer}
						onPointerLeave={resetTilt}
					>
						<div className="cut overflow-hidden bg-card">
							<div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[11px] tracking-widest text-faint">
								<span>{t.home.profile.toUpperCase()}</span>
								<span className="inline-flex items-center gap-1.5">
									<span
										className="profile-live-dot h-1.5 w-1.5 bg-primary shadow-[0_0_8px_var(--color-primary)]"
										aria-hidden="true"
									/>
									{t.home.profileNow.toUpperCase()}
								</span>
							</div>
							<div className="profile-photo relative">
								<PixelatedImage
									src={Profile.portrait.path}
									alt={t.about.portraitAlt}
									width={340}
									height={300}
									fetchPriority="high"
									frameClassName="h-[300px] w-full"
								/>
								{/* Tinted copies of the photo, shifted in slices for the glitch. */}
								<img
									src={Profile.portrait.path}
									alt=""
									aria-hidden="true"
									className="profile-glitch profile-glitch-warm"
								/>
								<img
									src={Profile.portrait.path}
									alt=""
									aria-hidden="true"
									className="profile-glitch profile-glitch-cold"
								/>
							</div>
							<dl className="px-4 py-1.5 font-mono text-[12.5px]">
								{[
									[t.home.profileRole, "Head of Software Eng."],
									[t.home.profileFocus, t.home.focus],
									[t.home.profileBase, Profile.location.label[lang]],
								].map(([label, value], index) => (
									<div
										key={label}
										className="flex justify-between gap-3 border-b border-dashed border-border py-2.5 last:border-0"
									>
										<dt className="text-faint">{label?.toUpperCase()}</dt>
										<dd className="text-right">
											<ScrambleText text={value ?? ""} delay={index * 140} />
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
				<h2 className="font-display text-3xl font-bold tracking-tight">
					{t.home.domainsTitle}
				</h2>
				{/* The card under the pointer widens and stays lit until another one is reached. */}
				<div className="mt-8 flex flex-col gap-5 md:flex-row">
					{t.home.domains.map((domain, index) => (
						<article
							key={domain.title}
							onPointerEnter={() => setActiveDomain(index)}
							data-active={index === activeDomain}
							className="domain-card cut flex flex-col gap-3 p-7"
						>
							<p className="domain-detail font-mono text-xs">
								{String(index + 1).padStart(2, "0")}
							</p>
							<h3 className="font-display text-2xl font-semibold">{domain.title}</h3>
							<p className="domain-text">{domain.text}</p>
							<p className="domain-detail mt-auto pt-3 font-mono text-xs">
								{domain.tags}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<h2 className="font-display text-3xl font-bold tracking-tight">
						{t.home.careerTitle}
					</h2>
					<TransitionLink
						href={pagePath("about", lang)}
						className="inline-flex min-h-11 items-center gap-2 font-mono text-[13px] font-semibold tracking-wide text-accent uppercase hover:text-primary"
					>
						<ScrambleText text={t.home.details} />
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</TransitionLink>
				</div>
				<div className="relative mt-10">
					<div
						className="absolute top-[7px] right-0 left-0 hidden h-px bg-gradient-to-r from-ember to-primary sm:block"
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
												? "block h-3.5 w-3.5 scale-[0.8] rotate-45 border-2 border-primary bg-primary shadow-[0_0_0_5px_oklch(0.7_0.19_47/0.18)]"
												: "block h-3.5 w-3.5 scale-[0.8] rotate-45 border-2 border-primary bg-background transition-colors group-hover:bg-primary"
										}
										aria-hidden="true"
									/>
									<p className="mt-3 font-mono text-xs text-accent">
										{formatPeriod(role, lang)}
									</p>
									<p className="mt-1 text-sm font-medium">{role.title[lang]}</p>
								</li>
							);
						})}
					</ol>
				</div>
			</section>

			<section className="reveal mx-auto max-w-6xl px-4 pt-16 pb-28 sm:px-6">
				<div className="flex flex-wrap items-center justify-between gap-8 cut bg-card p-8 sm:p-12">
					<div>
						<h2 className="font-display text-3xl font-bold tracking-tight">
							{t.home.contactTitle}
						</h2>
						<p className="mt-2 font-mono text-muted-foreground">{Profile.email}</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<TransitionLink
							href={pagePath("contact", lang)}
							className="cut-sm cut-fill inline-flex min-h-12 items-center bg-primary px-6 font-mono text-[13px] font-semibold tracking-wide uppercase text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90"
						>
							<ScrambleText text={t.home.contactAction} />
						</TransitionLink>
						<CopyEmailButton />
					</div>
				</div>
			</section>
		</>
	);
}
