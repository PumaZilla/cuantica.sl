# Cuántica S.L.

Promotional website for a comedy webseries about a company building absurd scientific inventions. Astro generates a static site with a cosmic hero, a fictional shop that opens the episode, and interactive cast portraits. Audience-facing content is in Spanish; repository documentation and code comments are in English.

## Development

Read [AGENTS.md](AGENTS.md) for project context and design guidance, and follow [CONTRIBUTING.md](CONTRIBUTING.md) before making changes.

From the repository root, using Node.js >=22.12:

```sh
npm install
npm run dev -- --background
```

Local preview: http://localhost:4321. The Nix environment is defined in `flake.nix` and `.envrc`.

```sh
npm run astro -- dev status
npm run astro -- dev stop
npm run build
npm run preview
```

## Structure

- `src/pages/`: main page and visual direction page.
- `src/content/`: separate site, team, supporting-cast, and product modules.
- `src/layouts/`: document shell and metadata.
- `src/components/`: sections and reusable cast, shop, episode, and layout components.
- `src/styles/`: page and hero styles.
- `src/lib/`: hero, carousel, and player behavior.
- `src/assets/`: team, product, episode, hero, brand, and decorative media imported by the app.
- `public/`: favicon and files requiring stable public URLs.
- `dist/`: generated build output, excluded from version control.

Hero videos live in `src/assets/hero/`, episode media in `src/assets/episodes/`, and cast portraits in `src/assets/team/linkedin/`. Explicit `?url` imports preserve media quality and generate deployment URLs; only active media is kept in the source tree.

## Production archive

During the September 9, 2026 reorganization, sketches, references, previous versions, historical tools, and `cap.mov` were moved to `../cuanticasl-archive-20260909/`. They remain available as local production material and are not required to run or build the website. Unused web assets and legacy frame sequences are stored in its `unused-web-assets/` subdirectory. Hero frame settings now live in `src/content/hero.ts`.

## Episode media

The shared player uses season 1, episode 8: `src/assets/episodes/T108.mp4` and `T108-poster.jpg`. Labels and duration live in `src/content/site.ts`. The MP4 preserves the original 1080p50 H.264 video and converts only the PCM audio to AAC for browser playback. The original MOV is retained outside the repository in `../cuanticasl-archive-20260909/episode-sources/T108.mov`.
