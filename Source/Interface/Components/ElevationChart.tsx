import { useEffect, useMemo, useState, type PointerEvent } from "react";
import type { ElevationProfile } from "@/Application/Gpx";
import type { Lang } from "@/Resources/Content/Localized";
import { usePageTransition } from "@/Interface/Components/PageTransition";

export type ChartTrek = {
	id: string;
	name: string;
	profile: ElevationProfile;
};

const Width = 1000;
const Height = 270;
const Baseline = 255;
const PlotHeight = 190;
/** Samples per profile used to find the line closest to the pointer. */
const Samples = 240;
/** Vertical distance, in chart units, within which the pointer picks a line. */
const PickDistance = 28;
/** Peaks closer than this share of the width get their labels stacked. */
const LabelSpacing = 0.25;
/** On phones a label takes about half the width, so peaks need more room to share a level. */
const NarrowLabelSpacing = 0.6;
/** Chart heights in pixels on phones and on larger screens, matching the stylesheet. */
const NarrowChartHeight = 200;
const ChartHeight = 272;
/** Label geometry in pixels: the shortest stem, the half size of the summit dot, a label's height. */
const MinimumStem = 26;
const DotRadius = 7;
const LabelHeight = 24;
/** Time after which every line, area and summit has finished its entrance. */
const SettleDelay = 4500;

function elevationAt(profile: ElevationProfile, distance: number): number {
	const { points } = profile;
	let first = 0;
	let last = points.length - 1;
	while (first < last) {
		const middle = Math.floor((first + last) / 2);
		if (points[middle]![0] < distance) first = middle + 1;
		else last = middle;
	}
	return points[first]![1];
}

function buildChart(treks: ChartTrek[]) {
	const highest = Math.max(...treks.flatMap((trek) => trek.profile.points.map(([, e]) => e)));
	const step = highest > 3000 ? 1000 : 500;
	const top = Math.max(step, Math.ceil(highest / step) * step);
	const y = (elevation: number) => Baseline - (elevation / top) * PlotHeight;
	const grid = Array.from({ length: top / step + 1 }, (_, index) => index * step);

	const lines = treks.map((trek) => {
		const { distance, points } = trek.profile;
		const path = points
			.map(
				([d, e], index) =>
					`${index ? "L" : "M"}${((d / distance) * Width).toFixed(1)},${y(e).toFixed(1)}`,
			)
			.join("");
		const peak = points.reduce((best, point) => (point[1] > best[1] ? point : best));
		const samples = Array.from({ length: Samples + 1 }, (_, index) =>
			y(elevationAt(trek.profile, (index / Samples) * distance)),
		);
		return {
			trek,
			path,
			area: `${path}L${Width},${Baseline}L0,${Baseline}Z`,
			peak: { x: peak[0] / distance, y: y(peak[1]) / Height, elevation: peak[1] },
			samples,
		};
	});

	return {
		grid,
		y,
		lines,
		stems: stackLabels(lines, LabelSpacing, ChartHeight),
		narrowStems: stackLabels(lines, NarrowLabelSpacing, NarrowChartHeight),
	};
}

/**
 * Gives each summit the stem length, in pixels, that keeps its label clear of the others:
 * from the highest summit down, a label that would overlap one already placed is lifted above it.
 */
function stackLabels(
	lines: { trek: ChartTrek; peak: { x: number; y: number } }[],
	spacing: number,
	chartHeight: number,
) {
	const stems = new Map<string, number>();
	const placed: { x: number; bottom: number }[] = [];
	for (const line of [...lines].sort((first, second) => first.peak.y - second.peak.y)) {
		const peak = line.peak.y * chartHeight;
		let bottom = peak - MinimumStem - DotRadius;
		let blocker = placed.find(
			(other) =>
				Math.abs(other.x - line.peak.x) < spacing &&
				Math.abs(other.bottom - bottom) < LabelHeight,
		);
		while (blocker) {
			bottom = blocker.bottom - LabelHeight;
			blocker = placed.find(
				(other) =>
					Math.abs(other.x - line.peak.x) < spacing &&
					Math.abs(other.bottom - bottom) < LabelHeight,
			);
		}
		placed.push({ x: line.peak.x, bottom });
		stems.set(line.trek.id, Math.round(peak - bottom - DotRadius));
	}
	return stems;
}

