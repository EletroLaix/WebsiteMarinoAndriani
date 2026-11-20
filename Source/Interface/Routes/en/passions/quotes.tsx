import { createFileRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";
import { hiddenPageHead } from "@/Application/Seo";

export const Route = createFileRoute("/en/passions/quotes")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) throw notFound();
	},
	head: () => hiddenPageHead("Quotes — Marino Andriani"),
	component: import.meta.env.DEV
		? lazyRouteComponent(() => import("@/Interface/Views/QuotesView"), "EnglishQuotesView")
		: () => null,
});
