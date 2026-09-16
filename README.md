# Waar ben ik?

__Je wordt gedropt op een willekeurige plek in Amsterdam. Kun je raden waar je bent? Hoe dichterbij, hoe hoger je score.__

![](public/open-graph.jpg)

Geïnspireerd door <a href="https://geoguessr.com/world/play">GeoGuessr</a>, maar dan voor
Amsterdam en gemaakt met open source-tools en Amsterdamse open data.
Lees meer over deze data op het <a href="https://amsterdam.github.io/datablog/2019/03/21/360-gradenfotos-van-de-hele-stad/">Datablog van
data.amsterdam.nl</a>.

Gemaakt door <a href="https://bertspaan.nl/">Bert Spaan</a>, ontworpen door <a href="http://luukvandeven.nl/">Luuk van de Ven</a>.

Speel __Waar ben ik?__ op [bertspaan.nl/waar-ben-ik](https://bertspaan.nl/waar-ben-ik)!

Alle geschatte locaties worden opgeslagen in een SQLite-database, [via Glitch](https://glitch.com/edit/#!/waar-ben-ik). Al deze locaties zijn te bekijken in een [Observable-notebook](https://observablehq.com/@bertspaan/waar-ben-ik-submissions-visualization).

## Ontwikkelen

De app gebruikt Vue 3 met TypeScript, Vite en MapLibre GL JS met de Positron-kaart van
[OpenFreeMap](https://openfreemap.org/). Er is geen API-sleutel nodig.

Gebruik Node.js 22.13+ (of een recentere ondersteunde LTS-versie) en npm:

```sh
npm install
npm run dev
```

`npm run build` controleert eerst de TypeScript-types en bouwt de site in `dist`;
`npm run preview` toont deze lokaal.
De relatieve assetpaden ondersteunen hosting onder `/waar-ben-ik/`.

## Publiceren

Elke push naar `main` start de workflow in `.github/workflows/deploy.yml`.
Deze installeert de dependencies met Node.js 24, controleert de code en types,
bouwt de site en voert de browsertests uit. Alleen als alles slaagt, publiceert
GitHub Actions `dist` naar [bertspaan.nl/waar-ben-ik](https://bertspaan.nl/waar-ben-ik/).

GitHub Pages gebruikt hiervoor **GitHub Actions** als publicatiebron.
De `gh-pages`-branch en `npm run deploy` zijn niet meer nodig. Je kunt de workflow
ook handmatig starten via **Actions → Deploy to GitHub Pages → Run workflow**,
met `main` als branch.

## Controleren

```sh
npm run typecheck
npm run lint
npx playwright install chromium
npm test
```

De browsertests gebruiken vaste panorama- en kaartgegevens voor het spelverloop,
de resultaatkaarten en het openen van de kaart op mobiel. Ze testen niet de
beschikbaarheid van de externe diensten. Met een lokaal geïnstalleerde Chrome
kan ook `PLAYWRIGHT_CHANNEL=chrome npm test` worden gebruikt.
