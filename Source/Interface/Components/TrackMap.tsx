import { useEffect, useMemo, useRef, useState } from "react";
import { LngLatBounds, Map, Marker, type LngLatBoundsLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { combineTracks, TrackPoint } from "@/Application/Gpx";
import type { Lang } from "@/Resources/Content/Localized";
import { usePageTransition } from "@/Interface/Components/PageTransition";

const MapStyle = "https://tiles.openfreemap.org/styles/dark";
const PreviewDuration = 4800;
const AttributionDuration = 5000;
const TrailAccent = "#ff782c";

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

function buildProfile(segments: TrackPoint[][]) {
	const points = segments.flat();
	const maxDistance = points.at(-1)!.distance;
	const elevations = points.flatMap((point) =>
		point.elevation === null ? [] : [point.elevation],
	);
	const minimum = elevations.reduce((current, value) => Math.min(current, value), Infinity);
	const maximum = elevations.reduce((current, value) => Math.max(current, value), -Infinity);
	const profile = segments.map((segment) => {
		let command = "M";
		return segment
			.map((point) => {
				if (point.elevation === null) {
					command = "M";
					return "";
				}
				const x = (point.distance / maxDistance) * 600;
				const y =
					maximum === minimum
						? 44
						: 80 - ((point.elevation - minimum) / (maximum - minimum)) * 72;
				const draw = `${command}${x.toFixed(1)},${y.toFixed(1)}`;
				command = "L";
				return draw;
			})
			.join(" ");
	});
	return { points, maxDistance, profile, hasElevation: elevations.length > 1 };
}

export default function TrackMap({
	track,
	areaBounds,
	label,
	lang,
}: {
	track: ReturnType<typeof combineTracks> | undefined;
	areaBounds: LngLatBoundsLike;
	label: string;
	lang: Lang;
}) {
	const container = useRef<HTMLDivElement>(null);
	const cursor = useRef<Marker | null>(null);
	const { bootComplete } = usePageTransition();
	const [mapUnavailable, setMapUnavailable] = useState(false);
	const [mapReady, setMapReady] = useState(false);
	const [progress, setProgress] = useState(0);
	const elevation = useMemo(() => (track ? buildProfile(track.segments) : undefined), [track]);
	const number = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }), [lang]);
	const selected =
		elevation && pointAtDistance(elevation.points, elevation.maxDistance * progress);

	useEffect(() => {
		if (!container.current) return;
		const target = container.current;
		const accent = getComputedStyle(target).getPropertyValue("--accent").trim() || TrailAccent;
		let map: Map;
		try {
			map = new Map({
				container: target,
				style: MapStyle,
				attributionControl: { compact: true },
				scrollZoom: false,
				cooperativeGestures: true,
			});
		} catch {
			setMapUnavailable(true);
			return;
		}
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
		map.fitBounds(bounds, { padding: 52, maxZoom: 16, duration: 0 });
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

		const label = lang === "it" ? "Crediti cartografici" : "Map credits";
		toggle.setAttribute("aria-label", label);
		toggle.title = label;
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
	}, [areaBounds, bootComplete, lang, track]);

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
		<>
			<div
				ref={container}
				role="region"
				aria-label={label}
				className={`trek-map h-[22rem] sm:h-[28rem] ${mapUnavailable ? "hidden" : ""}`}
			/>
			{mapUnavailable && (
				<p className="border-t border-border p-4 text-sm text-muted-foreground">
					{lang === "it"
						? "Mappa non disponibile in questo browser."
						: "The map is unavailable in this browser."}
				</p>
			)}
			{elevation?.hasElevation && selected && (
				<div className="mx-auto max-w-5xl px-4 pb-3 sm:px-8">
					<p className="text-right font-display text-xs text-accent">
						<span className="sr-only">
							{lang === "it" ? "Profilo altimetrico" : "Elevation profile"}{" "}
						</span>
						{number.format(selected.distance)} km
						{selected.elevation === null
							? ""
							: ` · ${Math.round(selected.elevation)} m`}
					</p>
					<svg
						viewBox="0 0 600 88"
						preserveAspectRatio="none"
						className="mt-2 h-20 w-full text-accent"
						aria-hidden="true"
					>
						{elevation.profile.map((path, index) => (
							<path
								key={index}
								d={path}
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								vectorEffect="non-scaling-stroke"
							/>
						))}
						<line
							x1={progress * 600}
							x2={progress * 600}
							y1="0"
							y2="88"
							stroke="currentColor"
							strokeOpacity="0.5"
						/>
					</svg>
				</div>
			)}
		</>
	);
}
