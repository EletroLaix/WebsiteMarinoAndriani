import { useRouter } from "@tanstack/react-router";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type AnchorHTMLAttributes,
	type MouseEvent,
	type ReactNode,
} from "react";
import { normalizePath } from "@/Application/Site";
import { Profile } from "@/Resources/Content/Profile";
import { useDictionary } from "@/Interface/Hooks/UseLanguage";

type Phase = "boot" | "opening" | "idle" | "closing";

const BootKey = "ma-booted";
const BootDuration = 1300;
const LidDuration = 460;
const OpenDuration = 520;
const RingLength = 502.65;

type PageTransitionValue = {
	navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionValue>({
	navigate: () => {},
});

export function usePageTransition(): PageTransitionValue {
	return useContext(PageTransitionContext);
}

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readBooted(): boolean {
	try {
		return window.sessionStorage.getItem(BootKey) === "1";
	} catch {
		return false;
	}
}

function storeBooted() {
	try {
		window.sessionStorage.setItem(BootKey, "1");
	} catch {
		/* Without storage the full loader simply plays again. */
	}
}

/**
 * Plays the eye loader on the first visit of a session, then closes and reopens
 * two "eyelids" around every page change made through `navigate`.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
	const router = useRouter();
	const [phase, setPhase] = useState<Phase>("boot");
	const [progress, setProgress] = useState(0);
	const phaseRef = useRef<Phase>("boot");
	const timers = useRef<number[]>([]);

	const changePhase = useCallback((next: Phase) => {
		phaseRef.current = next;
		setPhase(next);
	}, []);

	const later = useCallback((callback: () => void, delay: number) => {
		timers.current.push(window.setTimeout(callback, delay));
	}, []);

	useEffect(() => {
		const closed = phase === "boot" || phase === "closing";
		document.documentElement.dataset["overlay"] = closed ? "closed" : "open";
	}, [phase]);

	useEffect(() => {
		const pending = timers.current;
		let frame = 0;

		if (prefersReducedMotion()) {
			changePhase("idle");
		} else if (readBooted()) {
			setProgress(1);
			later(() => changePhase("opening"), 80);
			later(() => changePhase("idle"), 80 + OpenDuration);
		} else {
			const start = performance.now();
			const step = (now: number) => {
				const elapsed = Math.min(1, (now - start) / BootDuration);
				setProgress(1 - Math.pow(1 - elapsed, 3));
				if (elapsed < 1) {
					frame = requestAnimationFrame(step);
					return;
				}
				storeBooted();
				later(() => changePhase("opening"), 150);
				later(() => changePhase("idle"), 150 + OpenDuration);
			};
			frame = requestAnimationFrame(step);
		}

		return () => {
			cancelAnimationFrame(frame);
			pending.forEach((timer) => clearTimeout(timer));
			pending.length = 0;
		};
	}, [changePhase, later]);

	const navigate = useCallback(
		(href: string) => {
			if (normalizePath(href) === normalizePath(window.location.pathname)) {
				return;
			}
			if (prefersReducedMotion() || phaseRef.current !== "idle") {
				void router.navigate({ href });
				return;
			}
			changePhase("closing");
			later(() => {
				void router.navigate({ href }).finally(() => {
					window.scrollTo(0, 0);
					changePhase("opening");
					later(() => changePhase("idle"), OpenDuration);
				});
			}, LidDuration);
		},
		[router, changePhase, later],
	);

	return (
		<PageTransitionContext.Provider value={{ navigate }}>
			{children}
			<EyeOverlay phase={phase} progress={progress} />
		</PageTransitionContext.Provider>
	);
}

function EyeOverlay({ phase, progress }: { phase: Phase; progress: number }) {
	const t = useDictionary();
	const percent = String(Math.round(progress * 100)).padStart(3, "0");

	return (
		<div className="eye-overlay" data-phase={phase} aria-hidden="true">
			<div className="eye-lid eye-lid-top" />
			<div className="eye-lid eye-lid-bottom" />
			<div className="eye-core">
				<div className="relative grid h-[168px] w-[168px] place-items-center">
					<svg viewBox="0 0 168 168" className="eye-ring absolute inset-0 h-full w-full">
						<circle
							cx="84"
							cy="84"
							r="80"
							fill="none"
							stroke="oklch(0.7 0.19 47 / 0.15)"
							strokeWidth="2"
						/>
						<circle
							cx="84"
							cy="84"
							r="80"
							fill="none"
							stroke="var(--color-primary)"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeDasharray={RingLength}
							strokeDashoffset={(RingLength * (1 - progress)).toFixed(1)}
							transform="rotate(-90 84 84)"
						/>
					</svg>
					<img
						src={Profile.icon.path}
						alt=""
						width={128}
						height={128}
						className="eye-image h-32 w-32"
					/>
				</div>
				<div className="text-center font-mono">
					<p className="text-[13px] tracking-[0.32em] text-foreground">MARINO ANDRIANI</p>
					<p className="mt-2 text-[11px] tracking-[0.2em] text-faint">
						{phase === "boot" ? `${t.loader.loading.toUpperCase()} ${percent}%` : " "}
					</p>
				</div>
			</div>
		</div>
	);
}

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** An internal link that plays the eyelid transition before changing page. */
export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
	const { navigate } = usePageTransition();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event);
		const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
		if (event.defaultPrevented || event.button !== 0 || modified) {
			return;
		}
		event.preventDefault();
		navigate(href);
	};

	return (
		<a href={href} onClick={handleClick} {...rest}>
			{children}
		</a>
	);
}
