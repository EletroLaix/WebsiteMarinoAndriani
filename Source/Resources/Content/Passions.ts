import type { Localized } from "./Localized";

export type PassionSection = {
	id: "lab" | "quotes" | "trekking";
	/** Unpublished sections are left out of navigation, the sitemap, and the static build. */
	published: boolean;
	path: Localized;
	title: Localized;
	/** Unpublished sections only: where the index counter stops, from 0 to 99. */
	progress?: number;
	/** Unpublished sections only: the tongue-in-cheek error shown under the counter. */
	status?: Localized;
};

/** Sub-sections of the "Passioni" area; each one is enabled once it has content. */
export const PassionSections: PassionSection[] = [
	{
		id: "lab",
		published: false,
		path: { it: "/passioni/laboratorio", en: "/en/passions/lab" },
		title: { it: "Progetti personali", en: "Personal projects" },
		progress: 42,
		status: {
			it: "ERR 42 · la risposta c’è, manca la domanda",
			en: "ERR 42 · the answer is here, the question is missing",
		},
	},
	{
		id: "quotes",
		published: false,
		path: { it: "/passioni/citazioni", en: "/en/passions/quotes" },
		title: { it: "Citazioni", en: "Quotes" },
		progress: 68,
		status: {
			it: "FAIL · Marvin si rifiuta di collaborare",
			en: "FAIL · Marvin refuses to cooperate",
		},
	},
	{
		id: "trekking",
		published: true,
		path: { it: "/passioni/trekking", en: "/en/passions/trekking" },
		title: { it: "Trekking", en: "Trekking" },
	},
];

export function publishedPassionSections(): PassionSection[] {
	return PassionSections.filter((section) => section.published);
}
