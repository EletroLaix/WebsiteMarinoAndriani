// Summarizes the GPX stages of one trek so its entry in Trekking.ts can be filled in.
// Usage: node .agents/skills/add-trek/scripts/TrekSummary.mjs "<Trek name>"
// Prints the stage files found, the distance and elevation gain measured from the tracks,
// and map bounds with a small margin. Wikiloc figures stay the reference for the entry.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const TracksDirectory = "Source/Resources/Tracks";
const BoundsMargin = 0.03;

function distanceBetween(first, second) {
	const radians = Math.PI / 180;
	const latitude = Math.sin(((second.latitude - first.latitude) * radians) / 2);
	const longitude = Math.sin(((second.longitude - first.longitude) * radians) / 2);
	const haversine =
		latitude ** 2 +
		longitude ** 2 * Math.cos(first.latitude * radians) * Math.cos(second.latitude * radians);
	return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(haversine)));
}

function readPoints(file) {
	const text = readFileSync(file, "utf8");
	const pattern = /<(?:trkpt|rtept)\b([^>]*)>([\s\S]*?)<\/(?:trkpt|rtept)>/g;
	const points = [];
	for (const [, attributes, body] of text.matchAll(pattern)) {
		const latitude = Number(/lat="([^"]+)"/.exec(attributes)?.[1]);
		const longitude = Number(/lon="([^"]+)"/.exec(attributes)?.[1]);
		const elevation = Number(/<ele>([^<]+)<\/ele>/.exec(body)?.[1]);
		if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
			points.push({
				latitude,
				longitude,
				elevation: Number.isFinite(elevation) ? elevation : null,
			});
		}
	}
	return points;
}

const name = process.argv[2];
if (!name) {
	console.error('Usage: node .agents/skills/add-trek/scripts/TrekSummary.mjs "<Trek name>"');
	process.exit(1);
}

const stagePattern = new RegExp(
	`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\[(\\d{2})\\]\\.gpx$`,
);
const files = readdirSync(TracksDirectory)
	.map((file) => ({ file, match: stagePattern.exec(file) }))
	.filter(({ match }) => match)
	.sort((first, second) => Number(first.match[1]) - Number(second.match[1]));

if (!files.length) {
	console.error(`No "${name} [NN].gpx" files in ${TracksDirectory}.`);
	process.exit(1);
}

const bounds = { west: 180, south: 90, east: -180, north: -90 };
let expected = 1;
for (const { file, match } of files) {
	const number = Number(match[1]);
	if (number !== expected) console.warn(`Warning: stage ${expected} is missing before ${file}.`);
	expected = number + 1;
	const points = readPoints(join(TracksDirectory, file));
	let distance = 0;
	let ascent = 0;
	for (let index = 1; index < points.length; index += 1) {
		const previous = points[index - 1];
		const point = points[index];
		distance += distanceBetween(previous, point);
		if (
			previous.elevation !== null &&
			point.elevation !== null &&
			point.elevation > previous.elevation
		) {
			ascent += point.elevation - previous.elevation;
		}
	}
	for (const point of points) {
		bounds.west = Math.min(bounds.west, point.longitude);
		bounds.east = Math.max(bounds.east, point.longitude);
		bounds.south = Math.min(bounds.south, point.latitude);
		bounds.north = Math.max(bounds.north, point.latitude);
	}
	const withElevation = points.filter((point) => point.elevation !== null).length;
	console.log(
		`${file}: ${points.length} points, ${distance.toFixed(2)} km, ~${Math.round(ascent)} m gain` +
			(withElevation < points.length
				? `, ${points.length - withElevation} points without elevation`
				: ""),
	);
}

const round = (value) => Math.round(value * 100) / 100;
console.log(
	`mapBounds: [${round(bounds.west - BoundsMargin)}, ${round(bounds.south - BoundsMargin)}, ` +
		`${round(bounds.east + BoundsMargin)}, ${round(bounds.north + BoundsMargin)}],`,
);
