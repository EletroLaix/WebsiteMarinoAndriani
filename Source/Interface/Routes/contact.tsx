import { createFileRoute } from "@tanstack/react-router";
import { hiddenPageHead } from "@/Application/Seo";
import { LegacyRedirects } from "@/Application/Site";
import { LegacyRedirectView } from "@/Interface/Views/LegacyRedirectView";

// Retired English-only address kept so existing links keep working.
const target = LegacyRedirects["/contact"] ?? "/";

export const Route = createFileRoute("/contact")({
	head: () => {
		const head = hiddenPageHead("Marino Andriani", target);
		return {
			...head,
			meta: [...head.meta, { httpEquiv: "refresh", content: `0; url=${target}/` }],
		};
	},
	component: () => <LegacyRedirectView to={target} />,
});
