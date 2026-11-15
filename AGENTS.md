# Project instructions

## Branch workflow

- Use `Develop` for development.
- Use `Deploy` as the default branch for releases to GitHub Pages, which publishes its `/docs` directory.
- Merge `Develop` into `Deploy` and create a version tag only when the user explicitly requests a release.
- Keep one merge commit per release on the first-parent history of `Deploy`: use `git merge --no-ff --no-commit Develop`, generate the static site with `bun run build:pages`, replace `docs` with `dist/client`, include `CNAME` and `.nojekyll`, and stage it with `git add -f docs` before committing the merge. Do not add a separate build commit on `Deploy`.
- Create an annotated tag matching the requested version on that release merge commit; the initial release is `1.0.0`.
- Keep application source changes on `Develop`; do not edit generated files in `docs` manually.
- Generated `docs` belongs only on `Deploy` and is ignored on `Develop`. Do not merge releases back into `Develop` during normal development.
- Preserve published history unless the user explicitly requests otherwise. After release work, return the local checkout to `Develop`.
- Use Bun and the committed `bun.lock` for dependency installation. Validate both server and static builds when changing build configuration.
