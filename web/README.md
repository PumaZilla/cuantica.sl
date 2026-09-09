# Cuántica SL

Web synthwave de la serie, con retratos y seis vídeos de gestos generados en Higgsfield a partir del reparto de `../cap.mov`, transiciones por scroll y ascensión espacial del CEO.

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
- `src/lib/experience.ts`: scroll, reproducción selectiva, transiciones, estrellas y accesibilidad.
- `src/lib/alpha-video.ts`: composición transparente de los MP4 con color y máscara en el mismo fotograma.
- `src/styles/global.css`: dirección visual y adaptación móvil.
- `public/media/motion/`: seis MP4 y sus imágenes WebP transparentes de reserva.
- `public/media/portraits/`: retratos originales de las revisiones anteriores.
- `../design.md`: diario de decisiones, pasos, limitaciones y validación.
- `../references/generations.json`: prompts, fotogramas y trazabilidad de Higgsfield.
- `../old/previous-web/`: implementación anterior preservada.

Los clips se sirven localmente: cinco bucles de gestos y un ascenso cuyo tiempo sigue el scroll. Solo se reproducen los personajes visibles y se prepara el siguiente. Se pausan fuera del escenario, al ocultar la pestaña y al abrir el episodio. Movimiento reducido o ausencia de WebGL usan imágenes estáticas. Producción y trazabilidad de esta revisión en `../references/synthwave-generations.json`.
