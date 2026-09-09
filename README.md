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
- `src/content/site.ts`: cast, inventions, and site data.
- `src/components/`: shared branding and UI components.
- `src/styles/`: page and hero styles.
- `src/lib/`: hero, carousel, and player behavior.
- `public/`: static images, videos, and other assets.
- `dist/`: generated build output, excluded from version control.

Hero videos are `public/media/hero-forward.mp4` and `public/media/hero-reverse.mp4`. The episode is served from `public/media/episode.mp4`. Cast portraits live in `public/media/team/linkedin/`.

## Production archive

During the September 9, 2026 reorganization, sketches, references, previous versions, historical tools, and `cap.mov` were moved to `../cuanticasl-archive-20260909/`. They remain available as local production material and are not required to run or build the website.
