import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { HomeView } from "@/Interface/Views/HomeView";

export const Route = createFileRoute("/")({
	head: () => pageHead("home", "it"),
	component: () => <HomeView lang="it" />,
});
