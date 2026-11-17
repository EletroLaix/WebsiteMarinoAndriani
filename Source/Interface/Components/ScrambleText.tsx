import { useEffect, useRef, useState } from "react";

const Duration = 520;
const FlipInterval = 45;

function randomBit(): string {
	return Math.random() < 0.5 ? "0" : "1";
}

/**
 * Builds the frame shown at the given progress: characters resolve from left to right,
 * and the ones still waiting are shown as random binary digits.
 */
function scrambledFrame(text: string, progress: number): string {
	const characters = [...text];
	return characters
		.map((character, index) => {
			if (character.trim() === "") {
				return character;
			}
			const resolvesAt = 0.25 + (0.75 * index) / characters.length;
			return progress >= resolvesAt ? character : randomBit();
		})
		.join("");
}

/**
 * Text that scrambles into zeros and ones when the pointer enters its link or button,
 * then settles back on the original text. The real text keeps the size and stays
 * readable by assistive technology.
 */
export function ScrambleText({ text }: { text: string }) {
	const rootRef = useRef<HTMLSpanElement>(null);
	const [frame, setFrame] = useState<string | null>(null);

	useEffect(() => {
		const trigger = rootRef.current?.closest("a, button");
		if (!trigger) {
			return;
		}

		let animation = 0;
		let lastFlip = 0;

		const play = () => {
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				return;
			}
			cancelAnimationFrame(animation);
			const start = performance.now();
			lastFlip = 0;

			const step = (now: number) => {
				const progress = (now - start) / Duration;
				if (progress >= 1) {
					setFrame(null);
					return;
				}
				if (now - lastFlip >= FlipInterval) {
					lastFlip = now;
					setFrame(scrambledFrame(text, progress));
				}
				animation = requestAnimationFrame(step);
			};
			animation = requestAnimationFrame(step);
		};

		trigger.addEventListener("pointerenter", play);
		trigger.addEventListener("focus", play);
		return () => {
			trigger.removeEventListener("pointerenter", play);
			trigger.removeEventListener("focus", play);
			cancelAnimationFrame(animation);
		};
	}, [text]);

	return (
		<span ref={rootRef} className="scramble-text">
			<span style={{ opacity: frame === null ? 1 : 0 }}>{text}</span>
			{frame !== null && (
				<span aria-hidden="true" className="scramble-text-overlay">
					{frame}
				</span>
			)}
		</span>
	);
}
