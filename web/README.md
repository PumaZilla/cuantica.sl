# Cuántica SL

Rediseño editorial de la webserie. Marfil, tinta y naranja industrial; personajes y movimiento procedentes del episodio original.

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

- `src/content/site.ts`: nombres, roles, descripciones, inventos y rutas multimedia.
- `src/pages/index.astro`: estructura y texto editorial de las secciones.
- `src/styles/global.css`: colores, tipografías, composición y adaptación móvil.
- `src/lib/experience.ts`: scroll nativo, secuencia de imágenes y reproductor.
- `public/media/vision-v2/manifest.json`: 60 fotogramas originales a 20 fps, 1280 × 720, extraídos de 00:23 a 00:26.
- `public/media/team/`: retratos de los cinco personajes extraídos del episodio; no son caras regeneradas.
- `public/media/episode.mp4`: episodio comprimido a 720p, H.264/AAC, con inicio rápido. Se solicita al pulsar reproducir.

Los archivos multimedia son locales. No hay formulario, cuentas, analítica ni servicios externos de datos. Las fuentes se solicitan a Google Fonts y tienen fuentes de sistema como alternativa.

La web no se ha publicado. `npm run build` produce `dist/` para un alojamiento estático. El original `../cap.mov` permanece intacto y no se incluye en la compilación.

Los textos y aparatos son copy original de ficción para la web; no representan una transcripción ni afirman que todos los inventos aparezcan en el episodio.

## Dirección y verificación

Ver `../references/rebuild/production.md`. La versión anterior del código se conserva en `../references/rebuild/source-before/`, además del historial Git existente.
