import { defineConfig, type Plugin } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { DOMParser } from "@xmldom/xmldom";
import { parseGpx } from "./Source/Application/Gpx";
import { absoluteUrl, LegacyRedirects, publishedPages } from "./Source/Application/Site";

type StaticPage = {
	path: string;
	sitemap: {
		exclude?: boolean;
		alternateRefs?: { hreflang: string; href: string }[];
	};
	prerender?: { outputPath: string };
};

/** Paths with a trailing slash, the form GitHub Pages serves without redirecting. */
function servedPath(path: string): string {
	return path === "/" ? path : `${path}/`;
}

/**
 * The exact list of pages to generate: published pages go into the sitemap with
 * their language alternates; redirects and the 404 page are generated but not listed.
 */
function staticPages(): StaticPage[] {
	const pages: StaticPage[] = publishedPages().map((page) => ({
		path: servedPath(page.path),
		sitemap: {
			alternateRefs: [
				...page.alternates.map((alternate) => ({
					hreflang: alternate.lang,
					href: absoluteUrl(alternate.path),
				})),
				{ hreflang: "x-default", href: absoluteUrl(page.alternates[0]?.path ?? "/") },
			],
		},
	}));
	const legacy: StaticPage[] = Object.keys(LegacyRedirects).map((path) => ({
		path: servedPath(path),
		sitemap: { exclude: true },
	}));
	const notFound: StaticPage = {
		path: "/404",
		sitemap: { exclude: true },
		prerender: { outputPath: "/404.html" },
	};
	return [...pages, ...legacy, notFound];
}

function escapeXml(value: string): string {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function trekkingTracksPlugin(): Plugin {
	const parser = new DOMParser({
		onError(level, message) {
			if (level !== "warning") throw new Error(message);
		},
	});
	return {
		name: "trekking-tracks",
		enforce: "pre",
		async load(id) {
			if (!id.endsWith(".gpx?track")) return;
			const filename = id.slice(0, -"?track".length);
			this.addWatchFile(filename);
			try {
				const document = parser.parseFromString(
					await readFile(filename, "utf8"),
					"application/xml",
				);
				const segments = parseGpx(document);
				const data = JSON.stringify(segments, (key, value) =>
					key === "distance" && typeof value === "number"
						? Number(value.toFixed(5))
						: value,
				);
				return `export default ${data};`;
			} catch (error) {
				this.error(`Could not read trekking track ${filename}: ${String(error)}`);
			}
		},
	};
}

/** Writes sitemap.xml with hreflang alternates into the static client output. */
function sitemapPlugin(): Plugin {
	return {
		name: "website-sitemap",
		apply: "build",
		generateBundle() {
			if (this.environment.name !== "client") return;
			const urls = staticPages()
				.filter((page) => !page.sitemap.exclude)
				.map((page) => {
					const links = (page.sitemap.alternateRefs ?? [])
						.map(
							(ref) =>
								`\t\t<xhtml:link rel="alternate" hreflang="${ref.hreflang}" href="${escapeXml(ref.href)}" />`,
						)
						.join("\n");
					return `\t<url>\n\t\t<loc>${escapeXml(absoluteUrl(page.path))}</loc>\n${links}\n\t</url>`;
				});
			this.emitFile({
				type: "asset",
				fileName: "sitemap.xml",
				source: [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
					...urls,
					"</urlset>",
					"",
				].join("\n"),
			});
		},
	};
}

export default defineConfig(({ command, mode }) => {
	const staticExport = mode === "pages" || process.env["STATIC_EXPORT"] === "1";
	// The released version in package.json, shown in the footer and the loader.
	const { version } = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };

	return {
		publicDir: "Source/Resources/Public",
		define: { __SITE_VERSION__: JSON.stringify(version) },
		cacheDir: "Output/Cache/Vite",
		build: { outDir: "Output/Static" },
		resolve: {
			tsconfigPaths: true,
			dedupe: ["react", "react-dom", "@tanstack/react-query", "@tanstack/query-core"],
		},
		plugins: [
			trekkingTracksPlugin(),
			tailwindcss(),
			tanstackStart({
				srcDirectory: "Source",
				router: { routesDirectory: "Interface/Routes", tmpDir: "Output/Cache/Router" },
				server: { entry: "server" },
				importProtection: {
					behavior: "error",
					client: { files: ["**/server/**"], specifiers: ["server-only"] },
				},
				...(staticExport
					? {
							pages: staticPages(),
							prerender: {
								enabled: true,
								// Only the listed pages are generated, so unpublished sections stay out.
								autoStaticPathsDiscovery: false,
								crawlLinks: false,
							},
						}
					: {}),
			}),
			...(command === "build" && !staticExport
				? [nitro({ preset: "node-server", output: { dir: "Output/Server" } })]
				: []),
			react(),
			...(staticExport ? [sitemapPlugin()] : []),
		],
	};
});
