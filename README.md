# Cuántica S.L.

Web promocional de una webserie de comedia sobre una empresa de inventos científicos descabellados. Astro genera una web estática con hero galáctico, tienda ficticia que abre el episodio y retratos interactivos del equipo.

## Desarrollo

Lee [AGENTS.md](AGENTS.md) y sigue [CONTRIBUTING.md](CONTRIBUTING.md) antes de trabajar. La finalidad y los criterios visuales están en [docs/project-guide.md](docs/project-guide.md).

Desde la raíz, con Node.js >=22.12:

```sh
npm install
npm run dev -- --background
```

Disponible en http://localhost:4321. El entorno Nix está definido en `flake.nix` y `.envrc`.

```sh
npm run astro -- dev status
npm run astro -- dev stop
npm run build
npm run preview
```

## Estructura

- `src/pages/`: página principal y página de dirección visual.
- `src/content/site.ts`: protagonistas, secundarios, inventos y datos del sitio.
- `src/components/`: marca y componentes compartidos.
- `src/styles/`: estilos generales y hero.
- `src/lib/`: hero, carrusel y reproductor.
- `public/`: imágenes, vídeos y otros recursos estáticos.
- `docs/`: guía de diseño y contexto.
- `dist/`: compilación generada; no se versiona.

Los vídeos del hero son `public/media/hero-forward.mp4` y `hero-reverse.mp4`. El episodio se sirve desde `public/media/episode.mp4`. Los retratos están en `public/media/team/linkedin/`.

## Archivo de producción

En la reorganización del 9 de septiembre de 2026, los bocetos, referencias, versiones antiguas, herramientas históricas y `cap.mov` se movieron a `../cuanticasl-archive-20260909/`. Se conservan como material de trabajo local; no hacen falta para ejecutar ni compilar la web.
