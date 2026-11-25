// Helpers for Source/Resources/Quotes/Quotes.json.
//   node .agents/skills/add-quote/scripts/QuoteTools.mjs find "<text>"
//     Lists existing quotes that look like the given text (Italian or English) and the next id.
//   node .agents/skills/add-quote/scripts/QuoteTools.mjs check
//     Validates the whole file: ids, kinds, texts, sources and notes.
import { readFileSync } from "node:fs";

const QuotesFile = "Source/Resources/Quotes/Quotes.json";
const Kinds = ["personal", "film", "series", "tv", "book", "music", "web", "person", "unknown"];
const KindsWithSource = ["film", "series", "tv", "book", "music", "web", "person"];
const SimilarityThreshold = 0.5;

function normalize(text) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9\s]/g, " ")
		.split(/\s+/)
		.filter((word) => word.length > 2);
}

/** Share of the shorter text's words that also appear in the other text. */
function similarity(first, second) {
	const a = new Set(normalize(first));
	const b = new Set(normalize(second));
	if (!a.size || !b.size) return 0;
	let shared = 0;
	for (const word of a) if (b.has(word)) shared += 1;
	return shared / Math.min(a.size, b.size);
}

function isLocalized(value) {
	return (
		value &&
		typeof value === "object" &&
		typeof value.it === "string" &&
		value.it.trim() !== "" &&
		typeof value.en === "string" &&
		value.en.trim() !== ""
	);
}

const quotes = JSON.parse(readFileSync(QuotesFile, "utf8"));
const [command, ...rest] = process.argv.slice(2);

if (command === "find") {
	const text = rest.join(" ");
	if (!text) {
		console.error('Usage: QuoteTools.mjs find "<text>"');
		process.exit(1);
	}
	const matches = quotes
		.map((quote) => ({
			quote,
			score: Math.max(similarity(text, quote.text.it), similarity(text, quote.text.en)),
		}))
		.filter(({ score }) => score >= SimilarityThreshold)
		.sort((first, second) => second.score - first.score);
	if (!matches.length) console.log("No similar quote found.");
	for (const { quote, score } of matches) {
		console.log(
			`#${quote.id} (${Math.round(score * 100)}% similar, ${quote.kind}): ${quote.text.it}`,
		);
	}
	console.log(`Next id: ${Math.max(...quotes.map((quote) => quote.id)) + 1}`);
} else if (command === "check") {
	const problems = [];
	quotes.forEach((quote, index) => {
		const where = `entry ${index + 1} (id ${quote.id})`;
		if (quote.id !== index + 1) problems.push(`${where}: ids must run 1, 2, 3… in file order`);
		if (!Kinds.includes(quote.kind)) problems.push(`${where}: unknown kind "${quote.kind}"`);
		if (!isLocalized(quote.text)) problems.push(`${where}: text needs both "it" and "en"`);
		if (KindsWithSource.includes(quote.kind) && !isLocalized(quote.source)) {
			problems.push(`${where}: a ${quote.kind} quote needs a source in "it" and "en"`);
		}
		if (!KindsWithSource.includes(quote.kind) && quote.source !== undefined) {
			problems.push(`${where}: a ${quote.kind} quote has no source`);
		}
		if (quote.note !== undefined && !isLocalized(quote.note)) {
			problems.push(`${where}: note needs both "it" and "en"`);
		}
		const extra = Object.keys(quote).filter(
			(key) => !["id", "kind", "text", "source", "note"].includes(key),
		);
		if (extra.length) problems.push(`${where}: unexpected fields ${extra.join(", ")}`);
	});
	for (const [index, quote] of quotes.entries()) {
		for (const other of quotes.slice(index + 1)) {
			if (similarity(quote.text.it, other.text.it) >= 0.9) {
				problems.push(`ids ${quote.id} and ${other.id} look like the same quote`);
			}
		}
	}
	if (problems.length) {
		console.error(problems.join("\n"));
		process.exit(1);
	}
	console.log(`${quotes.length} quotes, all valid.`);
} else {
	console.error('Usage: QuoteTools.mjs find "<text>" | check');
	process.exit(1);
}
