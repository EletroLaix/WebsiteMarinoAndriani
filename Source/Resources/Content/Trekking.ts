import type { Localized } from "./Localized";

export type Stage = {
	wikilocId: number;
	distance: number;
	ascent: number;
	difficulty: "moderate" | "hard" | "veryHard";
};

export type Trek = {
	id: string;
	name: string;
	area: Localized;
	mapBounds: [west: number, south: number, east: number, north: number];
	year: number;
	description: Localized;
	stages: Stage[];
};

// Recorded stages and statistics from Marino Andriani's Wikiloc profile (6510992).
export const Treks: Trek[] = [
	{
		id: "viandante",
		name: "Sentiero del Viandante",
		area: { it: "Lago di Como · Lombardia", en: "Lake Como · Lombardy" },
		mapBounds: [9.18, 45.81, 9.5, 46.19],
		year: 2026,
		description: {
			it: "Quattro tappe lungo la sponda orientale del Lago di Como, fra borghi, mulattiere e salite sopra il lago.",
			en: "Four stages along the eastern shore of Lake Como, through villages and up old mule tracks above the water.",
		},
		stages: [
			{ wikilocId: 282006534, distance: 11.64, ascent: 409, difficulty: "moderate" },
			{ wikilocId: 282245187, distance: 18.33, ascent: 1032, difficulty: "hard" },
			{ wikilocId: 282423465, distance: 19.57, ascent: 763, difficulty: "hard" },
			{ wikilocId: 282601653, distance: 25.68, ascent: 1115, difficulty: "moderate" },
		],
	},
	{
		id: "spirito",
		name: "Sentiero dello Spirito",
		area: { it: "Maiella · Abruzzo", en: "Maiella · Abruzzo" },
		mapBounds: [13.87, 41.89, 14.27, 42.31],
		year: 2022,
		description: {
			it: "Quattro tappe sulla Maiella, tra valloni, boschi ed eremi. Le prime due concentrano gran parte della salita.",
			en: "Four stages in the Maiella, through ravines, woods and hermitages. Most of the climbing comes in the first two stages.",
		},
		stages: [
			{ wikilocId: 111191135, distance: 30.55, ascent: 2245, difficulty: "hard" },
			{ wikilocId: 111289476, distance: 21.8, ascent: 1940, difficulty: "veryHard" },
			{ wikilocId: 111419951, distance: 28.74, ascent: 1039, difficulty: "hard" },
			{ wikilocId: 111485071, distance: 14.87, ascent: 483, difficulty: "moderate" },
		],
	},
	{
		id: "via-degli-dei",
		name: "Via degli Dei",
		area: { it: "Bologna → Firenze", en: "Bologna → Florence" },
		mapBounds: [11.08, 43.73, 11.51, 44.53],
		year: 2020,
		description: {
			it: "Cinque tappe per attraversare l’Appennino a piedi, da Bologna fino a Firenze.",
			en: "Five stages across the Apennines on foot, from Bologna to Florence.",
		},
		stages: [
			{ wikilocId: 54259112, distance: 28.05, ascent: 789, difficulty: "moderate" },
			{ wikilocId: 54378079, distance: 27.41, ascent: 1170, difficulty: "moderate" },
			{ wikilocId: 54409261, distance: 18.52, ascent: 686, difficulty: "moderate" },
			{ wikilocId: 54486118, distance: 25.23, ascent: 560, difficulty: "moderate" },
			{ wikilocId: 54553343, distance: 34.47, ascent: 1014, difficulty: "moderate" },
		],
	},
];
