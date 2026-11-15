import type { Lang, Localized } from "./Localized";

export type SkillId =
	"c" | "atmel" | "pcb" | "br" | "iec" | "motion" | "scrum" | "network" | "teaching";

export type Skill = {
	id: SkillId;
	label: Localized;
};

export type Role = {
	id: string;
	company: string;
	title: Localized;
	/** Start and end as `YYYY-MM`; a missing end means the role is current. */
	start: string;
	end?: string;
	kind: "work" | "community";
	problem: Localized;
	solution: Localized;
	/** Shown only once a verified outcome is available. */
	result?: Localized;
	skills: SkillId[];
};

export type Certification = {
	year: number;
	title: string;
	detail: string;
};

export const Skills: Skill[] = [
	{ id: "c", label: { it: "C / C++", en: "C / C++" } },
	{ id: "atmel", label: { it: "ATmega · SAM", en: "ATmega · SAM" } },
	{ id: "pcb", label: { it: "Altium · KiCad", en: "Altium · KiCad" } },
	{ id: "br", label: { it: "B&R Studio", en: "B&R Studio" } },
	{ id: "iec", label: { it: "IEC 61131-3", en: "IEC 61131-3" } },
	{ id: "motion", label: { it: "Motion control", en: "Motion control" } },
	{ id: "scrum", label: { it: "SCRUM · DevOps", en: "SCRUM · DevOps" } },
	{ id: "network", label: { it: "Reti e server", en: "Networks & servers" } },
	{ id: "teaching", label: { it: "Didattica", en: "Teaching" } },
];

// Problem and solution texts are drafts derived from the previous site and still need review.
export const Roles: Role[] = [
	{
		id: "head",
		company: "Roboze SPA",
		title: { it: "Head of Software Engineering", en: "Head of Software Engineering" },
		start: "2023-07",
		kind: "work",
		problem: {
			it: "Un team software in crescita, con più prodotti da seguire, aveva bisogno di un modo condiviso di pianificare e rilasciare.",
			en: "A growing software team working on several products needed a shared way to plan and release.",
		},
		solution: {
			it: "Ho introdotto SCRUM e una piattaforma DevOps per backlog, revisione del codice e rilasci.",
			en: "I introduced SCRUM and a DevOps platform for backlog, code review, and releases.",
		},
		skills: ["scrum"],
	},
	{
		id: "automation",
		company: "Roboze SPA",
		title: { it: "Automation Engineer", en: "Automation Engineer" },
		start: "2020-12",
		kind: "work",
		problem: {
			it: "Le stampanti 3D industriali richiedono un controllo preciso di assi, temperature e sequenze di stampa.",
			en: "Industrial 3D printers require precise control of axes, temperatures, and print sequences.",
		},
		solution: {
			it: "Software di controllo su PLC B&R con linguaggi IEC 61131-3 (LD, ST, FBD) e motion control.",
			en: "Control software on B&R PLCs with IEC 61131-3 languages (LD, ST, FBD) and motion control.",
		},
		skills: ["br", "iec", "motion"],
	},
	{
		id: "embedded",
		company: "Roboze SPA",
		title: { it: "Embedded Programmer", en: "Embedded Programmer" },
		start: "2016-06",
		kind: "work",
		problem: {
			it: "Le schede delle macchine avevano bisogno di firmware affidabile e di elettronica su misura.",
			en: "The machines' boards needed reliable firmware and custom electronics.",
		},
		solution: {
			it: "Firmware in C/C++ per Atmel ATmega e SAM e progettazione delle schede.",
			en: "C/C++ firmware for Atmel ATmega and SAM microcontrollers and board design.",
		},
		skills: ["c", "atmel", "pcb"],
	},
	{
		id: "it",
		company: "Roboze SPA",
		title: { it: "IT Manager", en: "IT Manager" },
		start: "2018-06",
		end: "2022-06",
		kind: "work",
		problem: {
			it: "Un'azienda in crescita aveva bisogno di un'infrastruttura IT e di una rete all'altezza.",
			en: "A growing company needed IT infrastructure and a network to match.",
		},
		solution: {
			it: "Ho gestito e ampliato server, rete e postazioni aziendali.",
			en: "I managed and expanded the company's servers, network, and workstations.",
		},
		skills: ["network"],
	},
	{
		id: "barimakers",
		company: "Barimakers",
		title: { it: "Volontario", en: "Volunteer" },
		start: "2014-01",
		end: "2018-01",
		kind: "community",
		problem: {
			it: "Avvicinare a programmazione ed elettronica chi parte da zero.",
			en: "Introducing programming and electronics to complete beginners.",
		},
		solution: {
			it: "Corsi, progetti open source, video tutorial e organizzazione dei Makers' Meeting 2014 e 2015.",
			en: "Courses, open source projects, video tutorials, and the 2014 and 2015 Makers' Meetings.",
		},
		skills: ["c", "teaching"],
	},
	{
		id: "arci",
		company: "Circolo Arci Carlo Cafiero",
		title: { it: "Docente", en: "Lecturer" },
		start: "2017-03",
		end: "2017-05",
		kind: "community",
		problem: {
			it: "Offrire una base solida di elettronica ai principianti.",
			en: "Giving beginners a solid grounding in electronics.",
		},
		solution: {
			it: "Elettronica di base, PCB con strumenti open source, microcontrollori Atmel e Arduino.",
			en: "Basic electronics, PCB design with open source tools, Atmel and Arduino microcontrollers.",
		},
		skills: ["c", "atmel", "pcb", "teaching"],
	},
	{
		id: "apulia",
		company: "Apulia Makers 3D",
		title: { it: "Docente", en: "Lecturer" },
		start: "2016-04",
		end: "2016-04",
		kind: "community",
		problem: {
			it: "Rendere programmazione ed elettronica accessibili ai principianti.",
			en: "Making programming and electronics approachable for beginners.",
		},
		solution: {
			it: "Introduzione pratica con esercizi su schede reali.",
			en: "A hands-on introduction with exercises on real boards.",
		},
		skills: ["teaching"],
	},
];

export const Certifications: Certification[] = [
	{
		year: 2021,
		title: "SOLIDWORKS",
		detail: "Certified SOLIDWORKS Associate (CSWA) — Mechanical Design; Certified SOLIDWORKS Professional Advanced (CSWPA-DT) — Drawing Tools",
	},
	{
		year: 2020,
		title: "B&R Academy",
		detail: "Automation Diploma: IEC Programming; Automation Diploma: Motion",
	},
];

function formatMonth(value: string): string {
	const [year, month] = value.split("-");
	return `${month}/${year}`;
}

/** Formats a role period, for example `07/2023 — oggi`. */
export function formatPeriod(role: Role, lang: Lang): string {
	if (role.end === role.start) {
		return formatMonth(role.start);
	}
	const end = role.end ? formatMonth(role.end) : lang === "it" ? "oggi" : "present";
	return `${formatMonth(role.start)} — ${end}`;
}

/** Roles ordered from the earliest start date. */
export function rolesByStart(): Role[] {
	return [...Roles].sort((a, b) => a.start.localeCompare(b.start));
}
