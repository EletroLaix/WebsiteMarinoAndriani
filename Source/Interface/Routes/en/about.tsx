import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { AboutView } from "@/Interface/Views/AboutView";

export const Route = createFileRoute("/en/about")({
	head: () => pageHead("about", "en"),
	component: () => <AboutView lang="en" />,
});
