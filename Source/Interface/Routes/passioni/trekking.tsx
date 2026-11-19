import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { TrekkingView } from "@/Interface/Views/TrekkingView";

export const Route = createFileRoute("/passioni/trekking")({
	head: () => pageHead("trekking", "it"),
	component: () => <TrekkingView lang="it" />,
});
