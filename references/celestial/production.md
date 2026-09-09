# El universo de David

## Punto de retorno

La versión editorial aprobada por el usuario se guardó ANTES de los cambios en el commit `c6e613a` (Save approved editorial redesign with original cast and playable episode). El nuevo giro sustituye solo la entrada y su motor de scroll. Inventos, franja naranja, equipo, episodio y pie conservan su estructura y estilos aprobados.

## Dirección visual

Un escenario galáctico continuo a pantalla completa, sin margen ni tarjeta. David es el foco central; conserva americana azul, camiseta de rayas y grandes gafas. Los objetos solicitados son una tostadora, un gato naranja, un mecha industrial y una poción rosa con forma de corazón. Paleta desaturada, negro verdoso, halo cálido y pocos puntos de luz. La tipografía HTML ocupa el tercio izquierdo en escritorio y la parte inferior en móvil. Cabecera, logo y botones se superponen al vídeo.

## Generación y referencias

Fotograma inicial: GPT Image 2 en Higgsfield, trabajo `4697810f-27f1-40e6-bd4f-82d25ba993a7`. Se usaron directamente las dos referencias ORIGINALES de David: `d9c9e641-217b-4471-b139-27f45e24f700` (00:23) y `ba6926e9-8e60-4f1f-820e-8577db6affc1` (00:15), no la imagen rechazada del laboratorio ni las antiguas caras sintetizadas. El rostro resultante fue inspeccionado junto con las referencias antes de iniciar vídeo. La generación puede introducir diferencias; no se afirma identidad píxel a píxel.

Vídeo: Seedance 2.0 en Higgsfield, trabajo `6cfbdbd0-94d1-450c-8e6d-688231959b17`, solicitud de 12 segundos, 1080p, sin audio. Fotograma inicial y referencia original del actor. Plano fijo con órbitas diferenciadas y objetos entrando en el centro para el recorte móvil. Prompts exactos en `generation.json`.

## Secuencia de scroll

420svh de contenedor en escritorio: 100svh visibles + 320svh de recorrido activo. En móvil 380svh: 100svh + 280svh activos. Primer 8% de recorrido: pausa de lectura. Siguiente 86%: movimiento continuo de la secuencia. Último 6%: pausa final antes de pasar al marfil. La duración del vídeo y la distancia de scroll son independientes.

Tres capítulos de texto: visión (0–28%), creación (28–78%) y universo (78–100%). Los textos inactivos están ocultos e inert. Las escenas no contienen texto horneado. Scroll nativo, reversible, y enlace para saltar directamente a inventos.

Modo reducido: poster fijo, primera escena, sin recorrido fijado, mismo contenido editorial debajo. Respeta la preferencia del sistema y permite control desde el hero y desde el pie. Con ahorro de datos se inicia en modo reducido, salvo preferencia manual guardada. Sin JavaScript se conserva poster y primera escena, y el recorrido también se acorta.

## Preparación y carga

Secuencia WebP a 24 fps. Variante escritorio de 1600 px y móvil de 960 px. Crop centrado idéntico para poster y canvas; no se desplaza a David lateralmente. Se escoge variante al cargar la página. Al redimensionar se recompone el crop sin perder el progreso.

Carga por cercanía al fotograma solicitado, máximo 4 peticiones simultáneas, caché de 20 bitmaps con liberación de memoria. No se precarga toda la secuencia. Hasta 2 intentos por fotograma; poster conservado si falla el manifiesto o el vídeo. Se pausa la carga fuera de pantalla o con pestaña oculta. La imagen de portada es inmediata.

El episodio original y su reproductor no se modificaron. No hay publicación pública ni cambios de suscripción.

## Resultado y validación final

Vídeo completado de 12,04 s, 1920 × 1080 a 24 fps; 289 fotogramas. Secuencia escritorio: 9.859.028 bytes; móvil: 4.065.794 bytes. Original: aproximadamente 6,6 MB. Los cuatro objetos realizan desplazamientos de órbita perceptibles, con David en el centro. Se inspeccionaron doce momentos del plano y recortes del rostro al inicio, mitad y final. El movimiento facial es mínimo. En el recorte móvil los objetos pueden salir por los lados durante parte de su órbita, y regresan al área central; David sigue visible.

Pruebas reales en navegador: fotogramas 0 → 33 → 134 → 221 → 288 → 114 → 0, cada solicitud resuelta; rueda hacia abajo y arriba (66 → 20); tres capítulos sincronizados y solo uno visible/accesible; secuencia móvil de 960 px solicitada en viewport 390 px; imágenes revisadas en varios puntos del recorrido móvil. El final del escenario y el inicio de inventos coinciden exactamente, sin vídeo fijo sobre las secciones siguientes.

Portada ocupa exactamente 320 × 568, 390 × 844, 768 × 1024 y 1440 × 900 según viewport; sin desbordamiento horizontal. Modo reducido elimina el tramo de scroll y mantiene el hero a una pantalla. Enlace a inventos operativo, reproducción real del episodio, cierre con Escape y pausa posterior confirmados. Compilación Astro de dos rutas correcta, manifiestos y numeración verificados. Sin errores de consola tras integrar los medios finales.
