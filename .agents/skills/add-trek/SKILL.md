---
name: add-trek
description: Add a new hike (trek) with its GPX stages to the website's trekking page. Use when the user wants to publish a new walk, add GPX tracks, or extend the trekking timeline, maps, elevation chart, or stage profile.
---

# Add a trek

A trek is pure content. Its GPX files and one entry in `Trekking.ts` are enough: the timeline, the map, the stage profile, the hero figures, the elevation chart with its summit label, and the hover preview on the Passions page all derive from them. **Do not change components, views, or styles to add a trek.**

## 1. Gather the inputs

Ask the user for anything missing; never invent figures.

| Field                                                                     | Source                                                          | Example                                  |
| ------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------- |
| Trek name                                                                 | As the user writes it, with accents and capitals                | `Sentiero dello Spirito`                 |
| Year                                                                      | When it was walked                                              | `2022`                                   |
| Area, Italian and English                                                 | Short place line, `·` between place and region, `→` for a route | `Maiella · Abruzzo`, `Bologna → Firenze` |
| Description, Italian and English                                          | One sentence: stage count, then landscape                       | see existing entries                     |
| One GPX file per stage                                                    | Original export, usually from Wikiloc                           |                                          |
| For each stage: Wikiloc id, distance (km), elevation gain (m), difficulty | The Wikiloc page of the stage                                   | `111191135`, `30.55`, `2245`, `hard`     |

Wikiloc difficulty maps to `moderate` (Moderato / Moderate), `hard` (Difficile / Difficult), `veryHard` (Molto difficile / Very difficult). Any easier grade uses `moderate`. The Wikiloc id is the number at the end of the trail URL.

## 2. Add the GPX files

Copy them to `Source/Resources/Tracks/` and name each one exactly:

```
<Trek name> [NN].gpx
```

- `<Trek name>` is identical to the `name` field of the entry, character by character, accents included.
- `NN` is the stage number with two digits, from `01`, in walking order and without gaps. It matches the stage's position in `stages`.
- One file per stage. Keep the original content; do not edit or re-export tracks.

Check them with the helper. It lists the stages found, measures each one, and prints map bounds:

```sh
node .agents/skills/add-trek/scripts/TrekSummary.mjs "<Trek name>"
```

GPS elevation gain is noisy, so the measured gain is only a sanity check. Use the Wikiloc figures for `distance` and `ascent`. If a measured distance differs much from Wikiloc, the stage files are probably swapped or misnamed.

## 3. Add the entry in `Source/Resources/Content/Trekking.ts`

Insert a new object in `Treks`, keeping the array newest first:

```ts
{
	id: "spirito",
	name: "Sentiero dello Spirito",
	area: { it: "Maiella · Abruzzo", en: "Maiella · Abruzzo" },
	mapBounds: [13.87, 41.89, 14.27, 42.31],
	year: 2022,
	description: {
		it: "Quattro tappe sulla Maiella, tra valloni, boschi ed eremi.",
		en: "Four stages in the Maiella, through ravines, woods and hermitages.",
	},
	stages: [
		{ wikilocId: 111191135, distance: 30.55, ascent: 2245, difficulty: "hard" },
		// one line per GPX file, in the same order
	],
},
```

- `id`: short, lowercase, kebab-case, and unique. It becomes the page anchor (`#spirito`), so never change it once published.
- `mapBounds`: `[west, south, east, north]` from the helper. They frame the map when a track cannot load.
- `stages`: as many items as GPX files, in the same order.
- Two treks in the same year keep the array order, so put the more recent one first.

## 4. Update the copy that names every trek

- `Source/Application/Seo.ts`, `trekking`: the Italian and English descriptions list all trek names. Add the new one in the same style, newest first.
- `Documentation/Changelog.md`, `## Unreleased` (create it above the latest release if missing): under `### Features`, a line such as "Added the <Trek name> (<year>) to the trekking page with <N> stages."; under `### Resources`, "Added <N> GPX files for the <Trek name>."

Nothing else names treks. The hero counts, total distance, total elevation gain, Everest comparison, chart scale, summit labels, and "Explore" anchor update by themselves.

## 5. What not to touch

- Components, views, and `Source/styles.css`, including `ElevationChart`, `TrackMap`, `TrekkingView`, and `PassionsView`.
- `vite.config.ts`, `Source/Application/Gpx.ts`, and `Source/Application/TrekProfiles.ts`.
- Existing GPX files, existing trek ids, `package.json` version, and the generated `docs` folder.

If the new trek seems to need a layout change, for example a label that does not fit, stop and ask the user instead of adapting the code.

## 6. Validate

Run from the repository root:

```sh
npm exec --yes --package=bun@1.4.4 -- bun install --frozen-lockfile
node_modules/.bin/tsc --noEmit -p .
node_modules/.bin/eslint .
node_modules/.bin/prettier --check Source
npm exec --yes --package=bun@1.4.4 -- bun run build:pages
```

The static build parses every GPX file and fails on a broken track. Then open `/passioni/trekking` and `/en/passions/trekking` with the dev server and check:

- the new trek appears in the timeline at its year, with its map, numbered stage markers, and stage profile, with one column per stage aligned to the chart;
- the hero shows the new number of treks and the new totals, and the chart has one more profile with its summit label;
- `/passioni` draws the new profile behind the Trekking row on hover;
- no console errors.

## 7. Commit

Follow `AGENTS.md`: work on `Develop`, or on a feature branch from it, and use English messages. Use one commit for the content, for example `feat: add the <Trek name> trek` with the GPX files, `Trekking.ts`, and `Seo.ts`, and one for the changelog, `docs: describe the <Trek name> trek in the changelog`. Push to `origin`. Do not release or tag unless the user asks.
