# Rediseño de Cuántica SL — 9 septiembre 2026

## Resultado

Web construida sobre Astro existente, con composición nueva. Cabecera editorial marfil, acento naranja, entrada cinematográfica breve, tres aparatos ilustrados con CSS, cinco personajes, episodio en diálogo y tablero de dirección visual en `/direccion`.

Se conserva la geometría del símbolo orbital existente. Space Grotesk y DM Sans, con Georgia italic como contrapunto. Variables de color en `web/src/styles/global.css`.

## Corrección de identidad solicitada

El usuario rechazó la cara del CEO generada en Higgsfield. Ese resultado y su vídeo no se usan en la web. Se sustituyeron TODAS las caras visibles por recortes del episodio original; David tiene además movimiento original. Solo recorte, reducción y ajuste de contraste/luminosidad; no síntesis facial.

David: `ceo-angle-v2.jpg`, 00:23. Kike: `kike-front-v2.jpg`, 04:17. Paula: `cientifica-ref.jpg`, 04:28 (nombre histórico del archivo incorrecto para el papel). Raquel: `redes-ref.jpg`, 04:39 (mismo problema histórico). Bobby: `perro-ref.jpg`, 05:12. Los roles responden a la asignación explícita del usuario, por encima de la demo anterior.

## Recorrido

1. Titular «El futuro no se inventa solo». Presentación de David.
2. Escenario fijo breve: 155vh totales en escritorio y 130svh en móvil. El recorrido activo es la altura del contenedor menos la del escenario, que se calcula en ejecución. Primer 15%: pausa en el fotograma inicial; siguiente 70%: tres segundos de movimiento original; último 15%: pausa final. El texto secundario aparece entre el 30% y el 60%. No se intercepta la rueda.
3. Inventos, equipo y episodio fluyen normalmente. En movimiento reducido, se elimina el tramo fijado y se conserva la imagen y los textos.

La primera selección de cuatro segundos contenía un corte a Kike; la revisión visual detectó el corte y la secuencia final se acotó a 00:23–00:26. Se han revisado los fotogramas inicial, intermedio y final.

## Medios y rendimiento

60 WebP de 1280 × 720 a 20 fps; peso exacto en `web/public/media/vision-v2/manifest.json`. Máximo 4 solicitudes de fotogramas simultáneas y 16 bitmaps decodificados; expulsión con liberación de memoria; hasta 2 intentos por fotograma. La imagen de portada aparece antes que la secuencia. Carga detenida fuera de pantalla y con pestaña oculta. Con ahorro de datos se mantiene el fotograma fijo.

Episodio de 368,48 s a 720p, H.264/AAC, aproximadamente 53 MB, sin carga antes de pulsar play. Original de más de 1 GB intacto fuera de `public/`.

## Higgsfield

Se consultaron los elementos existentes del usuario. Imagen `8203ae4e-5e18-4a15-95ba-964e4e16da10` solicitada con Nano Banana Pro y ejecutada como Nano Banana 2. Vídeo `73bbcf6a-3c2b-4b2c-9cc6-80bde9fc8ca4` con Seedance 2.0, 6 segundos, 1080p, sin audio, iniciado antes de la corrección del usuario. Ambos completados; descartados por identidad, no integrados. Prompts en `generation-attempts.json`. No se modificaron planes ni se compraron suscripciones.

## Validación realizada

Compilación de producción correcta. Navegador real: scroll con rueda hacia delante y atrás; imágenes de cinco personajes cargadas; despliegue de ficha de Paula; reproducción real del MP4; Escape cierra, pausa y restaura foco; movimiento reducido elimina el recorrido y oculta canvas. Anchuras 320, 390, 768 y 1440 sin desbordamiento horizontal. Sin errores de consola. Inspección visual de escritorio y móvil.

No se ha publicado la web. No se han reconstruido los vídeos generados antiguos de Kike y Paula: la web utiliza fotogramas originales para conservar su identidad. No hay nuevas animaciones faciales sintéticas.
