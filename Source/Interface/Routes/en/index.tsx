import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { HomeView } from "@/Interface/Views/HomeView";

export const Route = createFileRoute("/en/")({
	head: () => pageHead("home", "en"),
	component: () => <HomeView lang="en" />,
});
