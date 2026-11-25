# Changelog

## Unreleased

### Features

- The home page presents the three fields of expertise as cards that widen and turn orange under the pointer, above a smaller career timeline without company names.
- The career timeline on the home page advances when it comes into view, lighting each role as the line reaches it.
- On phones, the tapped expertise card opens and turns orange while the others close to their title, and the career timeline climbs from the oldest role at the bottom to the latest at the top.
- The home page now ends with the career timeline; the contact box at the bottom was removed, and Contact stays in the menu.
- The third field of expertise on the home page is now called Team lead instead of Team, also in the profile card.
- The orange line under the current page slides between the links of the top menu.
- The analytics preferences link in the footer is now an orange cookie icon, with a short label on hover.
- Renamed the About page to Career, at `/carriera` and `/en/career`; the old addresses redirect to the new ones.
- Quotes now say where they were found, such as a film, TV series, TV show, book or website, instead of the generic author label; when only a name is known, it is shown without a label.

### Resources

- Sorted the 44 author quotes in `Quotes.json` by kind, with the title and the person in separate fields.

### Known issues

- Six quotes have a name but no known work, and some attributions still need verification.

## 1.6.0

### Features

- Published the Quotes page in Italian and English. The lava behind the site slowly heats up into a wall; in its centre it turns into bits that take its colours, and each quote forms from them and comes forward, with its source and kind below: film, book, music, author, Marino Andriani or unknown.
- All 90 quotes appear in random order without repeats and stay on screen for a time that follows their length. A counter climbs to each quote number, and a pause control drawn like the route widget stops the rotation.
- The Quotes row in the Passions index counts up to 100% and opens like Trekking; on hover, lines of bits fade in behind it and decode Marino's quote on perfection.

### Resources

- Collected the 90 quotes from the Notion collection in one bilingual file, `Source/Resources/Quotes/Quotes.json`, with an English version for every quote.
- Added the add-quote agent skill in `.agents/skills`, which explains the checks to run before adding a quote and includes a script that finds similar quotes and validates the file.

### Known issues

- Some attributions still need verification, and a few author quotes may belong to a more specific kind, such as The Social Dilemma under film.
- Touch pinch-to-zoom on the trek maps still needs verification on a physical phone.

## 1.5.0

### Features

- The trekking hero shows three figures, treks, distance and elevation gain with an Everest comparison, above a chart of every trek's elevation profile on one altitude scale.
- The chart draws itself once the page is ready, labels each summit with its height and trek name, and highlights the trek under the pointer while dimming the others.
- Each trek map is taller and carries a stage profile over its bottom edge, with distance, elevation gain and difficulty for every stage; the stage under the moving dot lights up.
- Trek entries show only distance and elevation gain, and the map credits sit in the top corner.
- The Passions page is a numbered index of titles on see-through bands with cut corners: Trekking counts up to 100% and turns into an open label, with the treks' elevation profiles drawn behind it on hover.
- Sections in preparation stop at their own progress, pulse, glitch into zeros and ones from time to time and show a tongue-in-cheek error with its code in red.

### Resources

- The build summarizes each GPX file into a light elevation profile for the hero chart.
- Added the add-trek agent skill in `.agents/skills`, which explains how to publish a new trek from its GPX files.

### Known issues

- Touch pinch-to-zoom on the trek maps still needs verification on a physical phone.

## 1.4.0

### Features

- Opened the bilingual Passions hub with Trekking, Personal projects, and Quotes.
- Added a chronological trekking landing page for the Sentiero del Viandante, Sentiero dello Spirito, and Via degli Dei, with thirteen recorded stages and a link to Marino's Wikiloc profile.
- Added interactive maps and synchronized elevation previews that restart when a map returns to view.

### BugFix

- Made the preparation status clear on the Personal projects and Quotes cards.
- Restored Google Analytics when a visitor accepts after previously declining.
- Kept the cookie consent banner above the footer in a compact layout with larger mobile touch targets.

### Resources

- Added thirteen original GPX files as source assets. The public build includes the geometry and elevation used by the maps.

