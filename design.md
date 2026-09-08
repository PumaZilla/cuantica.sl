# Cuántica SL — Diario de diseño

## 01 · Encargo y revisión inicial · 9 septiembre 2026
Crear la web de una comedia sobre una empresa de aparatos científicos absurdos. La experiencia debe presentar al CEO como un visionario, transformar su retrato en los demás personajes al desplazar la página y devolverlo al CEO para una ascensión espacial. Toda generación de imágenes o vídeo se realiza con Higgsfield.

Material fuente: `cap.mov` (1,19 GB). Proyecto anterior en `web/`, Astro, con cinco clips y un motor de scroll. Se conservará en `old/` antes de sustituir su implementación. Los diseños anteriores se conservan como archivo, no como dirección de arte.

## 02 · Dirección de arte
Una campaña corporativa con la grandilocuencia de un programa espacial y el sentido del humor de una oficina que no funciona. Fondo negro tinta, blanco cálido, verde ácido como señal científica. Retratos centrales grandes, aros de medición, tipografía editorial y pequeños indicadores técnicos. La comedia entra por el texto y las funciones del equipo; la puesta en escena se toma completamente en serio.

Secuencia prevista: CEO → hacker → científica → responsable de redes → perro → CEO → ascensión → ver episodio. Misma posición y escala de ojos en los retratos para continuidad. Transiciones con disolución, escala y distorsión breve controladas por scroll, reversibles. El scroll sigue siendo nativo; se interpola la composición, no se secuestra la rueda.

## 03 · Higgsfield y referencias
Plugin instalado y conexión confirmada. Consultado el catálogo de modelos con referencias visuales. Se revisará el episodio para extraer fotogramas e identificar visualmente a cada personaje, sin inventar nombres propios. Los recursos generados y sus identificadores se documentarán aquí.

## 04 · Desglose del episodio
Duración verificada en el navegador: 368,48 s; resolución 1920 × 1080. Hoja de contacto de 32 fotogramas guardada en `references/contact.jpg`.

| Personaje / etiqueta editorial | Tiempo | Referencia visual |
|---|---:|---|
| CEO | 00:26 | Gafas negras grandes, americana azul y camiseta de rayas rojas |
| Hacker | 00:37 | Capucha negra y gafas |
| Científica (asignación editorial por el encargo) | 04:28 | Mujer de pelo corto rizado, gafas y camiseta de rayas |
| Redes (asignación editorial por el encargo) | 04:39 | Mujer joven de trenzas, gafas transparentes y pendientes geométricos |
| Perro | 05:12 | Hombre con barba y traje peludo gris; se conserva el disfraz, no se sustituye por un animal |

No se han inventado nombres propios ni transcrito diálogos. Las descripciones y bromas de la web son copy original de campaña, no citas del episodio.

## 05 · Producción visual en Higgsfield
Cinco retratos enviados en un lote, con referencias extraídas de `cap.mov`. Modelo solicitado: `nano_banana_pro`; Higgsfield identifica el modelo ejecutado como `nano_banana_2`. Salida vertical 3:4, resolución solicitada 2K. Retrato frontal, misma altura de ojos, fondo negro, luz principal blanca y contorno verde discreto. Prompts completos, referencias e identificadores conservados en `references/generations.json`.

Los cinco retratos terminaron correctamente. Conversión a WebP de 900 px de ancho dentro del sandbox de Higgsfield: aproximadamente 560 KB para el conjunto. Se descargan como recursos locales de la web. La primera generación del CEO a cuerpo entero falló; se repitió usando su retrato generado como referencia.

## 06 · Implementación
Archivado el código y los medios anteriores en `old/previous-web/`. Se conserva la base Astro y se sustituye completamente la página, CSS y motor de scroll. Consultadas las guías oficiales de Astro de componentes, estilos y rutas.

Escenario de una pantalla fijado durante nueve alturas de viewport (ocho en móvil). Scroll nativo con interpolación temporal de 105 ms, capítulos navegables, transiciones reversibles, retratos superpuestos y desplazamiento orbital. Fondo de partículas dibujado en canvas, con densidad y estelas crecientes durante el ascenso. La animación se suspende cuando el escenario queda fuera de pantalla o la pestaña está oculta.

Tras el viaje: manifiesto verde ácido con tres líneas de investigación de tono cómico y cierre con el episodio real. Reproductor en diálogo nativo con controles, Escape para cerrar, pausa al cerrar y restauración del foco. El episodio original se enlaza desde `public/media/episode.mov` para evitar duplicarlo durante el desarrollo. No se carga hasta pulsar reproducir.

Accesibilidad: enlace para saltar al episodio, navegación por teclado, capítulos etiquetados, escenas inactivas `inert`, botón de movimiento reducido con preferencia persistente y respeto inicial por `prefers-reduced-motion`. En ese modo cambian las imágenes sin desplazamientos ni interpolación, y el ascenso usa una imagen fija.

## 07 · Ascenso definitivo y limitaciones de cuenta
La segunda generación del CEO a cuerpo entero terminó correctamente: `d69d512e-215f-4d93-8a4f-1857dbd34de3`. Se revisó visualmente y se convirtió a WebP en Higgsfield.

