# David — universo 4K aprobado

## Versión actual

Vídeo Seedance 2.0 aprobado por el usuario e incorporado al hero: `09-david-seedance2-4k.mp4`, 3840×2160, 8,04 segundos y 24 fps. Trabajo `c957fa53-3935-4078-abf7-7c62ea76f0d2`; parámetros y referencias en `09-seedance2-4k-generation.json`. La web sirve todos sus fotogramas en `/media/david-universe-4k/`, WebP calidad 90, resolución original 3840×2160. Sin cortes ni fundidos heredados de la toma anterior. Se conservan el texto secuencial, el recorte central, el desplazamiento inmediato y el breve cierre. El usuario aprobó la toma con sus artefactos puntuales de generación.

Los másteres y capturas de trabajo permanecen en local, ignorados por Git; los fotogramas de producción, referencias aprobadas y metadatos sí están versionados. Checkpoint previo a esta integración: `830936b`.

## Histórico (las aprobaciones y configuraciones siguientes han sido sustituidas)

Nueva propuesta con estrellas y polvo cósmico: `07-david-universo-2k-web.mp4` (2560×1440, 8 s, 24 fps, sin audio), generada de nuevo con MiniMax H3 y referencias nuevas. Metadatos en `universe-2k-v2-generation.json`. Aún no integrada. La prueba `06` se descartó por fondo demasiado parecido al anterior y alejamiento excesivo. El usuario abandonó el reescalado 4K; no hay herramienta disponible para cancelar ese trabajo remoto, no usar su resultado. Checkpoint aprobado guardado en `b9ed338`.

Edición de arranque: se omiten los índices 2–28, ambos incluidos. La secuencia de reproducción es 0, 1, 29…209; precarga y scroll inverso usan la misma lista. Archivos originales conservados.

Calidad HD: la web sirve ahora `/media/david-orbits-hd/`, fotogramas 1920×1080 extraídos directamente del máster original, WebP calidad 94. Escritorio y móvil usan la misma fuente Full HD; canvas hasta DPR 2. Se mantienen corte en 209 y ausencia de filtro. Antes se servía 1600×900 / 960×540 desde la copia comprimida para navegador.

Recorte solicitado tras la integración: la captura del usuario coincide con `frame-209.webp` (8,708 s). El hero termina ahí; recorrido acortado a 325svh en escritorio y 297svh en móvil. Se muestran solo los capítulos Visión y Creación. Se ha eliminado por completo la capa `.cosmic-shade`, incluidas sus reglas de color en móvil. Secuencia original conservada; reproducción y precarga limitadas al fotograma 209.

Vídeo aprobado e integrado: `05-david-orbitas-v2-web.mp4`, con desplazamientos orbitales en la parte intermedia y estabilización hacia el final. Metadatos en `video-orbitas-v2-generation.json`. La prueba `04-david-orbitas.mp4` se descarta por añadir líneas y duplicados. La portada utiliza `/media/david-orbits/`: 289 fotogramas a 24 fps, versiones de 1600×900 y 960×540, recorte central y póster del primer fotograma. Cabecera simplificada, menos texto y CTA del episodio a la izquierda. Verificados build, scroll reversible a fotogramas 40/141/288 en escritorio y móvil, diálogo del episodio y movimiento reducido.

ACTUALIZACIÓN: el usuario ha aprobado los fotogramas («Maravilloso, me gusta») y autorizado generar el vídeo. Se prepara `03-david-ascenso.mp4`, Seedance 2.5, 12 s, 1080p. Secuencia: mirada elevada inicial, cámara alejándose, breve mirada frontal de superioridad, nueva mirada elevada y ascenso con los seis inventos. Metadatos en `video-generation.json`. Las advertencias de aprobación pendiente que siguen pertenecen al histórico anterior.

Última revisión solicitada: `02-final-v3-seis-inventos.png`. Sustituye la probeta por un microscopio pequeño, añade un gorro de piscina con luces, ajusta el interfono a la nueva foto aportada por el usuario (panel superior con dos mandos y botones) y eleva la mirada de David para un ascenso angelical. Se mantienen gato, tostadora y poción: seis objetos en total. Metadatos en `revision-seis-inventos.json`. Sigue pendiente el OK explícito; las propuestas anteriores se conservan como histórico.

Punto de retorno previo a cualquier cambio de este turno: `b56b7d0`.

Petición del usuario: tomar el azul cielo de la A de Cuántica como motivo cromático, eliminar el tono carne cálido de las palabras destacadas y llevar el espacio hacia el azul. La referencia del logo está desaturada: `#73B5DB` es una aproximación de diseño, no una recuperación exacta del color oficial. Fondo oscuro propuesto: `#0B1D2C`; fondo editorial: `#EDF4F8`.

Se ha aplicado la paleta en la web. El clip existente solo recibe el tratamiento azul de la capa de fondo de la página; sus fotogramas originales no se han modificado. El vídeo nuevo queda PENDIENTE.

Entregables de esta revisión: dos fotogramas limpios, sin texto horneado. Inicio: David reconocible, primer plano, actitud de fundador visionario y mirada elevada. Final revisado: plano abierto del mismo David ascendiendo por el espacio con tostadora, gato, poción del amor, interfono Siemens de sobremesa del episodio y probeta graduada. El usuario ha pedido sustituir el robot por el interfono y la probeta. Referencia del aparato: segundo 152 del episodio, base negra rectangular y micrófono de cuello flexible. La propuesta revisada es `02-final-v2-cinco-inventos.png`; metadatos en `revision-cinco-inventos.json`. Mismo eje central para recorte móvil y espacio negativo para un titular breve y un botón a la izquierda.

Referencia de composición de YouTube: logo aislado, poco texto y CTA junto al bloque izquierdo. No copiar marca, prendas ni rostro del presentador de la referencia.

Límite explícito del usuario: SIN SU OK NO SE CONTINÚA. No generar vídeo, no montar nuevo recorrido y no reformar header/textos hasta que haya aprobado estos fotogramas. La petición de aprobación procede directamente del usuario, no de una regla adicional.
