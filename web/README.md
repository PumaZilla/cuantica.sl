# Cuántica SL

Entrada galáctica de David a pantalla completa con vídeo de Higgsfield controlado por scroll. Las secciones inferiores conservan el diseño editorial marfil, tinta y naranja industrial y los retratos originales del episodio.

## Abrir y editar

Desde esta carpeta:

```sh
npm install
npm run dev -- --background
```

Vista previa: http://localhost:4321
Dirección visual editable: http://localhost:4321/direccion

```sh
npm run astro -- dev status
npm run astro -- dev stop
npm run build
```

- `src/content/site.ts`: capítulos del hero, nombres, roles, descripciones, inventos y rutas multimedia.
- `src/pages/index.astro`: estructura y texto editorial de las secciones.
- `src/styles/global.css`: diseño editorial aprobado. `src/styles/celestial.css`: entrada galáctica y su adaptación móvil.
- `src/lib/experience.ts`: scroll nativo, secuencia de imágenes y reproductor.
- `public/media/celestial/manifest.json`: secuencia de escritorio del vídeo galáctico a 24 fps. Variante móvil en `public/media/celestial/mobile/manifest.json`. Original en `../references/celestial/orbit-original.mp4`.
- `public/media/team/`: retratos de los cinco personajes extraídos del episodio; no son caras regeneradas.
- `public/media/episode.mp4`: episodio comprimido a 720p, H.264/AAC, con inicio rápido. Se solicita al pulsar reproducir.

Los archivos multimedia son locales. No hay formulario, cuentas, analítica ni servicios externos de datos. Las fuentes se solicitan a Google Fonts y tienen fuentes de sistema como alternativa.

La web no se ha publicado. `npm run build` produce `dist/` para un alojamiento estático. El original `../cap.mov` permanece intacto y no se incluye en la compilación.

Los textos y aparatos son copy original de ficción para la web; no representan una transcripción ni afirman que todos los inventos aparezcan en el episodio.

## Dirección y verificación

Ver `../references/celestial/production.md`. La versión editorial aprobada está guardada en el commit `c6e613a`; su nota de producción permanece en `../references/rebuild/production.md`.
