# Marino Andriani's Website

Personal portfolio built with React, TanStack Start, TypeScript, Tailwind CSS, and Vite.

## Development

Use a compatible Node.js version and Bun:

```sh
git switch Develop
bun install --frozen-lockfile
bun run dev
```

`Source/Application` contains application services; `Source/Interface` contains routes, components, and hooks; `Source/Resources` contains translations and public assets. Tool-defined file names are retained where required.

## Builds and releases

`bun run build` produces the Node server under `Output/Server`. `bun run build:pages` generates the static site under `Output/Static/client`. Build artifacts and caches belong in the ignored `Output` directory.

Develop exclusively on `Develop`. `Deploy` is the default branch and is reserved for explicitly requested releases. To release, merge `Develop` into `Deploy` using `git merge --no-ff --no-commit Develop`, build the static site, replace `docs` with the static client output, add `.nojekyll`, and stage it with `git add -f docs`. Commit the merge as `release: <version>`, create an annotated version tag on that commit, and push the branch and tag together. Return to `Develop` afterwards.

GitHub Pages publishes `Deploy:/docs` at `marinoandriani.me`. Release history is recorded in `Documentation/Changelog.md`.
