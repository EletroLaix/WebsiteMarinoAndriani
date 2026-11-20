import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { QuotesView } from "@/Interface/Views/QuotesView";

export const Route = createFileRoute("/en/passions/quotes")({
	head: () => pageHead("quotes", "en"),
	component: () => <QuotesView lang="en" />,
});
