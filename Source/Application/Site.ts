// Imported by vite.config.ts as well, so keep relative imports and no React here.
import { DefaultLang, Languages, type Lang, type Localized } from "../Resources/Content/Localized";
import { PassionSections, publishedPassionSections } from "../Resources/Content/Passions";

export const SiteUrl = "https://marinoandriani.me";

export type PageKey = "home" | "about" | "contact" | "passions";

const PagePaths: Record<PageKey, Localized> = {
	home: { it: "/", en: "/en" },
	about: { it: "/chi-sono", en: "/en/about" },
	contact: { it: "/contatti", en: "/en/contact" },
	passions: { it: "/passioni", en: "/en/passions" },
};

/** Old addresses that now redirect to their localized replacement. */
export const LegacyRedirects: Record<string, string> = {
	"/about": PagePaths.about.it,
	"/contact": PagePaths.contact.it,
};

export function normalizePath(pathname: string): string {
	if (pathname.length > 1 && pathname.endsWith("/")) {
		return pathname.slice(0, -1);
	}
	return pathname;
}

export function langFromPath(pathname: string): Lang {
	const path = normalizePath(pathname);
	return path === "/en" || path.startsWith("/en/") ? "en" : DefaultLang;
}

export function pagePath(key: PageKey, lang: Lang): string {
	return PagePaths[key][lang];
}

export function pageFromPath(pathname: string): PageKey | undefined {
	const path = normalizePath(pathname);
	const keys = Object.keys(PagePaths) as PageKey[];
	return keys.find((key) => Languages.some((lang) => PagePaths[key][lang] === path));
}

export function isPagePublished(key: PageKey): boolean {
	if (key === "passions") {
		return publishedPassionSections().length > 0;
	}
	return true;
}

/** The same page in another language, falling back to that language's home page. */
export function alternatePath(pathname: string, target: Lang): string {
	const path = normalizePath(pathname);
	const key = pageFromPath(path);
	if (key) {
		return pagePath(key, target);
	}
	const section = PassionSections.find((item) =>
		Languages.some((lang) => item.path[lang] === path),
	);
	return section ? section.path[target] : pagePath("home", target);
}

/** Absolute URL in the form GitHub Pages serves without a redirect. */
export function absoluteUrl(path: string): string {
	const normalized = normalizePath(path);
	return normalized === "/" ? `${SiteUrl}/` : `${SiteUrl}${normalized}/`;
}

export type SitePage = {
	path: string;
	alternates: { lang: Lang; path: string }[];
};

/** Every published, indexable page with its language alternates. */
export function publishedPages(): SitePage[] {
	const pages: SitePage[] = [];
	const keys = Object.keys(PagePaths) as PageKey[];
	for (const key of keys.filter(isPagePublished)) {
		for (const lang of Languages) {
			pages.push({
				path: PagePaths[key][lang],
				alternates: Languages.map((other) => ({
					lang: other,
					path: PagePaths[key][other],
				})),
			});
		}
	}
	for (const section of publishedPassionSections()) {
		for (const lang of Languages) {
			pages.push({
				path: section.path[lang],
				alternates: Languages.map((other) => ({ lang: other, path: section.path[other] })),
			});
		}
	}
	return pages;
}

/** True for paths that exist as routes but must not be generated yet. */
export function isUnpublishedPath(pathname: string): boolean {
	const path = normalizePath(pathname);
	if (
		!isPagePublished("passions") &&
		Languages.some((lang) => PagePaths.passions[lang] === path)
	) {
		return true;
	}
	return PassionSections.some(
		(section) =>
			!section.published && Languages.some((lang) => path.startsWith(section.path[lang])),
	);
}
