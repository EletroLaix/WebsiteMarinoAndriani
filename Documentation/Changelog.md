# Changelog

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
