import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { combineTracks, type TrackPoint, type TrackStage } from "@/Application/Gpx";
import { pagePath } from "@/Application/Site";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import type { Lang } from "@/Resources/Content/Localized";
import { Treks, type Trek } from "@/Resources/Content/Trekking";

const WikilocProfile = "https://it.wikiloc.com/wikiloc/user.do?id=6510992";
const TrackMap = lazy(() => import("@/Interface/Components/TrackMap"));
const TrackFiles = import.meta.glob<TrackPoint[][]>("/Source/Resources/Tracks/*.gpx", {
	query: "?track",
	import: "default",
});

const Copy = {
	it: {
		back: "Passioni",
		title: "Cammini",
		intro: "Dal Lago di Como alla Maiella e all’Appennino. I miei viaggi a piedi, dal più recente al primo.",
		explore: "Esplora i cammini",
		wikiloc: "Il mio profilo Wikiloc",
		treks: "Cammini",
		stages: "Tappe",
		distance: "Distanza percorsa",
		ascent: "Dislivello positivo",
		missing: "Traccia GPS in preparazione",
		map: "Mappa",
		loading: "Caricamento della mappa…",
		failed: "Traccia GPS momentaneamente non disponibile",
		partial: "Tappe disponibili sulla mappa",
	},
	en: {
		back: "Passions",
		title: "Hikes",
		intro: "From Lake Como to the Maiella and the Apennines. My journeys on foot, from the latest to the first.",
		explore: "Explore the hikes",
		wikiloc: "My Wikiloc profile",
		treks: "Hikes",
		stages: "Stages",
		distance: "Distance covered",
		ascent: "Elevation gain",
		missing: "GPS track awaiting import",
		map: "Map",
		loading: "Loading map…",
		failed: "GPS track temporarily unavailable",
		partial: "Stages available on the map",
	},
};

const Timeline = [...Treks].sort((first, second) => second.year - first.year);

function trackFile(trek: Trek, stage: number) {
	const number = String(stage).padStart(2, "0");
	return TrackFiles[`/Source/Resources/Tracks/${trek.name} [${number}].gpx`];
}

function trekStats(trek: Trek) {
	return {
		distance: trek.stages.reduce((total, stage) => total + stage.distance, 0),
		ascent: trek.stages.reduce((total, stage) => total + stage.ascent, 0),
	};
}

function TrekMap({ trek, lang }: { trek: Trek; lang: Lang }) {
	const t = Copy[lang];
	const [stages, setStages] = useState<TrackStage[]>();
	const track = useMemo(() => (stages?.length ? combineTracks(stages) : undefined), [stages]);
	const hasFiles = trek.stages.some((_, index) => trackFile(trek, index + 1));

	useEffect(() => {
		if (!hasFiles) return;
		let active = true;
		async function loadTracks() {
			const loaded = await Promise.allSettled(
				trek.stages.flatMap((_, index) => {
					const load = trackFile(trek, index + 1);
					return load
						? [load().then((segments) => ({ number: index + 1, segments }))]
						: [];
				}),
			);
			if (active) {
				setStages(
					loaded.flatMap((stage) => (stage.status === "fulfilled" ? [stage.value] : [])),
				);
			}
		}
		void loadTracks();
		return () => {
			active = false;
		};
	}, [hasFiles, trek]);

	const loadingMap = (
		<p
			role="status"
			className="trek-map-placeholder grid h-[22rem] place-items-center p-6 text-sm text-muted-foreground sm:h-[28rem]"
		>
			{t.loading}
		</p>
	);
	if (hasFiles && !stages) return loadingMap;

	return (
		<ClientOnly fallback={loadingMap}>
			<Suspense fallback={loadingMap}>
				<TrackMap
					track={track}
					areaBounds={trek.mapBounds}
					label={`${t.map} · ${trek.name}`}
					lang={lang}
				/>
				{stages?.length !== trek.stages.length && (
					<p
						role="status"
						className="border-t border-border p-4 text-sm text-muted-foreground"
					>
						{stages?.length
							? `${t.partial} · ${stages.length}/${trek.stages.length}`
							: hasFiles
								? t.failed
								: t.missing}
					</p>
				)}
			</Suspense>
		</ClientOnly>
	);
}

