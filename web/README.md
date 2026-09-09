# Cuántica SL

Web de la serie con retratos del reparto generados en Higgsfield a partir de `../cap.mov`, transiciones controladas por scroll y ascensión espacial del CEO.

## Desarrollo

Desde esta carpeta, con Node 22.12 o posterior:

```sh
npm install
npm run dev -- --background
```

Abrir http://localhost:4321. Para detener el servidor: `npm run astro -- dev stop`.

## Compilación

```sh
npm run build
npm run preview
```

El resultado se guarda en `dist/`. El episodio original se sirve mediante el enlace `public/media/episode.mov` a `../../../cap.mov`. Astro copia el vídeo de 1,19 GB en la compilación; para publicar conviene preparar una versión de distribución comprimida o alojarlo en un servicio de vídeo. El reproductor no descarga el episodio hasta pulsar play.

## Archivos

- `src/pages/index.astro`: personajes, textos, capítulos y reproductor.
- `src/lib/experience.ts`: scroll, transiciones, estrellas, accesibilidad y controles.
- `src/styles/global.css`: dirección visual y adaptación móvil.
- `public/media/portraits/`: seis WebP creados con Higgsfield (cinco retratos y CEO completo).
- `../design.md`: diario de decisiones, pasos, limitaciones y validación.
- `../references/generations.json`: prompts, fotogramas y trazabilidad de Higgsfield.
- `../old/previous-web/`: implementación anterior preservada.

La cuenta de Higgsfield permitió generar imágenes, pero los modelos de vídeo probados exigieron ampliar el plan. La animación final usa los recursos generados y se ejecuta en el navegador; no depende de clips externos.
