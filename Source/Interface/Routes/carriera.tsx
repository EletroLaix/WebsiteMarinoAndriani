import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { AboutView } from "@/Interface/Views/AboutView";

export const Route = createFileRoute("/carriera")({
	head: () => pageHead("about", "it"),
	component: () => <AboutView lang="it" />,
});
