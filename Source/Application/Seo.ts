import { absoluteUrl, pagePath, SiteUrl, type PageKey } from "@/Application/Site";
import { Languages, type Lang } from "@/Resources/Content/Localized";
import { Profile } from "@/Resources/Content/Profile";
import { dictionary } from "@/Resources/Dictionary";

type SeoText = { title: string; description: string };

const PageText: Record<PageKey, Record<Lang, SeoText>> = {
	home: {
		it: {
			title: "Marino Andriani — Software Engineer, sistemi embedded e automazione industriale",
			description:
				"Marino Andriani, software engineer a Bari. Head of Software Engineering in Roboze: firmware C/C++ per microcontrollori, PLC B&R e automazione per stampanti 3D industriali.",
		},
		en: {
			title: "Marino Andriani — Software Engineer, embedded systems and industrial automation",
			description:
				"Marino Andriani, software engineer based in Bari, Italy. Head of Software Engineering at Roboze: C/C++ firmware for microcontrollers, B&R PLCs, and automation for industrial 3D printers.",
		},
	},
	about: {
		it: {
			title: "Chi sono ed esperienza — Marino Andriani",
			description:
				"Esperienza di Marino Andriani in Roboze e nella community maker di Bari: sistemi embedded, automazione industriale con PLC B&R, IT e coordinamento del team software.",
		},
		en: {
			title: "About and experience — Marino Andriani",
			description:
				"Marino Andriani's experience at Roboze and in the Bari maker community: embedded systems, industrial automation with B&R PLCs, IT, and software team leadership.",
		},
	},
	contact: {
		it: {
			title: "Contatti — Marino Andriani",
			description:
				"Contatta Marino Andriani, software engineer a Bari, via email, LinkedIn, GitHub o X.",
		},
		en: {
			title: "Contact — Marino Andriani",
			description:
				"Get in touch with Marino Andriani, software engineer in Bari, Italy, by email, LinkedIn, GitHub, or X.",
		},
	},
	passions: {
		it: {
			title: "Passioni — Marino Andriani",
			description: "Progetti personali, citazioni e trekking di Marino Andriani.",
		},
		en: {
			title: "Passions — Marino Andriani",
			description: "Personal projects, quotes, and trekking by Marino Andriani.",
		},
	},
};

const Locales: Record<Lang, string> = { it: "it_IT", en: "en_US" };
const PersonId = `${SiteUrl}/#person`;
const WebsiteId = `${SiteUrl}/#website`;

function personSchema(lang: Lang) {
	return {
		"@type": "Person",
		"@id": PersonId,
		name: Profile.name,
		url: absoluteUrl(pagePath("home", lang)),
		image: `${SiteUrl}${Profile.portrait.path}`,
		email: `mailto:${Profile.email}`,
		jobTitle: Profile.jobTitle,
		worksFor: {
			"@type": "Organization",
			name: Profile.employer,
			url: "https://www.roboze.com",
		},
		address: {
			"@type": "PostalAddress",
			addressLocality: Profile.location.city,
			addressRegion: Profile.location.region,
			addressCountry: Profile.location.country,
		},
		knowsAbout: [
			"Embedded systems",
			"C/C++",
			"Atmel AVR",
			"PCB design",
			"Industrial automation",
			"B&R Automation",
			"IEC 61131-3",
			"Motion control",
			"Industrial 3D printing",
			"SCRUM",
			"DevOps",
		],
		knowsLanguage: ["it", "en"],
		sameAs: Profile.socials.map((social) => social.url),
	};
}

function breadcrumbSchema(lang: Lang, key: PageKey) {
	const t = dictionary(lang);
	const names: Record<PageKey, string> = {
		home: t.nav.home,
		about: t.nav.about,
		contact: t.nav.contact,
		passions: t.nav.passions,
	};
	return {
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: names.home,
				item: absoluteUrl(pagePath("home", lang)),
			},
			{
				"@type": "ListItem",
				position: 2,
				name: names[key],
				item: absoluteUrl(pagePath(key, lang)),
			},
		],
	};
}

function structuredData(key: PageKey, lang: Lang) {
	const url = absoluteUrl(pagePath(key, lang));
	const text = PageText[key][lang];
	if (key === "home") {
		return [
			personSchema(lang),
			{
				"@type": "WebSite",
				"@id": WebsiteId,
				url: absoluteUrl(pagePath("home", lang)),
				name: Profile.name,
				inLanguage: Languages,
				publisher: { "@id": PersonId },
			},
		];
	}
	const pageType =
		key === "about" ? "ProfilePage" : key === "contact" ? "ContactPage" : "WebPage";
	return [
		{
			"@type": pageType,
			url,
			name: text.title,
			description: text.description,
			inLanguage: lang,
			isPartOf: { "@id": WebsiteId },
			...(key === "about"
				? { mainEntity: personSchema(lang) }
				: { about: { "@id": PersonId } }),
		},
		breadcrumbSchema(lang, key),
	];
}

/** Title, description, canonical URL, language alternates, social cards, and JSON-LD for a page. */
export function pageHead(key: PageKey, lang: Lang) {
	const text = PageText[key][lang];
	const url = absoluteUrl(pagePath(key, lang));
	const image = `${SiteUrl}${Profile.portrait.path}`;
	const otherLocales = Languages.filter((other) => other !== lang).map((other) => ({
		property: "og:locale:alternate",
		content: Locales[other],
	}));

	return {
		meta: [
			{ title: text.title },
			{ name: "description", content: text.description },
			{ property: "og:type", content: key === "home" ? "profile" : "website" },
			{ property: "og:site_name", content: Profile.name },
			{ property: "og:title", content: text.title },
			{ property: "og:description", content: text.description },
			{ property: "og:url", content: url },
			{ property: "og:locale", content: Locales[lang] },
			...otherLocales,
			{ property: "og:image", content: image },
			{ property: "og:image:width", content: String(Profile.portrait.width) },
			{ property: "og:image:height", content: String(Profile.portrait.height) },
			{ property: "og:image:alt", content: dictionary(lang).about.portraitAlt },
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:site", content: Profile.xHandle },
			{ name: "twitter:title", content: text.title },
			{ name: "twitter:description", content: text.description },
			{ name: "twitter:image", content: image },
		],
		links: [
			{ rel: "canonical", href: url },
			...Languages.map((other) => ({
				rel: "alternate",
				hrefLang: other,
				href: absoluteUrl(pagePath(key, other)),
			})),
			{ rel: "alternate", hrefLang: "x-default", href: absoluteUrl(pagePath(key, "it")) },
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@graph": structuredData(key, lang),
				}),
			},
		],
	};
}

/** Head for pages that must stay out of search results, such as redirects and errors. */
export function hiddenPageHead(title: string, canonicalPath?: string) {
	return {
		meta: [{ title }, { name: "robots", content: "noindex, follow" }],
		links: canonicalPath ? [{ rel: "canonical", href: absoluteUrl(canonicalPath) }] : [],
	};
}
