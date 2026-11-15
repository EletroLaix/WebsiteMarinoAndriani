import { createFileRoute, notFound } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { isPagePublished } from "@/Application/Site";
import { PassionsView } from "@/Interface/Views/PassionsView";

export const Route = createFileRoute("/en/passions/")({
	beforeLoad: () => {
		if (!isPagePublished("passions")) {
			throw notFound();
		}
	},
	head: () => pageHead("passions", "en"),
	component: () => <PassionsView lang="en" />,
});
