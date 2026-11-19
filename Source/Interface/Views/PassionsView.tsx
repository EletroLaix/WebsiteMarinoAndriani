import { ArrowRight, Github, Mountain, Quote } from "lucide-react";
import type { Lang } from "@/Resources/Content/Localized";
import { PassionSections } from "@/Resources/Content/Passions";
import { dictionary } from "@/Resources/Dictionary";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import { moveSpotlight } from "@/Interface/Components/PointerEffects";

const SectionIcons = { lab: Github, quotes: Quote, trekking: Mountain };

export function PassionsView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);
	const sections = [...PassionSections].sort(
		(first, second) => Number(second.published) - Number(first.published),
	);

	return (
		<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
			<h1 className="rise font-display text-5xl font-bold tracking-tighter sm:text-6xl">
				{t.passions.title}
			</h1>
			<p className="rise rise-1 mt-5 text-lg text-muted-foreground">{t.passions.intro}</p>
			<div className="mt-12 grid gap-5 md:grid-cols-2">
				{sections.map((section) => {
					const Icon = SectionIcons[section.id];
					if (!section.published) {
						return (
							<article
								key={section.id}
								className="cut flex flex-col gap-3 bg-card p-7"
							>
								<Icon className="size-6 text-muted-foreground" aria-hidden="true" />
								<h2 className="font-display text-2xl font-semibold">
									{section.title[lang]}
								</h2>
								<p className="text-muted-foreground">{section.summary[lang]}</p>
								<p className="font-display text-xs uppercase text-muted-foreground">
									{lang === "it" ? "In preparazione" : "Coming soon"}
								</p>
							</article>
						);
					}
					return (
						<TransitionLink
							key={section.id}
							href={section.path[lang]}
							onPointerEnter={moveSpotlight}
							onPointerMove={moveSpotlight}
							className="spotlight cut cut-hover flex flex-col gap-3 bg-card p-7 hover:-translate-y-1 md:col-span-2"
						>
							<Icon className="size-6 text-accent" aria-hidden="true" />
							<h2 className="font-display text-2xl font-semibold">
								{section.title[lang]}
							</h2>
							<p className="text-muted-foreground">{section.summary[lang]}</p>
							<span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
								{t.passions.open}
								<ArrowRight className="h-4 w-4" aria-hidden="true" />
							</span>
						</TransitionLink>
					);
				})}
			</div>
		</section>
	);
}
