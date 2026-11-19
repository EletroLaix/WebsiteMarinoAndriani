import type { Document, Element } from "@xmldom/xmldom";

export type TrackPoint = {
	longitude: number;
	latitude: number;
	elevation: number | null;
	distance: number;
};

export type TrackStage = {
	number: number;
	segments: TrackPoint[][];
};

export function combineTracks(stages: TrackStage[]) {
	const segments: TrackPoint[][] = [];
	const starts: { stage: number; point: TrackPoint }[] = [];
	let offset = 0;
	for (const stage of stages) {
		const shifted = stage.segments.map((segment) =>
			segment.map((point) => ({ ...point, distance: point.distance + offset })),
		);
		starts.push({ stage: stage.number, point: shifted[0]![0]! });
		segments.push(...shifted);
		offset = shifted.at(-1)!.at(-1)!.distance;
	}
	return { segments, starts };
}

function distanceBetween(first: TrackPoint, second: TrackPoint): number {
	const radians = Math.PI / 180;
	const latitude = Math.sin(((second.latitude - first.latitude) * radians) / 2);
	const longitude = Math.sin(((second.longitude - first.longitude) * radians) / 2);
	const haversine =
		latitude ** 2 +
		longitude ** 2 * Math.cos(first.latitude * radians) * Math.cos(second.latitude * radians);
	return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(haversine)));
}

export function parseGpx(document: Document): TrackPoint[][] {
	if (document.documentElement?.localName !== "gpx") {
		throw new Error("Invalid GPX document");
	}

	const segments = Array.from(document.getElementsByTagNameNS("*", "trkseg"));
	const routes = Array.from(document.getElementsByTagNameNS("*", "rte"));
	let distance = 0;
	const tracks: TrackPoint[][] = [];
	for (const segment of segments.length ? segments : routes) {
		const points: TrackPoint[] = [];
		for (const child of Array.from(segment.childNodes)) {
			if (child?.nodeType !== 1) continue;
			const node = child as Element;
			if (node.localName !== "trkpt" && node.localName !== "rtept") continue;
			const lat = node.getAttribute("lat")?.trim();
			const lon = node.getAttribute("lon")?.trim();
			const latitude = lat ? Number(lat) : Number.NaN;
			const longitude = lon ? Number(lon) : Number.NaN;
			if (
				!Number.isFinite(latitude) ||
				!Number.isFinite(longitude) ||
				Math.abs(latitude) > 90 ||
				Math.abs(longitude) > 180
			)
				continue;
			const elevationText = node.getElementsByTagNameNS("*", "ele")[0]?.textContent?.trim();
			const elevation = elevationText ? Number(elevationText) : Number.NaN;
			const point = {
				latitude,
				longitude,
				elevation: Number.isFinite(elevation) ? elevation : null,
				distance,
			};
			const previous = points.at(-1);
			if (previous) distance += distanceBetween(previous, point);
			point.distance = distance;
			points.push(point);
		}
		if (points.length >= 2) tracks.push(points);
	}
	if (!tracks.length || distance <= 0) throw new Error("GPX contains no drawable track");
	return tracks;
}
