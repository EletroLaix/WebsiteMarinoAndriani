import { useEffect, useMemo, useRef, useState } from "react";
import { AttributionControl, LngLatBounds, Map, Marker, type LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { combineTracks, TrackPoint } from "@/Application/Gpx";
import type { Lang } from "@/Resources/Content/Localized";
import type { Stage } from "@/Resources/Content/Trekking";
import { usePageTransition } from "@/Interface/Components/PageTransition";

const MapStyle = "https://tiles.openfreemap.org/styles/dark";
const PreviewDuration = 4800;
const AttributionDuration = 5000;
const TrailAccent = "#ff782c";
/** Share of the map height covered by the stage profile, kept free when framing the trail. */
const ProfileShare = 0.4;

const Copy = {
	it: {
		profile: "Profilo a tappe",
		stage: "Tappa",
		difficulty: { moderate: "moderata", hard: "impegnativa", veryHard: "molto impegnativa" },
		unavailable: "Mappa non disponibile in questo browser.",
		credits: "Crediti cartografici",
	},
	en: {
		profile: "Stage profile",
		stage: "Stage",
		difficulty: { moderate: "moderate", hard: "hard", veryHard: "very hard" },
		unavailable: "The map is unavailable in this browser.",
		credits: "Map credits",
	},
};

const DifficultyLevel: Record<Stage["difficulty"], number> = { moderate: 1, hard: 2, veryHard: 3 };

function coordinates(point: TrackPoint): [number, number] {
	return [point.longitude, point.latitude];
}

function pointAtDistance(points: TrackPoint[], distance: number) {
	let first = 0;
	let last = points.length - 1;
	while (first < last) {
		const middle = Math.floor((first + last) / 2);
		if (points[middle]!.distance < distance) first = middle + 1;
		else last = middle;
	}
	return points[first];
}

function buildProfile({ segments, starts }: ReturnType<typeof combineTracks>) {
	const points = segments.flat();
	const maxDistance = points.at(-1)!.distance;
	const elevations = points.flatMap((point) =>
		point.elevation === null ? [] : [point.elevation],
	);
	const minimum = elevations.reduce((current, value) => Math.min(current, value), Infinity);
	const maximum = elevations.reduce((current, value) => Math.max(current, value), -Infinity);
	const x = (distance: number) => ((distance / maxDistance) * 600).toFixed(1);
	const y = (value: number) =>
		(maximum === minimum ? 44 : 84 - ((value - minimum) / (maximum - minimum)) * 76).toFixed(1);
	const profile = segments.map((segment) => {
		let command = "M";
		return segment
			.map((point) => {
				if (point.elevation === null) {
					command = "M";
					return "";
				}
				const draw = `${command}${x(point.distance)},${y(point.elevation)}`;
				command = "L";
				return draw;
			})
			.join(" ");
	});
	const areas = segments.flatMap((segment) => {
		const measured = segment.filter((point) => point.elevation !== null);
		if (measured.length < 2) return [];
		const outline = measured.map(
			(point, index) => `${index ? "L" : "M"}${x(point.distance)},${y(point.elevation!)}`,
		);
		return [
			`${outline.join("")}L${x(measured.at(-1)!.distance)},88L${x(measured[0]!.distance)},88Z`,
		];
	});
	// Each stage runs from its first point to the start of the next one, as recorded in the GPX files.
	const stages = starts.map((start, index) => ({
		number: start.stage,
		from: start.point.distance / maxDistance,
		to: (starts[index + 1]?.point.distance ?? maxDistance) / maxDistance,
	}));
	return {
		points,
		maxDistance,
		profile,
		areas,
		stages,
		minimum: Math.round(minimum),
		maximum: Math.round(maximum),
		hasElevation: elevations.length > 1,
	};
}

export default function TrackMap({
	track,
	stages,
	areaBounds,
	label,
	lang,
}: {
	track: ReturnType<typeof combineTracks> | undefined;
	stages: Stage[];
	areaBounds: LngLatBoundsLike;
	label: string;
	lang: Lang;
}) {
	const t = Copy[lang];
	const container = useRef<HTMLDivElement>(null);
	const cursor = useRef<Marker | null>(null);
	const { bootComplete } = usePageTransition();
	const [mapUnavailable, setMapUnavailable] = useState(false);
	const [mapReady, setMapReady] = useState(false);
	const [progress, setProgress] = useState(0);
	const elevation = useMemo(() => (track ? buildProfile(track) : undefined), [track]);
	const number = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }), [lang]);
	const wholeNumber = useMemo(() => new Intl.NumberFormat(lang), [lang]);
	const selected =
		elevation && pointAtDistance(elevation.points, elevation.maxDistance * progress);
	const showProfile = Boolean(elevation?.hasElevation && selected);
	const currentStage = elevation?.stages.find(
		(stage, index, all) => progress < stage.to || index === all.length - 1,
	)?.number;

	useEffect(() => {
		if (!container.current) return;
		const target = container.current;
		const accent = getComputedStyle(target).getPropertyValue("--accent").trim() || TrailAccent;
		let map: Map;
		try {
			map = new Map({
				container: target,
				style: MapStyle,
				// Credits sit at the top, away from the stage profile drawn over the bottom edge.
				attributionControl: false,
				scrollZoom: false,
				cooperativeGestures: true,
			});
		} catch {
			setMapUnavailable(true);
			return;
		}
		map.addControl(new AttributionControl({ compact: true }), "top-right");
		const canvas = map.getCanvas();
		function activateWheel(event: PointerEvent) {
			if (event.pointerType !== "mouse" || event.button !== 0) return;
			map.cooperativeGestures.disable();
			map.scrollZoom.enable();
		}
		function restorePageScroll() {
			map.scrollZoom.disable();
			map.cooperativeGestures.enable();
		}
		canvas.addEventListener("pointerdown", activateWheel);
		target.addEventListener("pointerleave", restorePageScroll);
		canvas.addEventListener("blur", restorePageScroll);
		function removeMap() {
			canvas.removeEventListener("pointerdown", activateWheel);
			target.removeEventListener("pointerleave", restorePageScroll);
			canvas.removeEventListener("blur", restorePageScroll);
			cursor.current = null;
			map.remove();
		}
		if (!track) {
			map.fitBounds(areaBounds, { padding: 32, duration: 0 });
			return removeMap;
		}
		const { segments, starts } = track;
		const bounds = new LngLatBounds();
		for (const segment of segments) {
			for (const point of segment) bounds.extend(coordinates(point));
		}
		// The bottom of the map is covered by the stage profile, so the trail is framed above it.
		const profileSpace = Math.round(target.clientHeight * ProfileShare);
		map.fitBounds(bounds, {
			padding: { top: 52, right: 52, bottom: profileSpace, left: 52 },
			maxZoom: 16,
			duration: 0,
		});
		map.once("load", () => {
			map.addSource("trail", {
				type: "geojson",
				data: {
					type: "Feature",
					properties: {},
					geometry: {
						type: "MultiLineString",
						coordinates: segments.map((segment) => segment.map(coordinates)),
					},
				},
			});
			map.addLayer({
				id: "trail-outline",
				type: "line",
				source: "trail",
				layout: { "line-cap": "round", "line-join": "round" },
				paint: { "line-color": "#0c1014", "line-width": 8 },
			});
			map.addLayer({
				id: "trail-line",
				type: "line",
				source: "trail",
				layout: { "line-cap": "round", "line-join": "round" },
				paint: { "line-color": TrailAccent, "line-width": 4 },
			});
			setMapReady(true);
		});
		const start = segments[0]![0]!;
		const finish = segments.at(-1)!.at(-1)!;
		for (const item of starts) {
			const stage = document.createElement("span");
			stage.className =
				"grid size-6 place-items-center rounded-full border border-accent bg-background font-display text-xs font-semibold text-accent";
			stage.textContent = String(item.stage);
			new Marker({ element: stage, offset: [0, -13] })
				.setLngLat(coordinates(item.point))
				.addTo(map);
		}
		new Marker({ color: TrailAccent }).setLngLat(coordinates(finish)).addTo(map);
		const dot = document.createElement("span");
		dot.className = "trek-map-cursor size-3 rounded-full border-2 border-white";
		dot.style.background = accent;
		cursor.current = new Marker({ element: dot }).setLngLat(coordinates(start)).addTo(map);
		return removeMap;
	}, [areaBounds, track]);

	useEffect(() => {
		if (!bootComplete) return;
		const attribution = container.current?.querySelector(".maplibregl-ctrl-attrib");
		const toggle = attribution?.querySelector("summary");
		if (!attribution || !toggle) return;

		toggle.setAttribute("aria-label", t.credits);
		toggle.title = t.credits;
		let timeout: number | undefined;
		function stop() {
			window.clearTimeout(timeout);
			observer.disconnect();
			toggle?.removeEventListener("click", stop);
		}
		const observer = new IntersectionObserver(([entry]) => {
			window.clearTimeout(timeout);
			if (!entry?.isIntersecting) return;
			timeout = window.setTimeout(() => {
				if (
					attribution.classList.contains("maplibregl-compact-show") &&
					!attribution.contains(document.activeElement)
				) {
					toggle.click();
				}
				stop();
			}, AttributionDuration);
		});
		toggle.addEventListener("click", stop);
		observer.observe(attribution);
		return stop;
	}, [areaBounds, bootComplete, t, track]);

	useEffect(() => {
		const target = container.current;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (!target || !mapReady || !bootComplete || !track) return;

		let frame: number | undefined;
		let previous: number | undefined;
		let elapsed = 0;
		let entered = false;
		function pause() {
			if (frame !== undefined) cancelAnimationFrame(frame);
			frame = undefined;
			previous = undefined;
		}
		function stop() {
			pause();
			observer.disconnect();
			motion.removeEventListener("change", pause);
		}
		function advance(now: number) {
			elapsed += previous === undefined ? 0 : now - previous;
			previous = now;
			const nextProgress = Math.min(elapsed / PreviewDuration, 1);
			setProgress(nextProgress);
			frame = nextProgress < 1 ? requestAnimationFrame(advance) : undefined;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				const ratio = entry?.intersectionRatio ?? 0;
				if (ratio <= 0.15) {
					entered = false;
					pause();
					return;
				}
				if (ratio < 0.45 || entered || motion.matches) return;
				entered = true;
				elapsed = 0;
				setProgress(0);
				frame = requestAnimationFrame(advance);
			},
			{ threshold: [0.15, 0.45] },
		);
		motion.addEventListener("change", pause);
		observer.observe(target);
		return stop;
	}, [bootComplete, mapReady, track]);

	useEffect(() => {
		if (selected) cursor.current?.setLngLat(coordinates(selected));
	}, [selected]);

	return (
		<div className="relative">
			<div
				ref={container}
				role="region"
				aria-label={label}
				className={`trek-map h-[30rem] sm:h-[36rem] ${mapUnavailable ? "hidden" : ""}`}
			/>
			{mapUnavailable && (
				<p className="border-t border-border p-4 text-sm text-muted-foreground">
					{t.unavailable}
				</p>
			)}
			{showProfile && elevation && selected && (
				<div className={mapUnavailable ? "px-4 pb-3 sm:px-7" : "trek-profile"}>
					<p className="flex justify-between gap-4 font-display text-[0.6875rem] text-faint">
						<span>
							<span className="uppercase tracking-wider">{t.profile}</span>
							<span className="hidden sm:inline">
								{" "}
								· {wholeNumber.format(elevation.minimum)}–
								{wholeNumber.format(elevation.maximum)} m
							</span>
						</span>
						<span className="tabular-nums">
							<b className="font-semibold text-accent">
								{number.format(selected.distance)} km
							</b>
							{selected.elevation === null
								? ""
								: ` · ${wholeNumber.format(Math.round(selected.elevation))} m`}
						</span>
					</p>
					<svg
						viewBox="0 0 600 88"
						preserveAspectRatio="none"
						className="mt-1 h-20 w-full sm:h-24"
						aria-hidden="true"
					>
						{elevation.stages.map((stage) => (
							<rect
								key={stage.number}
								x={stage.from * 600}
								y="0"
								width={(stage.to - stage.from) * 600}
								height="88"
								className={`trek-profile-band ${stage.number === currentStage ? "is-current" : ""}`}
							/>
						))}
						{elevation.stages.slice(1).map((stage) => (
							<line
								key={stage.number}
								x1={stage.from * 600}
								x2={stage.from * 600}
								y1="0"
								y2="88"
								className="trek-profile-divider"
								vectorEffect="non-scaling-stroke"
							/>
						))}
						{elevation.areas.map((path, index) => (
							<path key={index} d={path} className="trek-profile-area" />
						))}
						{elevation.profile.map((path, index) => (
							<path
								key={index}
								d={path}
								className="trek-profile-line"
								vectorEffect="non-scaling-stroke"
							/>
						))}
						<line
							x1={progress * 600}
							x2={progress * 600}
							y1="0"
							y2="88"
							className="trek-profile-cursor"
							vectorEffect="non-scaling-stroke"
						/>
					</svg>
					<ol className="relative h-14 font-display text-[0.6875rem] text-faint">
						{elevation.stages.map((stage) => {
							const data = stages[stage.number - 1];
							const level = data ? DifficultyLevel[data.difficulty] : 0;
							return (
								<li
									key={stage.number}
									className={`trek-profile-stage ${stage.number === currentStage ? "is-current" : ""}`}
									style={{
										left: `${stage.from * 100}%`,
										width: `${(stage.to - stage.from) * 100}%`,
									}}
								>
									<b>
										{t.stage} {stage.number}
									</b>
									{data && (
										<>
											<span className="block">
												{number.format(data.distance)} km
												<span className="hidden sm:inline">
													{" "}
													· {wholeNumber.format(data.ascent)} m
												</span>
											</span>
											<span className="hidden sm:block">
												<span
													className="trek-profile-level"
													aria-hidden="true"
												>
													{"■".repeat(level)}
													<span>{"■".repeat(3 - level)}</span>
												</span>{" "}
												{t.difficulty[data.difficulty]}
											</span>
										</>
									)}
								</li>
							);
						})}
					</ol>
				</div>
			)}
		</div>
	);
}
