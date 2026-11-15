<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Branch workflow

- Use `Develop` for development; it is the default branch.
- Use `Deploy` for releases to GitHub Pages, which publishes its `/docs` directory.
- Merge `Develop` into `Deploy` only for an explicitly requested release, then regenerate `docs` with `STATIC_EXPORT=1` using the committed Bun lockfile.
- Keep application source changes on `Develop`; do not edit generated files in `docs` manually.
- Preserve published history. After release work, return the local checkout to `Develop`.
