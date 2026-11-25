import { useEffect, useRef, useState, type CSSProperties } from "react";
import { formatPeriod, type Role } from "@/Resources/Content/Experience";
import type { Lang } from "@/Resources/Content/Localized";
import { usePageTransition } from "@/Interface/Components/PageTransition";

/** Without scripts or motion the timeline stays in its final state. */
type Phase = "still" | "waiting" | "running";

/** Roles along a line that advances once on screen, lighting every role it reaches. */
export function CareerTimeline({ roles, lang }: { roles: Role[]; lang: Lang }) {
	const { bootComplete } = usePageTransition();
	const rootRef = useRef<HTMLDivElement>(null);
	const [phase, setPhase] = useState<Phase>("still");

	useEffect(() => {
		const root = rootRef.current;
		if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		setPhase("waiting");
		if (!bootComplete) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				setPhase("running");
			},
			{ rootMargin: "0px 0px -15% 0px" },
		);
		observer.observe(root);
		return () => observer.disconnect();
	}, [bootComplete]);

	return (
		<div ref={rootRef} className="timeline relative mt-10" data-phase={phase}>
			<div className="timeline-track" aria-hidden="true">
				<span className="timeline-line" />
				<span className="timeline-head" />
			</div>
			<ol className="relative grid gap-8 sm:grid-cols-5 sm:gap-6">
				{roles.map((role, index) => (
					<li
						key={role.id}
						className="timeline-role"
						data-current={index === roles.length - 1}
						style={{ "--reached": index / roles.length } as CSSProperties}
					>
						<span className="timeline-mark" aria-hidden="true" />
						<div className="timeline-label">
							<p className="mt-3 font-mono text-xs text-accent">
								{formatPeriod(role, lang)}
							</p>
							<p className="mt-1 text-sm font-medium">{role.title[lang]}</p>
						</div>
					</li>
				))}
			</ol>
		</div>
	);
}
