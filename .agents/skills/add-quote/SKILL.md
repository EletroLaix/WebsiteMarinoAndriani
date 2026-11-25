---
name: add-quote
description: Add a new quote to the website's Quotes page. Use when the user wants to add, save or publish a phrase, a line from a film, book or song, or one of their own thoughts to the quote collection.
---

# Add a quote

Every quote lives in one file, `Source/Resources/Quotes/Quotes.json`. The Quotes page, its counter, its random order, its reading time and its source labels all derive from it. **Do not change components, views or styles to add a quote.**

## 1. Check before writing anything

Do these checks first and report what you find to the user before inserting.

1. **Is it already there?** Run:

    ```sh
    node .agents/skills/add-quote/scripts/QuoteTools.mjs find "<the quote>"
    ```

    It lists similar quotes in Italian or English and prints the next id. If a match is the same quote, stop and ask the user whether to correct the existing entry instead.

2. **What kind is it, and from where?** Decide one `kind`:

    | kind       | When                                              | `source`             |
    | ---------- | ------------------------------------------------- | -------------------- |
    | `personal` | Written by Marino                                 | none                 |
    | `film`     | Said in a film or documentary                     | title                |
    | `series`   | Said in a TV or streaming series                  | title                |
    | `tv`       | Said in a TV programme                            | title                |
    | `book`     | Written in a book or essay                        | title                |
    | `music`    | From a song                                       | song title           |
    | `web`      | From a website, video or social post              | site or channel name |
    | `person`   | Known person, work unknown; shown without a label | the person's name    |
    | `unknown`  | Nobody knows who said it                          | none                 |

    Ask the user when the source is unclear, and do not invent one. A popular attribution that cannot be confirmed keeps its work or name, with a note such as "attribuita" / "attributed"; otherwise use `unknown`.

3. **Is there an English version?** Every quote needs both languages.
    - For public-domain works, use the well-known English wording.
    - For works still under copyright, write your own translation of the Italian rather than copying a long passage from the original.
    - Ask the user to review the translation of their own quotes.

## 2. Insert it

Append one entry at the end of the array, with the next id from step 1. Never renumber or reorder existing entries: the id is the number shown in the counter.

```json
{
	"id": 91,
	"kind": "film",
	"text": {
		"it": "A volte devi compiere un atto di fede, dopo saprai di chi fidarti",
		"en": "Sometimes you have to take a leap of faith first. The trust part comes later."
	},
	"source": { "it": "L’uomo d’acciaio", "en": "Man of Steel" },
	"note": { "it": "Padre Leone · 2013", "en": "Father Leone · 2013" }
}
```

- `text`: required, both `it` and `en`.
- `source`: required for every other kind; omitted for `personal` and `unknown`. Put the title here and the person in `note`. A name stays the same in both languages.
- `note`: optional, for the author, character, a chapter or a year, joined with `·`.
- Typography: Italian uses the curly apostrophe `’`, the ellipsis `…` and `« »` for quotes inside a quote; English uses `’`, `…` and `“ ”`. Keep the original wording apart from these marks.
- The file is indented with tabs, as Prettier formats it.

## 3. Validate

```sh
node .agents/skills/add-quote/scripts/QuoteTools.mjs check
node_modules/.bin/prettier --check Source/Resources/Quotes/Quotes.json
node_modules/.bin/tsc --noEmit -p .
npm exec --yes --package=bun@1.4.4 -- bun run build:pages
```

`check` verifies ids, kinds, both languages, sources and near-duplicates. Then open `/passioni/citazioni` and `/en/passions/quotes` with the dev server; quotes appear in random order, so wait or reload until the counter shows the new id, and check the text and the source label.

## 4. Record and commit

Follow `AGENTS.md`: work on `Develop`, or on a feature branch from it, with English messages.

1. Commit the quote alone, for example `feat: add quote 91 from Man of Steel`.
2. In `Documentation/Changelog.md`, under `## Unreleased` (create it above the latest release if missing), add to `### Resources` a line such as "Added quote 91, from Man of Steel." Commit it as `docs: describe quote 91 in the changelog`.
3. Push to `origin`. Do not release or tag unless the user asks.
