import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { QuotesView } from "@/Interface/Views/QuotesView";

export const Route = createFileRoute("/passioni/citazioni")({
	head: () => pageHead("quotes", "it"),
	component: () => <QuotesView lang="it" />,
});
