import type { Localized } from "./Localized";
import QuoteRecords from "../Quotes/Quotes.json";

/**
 * Where a quote comes from: Marino himself, a film, a book, a song, a named author,
 * or an unknown source.
 */
export type QuoteKind = "personal" | "film" | "book" | "music" | "author" | "unknown";

/** One entry of Quotes.json, the single source of every quote shown on the site. */
export type Quote = {
	/** Number shown in the counter, stable across languages. */
	id: number;
	kind: QuoteKind;
	text: Localized;
	/** Title of the film, book or song, or the author's name for "author" quotes. */
	source?: Localized;
	/** Extra detail, such as the character, the book's author, a chapter or a year. */
	note?: Localized;
};

export const Quotes = QuoteRecords as Quote[];
