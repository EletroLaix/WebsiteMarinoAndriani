import { useEffect, useState, type ReactNode } from "react";
import { randomBit, scrambledFrame } from "@/Application/Scramble";
import { TrekProfiles } from "@/Application/TrekProfiles";
import type { Lang } from "@/Resources/Content/Localized";
import { PassionSections, type PassionSection } from "@/Resources/Content/Passions";
import { dictionary } from "@/Resources/Dictionary";
import { TransitionLink, usePageTransition } from "@/Interface/Components/PageTransition";

/** Time between the start of one row's counter and the next. */
const RowStagger = 450;
const FirstRowDelay = 350;
const PublishedCount = 1800;
/** Pause on 100% before the counter decodes into the "open" label. */
const OpenDelay = 450;
const DecodeDuration = 520;
const DecodeFlip = 45;
const GlitchFrames = 7;
const GlitchFlip = 45;

function threeDigits(value: number): string {
	return String(value).padStart(3, "0");
}

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Counts from 0 to the target with an ease-out, starting after the delay once `active`. */
function useCounter(target: number, duration: number, delay: number, active: boolean) {
	const [value, setValue] = useState(0);
	useEffect(() => {
		if (!active) return;
		if (prefersReducedMotion()) {
			setValue(target);
			return;
		}
		let frame = 0;
		const timeout = window.setTimeout(() => {
			const start = performance.now();
			const step = (now: number) => {
				const progress = Math.min((now - start) / duration, 1);
				setValue(Math.round(target * (1 - (1 - progress) ** 3)));
				if (progress < 1) frame = requestAnimationFrame(step);
			};
			frame = requestAnimationFrame(step);
		}, delay);
		return () => {
			window.clearTimeout(timeout);
			cancelAnimationFrame(frame);
		};
	}, [target, duration, delay, active]);
	return value;
}

/** Shows `text` decoding from zeros and ones once `active` becomes true. */
function useDecoded(text: string, active: boolean) {
	const [frame, setFrame] = useState<string>();
	useEffect(() => {
		if (!active || prefersReducedMotion()) return;
		let animation = 0;
		let lastFlip = 0;
		const start = performance.now();
		const step = (now: number) => {
			const progress = (now - start) / DecodeDuration;
			if (progress >= 1) {
				setFrame(undefined);
				return;
			}
			if (now - lastFlip >= DecodeFlip) {
				lastFlip = now;
				setFrame(scrambledFrame(text, progress));
			}
			animation = requestAnimationFrame(step);
		};
		animation = requestAnimationFrame(step);
		return () => cancelAnimationFrame(animation);
	}, [text, active]);
	return frame ?? text;
}

/** The three treks' elevation profiles, drawn behind the trekking row on hover. */
function TrekkingPreview() {
	const width = 1000;
	const height = 150;
	const baseline = 146;
	const highest = Math.max(
		...TrekProfiles.flatMap((trek) => trek.profile.points.map(([, elevation]) => elevation)),
	);
	const top = Math.ceil(highest / 500) * 500;
	return (
		<svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
			{TrekProfiles.map((trek, index) => {
				const { distance, points } = trek.profile;
				const path = points
					.map(
						([d, elevation], point) =>
							`${point ? "L" : "M"}${((d / distance) * width).toFixed(1)},${(baseline - (elevation / top) * (height - 22)).toFixed(1)}`,
					)
					.join("");
				const strength = `${50 + (50 * (index + 1)) / TrekProfiles.length}%`;
				return (
					<g key={trek.id} style={{ ["--strength" as string]: strength }}>
						<path
							d={`${path}L${width},${height}L0,${height}Z`}
							className="passion-preview-area"
						/>
						<path
							d={path}
							pathLength={1}
							className="passion-preview-line"
							style={{ transitionDelay: `${index * 0.2}s` }}
							vectorEffect="non-scaling-stroke"
						/>
					</g>
				);
			})}
		</svg>
	);
}

const Previews: Partial<Record<PassionSection["id"], () => ReactNode>> = {
	trekking: TrekkingPreview,
};

