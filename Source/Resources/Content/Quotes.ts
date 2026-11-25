import type { Localized } from "./Localized";
import QuoteRecords from "../Quotes/Quotes.json";

/**
 * Where a quote was found. A "person" quote only has a name, because the work is not known.
 */
export type QuoteKind =
	"personal" | "film" | "series" | "tv" | "book" | "music" | "web" | "person" | "unknown";

/** One entry of Quotes.json, the single source of every quote shown on the site. */
export type Quote = {
	/** Number shown in the counter, stable across languages. */
	id: number;
	kind: QuoteKind;
	text: Localized;
	/** Title of the work or site, or the name for "person" quotes. */
	source?: Localized;
	/** Extra detail, such as the character, the book's author, a chapter or a year. */
	note?: Localized;
};

export const Quotes = QuoteRecords as Quote[];
