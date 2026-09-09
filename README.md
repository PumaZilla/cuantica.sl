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

The shared player uses season 1, episode 8: `src/assets/episodes/T108-optimized.mp4` and `T108-poster.jpg`. Labels and duration live in `src/content/site.ts`. The delivery MP4 uses H.264 at the original 1080p50 resolution and frame rate, with AAC audio and fast-start metadata. It is compressed for streaming; the previous high-bitrate MP4 is retained in the external performance archive. The original MOV is retained outside the repository in `../cuanticasl-archive-20260909/episode-sources/T108.mov`.

## Media delivery

Images are pre-encoded as WebP at quality 85: portraits up to 900 px wide, products up to 1000 px, decorations up to 640 px, and the hero poster at 2560 px. Explicit `?url` imports preserve these delivery bytes. Below-the-fold images use native lazy loading.

Hero videos retain the 24 fps frame sequence and forward/reverse timing. Desktop and mobile use the same 1080p H.264 files (CRF 22), keeping the centered portrait crop sharp. All video variants use fast-start metadata. Only the forward hero loads initially; the reverse loads after the opening sequence or on demand. Reduced-motion users do not load either video. The episode loads only when its player is opened.

Original media is preserved in `../cuanticasl-archive-20260909/performance-originals/`, mirroring the asset directories. Future revisions should start from those originals rather than recompressing delivery assets.