function TrekEntry({ trek, lang, number }: { trek: Trek; lang: Lang; number: Intl.NumberFormat }) {
	const t = Copy[lang];
	const stats = trekStats(trek);
	const headingId = `${trek.id}-title`;

	return (
		<li className="relative border-l border-accent/35 pb-16 pl-6 last:pb-0 sm:pb-24 sm:pl-12">
			<span
				className="absolute -left-[5px] top-2 size-2.5 rotate-45 bg-accent"
				aria-hidden="true"
			/>
			<article id={trek.id} aria-labelledby={headingId} className="scroll-mt-28">
				<div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-display uppercase tracking-wider">
					<time
						dateTime={String(trek.year)}
						className="text-xl font-bold text-accent sm:text-2xl"
					>
						{trek.year}
					</time>
					<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<MapPin className="size-3.5" aria-hidden="true" /> {trek.area[lang]}
					</span>
				</div>
				<h2
					id={headingId}
					className="max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl"
				>
					{trek.name}
				</h2>
				<p className="mt-3 max-w-2xl text-base text-muted-foreground">
					{trek.description[lang]}
				</p>
				<dl className="my-6 flex flex-wrap gap-x-8 gap-y-3">
					{[
						{ label: t.distance, value: `${number.format(stats.distance)} km` },
						{ label: t.ascent, value: `${number.format(stats.ascent)} m` },
						{ label: t.stages, value: trek.stages.length },
					].map(({ label, value }) => (
						<div key={label}>
							<dt className="text-xs text-muted-foreground">{label}</dt>
							<dd className="font-display text-lg font-semibold tabular-nums">
								{value}
							</dd>
						</div>
					))}
				</dl>
				<TrekMap trek={trek} lang={lang} />
			</article>
		</li>
	);
}

export function TrekkingView({ lang }: { lang: Lang }) {
	const t = Copy[lang];
	const number = new Intl.NumberFormat(lang, { maximumFractionDigits: 2 });
	const distance = Timeline.reduce((total, trek) => total + trekStats(trek).distance, 0);
	const stageCount = Timeline.reduce((total, trek) => total + trek.stages.length, 0);

	return (
		<div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
			<section className="trek-hero cut isolate grid gap-8 bg-card px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
				<div>
					<TransitionLink
						href={pagePath("passions", lang)}
						className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-accent hover:underline"
					>
						<ArrowLeft className="size-4" aria-hidden="true" /> {t.back}
					</TransitionLink>
					<h1 className="mt-5 font-display text-[clamp(3.5rem,10vw,8rem)] font-bold leading-[0.94] tracking-tighter">
						{t.title}
					</h1>
					<p className="mt-6 max-w-lg text-lg text-muted-foreground">{t.intro}</p>
					<div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
						<a
							href={`#${Timeline[0]!.id}`}
							className="cut cut-hover inline-flex items-center gap-2 bg-accent px-4 py-3 font-display font-semibold text-accent-foreground"
						>
							{t.explore} <ArrowDown className="size-4" aria-hidden="true" />
						</a>
						<a
							href={WikilocProfile}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
						>
							{t.wikiloc} <ArrowUpRight className="size-4" aria-hidden="true" />
						</a>
					</div>
				</div>
				<dl className="grid grid-cols-2 gap-x-5 gap-y-4 border-l border-accent/35 pl-5 sm:pl-7">
					<div>
						<dt className="text-sm text-muted-foreground">{t.treks}</dt>
						<dd className="font-display text-3xl font-semibold text-accent">
							{Timeline.length}
						</dd>
					</div>
					<div>
						<dt className="text-sm text-muted-foreground">{t.stages}</dt>
						<dd className="font-display text-3xl font-semibold text-accent">
							{stageCount}
						</dd>
					</div>
					<div className="col-span-2">
						<dt className="text-sm text-muted-foreground">{t.distance}</dt>
						<dd className="font-display text-3xl font-semibold text-accent">
							{number.format(distance)} km
						</dd>
					</div>
				</dl>
			</section>
			<ol className="mt-12 pl-1 sm:mt-16 sm:pl-2">
				{Timeline.map((trek) => (
					<TrekEntry key={trek.id} trek={trek} lang={lang} number={number} />
				))}
			</ol>
		</div>
	);
}
