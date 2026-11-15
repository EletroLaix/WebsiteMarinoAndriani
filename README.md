# Website Marino Andriani

Portfolio personale di Marino Andriani, realizzato con React, TanStack Start,
TypeScript, Tailwind CSS e Vite. Il progetto viene gestito direttamente da
questo repository.

## Sviluppo locale

Sono necessari Node.js compatibile con Vite 8 e Bun.

```sh
git switch Develop
bun install --frozen-lockfile
bun run dev
```

Il lockfile di riferimento è `bun.lock`: non aggiungere lockfile di altri
package manager.

## Build

```sh
bun run build
bun run build:pages
```

`build` genera il server Node in `.output`; si può avviare con
`node .output/server/index.mjs`. `build:pages` genera il sito statico in
`dist/client`, con prerendering di Home, About e Contact. La variabile
`STATIC_EXPORT=1` resta supportata per le build statiche.

## Branch e versioni

- `Develop` è il branch predefinito. Tutto lo sviluppo e i commit ordinari
  avvengono qui; le modifiche non vengono pubblicate automaticamente.
- `Deploy` contiene i rilasci definitivi. La sua storia principale
  (`git log --first-parent Deploy`) contiene il primo commit del repository
  e un commit di merge per ogni versione. La storia dei sorgenti rimane
  raggiungibile attraverso i merge.
- Il tag annotato `1.0.0` identifica il primo rilascio di questo flusso.
  Ogni versione successiva riceve il proprio tag sul merge di rilascio.

Si pubblica una nuova versione solo su richiesta esplicita. Dopo aver
aggiornato entrambi i branch dal remoto e verificato che il lavoro sia
committato, passare a `Deploy` e integrare `Develop` con
`git merge --no-ff --no-commit Develop`. Con il merge ancora aperto,
installare le dipendenze con `bun install --frozen-lockfile`, eseguire
`bun run build:pages` e sostituire interamente `docs` con `dist/client`.
Includere `CNAME` e un file vuoto `.nojekyll`, verificare pagine e asset e
aggiungere l'output con `git add -f docs`.

Concludere con un unico commit di merge `release: <versione>`, creare il tag
annotato della stessa versione e pubblicare branch e tag insieme. Non creare
commit di build separati su `Deploy`. Tornare infine su `Develop`, senza
integrare di nuovo il branch di rilascio.

GitHub Pages pubblica esclusivamente da `Deploy:/docs`, sul dominio
`marinoandriani.me`. Gli artefatti generati non sono versionati su `Develop`.
