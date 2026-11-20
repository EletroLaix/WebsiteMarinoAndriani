import { useEffect, useRef } from "react";

const Sparks = Array.from({ length: 128 }, (_, index) => ({
	phase: (index * 0.271) % 1,
	speed: 0.14 + (index % 7) * 0.014,
	angle: index * 2.399,
	spread: 0.13 + (index % 13) / 18,
	lift: 0.41 + (index % 9) * 0.023,
	digit: String(index % 2),
	mote: index % 4 === 0,
}));

type LavaField = {
	width: number;
	height: number;
	time: number;
	pulse: number;
	x: number;
	y: number;
};

function drawEmbers(context: CanvasRenderingContext2D, field: LavaField) {
	const { width, height, time, pulse, x, y } = field;
	const cx = width / 2;
	const cy = height * 0.81;
	const radius = Math.min(width * 0.39, 315);
	const charge = Math.max(0, 1 - Math.abs(pulse) * (pulse < 0 ? 1.25 : 0.95));

	context.save();
	context.translate(cx, cy);
	context.scale(1, 0.22);
	const glow = context.createRadialGradient(0, 0, 0, 0, 0, radius);
	glow.addColorStop(0, `rgba(255, 164, 76, ${0.21 + charge * 0.43})`);
	glow.addColorStop(0.32, `rgba(240, 88, 27, ${0.12 + charge * 0.21})`);
	glow.addColorStop(1, "transparent");
	context.fillStyle = glow;
	context.fillRect(-radius, -radius, radius * 2, radius * 2);
	context.restore();

	context.font = "12px monospace";
	for (const spark of Sparks) {
		const phase = (spark.phase + time * spark.speed) % 1;
		const spread = radius * spark.spread * (0.18 + phase);
		const px = cx + Math.cos(spark.angle + phase * 2.7) * spread;
		const py = cy - phase * height * spark.lift;
		const pointer = Math.max(0, 1 - Math.hypot(px - x, py - y) / 115);
		const alpha = Math.sin(phase * Math.PI) * (0.16 + charge * 0.52) + pointer * 0.4;
		context.fillStyle = `rgba(255, 171, 106, ${alpha})`;
		if (spark.mote) context.fillRect(px, py, 1.25, 2);
		else context.fillText(spark.digit, px, py);
	}
}

export function QuoteField({ revision, entryDelay }: { revision: number; entryDelay: number }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pulseTime = useRef(-10_000);

	useEffect(() => {
		pulseTime.current = performance.now() + entryDelay;
	}, [revision, entryDelay]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const scene = canvas?.parentElement;
		const context = canvas?.getContext("2d");
		if (!canvas || !scene || !context) return;

		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const field: LavaField = { width: 0, height: 0, time: 0, pulse: 2, x: -1000, y: -1000 };
		let frame = 0;
		let lastFrame = 0;

		function draw(timestamp: number, animated: boolean) {
			if (!context || !field.width || !field.height) return;
			field.time = animated ? timestamp / 1000 : 0;
			field.pulse = animated ? (timestamp - pulseTime.current) / 1000 : 2;
			context.clearRect(0, 0, field.width, field.height);
			drawEmbers(context, field);
		}

		function tick(timestamp: number) {
			if (timestamp - lastFrame >= 30) {
				draw(timestamp, true);
				lastFrame = timestamp;
			}
			frame = requestAnimationFrame(tick);
		}

		function syncMotion() {
			cancelAnimationFrame(frame);
			if (motion.matches || document.hidden) draw(performance.now(), false);
			else frame = requestAnimationFrame(tick);
		}

		function trackPointer(event: PointerEvent) {
			if (motion.matches || !canvas) return;
			const bounds = canvas.getBoundingClientRect();
			field.x = event.clientX - bounds.left;
			field.y = event.clientY - bounds.top;
		}

		function releasePointer(event: PointerEvent) {
			if (event.type === "pointerleave" || event.pointerType !== "mouse") field.x = -1000;
		}

		function sendPulse(event: PointerEvent) {
			if (motion.matches || event.button !== 0) return;
			trackPointer(event);
			pulseTime.current = performance.now();
		}

		const resize = new ResizeObserver(([entry]) => {
			if (!entry) return;
			field.width = entry.contentRect.width;
			field.height = entry.contentRect.height;
			const ratio = Math.min(window.devicePixelRatio, 1.5);
			canvas.width = Math.round(field.width * ratio);
			canvas.height = Math.round(field.height * ratio);
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			draw(performance.now(), !motion.matches);
		});
		resize.observe(canvas);
		scene.addEventListener("pointermove", trackPointer, { passive: true });
		scene.addEventListener("pointerdown", sendPulse, { passive: true });
		scene.addEventListener("pointerleave", releasePointer);
		scene.addEventListener("pointerup", releasePointer);
		scene.addEventListener("pointercancel", releasePointer);
		motion.addEventListener("change", syncMotion);
		document.addEventListener("visibilitychange", syncMotion);
		syncMotion();

		return () => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			scene.removeEventListener("pointermove", trackPointer);
			scene.removeEventListener("pointerdown", sendPulse);
			scene.removeEventListener("pointerleave", releasePointer);
			scene.removeEventListener("pointerup", releasePointer);
			scene.removeEventListener("pointercancel", releasePointer);
			motion.removeEventListener("change", syncMotion);
			document.removeEventListener("visibilitychange", syncMotion);
		};
	}, []);

	return <canvas ref={canvasRef} className="quotes-field" aria-hidden="true" />;
}
