import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { TrekkingView } from "@/Interface/Views/TrekkingView";

export const Route = createFileRoute("/en/passions/trekking")({
	head: () => pageHead("trekking", "en"),
	component: () => <TrekkingView lang="en" />,
});