El intento de vídeo con Seedance 2.5 fue rechazado: «Requires plus plan or higher». El segundo intento con Kling 2.6 fue rechazado: «Requires basic plan or higher». No se ha modificado ni contratado ningún plan. No se ha generado ningún clip de vídeo nuevo.

Solución final: todos los retratos proceden de Higgsfield y el ascenso se anima directamente en la web con el retrato a cuerpo entero. Al avanzar, vuelve el CEO, se aleja hasta mostrar el cuerpo completo y asciende mientras se reduce al 16% de su tamaño y aparecen estelas espaciales. La posición exacta depende del scroll, por lo que retroceder invierte el movimiento sin esperas de decodificación. Se eliminó el código de vídeo provisional para no solicitar archivos inexistentes.

## 08 · Primera verificación
Compilación Astro correcta. Reiniciado el servidor después de sustituir `public/` para que Vite registre todos los recursos. Revisados el retrato principal y la versión móvil a 390 × 844. Prueba de navegador: navegación a hacker, perro y científica; cada escena activa tiene `aria-hidden=false`; sin desbordamiento horizontal y sin excepciones de JavaScript. Verificado el interruptor de movimiento reducido.

## 09 · Validación final y entrega
- Compilación final: `npm run build`, correcta (1 página estática).
- Todos los retratos cargan con dimensiones válidas y las solicitudes del recorrido no devuelven errores HTTP.
- Probados los siete capítulos en anchuras 320, 390, 768 y 1440 px: escena correcta, una sola escena accesible activa y sin desbordamiento horizontal.
- Probados scroll animado, salto a capítulos, modo de movimiento reducido y vuelta a los personajes.
- Reproducción real del MOV verificada: 1920 × 1080, duración 368,48 s, `readyState=4`, reproduciendo. Escape cierra, pausa y restaura foco al botón.
- Capturas revisadas en `references/desktop-final.png`, `references/perro-final.png`, `references/ascent-final.png`, `references/mobile-final.png`, `references/mobile-ascent.png` y `references/mobile-episode.png`.
- Documentación de ejecución actualizada en `web/README.md`. Vista previa local en http://localhost:4321.

El material original permanece intacto. No se ha publicado la web. La compilación incluye el episodio original de 1,19 GB: una distribución pública debería usar una versión comprimida o alojamiento de vídeo. Los seis recursos gráficos de la experiencia pesan en conjunto unos 600 KB; el episodio solo se solicita al reproducirlo.

## 10 · Revisión de identidad: Kike y CEO
Petición: guardar la versión existente en Git y rehacer ambos personajes porque el parecido no es suficiente. No existía repositorio; inicializado Git en la raíz y creado el commit `0bbfdb8` como punto de retorno. El episodio original, dependencias, compilaciones y capturas temporales quedan excluidos de Git.

Revisión de doce planos del episodio guardada en `references/identity-review.jpg`. El primer CEO se había generado desde un fotograma con los ojos cerrados; Kike se había interpretado desde una vista lateral con capucha. Nuevas referencias: CEO a 00:15 y 00:23; Kike frontal a 04:17 y en tres cuartos a 02:38. Kike aparece sin capucha, con gafas redondas finas, pelo corto oscuro, barba corta y camiseta blanca. Se prioriza conservar esos rasgos reales frente a la estética genérica de hacker.

Esta revisión pide una edición del retrato fuente: cambiar fondo e iluminación manteniendo geometría facial, edad, asimetrías y gafas. No se reutilizan los rostros generados anteriores como referencias de identidad. También se revisará el CEO de cuerpo entero para mantener el parecido durante el ascenso.

## 11 · Retratos corregidos e integración
Las dos nuevas imágenes se generaron correctamente en Higgsfield a partir de dos fotogramas originales por actor:
- Kike: `fb32ada7-2563-4c48-9f7b-273a6d6c57e2`. Sin capucha, con sus gafas de alambre, pelo corto, barba ligera y camiseta del episodio.
- CEO: `663771c4-183f-4fe0-98e5-d93a75e88fbf`. Se conserva la inclinación natural de la cabeza, frente, gafas grandes y expresión del actor.

Revisadas visualmente contra las referencias y convertidas a WebP de 900 px en el sandbox de Higgsfield. La generación adicional del cuerpo entero fue rechazada por falta de créditos. Para evitar regresar al rostro anterior durante el ascenso, se compuso el rostro nuevo sobre el cuerpo existente con una máscara ajustada al cuello y bordes suavizados, también dentro de Higgsfield. Se corrigió la máscara tras revisar el primer montaje para eliminar hombros duplicados. No se han comprado créditos ni cambiado el plan.

Sustituidos `ceo.webp`, `hacker.webp` y `ascent.webp`. Añadida versión `?v=2` a sus URL y a la precarga del CEO para que el navegador no conserve los retratos anteriores. El resto de personajes y el motor de animación se mantienen.

Prompts, referencias, trabajos, errores de cuota y método de composición guardados en `references/identity-v2.json`. Compilación correcta y verificación visual en 1440 × 900 y 390 × 844. Cargan ambos retratos y el ascenso, sin errores HTTP ni desbordamiento horizontal. La revisión se guarda en un segundo commit separado del punto de retorno.
