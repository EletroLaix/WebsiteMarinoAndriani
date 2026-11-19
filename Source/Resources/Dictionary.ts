import type { Lang } from "./Content/Localized";

const it = {
	nav: {
		label: "Principale",
		home: "Home",
		about: "Chi sono",
		passions: "Passioni",
		contact: "Contatti",
		openMenu: "Apri menu",
		closeMenu: "Chiudi menu",
		switchLanguage: "Switch to English",
	},
	home: {
		role: "Software engineer · Sistemi embedded e automazione industriale",
		summary: "Head of Software Engineering in Roboze.",
		contactAction: "Scrivimi",
		aboutAction: "Esperienza",
		profile: "Profilo",
		profileNow: "Roboze · oggi",
		profileRole: "Ruolo",
		profileFocus: "Focus",
		profileBase: "Base",
		focus: "Embedded · PLC · Team",
		domainsTitle: "Cosa faccio",
		domains: [
			{
				title: "Embedded",
				text: "Firmware C/C++ per Atmel ATmega e SAM. Progettazione schede.",
				tags: "C/C++ · ATmega · SAM · Altium · KiCad",
			},
			{
				title: "Automazione",
				text: "PLC B&R per stampanti 3D industriali.",
				tags: "B&R · IEC 61131-3 · Motion control",
			},
			{
				title: "Team",
				text: "Coordinamento del team software.",
				tags: "SCRUM · DevOps",
			},
		],
		experienceTitle: "Esperienza",
		details: "Dettagli",
		contactTitle: "Contatti",
	},
	about: {
		title: "Chi sono",
		intro: "Software engineer a Bari. In Roboze dal 2016: firmware, PLC, infrastruttura IT. Dal 2023 coordino il team software.",
		portraitAlt: "Ritratto di Marino Andriani",
		experienceTitle: "Esperienza",
		skillsHint: "Seleziona una competenza per vedere dove l'ho usata.",
		skillsLabel: "Competenze",
		problem: "Problema",
		solution: "Cosa ho fatto",
		result: "Risultato",
		certificationsTitle: "Certificazioni",
	},
	contact: {
		title: "Contatti",
		note: "Rispondo di solito entro pochi giorni.",
		emailLabel: "Email",
		write: "Scrivi un'email",
		copy: "Copia indirizzo",
		copied: "Copiato",
		elsewhere: "Altrove",
	},
	passions: {
		title: "Le cose che amo",
		intro: "Progetti personali, citazioni, trekking.",
		open: "Apri",
		inPreparation: "In preparazione",
	},
	footer: {
		role: "Software engineer · Bari, Puglia",
		consent: "Preferenze statistiche",
	},
	consent: {
		label: "Statistiche",
		text: "Uso Google Analytics solo per contare le visite. Nessuna pubblicità, nessun profilo.",
		accept: "Accetta",
		decline: "Rifiuta",
	},
	loader: {
		loading: "Caricamento",
	},
	notFound: {
		title: "Pagina non trovata",
		text: "La pagina che cerchi non esiste o è stata spostata.",
		home: "Torna alla home",
	},
	redirect: {
		text: "Questa pagina è stata spostata.",
		link: "Vai alla nuova pagina",
	},
};

export type Dictionary = typeof it;

const en: Dictionary = {
	nav: {
		label: "Main",
		home: "Home",
		about: "About",
		passions: "Passions",
		contact: "Contact",
		openMenu: "Open menu",
		closeMenu: "Close menu",
		switchLanguage: "Passa all'italiano",
	},
	home: {
		role: "Software engineer · Embedded systems and industrial automation",
		summary: "Head of Software Engineering at Roboze.",
		contactAction: "Get in touch",
		aboutAction: "Experience",
		profile: "Profile",
		profileNow: "Roboze · now",
		profileRole: "Role",
		profileFocus: "Focus",
		profileBase: "Based in",
		focus: "Embedded · PLC · Team",
		domainsTitle: "What I do",
		domains: [
			{
				title: "Embedded",
				text: "C/C++ firmware for Atmel ATmega and SAM. Board design.",
				tags: "C/C++ · ATmega · SAM · Altium · KiCad",
			},
			{
				title: "Automation",
				text: "B&R PLCs for industrial 3D printers.",
				tags: "B&R · IEC 61131-3 · Motion control",
			},
			{
				title: "Team",
				text: "Leading the software team.",
				tags: "SCRUM · DevOps",
			},
		],
		experienceTitle: "Experience",
		details: "Details",
		contactTitle: "Contact",
	},
	about: {
		title: "About",
		intro: "Software engineer in Bari. At Roboze since 2016: firmware, PLCs, IT infrastructure. Leading the software team since 2023.",
		portraitAlt: "Portrait of Marino Andriani",
		experienceTitle: "Experience",
		skillsHint: "Select a skill to see where I used it.",
		skillsLabel: "Skills",
		problem: "Problem",
		solution: "What I did",
		result: "Result",
		certificationsTitle: "Certifications",
	},
	contact: {
		title: "Contact",
		note: "I usually reply within a few days.",
		emailLabel: "Email",
		write: "Send an email",
		copy: "Copy address",
		copied: "Copied",
		elsewhere: "Elsewhere",
	},
	passions: {
		title: "Things I love",
		intro: "Personal projects, quotes, trekking.",
		open: "Open",
		inPreparation: "Coming soon",
	},
	footer: {
		role: "Software engineer · Bari, Italy",
		consent: "Analytics preferences",
	},
	consent: {
		label: "Analytics",
		text: "I use Google Analytics only to count visits. No advertising, no profiling.",
		accept: "Accept",
		decline: "Decline",
	},
	loader: {
		loading: "Loading",
	},
	notFound: {
		title: "Page not found",
		text: "The page you are looking for does not exist or has been moved.",
		home: "Back to home",
	},
	redirect: {
		text: "This page has moved.",
		link: "Go to the new page",
	},
};

const Dictionaries: Record<Lang, Dictionary> = { it, en };

export function dictionary(lang: Lang): Dictionary {
	return Dictionaries[lang];
}
