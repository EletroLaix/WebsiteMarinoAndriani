import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { randomBit, scrambledFrame } from "@/Application/Scramble";
import { pagePath } from "@/Application/Site";
import { TransitionLink, usePageTransition } from "@/Interface/Components/PageTransition";
import type { Lang } from "@/Resources/Content/Localized";
import { Quotes, type Quote } from "@/Resources/Content/Quotes";

const Copy = {
	it: {
		back: "Passioni",
		title: "Citazioni",
		next: "prossima",
		running: "AUTO",
		paused: "PAUSA",
		pause: "Metti in pausa le citazioni",
		resume: "Riprendi le citazioni",
		kinds: {
			personal: "MARINO ANDRIANI",
			film: "FILM",
			book: "LIBRO",
			music: "MUSICA",
			series: "SERIE TV",
			tv: "PROGRAMMA TV",
			web: "SITO WEB",
			// Only the name is known, so it is shown without a label.
			person: "",
			unknown: "FONTE IGNOTA",
		},
	},
	en: {
		back: "Passions",
		title: "Quotes",
		next: "next",
		running: "AUTO",
		paused: "PAUSED",
		pause: "Pause the quotes",
		resume: "Resume the quotes",
		kinds: {
			personal: "MARINO ANDRIANI",
			film: "FILM",
			book: "BOOK",
			music: "MUSIC",
			series: "TV SERIES",
			tv: "TV SHOW",
			web: "WEBSITE",
			person: "",
			unknown: "UNKNOWN SOURCE",
		},
	},
};

/** Reading time of a settled quote, in milliseconds, before the next one. */
const HoldBase = 3500;
const HoldPerCharacter = 45;
const MinimumHold = 5000;
const MaximumHold = 16000;
const EmergeDuration = 3400;
/** Time for the lava to heat up when the page opens, matching its CSS transition. */
const LavaWarmUp = 2200;
/** Time between the bits appearing and the words starting to form. */
const TextDelay = 900;
const SinkDuration = 1800;
const FlickerInterval = 90;
const Cell = 15;
const Dots = 18;
/** Long quotes use a smaller size so they stay inside the opening. */
const LongQuote = 150;
/** Number of lava tones the bits are drawn in. */
const HeatSteps = 12;
/** How often the lava colours behind the bits are read back. */
const LavaReadInterval = 150;

/** Bit colour for a lava heat from 0 to 1: deep red, orange, then pale gold. */
function bitTone(heat: number): [number, number, number] {
	const stops: [number, number, number][] = [
		[150, 40, 16],
		[230, 96, 24],
		[255, 168, 70],
		[255, 226, 170],
	];
	const position = heat * (stops.length - 1);
	const index = Math.min(Math.floor(position), stops.length - 2);
	const mix = position - index;
	const from = stops[index]!;
	const to = stops[index + 1]!;
	return [0, 1, 2].map((channel) =>
		Math.round(from[channel]! + (to[channel]! - from[channel]!) * mix),
	) as [number, number, number];
}

/** Time a quote stays on screen: a base, plus reading time for every character. */
function holdDuration(length: number): number {
	return Math.min(MaximumHold, Math.max(MinimumHold, HoldBase + length * HoldPerCharacter));
}

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function quoteText(quote: Quote, lang: Lang): { value: string; language: Lang } {
	return { value: quote.text[lang], language: lang };
}

function localized(value: Quote["source"] | Quote["note"], lang: Lang): string {
	return value?.[lang] ?? "";
}

/** Shuffles the quote numbers so every quote appears once before any repeats. */
function shuffledOrder(): number[] {
	const order = Quotes.map((_, index) => index);
	for (let index = order.length - 1; index > 0; index -= 1) {
		const other = Math.floor(Math.random() * (index + 1));
		[order[index], order[other]] = [order[other]!, order[index]!];
	}
	return order;
}

type Patch = {
	x: number;
	y: number;
	rx: number;
	ry: number;
	open: number;
	target: number;
	born: number;
};

