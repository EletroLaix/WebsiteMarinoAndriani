import { useEffect, useSyncExternalStore } from "react";
import {
	analyticsServerState,
	analyticsState,
	initializeAnalytics,
	setConsent,
	subscribeAnalytics,
} from "@/Application/Analytics";
import { useDictionary } from "@/Interface/Hooks/UseLanguage";

/** Minimal analytics consent prompt; Google Analytics stays off unless accepted. */
export function ConsentBanner() {
	const t = useDictionary();
	const state = useSyncExternalStore(subscribeAnalytics, analyticsState, analyticsServerState);

	useEffect(() => {
		initializeAnalytics();
	}, []);

	if (!state.bannerOpen) {
		return null;
	}

	return (
		<div
			role="region"
			aria-label={t.consent.label}
			className="consent-banner fixed inset-x-4 bottom-4 z-40 cut flex flex-col gap-3 bg-card/95 p-4 backdrop-blur sm:right-auto sm:max-w-sm"
		>
			<p className="text-sm leading-relaxed text-muted-foreground">{t.consent.text}</p>
			<div className="flex justify-end gap-2">
				<button
					type="button"
					onClick={() => setConsent("denied")}
					className="cut-sm cut-hover min-h-10 px-4 text-sm font-semibold text-foreground"
				>
					{t.consent.decline}
				</button>
				<button
					type="button"
					onClick={() => setConsent("granted")}
					className="cut-sm cut-fill min-h-10 bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
				>
					{t.consent.accept}
				</button>
			</div>
		</div>
	);
}
