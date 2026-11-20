import { combineProfiles, type ElevationProfile } from "@/Application/Gpx";
import { Treks, type Trek } from "@/Resources/Content/Trekking";

export type TrekProfile = {
	id: string;
	name: string;
	profile: ElevationProfile;
};

/** Each stage is a GPX file named after its trek and numbered from 01: "<name> [NN].gpx". */
export function stagePath(trek: Trek, stage: number): string {
	const number = String(stage).padStart(2, "0");
	return `/Source/Resources/Tracks/${trek.name} [${number}].gpx`;
}

// Light profiles are bundled with the pages, so the charts need no full track.
const ProfileFiles = import.meta.glob<ElevationProfile>("/Source/Resources/Tracks/*.gpx", {
	query: "?profile",
	import: "default",
	eager: true,
});

/** Elevation profile of every trek with tracks, from the first to the latest. */
export const TrekProfiles: TrekProfile[] = [...Treks]
	.sort((first, second) => first.year - second.year)
	.flatMap((trek) => {
		const profiles = trek.stages.flatMap(
			(_, index) => ProfileFiles[stagePath(trek, index + 1)] ?? [],
		);
		return profiles.length
			? [{ id: trek.id, name: trek.name, profile: combineProfiles(profiles) }]
			: [];
	});