function PublishedRow({
	section,
	index,
	lang,
	ready,
}: {
	section: PassionSection;
	index: number;
	lang: Lang;
	ready: boolean;
}) {
	const t = dictionary(lang);
	const delay = FirstRowDelay + index * RowStagger;
	const value = useCounter(100, PublishedCount, delay, ready);
	const [open, setOpen] = useState(false);
	const label = useDecoded(`${t.passions.open} →`, open);
	const Preview = Previews[section.id];

	useEffect(() => {
		if (value < 100) return;
		const timeout = window.setTimeout(() => setOpen(true), OpenDelay);
		return () => window.clearTimeout(timeout);
	}, [value]);

	return (
		<TransitionLink
			href={section.path[lang]}
			className={`passion-row is-published ${open ? "is-open" : ""}`}
			aria-label={`${section.title[lang]} · ${t.passions.open}`}
		>
			{Preview && (
				<span className="passion-preview">
					<Preview />
				</span>
			)}
			<span className="passion-number" aria-hidden="true">
				{String(index + 1).padStart(2, "0")}
			</span>
			<h2 className="passion-title">{section.title[lang]}</h2>
			<span className="passion-side" aria-hidden="true">
				<span className="passion-counter">
					{open ? (
						<span className="passion-open">{label}</span>
					) : (
						<>
							{threeDigits(value)}
							<sup>%</sup>
						</>
					)}
				</span>
			</span>
		</TransitionLink>
	);
}

function UnpublishedRow({
	section,
	index,
	lang,
	ready,
}: {
	section: PassionSection;
	index: number;
	lang: Lang;
	ready: boolean;
}) {
	const t = dictionary(lang);
	const target = section.progress ?? 0;
	const status = section.status?.[lang] ?? t.passions.inPreparation;
	const delay = FirstRowDelay + index * RowStagger;
	const value = useCounter(target, 900 + target * 12, delay, ready);
	const stuck = ready && value === target;
	const statusText = useDecoded(status, stuck);
	const [glitch, setGlitch] = useState<string>();

	// Once stuck, the digits break into zeros and ones for an instant every few seconds.
	useEffect(() => {
		if (!stuck || prefersReducedMotion()) return;
		let timeout = 0;
		let interval = 0;
		const schedule = () => {
			timeout = window.setTimeout(
				() => {
					let frames = 0;
					interval = window.setInterval(() => {
						frames += 1;
						if (frames > GlitchFrames) {
							window.clearInterval(interval);
							setGlitch(undefined);
							schedule();
							return;
						}
						setGlitch(randomBit() + randomBit() + randomBit());
					}, GlitchFlip);
				},
				2600 + Math.random() * 1200,
			);
		};
		schedule();
		return () => {
			window.clearTimeout(timeout);
			window.clearInterval(interval);
		};
	}, [stuck]);

	return (
		<div className={`passion-row is-unpublished ${stuck ? "is-stuck" : ""}`}>
			<span className="passion-number" aria-hidden="true">
				{String(index + 1).padStart(2, "0")}
			</span>
			<h2 className="passion-title">
				{section.title[lang]}
				<span className="sr-only"> · {t.passions.inPreparation}</span>
			</h2>
			<span className="passion-side" aria-hidden="true">
				<span className="passion-counter">
					{glitch ?? threeDigits(value)}
					<sup>%</sup>
				</span>
				<span className="passion-status">{stuck ? statusText : " "}</span>
			</span>
		</div>
	);
}

export function PassionsView({ lang }: { lang: Lang }) {
	const t = dictionary(lang);
	const { bootComplete } = usePageTransition();
	const sections = [...PassionSections].sort(
		(first, second) => Number(second.published) - Number(first.published),
	);

	return (
		<section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
			<h1 className="rise font-display text-5xl font-bold tracking-tighter sm:text-6xl">
				{t.passions.title}
			</h1>
			<p className="rise rise-1 mt-5 text-lg text-muted-foreground">{t.passions.intro}</p>
			<ol className="passion-index rise rise-2 mt-12">
				{sections.map((section, index) => (
					<li key={section.id}>
						{section.published ? (
							<PublishedRow
								section={section}
								index={index}
								lang={lang}
								ready={bootComplete}
							/>
						) : (
							<UnpublishedRow
								section={section}
								index={index}
								lang={lang}
								ready={bootComplete}
							/>
						)}
					</li>
				))}
			</ol>
		</section>
	);
}
