import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/Application/Utilities";

type RevealState = "pending" | "revealing" | "done";

/** Columns of "pixels" drawn at each step, from the coarsest to the finest. */
const ColumnSteps = [5, 9, 15, 24, 38, 60, 96];
const StepDuration = 95;
const FadeDuration = 280;
const StartDelay = 120;

type PixelatedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
	/** Classes for the frame that sizes and clips the image. */
	frameClassName?: string;
};

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Resolves once the eye overlay of the page transition is no longer covering the page. */
function overlayOpened(signal: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		const root = document.documentElement;
		if (root.dataset["overlay"] !== "closed") {
			resolve();
			return;
		}
		const observer = new MutationObserver(() => {
			if (root.dataset["overlay"] !== "closed") {
				observer.disconnect();
				resolve();
			}
		});
		observer.observe(root, { attributes: true, attributeFilter: ["data-overlay"] });
		signal.addEventListener("abort", () => observer.disconnect());
	});
}

/** Resolves once the element enters the viewport. */
function becameVisible(element: Element, signal: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.disconnect();
				resolve();
			}
		});
		observer.observe(element);
		signal.addEventListener("abort", () => observer.disconnect());
	});
}

function wait(delay: number, signal: AbortSignal): Promise<void> {
	return new Promise((resolve) => {
		const timer = window.setTimeout(resolve, delay);
		signal.addEventListener("abort", () => clearTimeout(timer));
	});
}

/**
 * Draws the image at the given number of columns, cropped like `object-fit: cover`,
 * and scales it up without smoothing so every sample becomes a visible block.
 */
function drawPixelated(
	canvas: HTMLCanvasElement,
	buffer: HTMLCanvasElement,
	image: HTMLImageElement,
	columns: number,
) {
	const context = canvas.getContext("2d");
	const bufferContext = buffer.getContext("2d");
	if (!context || !bufferContext) {
		return;
	}

	const rows = Math.max(1, Math.round((columns * canvas.height) / canvas.width));
	buffer.width = columns;
	buffer.height = rows;

	const frameRatio = canvas.width / canvas.height;
	const imageRatio = image.naturalWidth / image.naturalHeight;
	let sourceWidth = image.naturalWidth;
	let sourceHeight = image.naturalHeight;
	if (imageRatio > frameRatio) {
		sourceWidth = sourceHeight * frameRatio;
	} else {
		sourceHeight = sourceWidth / frameRatio;
	}
	const sourceX = (image.naturalWidth - sourceWidth) / 2;
	const sourceY = (image.naturalHeight - sourceHeight) / 2;

	bufferContext.imageSmoothingEnabled = true;
	bufferContext.drawImage(
		image,
		sourceX,
		sourceY,
		sourceWidth,
		sourceHeight,
		0,
		0,
		columns,
		rows,
	);

	context.imageSmoothingEnabled = false;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(buffer, 0, 0, columns, rows, 0, 0, canvas.width, canvas.height);
}

/**
 * An image that appears as large blocks and sharpens step by step, once it is loaded,
 * on screen, and no longer hidden by the page transition.
 */
export function PixelatedImage({ frameClassName, className, ...imageProps }: PixelatedImageProps) {
	const imageRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [state, setState] = useState<RevealState>("pending");

	useEffect(() => {
		const image = imageRef.current;
		const canvas = canvasRef.current;
		if (!image || !canvas) {
			return;
		}
		if (prefersReducedMotion()) {
			setState("done");
			return;
		}

		const controller = new AbortController();
		const { signal } = controller;
		const buffer = document.createElement("canvas");

		const reveal = async () => {
			try {
				await image.decode();
			} catch {
				// A broken or undecodable image is shown as it is.
				setState("done");
				return;
			}
			if (signal.aborted) {
				return;
			}

			const bounds = canvas.getBoundingClientRect();
			const scale = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.max(1, Math.round(bounds.width * scale));
			canvas.height = Math.max(1, Math.round(bounds.height * scale));
			drawPixelated(canvas, buffer, image, ColumnSteps[0] ?? 5);

			await Promise.all([overlayOpened(signal), becameVisible(canvas, signal)]);
			await wait(StartDelay, signal);
			if (signal.aborted) {
				return;
			}

			setState("revealing");
			for (const columns of ColumnSteps) {
				drawPixelated(canvas, buffer, image, columns);
				await wait(StepDuration, signal);
				if (signal.aborted) {
					return;
				}
			}
			setState("done");
		};

		void reveal();
		return () => controller.abort();
	}, []);

	return (
		<span
			className={cn("pixel-image relative block overflow-hidden", frameClassName)}
			data-state={state}
		>
			<img
				ref={imageRef}
				className={cn("h-full w-full object-cover", className)}
				{...imageProps}
			/>
			<canvas
				ref={canvasRef}
				aria-hidden="true"
				className="pixel-image-canvas pointer-events-none absolute inset-0 h-full w-full"
				style={{ transitionDuration: `${FadeDuration}ms` }}
			/>
		</span>
	);
}
