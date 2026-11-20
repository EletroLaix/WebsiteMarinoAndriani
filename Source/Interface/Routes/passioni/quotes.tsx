import { createFileRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";
import { hiddenPageHead } from "@/Application/Seo";

export const Route = createFileRoute("/passioni/citazioni")({
	beforeLoad: () => {
		if (!import.meta.env.DEV) throw notFound();
	},
	head: () => hiddenPageHead("Citazioni — Marino Andriani"),
	component: import.meta.env.DEV
		? lazyRouteComponent(() => import("@/Interface/Views/QuotesView"), "ItalianQuotesView")
		: () => null,
});
