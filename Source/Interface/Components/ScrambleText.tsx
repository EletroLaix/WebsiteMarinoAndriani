import { useEffect, useRef, useState } from "react";
import { scrambledFrame } from "@/Application/Scramble";

const Duration = 520;
const FlipInterval = 45;

type ScrambleTextProps = {
	text: string;
	/** Extra wait before the characters start resolving, to stagger several texts. */
	delay?: number;
};

/**
 * Text that scrambles into zeros and ones when the pointer enters its link, button or
 * closest `[data-scramble-trigger]` element, then settles back on the original text.
 * The real text keeps the size and stays readable by assistive technology.
 */
export function ScrambleText({ text, delay = 0 }: ScrambleTextProps) {
	const rootRef = useRef<HTMLSpanElement>(null);
	const [frame, setFrame] = useState<string | null>(null);

	useEffect(() => {
		const trigger = rootRef.current?.closest("a, button, [data-scramble-trigger]");
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
				const progress = Math.max(0, (now - start - delay) / Duration);
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
	}, [text, delay]);

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
