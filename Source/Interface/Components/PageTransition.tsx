import { useRouter } from "@tanstack/react-router";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
	type AnchorHTMLAttributes,
	type MouseEvent,
	type ReactNode,
} from "react";
import { normalizePath } from "@/Application/Site";
import { SiteVersion } from "@/Application/SiteVersion";
import { Profile } from "@/Resources/Content/Profile";
import { useDictionary, useLang } from "@/Interface/Hooks/UseLanguage";

type Phase = "boot" | "opening" | "idle";

const BootKey = "ma-booted";
const BootDuration = 2200;
const OpenDuration = 800;

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

/** Plays the boot loader on the first visit of a session; links change page through `navigate`. */
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
		document.documentElement.dataset["overlay"] = phase === "boot" ? "closed" : "open";
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
			void router.navigate({ href }).finally(() => window.scrollTo(0, 0));
		},
		[router],
	);

	const value = useMemo<PageTransitionValue>(() => ({ navigate }), [navigate]);

	return (
		<PageTransitionContext.Provider value={value}>
			{children}
			<BootOverlay phase={phase} progress={progress} />
		</PageTransitionContext.Provider>
	);
}

/** Boot steps of the loader; each turns OK once the counter reaches its threshold. */
const BootSteps: ReadonlyArray<{ label: string; at: number }> = [
	{ label: "init firmware", at: 25 },
	{ label: "load profile", at: 50 },
	{ label: "calibrate eye", at: 75 },
	{ label: "render interface", at: 100 },
];

/** A random 0 or 1; always "0" before the counter starts, so server and client render the same. */
function randomBit(progress: number): string {
	if (progress === 0) {
		return "0";
	}
	return Math.random() < 0.5 ? "0" : "1";
}

/** One digit of the counter: a 0–9 strip shifted so the wanted digit shows. */
function RollingDigit({ value }: { value: number }) {
	return (
		<span className="boot-digit">
			<span className="boot-digit-strip" style={{ transform: `translateY(${-value}em)` }}>
				{Array.from({ length: 10 }, (_, digit) => (
					<span key={digit}>{digit}</span>
				))}
			</span>
		</span>
	);
}

/** The name, still made of binary digits for the characters not resolved yet. */
function BinaryName({ progress }: { progress: number }) {
	const characters = [...Profile.name.toUpperCase()];
	const surnameStart = characters.indexOf(" ") + 1;
	return (
		<p className="boot-name">
			{characters.map((character, index) => {
				const resolved = progress >= 0.15 + (0.85 * index) / characters.length;
				const shown = character === " " || resolved ? character : randomBit(progress);
				return (
					<span
						key={index}
						className={index >= surnameStart ? "text-primary" : undefined}
					>
						{shown}
					</span>
				);
			})}
			<span className="boot-cursor" />
		</p>
	);
}

/**
 * Full-screen panel shown on the first visit: a boot log runs while a counter climbs to
 * 100, then the panel lifts like a curtain.
 */
function BootOverlay({ phase, progress }: { phase: Phase; progress: number }) {
	const t = useDictionary();
	const lang = useLang();
	const percent = Math.round(progress * 100);
	const digits = String(percent).padStart(3, "0").split("").map(Number);
	const visibleSteps = BootSteps.filter(
		(_, index) => index === 0 || percent >= BootSteps[index - 1]!.at,
	);

	return (
		<div className="boot-overlay" data-phase={phase} aria-hidden="true">
			<div className="boot-content">
				<pre className="boot-log">
					{`> boot ma-os v${SiteVersion}\n`}
					{visibleSteps.map((step) => (
						<span key={step.label}>
							{`> ${step.label.padEnd(17, " ")}........ `}
							{percent >= step.at ? (
								<span className="text-primary">OK</span>
							) : (
								<span className="text-faint">
									{randomBit(progress) + randomBit(progress)}
								</span>
							)}
							{"\n"}
						</span>
					))}
				</pre>

				<div className="boot-side">
					<img
						src={Profile.icon.path}
						alt=""
						width={40}
						height={40}
						className="brand-eye h-10 w-10"
					/>
					<span className="boot-label">[ {Profile.location.label[lang]} ]</span>
				</div>

				<div className="boot-main">
					<BinaryName progress={progress} />
					<div className="boot-counter">
						{digits.map((digit, index) => (
							<RollingDigit key={index} value={digit} />
						))}
						<span className="boot-percent">%</span>
					</div>
				</div>

				<span className="boot-label boot-status">[ {t.loader.loading} ]</span>
				<span className="boot-bar">
					<span style={{ transform: `scaleX(${progress})` }} />
				</span>
			</div>
		</div>
	);
}

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** An internal link that changes page through the transition provider. */
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
