# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and Bun — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
git switch Develop
bun install --frozen-lockfile
bun run dev
```

## Branch e rilasci

Il repository mantiene due branch: `Develop` per i sorgenti e lo sviluppo
(branch predefinito), `Deploy` per i rilasci. GitHub Pages pubblica da
`Deploy:/docs`, con dominio `marinoandriani.me`.

Le modifiche quotidiane restano su `Develop`. Solo quando si decide di
rilasciare, integrare `Develop` in `Deploy`, installare le dipendenze con
`bun install --frozen-lockfile` e generare il sito statico:

```powershell
$env:STATIC_EXPORT = '1'
bun run build
Remove-Item Env:STATIC_EXPORT
```

Sostituire il contenuto di `docs` con l'output statico in `dist/client`,
includendo `CNAME` e un file `.nojekyll`; verificare home, About e Contact,
quindi committare e pubblicare `Deploy`. Tornare infine su `Develop`.
Non modificare manualmente i bundle generati e non integrare `Deploy` in
`Develop`: le correzioni ai sorgenti partono sempre da `Develop`.

Il progetto usa Bun e il lockfile `bun.lock`; evitare di aggiungere lockfile
di altri package manager.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