export function QuotesView({ lang }: { lang: Lang }) {
	const t = Copy[lang];
	const { bootComplete } = usePageTransition();
	const stageRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const quoteRef = useRef<HTMLElement>(null);
	const textRef = useRef<HTMLParagraphElement>(null);
	const sourceRef = useRef<HTMLParagraphElement>(null);
	const counterRef = useRef<HTMLSpanElement>(null);
	const dotsRef = useRef<HTMLSpanElement>(null);
	const controlsRef = useRef<HTMLDivElement>(null);
	const pausedRef = useRef(false);
	const [paused, setPaused] = useState(false);
	const [index, setIndex] = useState<number>();
	const [long, setLong] = useState(false);

	// The lava becomes the wall of this page: stronger than anywhere else on the site.
	useEffect(() => {
		document.documentElement.dataset["lava"] = "wall";
		return () => {
			delete document.documentElement.dataset["lava"];
		};
	}, []);

	useEffect(() => {
		pausedRef.current = paused;
	}, [paused]);

	useEffect(() => {
		const stage = stageRef.current;
		const canvas = canvasRef.current;
		const quoteElement = quoteRef.current;
		const textElement = textRef.current;
		const sourceElement = sourceRef.current;
		if (!bootComplete || !stage || !canvas || !quoteElement || !textElement || !sourceElement) {
			return;
		}
		const context = canvas.getContext("2d");
		const lavaCanvas = document.querySelector<HTMLCanvasElement>(".lava-canvas");
		const lavaContext = lavaCanvas?.getContext("2d") ?? null;
		const reduced = prefersReducedMotion();
		const timers = new Set<number>();
		const later = (callback: () => void, delay: number) => {
			const timer = window.setTimeout(() => {
				timers.delete(timer);
				callback();
			}, delay);
			timers.add(timer);
		};
		let frame = 0;
		let flicker = 0;
		let order = shuffledOrder();
		let current = -1;
		let holding = false;
		let held = 0;
		let holdFor = MinimumHold;
		// The characters of the current quote, kept so the flicker does not query the DOM.
		let quoteCharacters: HTMLSpanElement[] = [];
		let lastTick = performance.now();
		let columns = 0;
		let rows = 0;
		let cells: { bit: string; flipped: number; speed: number }[] = [];
		const patch: Patch = { x: 0, y: 0, rx: 0, ry: 0, open: 0, target: 0, born: 0 };

		function resize() {
			canvas!.width = stage!.clientWidth;
			canvas!.height = stage!.clientHeight;
			columns = Math.ceil(canvas!.width / Cell);
			rows = Math.ceil(canvas!.height / Cell);
			cells = Array.from({ length: columns * rows }, () => ({
				bit: randomBit(),
				flipped: 0,
				speed: Math.random(),
			}));
		}

		function placePatch() {
			const stageBox = stage!.getBoundingClientRect();
			const box = quoteElement!.getBoundingClientRect();
			patch.x = box.left - stageBox.left + box.width / 2;
			patch.y = box.top - stageBox.top + box.height / 2;
			patch.rx = box.width * 0.72 + 70;
			patch.ry = box.height * 1.05 + 70;
		}

		// Bits are stamped from pre-rendered glyphs in a few lava tones, far cheaper than text.
		const sprites = Array.from({ length: HeatSteps }, (_, step) => {
			const heat = step / (HeatSteps - 1);
			const [red, green, blue] = bitTone(heat);
			return ["0", "1"].map((bit) => {
				const sprite = document.createElement("canvas");
				sprite.width = Cell;
				sprite.height = Cell;
				const spriteContext = sprite.getContext("2d")!;
				spriteContext.font = `600 ${Cell - 2}px "Geist Mono", monospace`;
				spriteContext.textAlign = "center";
				spriteContext.textBaseline = "middle";
				spriteContext.fillStyle = `rgb(${red}, ${green}, ${blue})`;
				spriteContext.fillText(bit, Cell / 2, Cell / 2);
				return sprite;
			});
		});
		let lava: Uint8ClampedArray | undefined;
		let lavaRead = 0;
		let lastDraw = 0;

		// Each bit takes the tone of the lava behind it, brighter where the lava is hot.
		function draw(now: number) {
			frame = requestAnimationFrame(draw);
			if (!context) return;
			// Moving bits are drawn at about 30 frames per second, resting ones at about 15.
			if (now - lastDraw < (patch.target >= 1 ? 33 : 66)) return;
			lastDraw = now;
			context.clearRect(0, 0, canvas!.width, canvas!.height);
			patch.open += (patch.target - patch.open) * 0.1;
			if (patch.open < 0.01 || !lavaCanvas || !lavaContext) return;
			// The lava only changes slowly, so it is read back a few times per second.
			if (!lava || now - lavaRead > LavaReadInterval) {
				lava = lavaContext.getImageData(0, 0, lavaCanvas.width, lavaCanvas.height).data;
				lavaRead = now;
			}
			const stageBox = stage!.getBoundingClientRect();
			const grow = Math.min((now - patch.born) / 1100, 1);
			const rx = patch.rx * (0.25 + 0.75 * grow);
			const ry = patch.ry * (0.25 + 0.75 * grow);
			const glow = context.createRadialGradient(
				patch.x,
				patch.y,
				0,
				patch.x,
				patch.y,
				Math.max(rx, ry) * 1.1,
			);
			glow.addColorStop(0, `rgba(255, 110, 20, ${0.22 * patch.open})`);
			glow.addColorStop(1, "rgba(255, 60, 0, 0)");
			context.fillStyle = glow;
			context.fillRect(0, 0, canvas!.width, canvas!.height);
			const lavaWidth = lavaCanvas.width;
			const lavaHeight = lavaCanvas.height;
			const scaleX = lavaWidth / window.innerWidth;
			const scaleY = lavaHeight / window.innerHeight;
			for (let row = 0; row < rows; row += 1) {
				const y = row * Cell + Cell / 2;
				const dy = (y - patch.y) / ry;
				if (Math.abs(dy) > 1.3) continue;
				for (let column = 0; column < columns; column += 1) {
					const x = column * Cell + Cell / 2;
					const dx = (x - patch.x) / rx;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance > 1.3) continue;
					const cell = cells[row * columns + column]!;
					if (now - cell.flipped > 110 + cell.speed * 300) {
						cell.bit = randomBit();
						cell.flipped = now;
					}
					const lavaX = Math.min(
						lavaWidth - 1,
						Math.max(0, ((x + stageBox.left) * scaleX) | 0),
					);
					const lavaY = Math.min(
						lavaHeight - 1,
						Math.max(0, ((y + stageBox.top) * scaleY) | 0),
					);
					const pixel = (lavaY * lavaWidth + lavaX) * 4;
					const heat = Math.min(1, (lava[pixel]! + lava[pixel + 1]!) / 280);
					const edge = Math.max(0, 1 - Math.max(0, distance - 0.45) / 0.85);
					const alpha =
						edge * patch.open * (0.35 + 0.65 * heat) * (0.6 + 0.4 * cell.speed);
					if (alpha < 0.02) continue;
					context.globalAlpha = alpha;
					context.drawImage(
						sprites[Math.round(heat * (HeatSteps - 1))]![cell.bit === "1" ? 1 : 0]!,
						x - Cell / 2,
						y - Cell / 2,
					);
				}
			}
			context.globalAlpha = 1;
		}

		function characters() {
			return quoteCharacters;
		}

		function startFlicker() {
			window.clearInterval(flicker);
			flicker = window.setInterval(() => {
				for (const character of characters()) {
					// Only some bits change at each step, which keeps repaints small.
					if (character.classList.contains("is-bit") && Math.random() < 0.4) {
						character.textContent = randomBit();
					}
				}
			}, FlickerInterval);
		}

		function countUp(target: number) {
			const element = counterRef.current;
			if (!element) return;
			const total = String(Quotes.length).padStart(3, "0");
			const render = (value: number) => {
				element.innerHTML = `${String(value).padStart(3, "0")}<sup>/ ${total}</sup>`;
			};
			if (reduced) return render(target);
			const start = performance.now();
			const duration = 900 + target * 6;
			const step = (now: number) => {
				const progress = Math.min((now - start) / duration, 1);
				render(Math.round(target * (1 - (1 - progress) ** 3)));
				if (progress < 1) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		}

		function decodeSource(plain: string, html: string) {
			if (reduced) {
				sourceElement!.innerHTML = html;
				return;
			}
			let step = 0;
			const interval = window.setInterval(() => {
				step += 1;
				sourceElement!.textContent = scrambledFrame(plain, step / 14);
				if (step >= 14) {
					window.clearInterval(interval);
					sourceElement!.innerHTML = html;
				}
			}, 40);
		}

		function drawDots(progress: number) {
			const element = dotsRef.current;
			if (!element) return;
			const filled = Math.round(progress * Dots);
			element.textContent = `> ${t.next} ${".".repeat(filled)}${" ".repeat(Dots - filled)} `;
		}

		function escape(value: string) {
			return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}

		function build(quote: Quote) {
			const text = quoteText(quote, lang);
			setLong(text.value.length > LongQuote);
			textElement!.lang = text.language;
			textElement!.innerHTML = text.value
				.split(" ")
				.map(
					(word) =>
						`<span class="quotes-word">${[...word]
							.map(
								(character) =>
									`<span class="quotes-character${reduced ? "" : " is-bit"}" data-character="${escape(character)}">${reduced ? escape(character) : randomBit()}</span>`,
							)
							.join("")}</span>`,
				)
				.join('<span class="quotes-character"> </span>');
			quoteCharacters = [
				...textElement!.querySelectorAll<HTMLSpanElement>("[data-character]"),
			];
			holdFor = holdDuration(text.value.length);
			const label = t.kinds[quote.kind];
			const title =
				quote.kind === "personal" || quote.kind === "unknown"
					? ""
					: localized(quote.source, lang);
			const note = localized(quote.note, lang);
			const detail = [title, note].filter(Boolean).join(" · ");
			const titleHtml = title ? `<b>${escape(title)}</b>` : "";
			const detailHtml = [titleHtml, note ? escape(note) : ""].filter(Boolean).join(" · ");
			const labelHtml = label
				? `<span class="quotes-kind" data-kind="${quote.kind}">${label}</span>`
				: "";
			const html = `${labelHtml}${detailHtml ? `<span>${detailHtml}</span>` : ""}`;
			sourceElement!.innerHTML = " ";
			return { plain: [label, detail].filter(Boolean).join("  "), html };
		}

		function emerge() {
			current = order.pop() ?? -1;
			if (current < 0) {
				order = shuffledOrder();
				current = order.pop()!;
			}
			setIndex(current);
			const quote = Quotes[current]!;
			const source = build(quote);
			quoteElement!.classList.remove("is-sinking");
			quoteElement!.classList.add("is-hidden");
			// The bits open first; the words, the quote number and the controls follow.
			requestAnimationFrame(() => {
				placePatch();
				patch.born = performance.now();
				patch.target = reduced ? 0 : 1;
				later(
					() => {
						quoteElement!.classList.remove("is-hidden");
						countUp(quote.id);
						controlsRef.current?.classList.add("is-ready");
					},
					reduced ? 0 : TextDelay,
				);
			});
			if (reduced) {
				decodeSource(source.plain, source.html);
				hold();
				return;
			}
			startFlicker();
			for (const character of characters()) {
				later(
					() => {
						character.classList.remove("is-bit");
						character.classList.add("is-hot");
						character.textContent = character.dataset["character"] ?? "";
						later(() => character.classList.remove("is-hot"), 600);
					},
					TextDelay + 1100 + Math.random() * 2000,
				);
			}
			later(() => {
				window.clearInterval(flicker);
				decodeSource(source.plain, source.html);
				patch.target = 0.18;
				later(hold, 800);
			}, TextDelay + EmergeDuration);
		}

		function hold() {
			held = 0;
			drawDots(0);
			holding = true;
		}

		function sink() {
			holding = false;
			sourceElement!.innerHTML = " ";
			if (reduced) {
				quoteElement!.classList.add("is-hidden");
				later(emerge, 600);
				return;
			}
			patch.born = performance.now() - 700;
			patch.target = 1;
			for (const character of characters()) {
				later(() => {
					character.classList.add("is-bit");
					character.textContent = randomBit();
				}, Math.random() * 800);
			}
			startFlicker();
			quoteElement!.classList.add("is-sinking");
			later(() => {
				window.clearInterval(flicker);
				patch.target = 0;
				later(emerge, 600);
			}, SinkDuration);
		}

		// The hold time only runs while the visitor has not paused the page.
		function tick(now: number) {
			ticker = requestAnimationFrame(tick);
			const elapsed = now - lastTick;
			lastTick = now;
			if (!holding || pausedRef.current) return;
			held += elapsed;
			drawDots(Math.min(held / holdFor, 1));
			if (held >= holdFor) sink();
		}

		resize();
		window.addEventListener("resize", resize);
		frame = requestAnimationFrame(draw);
		let ticker = requestAnimationFrame(tick);
		drawDots(0);
		// The first quote waits for the lava to heat up.
		void document.fonts.ready.then(() => later(emerge, reduced ? 0 : LavaWarmUp));

		return () => {
			cancelAnimationFrame(frame);
			cancelAnimationFrame(ticker);
			window.clearInterval(flicker);
			timers.forEach((timer) => window.clearTimeout(timer));
			window.removeEventListener("resize", resize);
		};
	}, [bootComplete, lang, t]);

	const quote = index === undefined ? undefined : Quotes[index];

	return (
		<div ref={stageRef} className="quotes-stage">
			<canvas ref={canvasRef} className="quotes-bits" aria-hidden="true" />
			<header className="quotes-intro">
				<TransitionLink
					href={pagePath("passions", lang)}
					className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-accent hover:underline"
				>
					<ArrowLeft className="size-4" aria-hidden="true" /> {t.back}
				</TransitionLink>
				<h1 className="quotes-title">{t.title}</h1>
			</header>
			<figure ref={quoteRef} className={`quotes-quote is-hidden ${long ? "is-long" : ""}`}>
				{quote && (
					<blockquote className="sr-only" lang={quoteText(quote, lang).language}>
						{quoteText(quote, lang).value}
					</blockquote>
				)}
				<p ref={textRef} className="quotes-text" aria-hidden="true" />
				<figcaption ref={sourceRef} className="quotes-source" />
			</figure>
			<div ref={controlsRef} className="quotes-controls">
				<span ref={counterRef} className="quotes-counter" aria-hidden="true" />
				<button
					type="button"
					className="quotes-auto"
					aria-label={paused ? t.resume : t.pause}
					aria-pressed={paused}
					onClick={() => setPaused((value) => !value)}
				>
					<span ref={dotsRef} />
					<span className="quotes-auto-state">{paused ? t.paused : t.running}</span>
				</button>
			</div>
		</div>
	);
}
