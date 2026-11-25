import { useEffect } from "react";
import { langFromPath } from "@/Application/Site";
import { dictionary } from "@/Resources/Dictionary";

/** Sends visitors of a retired address to its replacement. */
export function LegacyRedirectView({ to }: { to: string }) {
	const t = dictionary(langFromPath(to));

	useEffect(() => {
		window.location.replace(`${to}/`);
	}, [to]);

	return (
		<section className="mx-auto max-w-xl px-4 py-32 text-center">
			<p className="text-muted-foreground">{t.redirect.text}</p>
			<a href={`${to}/`} className="mt-4 inline-block font-semibold text-accent">
				{t.redirect.link}
			</a>
		</section>
	);
}
