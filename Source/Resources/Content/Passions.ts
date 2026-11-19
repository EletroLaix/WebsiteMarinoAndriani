import type { Localized } from "./Localized";

export type PassionSection = {
	id: "lab" | "quotes" | "trekking";
	/** Unpublished sections are left out of navigation, the sitemap, and the static build. */
	published: boolean;
	path: Localized;
	title: Localized;
	summary: Localized;
};

/** Sub-sections of the "Passioni" area; each one is enabled once it has content. */
export const PassionSections: PassionSection[] = [
	{
		id: "lab",
		published: false,
		path: { it: "/passioni/laboratorio", en: "/en/passions/lab" },
		title: { it: "Progetti personali", en: "Personal projects" },
		summary: {
			it: "Elettronica e firmware. Codice su GitHub.",
			en: "Electronics and firmware. Code on GitHub.",
		},
	},
	{
		id: "quotes",
		published: false,
		path: { it: "/passioni/citazioni", en: "/en/passions/quotes" },
		title: { it: "Citazioni", en: "Quotes" },
		summary: { it: "Le citazioni che preferisco.", en: "My favourite quotes." },
	},
	{
		id: "trekking",
		published: true,
		path: { it: "/passioni/trekking", en: "/en/passions/trekking" },
		title: { it: "Trekking", en: "Trekking" },
		summary: { it: "I percorsi che ho fatto.", en: "Trails I have hiked." },
	},
];

export function publishedPassionSections(): PassionSection[] {
	return PassionSections.filter((section) => section.published);
}