### Known issues

- Touch pinch-to-zoom still needs verification on a physical phone.

## 1.3.1

### Features

- The first-load loader waits until the page, its images and fonts have loaded, holding at 95% if needed, for at most 10 seconds.
- The first-load loader lasts at least four seconds, even when the page is already loaded.
- Reloading the page plays the full loader again; menu navigation keeps the light transition.

### BugFix

- On phones the loader hides the eye and the location, which overlapped the boot log.

### Known issues

- Role problem and solution texts are drafts and role results are still missing.
- Social previews use the square portrait; a dedicated 1200×630 image is not available yet.

## 1.3.0

### Features

- The portrait on Home and About appears as large pixels and sharpens once it is on screen.
- Menu entries and action buttons use uppercase Geist Mono and briefly turn into zeros and ones on hover.
- The footer shows the site version, read from `package.json` at build time.
- A new first-load loader runs a boot log while a counter climbs to 100 in about three seconds, then lifts like a curtain; it replaces the eye loader and its eyelid page transition.
- Page changes are lighter: the page fades out, the new title decodes from zeros and ones, then the content and the footer appear, while a route widget in the corner fills its dots up to OK.
- Boxes and buttons have cut corners instead of rounded ones, every other corner is square, and timeline dots are diamonds.
- The boot log nods to Asimov and The Hitchhiker's Guide to the Galaxy, with aligned results, a 42, and Marvin as the one step that fails.
- Hovering the profile card on Home passes glitch slices over the photo, decodes role, focus and base from zeros and ones, lights up the edge and makes the status dot blink.

### BugFix

- The orange glow on the cards now fades out when the pointer leaves instead of staying at its last position.
- The profile card now tilts towards the pointer; its entrance animation was overriding the tilt.

### Resources

- Replaced Inter, Space Grotesk, and JetBrains Mono with Geist for text and Geist Mono for headings, menu, and labels.

### Known issues

- Role problem and solution texts are drafts and role results are still missing.
- Social previews use the square portrait; a dedicated 1200×630 image is not available yet.

## 1.2.0

### Features

- Redesigned the site around the fiery eye: a first-load loader and eyelid transitions between pages.
- The home hero fills the first screen, and a lava background heats up around the mouse or finger.
- Added Italian pages at the root and English pages under `/en`, with a language switch for every page.
- Rebuilt Home, About, and Contact with shorter copy, a tilting profile card, pointer spotlights, and skills that highlight the roles where they were used.
- Prepared the Passions area with Lab, Quotes, and Trekking sub-sections, unpublished until they have content.
- Added per-page titles, descriptions, canonical URLs, hreflang alternates, social cards, and JSON-LD structured data.

### BugFix

- Replaced the contact form that reported messages as sent without sending them with email and copy actions.
- Google Analytics now loads only after the visitor accepts the analytics banner.
- Search engines now receive the Italian content, which was previously applied only in the browser.

### Resources

- Added the high-resolution eye icon and content files for profile, experience, and passions.
- Generated `sitemap.xml`, `404.html`, and a `robots.txt` that references the sitemap.
- Removed the old boot loader and the client-side translation provider.

### Known issues

- Role problem and solution texts are drafts and role results are still missing.
- Social previews use the square portrait; a dedicated 1200×630 image is not available yet.

## 1.0.1

### Features

- Added VS Code launch and debug configurations with automatic dependency setup.
- Organized the project source and release workflow for ongoing development.

### BugFix

- Fixed automatic Chrome opening during VS Code debugging.
- Restored the missing home page call-to-action translations, fixing TypeScript validation and the empty section.
- Fixed the server-side guard order in outbound link tracking.

### Resources

- Grouped application, interface, and resource files under `Source` and generated output under `Output`.
- Removed the unused GitHub projects server function.

### Known issues

- No known issues.

## 1.0.0

### Features

- Initial versioned release of the personal website.

### BugFix

- No changes recorded.

### Resources

- Static website published through GitHub Pages.

### Known issues

- The home page references three translation keys that are not defined.
