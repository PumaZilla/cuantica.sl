# Cuántica S.L. — Agent Guide

## Working rules

Read and follow [CONTRIBUTING.md](CONTRIBUTING.md) in full before making any change, including documentation. It defines branch and commit naming, required checks, and merge authorization. Never work or commit directly on `main`, and never merge without explicit authorization.

Use English for repository documentation, code comments, identifiers, commit messages, branch names, and pull request descriptions. Keep audience-facing website copy in Spanish, including accessible labels and character names; do not translate product content as part of code cleanup.

Preserve pending user changes. Inspect current code and assets before editing: this project evolves through visual iterations, and historical notes or conversation history may describe rejected versions. Current files and the latest user direction take precedence over older design descriptions.

## Purpose and voice

This is the Spanish promotional website for **Cuántica S.L.**, a comedy webseries about a company producing absurd scientific inventions. The story centers on the company and its ensemble. David, the visionary CEO, leads the visual introduction.

Use corporate and scientific language with absurd humor: extraordinary inventions, manufactured needs, and questionable consequences. The shop is fictional; purchase buttons open an episode modal. Do not introduce real checkout, accounts, or external services without a request.

## Visual direction

- **Hero:** full-screen cosmic scene with stars, dust clouds, and inventions orbiting David. Keep him centered for mobile cropping, with the logo and text over the footage. Preserve sharpness and legibility; avoid tinted overlays that muddy the image.
- **Palette:** dark universe `#050711`, navy ink `#121d2d`, dust `#2d3c53`, mist `#a8bcd0`, starlight `#edf4f8`, and blue accent `#73b5db`. Check live CSS tokens and overrides before changing colors. Bright accents belong mainly to brutalist elements in the shop.
- **Typography:** Space Grotesk headings, DM Sans body copy, Manrope hero text, and monospace labels. The shop uses heavy infomercial typography. Do not spread section-specific italics, colors, or type treatments across the site.
- **Shop:** satirical television shopping with uppercase calls to action, bold frames, seals, offers, and bottom-aligned prices and buttons. Product photos show deliberately makeshift inventions on neutral backgrounds without embedded text.
- **Corporate interlude:** editorial brutalism with overlapping typography and a sticky-note composition. Keep it distinct from the shop but integrated into the page background, with the cat peeking from the left.
- **Main cast:** consistent waist-up, semi-professional studio portraits, irregular frames, role labels, and alternate images on hover. Match identity, background color, lighting, and framing between each pair.
- **Supporting cast:** slow carousel with name and role labels, photos where available, and empty backgrounds otherwise. Align its pause button with the heading.
- **Decoration and layout:** align corner marks and symbols with section margins without accidental clipping. Check wide desktop, approximately 1100 px, and mobile layouts.

## Content

The main cast is David (CEO), Kike (hacker), Iria (researcher), Nati (scientist), Paula (social media), and Santi (intern). Nati is the character previously called Raquel. Bobby belongs to the supporting cast.

The supporting cast includes Antonio, Madre de Kike, Igor, Pitonisa, Sr. Bioverde, Srta. Gerania, and Bobby 2.0. The shop features a quantum transporter, brain stimulator, toaster, love elixir, facial emotion analyzer, and bioluminescent plant.

Use `src/content/site.ts` and the page template as the source of truth for current order, labels, copy, links, prices, and media paths. Do not recreate older content from memory.

## Media workflow

Preserve likeness to supplied photographs and episode references. Start portrait revisions from the approved primary photograph and original references when possible; repeatedly editing generated variants can degrade identity and detail.

Change only what was requested. Preserve the smile, eyes, clothing, background color, and texture unless they are specifically being edited. Inspect generated results before integration. Recurring props, especially Kike's intercom, must match their references.

Save clearly named asset versions, retain originals, and update the actual path used by the page. Do not request nonexistent hover images or invent portraits for empty slots. Keep archived source footage and references intact.

Preserve the current hero motion behavior, fallbacks, and reduced-motion preferences. Do not restore a historical scroll implementation without a request.

## Project map

- `src/pages/index.astro`: sections, headings, cards, media selection, and episode modal.
- `src/content/site.ts`: site, cast, social links, and product data.
- `src/components/`: shared branding and UI components.
- `src/styles/global.css`: page and section styles; inspect accumulated overrides and breakpoints.
- `src/styles/celestial.css`: hero styling and responsive behavior.
- `src/lib/experience.ts`: experience initialization and general interactions.
- `src/lib/hero-motion.ts`: forward and reverse hero video behavior.
- `src/lib/supporting-carousel.ts`: supporting-cast carousel interactions.
- `public/media/`: served media; portraits live in `team/linkedin/`.
- `flake.nix` and `.envrc`: local development environment.

The application runs from the repository root. Historical source footage, references, and prototypes are archived outside the repository and are not build dependencies. This file contains the consolidated project guidance; there is no separate `docs/` guide.

## Development and validation

Run commands from the repository root. Use background mode for the dev server:

```sh
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run build
```

For visual changes, inspect wide desktop, approximately 1100 px, and mobile layouts. Check overflow, cropping, label readability, and image loading. For relevant interactions, verify hover, keyboard focus, pause, reduced motion, and modal behavior.

Run checks appropriate to the change, and complete every pre-merge check required by `CONTRIBUTING.md`. Visual inspection does not replace a build check.

Consult the relevant official Astro guide before related implementation changes:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components](https://docs.astro.build/en/basics/astro-components/)
- [Framework integration](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styles and CSS](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
