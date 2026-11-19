const MeasurementId = "G-J1BV4FVTH5";
const ConsentKey = "ma-analytics-consent";
const AnalyticsDisabledKey = `ga-disable-${MeasurementId}`;

export type Consent = "granted" | "denied" | null;

type Placement = "header" | "mobile_menu" | "footer" | "contact_page" | "home";

type AnalyticsState = {
	consent: Consent;
	bannerOpen: boolean;
};

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

let state: AnalyticsState = { consent: null, bannerOpen: false };
let initialized = false;
let scriptLoaded = false;
const listeners = new Set<() => void>();

function emit(next: AnalyticsState) {
	state = next;
	listeners.forEach((listener) => listener());
}

function readStoredConsent(): Consent {
	try {
		const value = window.localStorage.getItem(ConsentKey);
		return value === "granted" || value === "denied" ? value : null;
	} catch {
		return null;
	}
}

function storeConsent(consent: Consent) {
	try {
		if (consent) {
			window.localStorage.setItem(ConsentKey, consent);
		} else {
			window.localStorage.removeItem(ConsentKey);
		}
	} catch {
		/* Storage can be unavailable in private browsing; consent then lasts for the visit. */
	}
}

/** Injects gtag.js once; nothing is sent to Google before the visitor accepts. */
function loadGoogleAnalytics() {
	if (scriptLoaded) {
		return;
	}
	scriptLoaded = true;
	window.dataLayer = window.dataLayer || [];
	// GA requires the raw `arguments` object to be pushed, not a real array.
	function gtag() {
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer?.push(arguments);
	}
	window.gtag = gtag as unknown as (...args: unknown[]) => void;
	window.gtag("js", new Date());
	window.gtag("config", MeasurementId, { send_page_view: false });

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${MeasurementId}`;
	document.head.appendChild(script);
}

function removeGoogleAnalyticsCookies() {
	const domain = window.location.hostname;
	for (const cookie of document.cookie.split(";")) {
		const name = cookie.split("=")[0]?.trim() ?? "";
		if (name === "_ga" || name.startsWith("_ga_")) {
			document.cookie = `${name}=; Max-Age=0; path=/`;
			document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
		}
	}
}

/** Reads the stored choice; call once on the client. */
export function initializeAnalytics() {
	if (initialized || typeof window === "undefined") {
		return;
	}
	initialized = true;
	const consent = readStoredConsent();
	if (consent === "granted") {
		loadGoogleAnalytics();
	}
	emit({ consent, bannerOpen: consent === null });
}

export function setConsent(consent: "granted" | "denied") {
	storeConsent(consent);
	const granted = consent === "granted";
	(window as unknown as Record<string, unknown>)[AnalyticsDisabledKey] = !granted;
	if (granted) {
		loadGoogleAnalytics();
	} else {
		removeGoogleAnalyticsCookies();
	}
	emit({ consent, bannerOpen: false });
	if (granted) trackPageView(window.location.pathname);
}

export function openConsentBanner() {
	emit({ ...state, bannerOpen: true });
}

export function subscribeAnalytics(listener: () => void): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

export function analyticsState(): AnalyticsState {
	return state;
}

const serverState: AnalyticsState = { consent: null, bannerOpen: false };

export function analyticsServerState(): AnalyticsState {
	return serverState;
}

export function trackPageView(path: string) {
	if (state.consent !== "granted" && readStoredConsent() !== "granted") {
		return;
	}
	window.gtag?.("event", "page_view", {
		page_path: path,
		page_location: window.location.href,
		page_title: document.title,
	});
}

/** Tracks an outbound click to a social network or email link. */
export function trackOutbound(network: string, placement: Placement, url: string) {
	if (typeof window === "undefined" || state.consent !== "granted") {
		return;
	}
	window.gtag?.("event", url.startsWith("mailto:") ? "email_click" : "social_click", {
		network,
		placement,
		link_url: url,
		link_id: `${network.toLowerCase()}_${placement}`,
		outbound: true,
	});
}
