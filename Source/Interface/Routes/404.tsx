import { createFileRoute } from "@tanstack/react-router";
import { hiddenPageHead } from "@/Application/Seo";
import { NotFoundView } from "@/Interface/Views/NotFoundView";

// Rendered to 404.html, which GitHub Pages serves for unknown addresses.
export const Route = createFileRoute("/404")({
	head: () => hiddenPageHead("404 — Marino Andriani"),
	component: NotFoundView,
});
