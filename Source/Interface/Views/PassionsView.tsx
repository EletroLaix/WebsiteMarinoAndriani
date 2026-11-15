import { ArrowRight } from "lucide-react";
import type { Lang } from "@/Resources/Content/Localized";
import { publishedPassionSections } from "@/Resources/Content/Passions";
import { dictionary } from "@/Resources/Dictionary";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import { moveSpotlight } from "@/Interface/Components/PointerEffects";

/** Hub of the "Passioni" area; lists only the published sub-sections. */
export function PassionsView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);

	return (
		<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
			<h1 className="rise font-display text-5xl font-bold tracking-tighter sm:text-6xl">
				{t.passions.title}
			</h1>
			<p className="rise rise-1 mt-5 text-lg text-muted-foreground">{t.passions.intro}</p>
			<div className="mt-12 grid gap-5 md:grid-cols-2">
				{publishedPassionSections().map((section) => (
					<TransitionLink
						key={section.id}
						href={section.path[lang]}
						onPointerMove={moveSpotlight}
						className="spotlight flex flex-col gap-3 rounded-2xl border border-border bg-card p-7 hover:-translate-y-1 hover:border-primary/60"
					>
						<h2 className="font-display text-2xl font-semibold">
							{section.title[lang]}
						</h2>
						<p className="text-muted-foreground">{section.summary[lang]}</p>
						<span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
							{t.passions.open}
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</span>
					</TransitionLink>
				))}
			</div>
		</section>
	);
}
