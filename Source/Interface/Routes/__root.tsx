import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	Outlet,
	createRootRouteWithContext,
	useRouter,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../../styles.css?url";
import { Header } from "@/Interface/Components/Header";
import { Footer } from "@/Interface/Components/Footer";
import { LavaBackground } from "@/Interface/Components/LavaBackground";
import { PageTransitionProvider } from "@/Interface/Components/PageTransition";
import { trackPageView } from "@/Application/Analytics";
import { langFromPath } from "@/Application/Site";
import { ConsentBanner } from "@/Interface/Components/ConsentBanner";
import { NotFoundView } from "@/Interface/Views/NotFoundView";
import { Profile } from "@/Resources/Content/Profile";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
	console.error(error);
	const router = useRouter();

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					This page didn't load
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Something went wrong on our end. You can try refreshing or head back home.
				</p>
				<div className="mt-6 flex flex-wrap justify-center gap-2">
					<button
						onClick={() => {
							router.invalidate();
							reset();
						}}
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Try again
					</button>
					<a
						href="/"
						className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
					>
						Go home
					</a>
				</div>
			</div>
		</div>
	);
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: Profile.name },
			{ name: "author", content: Profile.name },
			{ name: "theme-color", content: "#0b0b0b" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "icon", type: "image/png", href: "/favicon.png" },
			{ rel: "apple-touch-icon", href: Profile.icon.path },
			{ rel: "preload", as: "image", href: Profile.icon.path },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600;700&display=swap",
			},
		],
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundView,
	errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<html lang={langFromPath(pathname)} className="dark" data-overlay="closed">
			<head>
				<HeadContent />
			</head>
			<body className="font-sans antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function InnerRoot() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	useEffect(() => {
		trackPageView(pathname);
	}, [pathname]);

	return (
		<PageTransitionProvider>
			<LavaBackground />
			<div className="relative flex min-h-screen flex-col">
				<Header />
				<main className="flex-1">
					<Outlet />
				</main>
				<Footer />
				<ConsentBanner />
			</div>
		</PageTransitionProvider>
	);
}

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<QueryClientProvider client={queryClient}>
			<InnerRoot />
		</QueryClientProvider>
	);
}
