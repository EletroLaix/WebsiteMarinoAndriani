import { Cookie } from "lucide-react";
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
		<div className="consent-banner">
			<section aria-label={t.consent.label} className="cut bg-card">
				<div className="consent-banner-content px-3.5 pt-3 pb-1">
					<p className="flex items-start gap-2 text-[0.8125rem] leading-snug text-muted-foreground">
						<Cookie className="mt-px size-4 shrink-0 text-accent" aria-hidden="true" />
						<span>{t.consent.text}</span>
					</p>
					<div className="mt-1 flex flex-wrap justify-end gap-x-2">
						<button
							type="button"
							onClick={() => setConsent("denied")}
							className="min-h-11 w-20 px-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
						>
							{t.consent.decline}
						</button>
						<button
							type="button"
							onClick={() => setConsent("granted")}
							className="min-h-11 w-20 px-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
						>
							{t.consent.accept}
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
