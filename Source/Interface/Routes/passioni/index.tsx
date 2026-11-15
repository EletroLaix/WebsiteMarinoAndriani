import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { isPagePublished } from "@/Application/Site";
import { PassionsView } from "@/Interface/Views/PassionsView";

export const Route = createFileRoute("/passioni/")({
	beforeLoad: () => {
		if (!isPagePublished("passions")) {
			throw notFound();
		}
	},
	head: () => pageHead("passions", "it"),
	component: () => <PassionsView lang="it" />,
});
