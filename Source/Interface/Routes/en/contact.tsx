import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/Application/Seo";
import { ContactView } from "@/Interface/Views/ContactView";

export const Route = createFileRoute("/en/contact")({
	head: () => pageHead("contact", "en"),
	component: () => <ContactView lang="en" />,
});
