import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment, useEffect, useState, type CSSProperties } from "react";
import { pagePath } from "@/Application/Site";
import { TransitionLink } from "@/Interface/Components/PageTransition";
import { QuoteField } from "@/Interface/Components/QuoteField";
import type { Lang } from "@/Resources/Content/Localized";
import { Quotes, type Quote } from "@/Resources/Content/Quotes";
import "./QuotesView.css";

const Copy = {
	it: {
		back: "Passioni",
		title: "Citazioni",
		previous: "Citazione precedente",
		next: "Citazione successiva",
		kinds: {
			personal: "Pensiero personale",
			book: "Libro",
			film: "Film",
			noted: "Attribuzione da verificare",
			unknown: "Fonte da identificare",
		},
	},
	en: {
		back: "Passions",
		title: "Quotes",
		previous: "Previous quote",
		next: "Next quote",
		kinds: {
			personal: "Personal note",
			book: "Book",
			film: "Film",
			noted: "Attribution to verify",
			unknown: "Source to identify",
		},
	},
};

const ExitDuration = 680;

function quoteText(quote: Quote, lang: Lang) {
	return lang === "en" && quote.english
		? { value: quote.english, language: "en" }
		: { value: quote.italian, language: "it" };
}

function QuoteFragment({ quote, lang, outgoing }: { quote: Quote; lang: Lang; outgoing: boolean }) {
	const text = quoteText(quote, lang);
	const source = typeof quote.source === "string" ? quote.source : quote.source?.[lang];
	return (
		<figure
			className={`quotes-fragment ${outgoing ? "quotes-fragment-exit" : "quotes-fragment-enter"}`}
			aria-hidden={outgoing || undefined}
			data-dense={text.value.length > 235 || undefined}
		>
			<blockquote lang={text.language}>
				<p className="sr-only">“{text.value}”</p>
				<p className="quotes-binary" aria-hidden="true">
					{`“${text.value}”`.split(/\s+/).map((word, wordIndex) => (
						<Fragment key={wordIndex}>
							{wordIndex > 0 && " "}
							<span className="quotes-word">
								{Array.from(word, (letter, index) => (
									<span
										key={index}
										className="quotes-glyph"
										data-bit={((wordIndex * 3 + index * 5) % 7) % 2}
										style={
											{
												"--glyph-delay": `${Math.min(wordIndex * 17 + index * 11, 230)}ms`,
											} as CSSProperties
										}
									>
										{letter}
									</span>
								))}
							</span>
						</Fragment>
					))}
				</p>
			</blockquote>
			<figcaption>
				<span className="quotes-kind">{Copy[lang].kinds[quote.kind]}</span>
				{source && <span>{source}</span>}
				{quote.note && <small>{quote.note[lang]}</small>}
			</figcaption>
		</figure>
	);
}

function QuotesView({ lang }: { lang: Lang }) {
	const t = Copy[lang];
	const [position, setPosition] = useState({ index: 0, previous: 0, revision: 0, manual: false });
	const [reducedMotion, setReducedMotion] = useState(true);
	const [pageVisible, setPageVisible] = useState(true);
	const [reading, setReading] = useState(false);
	const [keyboardNavigation, setKeyboardNavigation] = useState(false);
	const quote = Quotes[position.index] ?? Quotes[0];
	const previous = Quotes[position.previous] ?? Quotes[0];
	const hasExit = previous.id !== quote.id;
	const entryDelay = hasExit ? ExitDuration : 0;
	const text = quoteText(quote, lang);
	const wordCount = text.value.split(/\s+/).length;

	useEffect(() => {
		const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
		const syncPreference = () => setReducedMotion(preference.matches);
		const syncVisibility = () => setPageVisible(!document.hidden);
		syncPreference();
		syncVisibility();
		preference.addEventListener("change", syncPreference);
		document.addEventListener("visibilitychange", syncVisibility);
		return () => {
			preference.removeEventListener("change", syncPreference);
			document.removeEventListener("visibilitychange", syncVisibility);
		};
	}, []);

	function moveQuote(direction: number, manual: boolean) {
		setPosition(({ index, revision }) => ({
			index: (index + direction + Quotes.length) % Quotes.length,
			previous: index,
			revision: revision + 1,
			manual,
		}));
	}

	useEffect(() => {
		if (reducedMotion || !pageVisible || reading || keyboardNavigation) return;
		const duration = Math.max(4200, 1700 + wordCount * 215) + entryDelay;
		const timer = window.setTimeout(() => moveQuote(1, false), duration);
		return () => window.clearTimeout(timer);
	}, [
		reducedMotion,
		pageVisible,
		reading,
		keyboardNavigation,
		wordCount,
		position.revision,
		entryDelay,
	]);

	return (
		<section className="quotes-page" aria-labelledby="quotes-title">
			<h1 id="quotes-title" className="sr-only">
				{t.title}
			</h1>
			<div className="quotes-toolbar">
				<TransitionLink href={pagePath("passions", lang)} className="quotes-back">
					<ArrowLeft size={14} aria-hidden="true" />
					{t.back}
				</TransitionLink>
			</div>

			<div
				className="quotes-scene"
				style={
					{
						"--entry-delay": `${entryDelay}ms`,
						"--exit-duration": `${ExitDuration}ms`,
					} as CSSProperties
				}
			>
				<QuoteField revision={position.revision} entryDelay={entryDelay} />
				<div
					className="quotes-fragments"
					aria-live="off"
					onPointerEnter={(event) => {
						if (event.pointerType === "mouse") setReading(true);
					}}
					onPointerLeave={() => setReading(false)}
				>
					{hasExit && (
						<QuoteFragment key={previous.id} quote={previous} outgoing lang={lang} />
					)}
					<QuoteFragment key={quote.id} quote={quote} outgoing={false} lang={lang} />
				</div>
			</div>

			<p className="sr-only" role="status" lang={text.language}>
				{position.manual ? text.value : ""}
			</p>
			<div className="quotes-controls">
				<button
					type="button"
					onClick={() => moveQuote(-1, true)}
					onFocus={(event) =>
						setKeyboardNavigation(event.currentTarget.matches(":focus-visible"))
					}
					onBlur={() => setKeyboardNavigation(false)}
					aria-label={t.previous}
					title={t.previous}
				>
					<ChevronLeft size={19} aria-hidden="true" />
				</button>
				<button
					type="button"
					onClick={() => moveQuote(1, true)}
					onFocus={(event) =>
						setKeyboardNavigation(event.currentTarget.matches(":focus-visible"))
					}
					onBlur={() => setKeyboardNavigation(false)}
					aria-label={t.next}
					title={t.next}
				>
					<ChevronRight size={19} aria-hidden="true" />
				</button>
			</div>
		</section>
	);
}

export function ItalianQuotesView() {
	return <QuotesView lang="it" />;
}

export function EnglishQuotesView() {
	return <QuotesView lang="en" />;
}
