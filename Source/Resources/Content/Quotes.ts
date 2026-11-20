import type { Localized } from "./Localized";
import { Profile } from "./Profile";
import { QuoteCollection } from "./QuoteCollection";

type QuoteDetails = {
	kind: "personal" | "book" | "film" | "noted" | "unknown";
	english?: string;
	source?: string | Localized;
	note?: Localized;
};

export type Quote = QuoteDetails & {
	id: number;
	italian: string;
};

const ReviewedQuotes: Partial<Record<number, QuoteDetails>> = {
	6: {
		kind: "film",
		english: "Sometimes you have to take a leap of faith first. The trust part comes later.",
		source: { it: "L’uomo d’acciaio", en: "Man of Steel" },
		note: { it: "Padre Leone · 2013", en: "Father Leone · 2013" },
	},
	12: {
		kind: "personal",
		english:
			"Perfection doesn’t exist, but a tolerance can be so small that it gives the illusion of perfection.",
		source: Profile.name,
	},
	21: {
		kind: "personal",
		english: "Artificial intelligence and robotics will be the natural evolution of humankind.",
		source: Profile.name,
	},
	38: {
		kind: "book",
		source: { it: "Il mondo nuovo", en: "Brave New World" },
		note: { it: "Aldous Huxley · Cap. 16", en: "Aldous Huxley · Chapter 16" },
	},
	47: {
		kind: "film",
		english: "You never win with violence. You only win when you maintain your dignity.",
		source: "Green Book",
		note: { it: "Don Shirley · 2018", en: "Don Shirley · 2018" },
	},
	51: {
		kind: "book",
		english:
			"If liberty means anything at all, it means the right to tell people what they do not want to hear.",
		source: { it: "La libertà di stampa", en: "The Freedom of the Press" },
		note: {
			it: "George Orwell · Prefazione proposta a La fattoria degli animali",
			en: "George Orwell · Proposed preface to Animal Farm",
		},
	},
	52: {
		kind: "personal",
		english:
			"I could tell you that you don’t solve your problems by simply solving them, but by learning how to solve them.",
		source: Profile.name,
	},
	72: {
		kind: "personal",
		english: "Sometimes forgiving is a selfish act.",
		source: Profile.name,
	},
};

function createQuote(
	[italian, attribution]: (typeof QuoteCollection)[number],
	index: number,
): Quote {
	const id = index + 1;
	const reviewed = ReviewedQuotes[id];
	if (reviewed) return { id, italian, ...reviewed };
	if (attribution) return { id, italian, kind: "noted", source: attribution };
	return { id, italian, kind: "unknown" };
}

const [firstQuote, ...remainingQuotes] = QuoteCollection;
export const Quotes: readonly [Quote, ...Quote[]] = [
	createQuote(firstQuote, 0),
	...remainingQuotes.map((entry, index) => createQuote(entry, index + 1)),
];
