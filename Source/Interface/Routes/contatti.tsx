import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { ContactView } from "@/Interface/Views/ContactView";

export const Route = createFileRoute("/contatti")({
	head: () => pageHead("contact", "it"),
	component: () => <ContactView lang="it" />,
});
