# Project instructions

## Branch workflow

- Use `Develop` for development.
- Use `Deploy` as the default branch for releases to GitHub Pages, which publishes its `/docs` directory.
- Merge `Develop` into `Deploy` and create a version tag only when the user explicitly requests a release.
- Keep one merge commit per release on the first-parent history of `Deploy`: use `git merge --no-ff --no-commit Develop`, generate the static site with `bun run build:pages`, replace `docs` with `Output/Static/client`, include `CNAME` and `.nojekyll`, and stage it with `git add -f docs` before committing the merge. Do not add a separate build commit on `Deploy`.
- Create an annotated tag matching the requested version on that release merge commit; the initial release is `1.0.0`.
- Before merging a release, set `version` in `package.json` on `Develop` to the requested version; the site shows it in the footer and the loader.
- Keep application source changes on `Develop`; do not edit generated files in `docs` manually.
- Generated `docs` belongs only on `Deploy` and is ignored on `Develop`. Do not merge releases back into `Develop` during normal development.
- Preserve published history unless the user explicitly requests otherwise. After release work, return the local checkout to `Develop`.
- Use Bun and the committed `bun.lock` for dependency installation. Validate both server and static builds when changing build configuration.

## Working rules

- Complete related changes before the final verification session. Commit distinct topics separately on `Develop` and push to `origin`.
- Use English for source code, comments, logs, and documentation; retain localized interface text.
- Use readable code, explicit control flow, concise purpose-focused comments, and tabs displayed at four columns. Respect format and tool conventions.
- Organize source code under `Source/Application`, `Source/Interface`, and `Source/Resources`; use complete, capitalized names except for tool-defined conventions.
- Keep generated builds, caches, and test output under ignored `Output`; never commit validation reports or checksums.
- Maintain `Documentation/Changelog.md` with newest releases first and Features, BugFix, Resources, and Known issues sections.
- Keep an existing license in the repository root. Generate dependency notices during builds when required; do not invent a license.