/** Keeps a label inside the chart: centred on its summit, or starting or ending there near an edge. */
function labelShift(x: number, edge: number): string {
	if (x < edge) return "-10px";
	if (x > 1 - edge) return "calc(-100% + 10px)";
	return "-50%";
}

/** The elevation profiles of every trek on one altitude scale, with each summit labelled. */
export function ElevationChart({ treks, lang }: { treks: ChartTrek[]; lang: Lang }) {
	const { bootComplete } = usePageTransition();
	const [highlighted, setHighlighted] = useState<string>();
	const [settled, setSettled] = useState(false);
	const chart = useMemo(() => buildChart(treks), [treks]);
	const number = useMemo(() => new Intl.NumberFormat(lang), [lang]);

	useEffect(() => {
		if (!bootComplete) return;
		const timeout = window.setTimeout(() => setSettled(true), SettleDelay);
		return () => window.clearTimeout(timeout);
	}, [bootComplete]);

	function pickLine(event: PointerEvent<HTMLDivElement>) {
		setSettled(true);
		const label = (event.target as HTMLElement).closest<HTMLElement>("[data-peak]");
		if (label) {
			setHighlighted(label.dataset["peak"]);
			return;
		}
		const bounds = event.currentTarget.getBoundingClientRect();
		const ratio = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
		const pointer = ((event.clientY - bounds.top) / bounds.height) * Height;
		const index = Math.round(ratio * Samples);
		let closest: string | undefined;
		let distance = PickDistance;
		for (const line of chart.lines) {
			const gap = Math.abs(line.samples[index]! - pointer);
			if (gap < distance) {
				distance = gap;
				closest = line.trek.id;
			}
		}
		setHighlighted(closest);
	}

	return (
		<div
			className={`elevation-chart ${bootComplete ? "is-drawn" : ""} ${settled ? "is-settled" : ""} ${highlighted ? "is-highlighting" : ""}`}
			onPointerMove={pickLine}
			onPointerLeave={() => setHighlighted(undefined)}
		>
			<svg viewBox={`0 0 ${Width} ${Height}`} preserveAspectRatio="none" aria-hidden="true">
				{chart.grid.map((elevation) => (
					<line
						key={elevation}
						x1="0"
						x2={Width}
						y1={chart.y(elevation)}
						y2={chart.y(elevation)}
						className="elevation-chart-grid"
						vectorEffect="non-scaling-stroke"
					/>
				))}
				{chart.lines.map((line, index) => (
					<g
						key={line.trek.id}
						className={`elevation-chart-trek ${highlighted === line.trek.id ? "is-active" : ""}`}
						style={{
							["--strength" as string]: `${50 + (50 * (index + 1)) / chart.lines.length}%`,
							["--delay" as string]: `${index * 0.35}s`,
						}}
					>
						<path d={line.area} className="elevation-chart-area" />
						<path
							d={line.path}
							pathLength={1}
							className="elevation-chart-line"
							vectorEffect="non-scaling-stroke"
						/>
					</g>
				))}
			</svg>
			{chart.grid.map((elevation) => (
				<span
					key={elevation}
					className="elevation-chart-scale"
					style={{ top: `${(chart.y(elevation) / Height) * 100}%` }}
				>
					{number.format(elevation)} m
				</span>
			))}
			{chart.lines.map((line, index) => {
				return (
					<span
						key={line.trek.id}
						data-peak={line.trek.id}
						className={`elevation-chart-peak ${highlighted === line.trek.id ? "is-active" : ""}`}
						style={{
							left: `${line.peak.x * 100}%`,
							top: `${line.peak.y * 100}%`,
							["--stem" as string]: `${chart.stems.get(line.trek.id) ?? 26}px`,
							["--narrow-stem" as string]: `${chart.narrowStems.get(line.trek.id) ?? 26}px`,
							["--shift" as string]: labelShift(line.peak.x, 0.12),
							["--narrow-shift" as string]: labelShift(line.peak.x, 0.35),
							["--delay" as string]: `${1.8 + index * 0.3}s`,
						}}
					>
						<span className="elevation-chart-stem" />
						<span className="elevation-chart-dot" />
						<span className="elevation-chart-label">
							<b>{number.format(line.peak.elevation)} m</b> {line.trek.name}
						</span>
					</span>
				);
			})}
		</div>
	);
}
