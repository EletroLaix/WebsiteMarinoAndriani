import type { PointerEvent } from "react";

/** Tilts a `.tilt` element towards the pointer (mouse only). */
export function tiltTowardsPointer(event: PointerEvent<HTMLElement>) {
	if (event.pointerType !== "mouse") return;
	const target = event.currentTarget;
	const rect = target.getBoundingClientRect();
	const x = (event.clientX - rect.left) / rect.width - 0.5;
	const y = (event.clientY - rect.top) / rect.height - 0.5;
	target.style.transform = `perspective(900px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg)`;
}

export function resetTilt(event: PointerEvent<HTMLElement>) {
	event.currentTarget.style.transform = "";
}
