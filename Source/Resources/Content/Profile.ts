import type { Localized } from "./Localized";

export type SocialLink = {
	id: "github" | "linkedin" | "x";
	label: string;
	url: string;
	handle: string;
};

/** Personal details shared by every page, structured data, and metadata. */
export const Profile = {
	name: "Marino Andriani",
	email: "Marino-Andriani@live.it",
	jobTitle: "Head of Software Engineering",
	employer: "Roboze",
	location: {
		city: "Bari",
		region: "Puglia",
		country: "IT",
		label: { it: "Bari, Puglia", en: "Bari, Italy" } satisfies Localized,
	},
	portrait: {
		path: "/assets/images/marino-andriani.jpg",
		width: 1280,
		height: 1280,
	},
	icon: {
		path: "/assets/images/eye.png",
		width: 256,
		height: 256,
	},
	socials: [
		{
			id: "linkedin",
			label: "LinkedIn",
			url: "https://www.linkedin.com/in/marino-andriani/",
			handle: "/marino-andriani",
		},
		{
			id: "github",
			label: "GitHub",
			url: "https://github.com/EletroLaix",
			handle: "@EletroLaix",
		},
		{
			id: "x",
			label: "X",
			url: "https://x.com/andriani_marino",
			handle: "@andriani_marino",
		},
	] satisfies readonly SocialLink[],
	xHandle: "@andriani_marino",
} as const;
