# Cuántica S.L. — guía del repositorio

## Antes de trabajar

Lee completo y adhiérete a [CONTRIBUTING.md](../CONTRIBUTING.md) antes de cualquier cambio, también si solo afecta a documentación. Es la referencia para ramas, commits, comprobaciones y autorización de merges. No trabajes ni hagas commits directamente en `main`; no hagas merges sin la autorización explícita que exige ese documento.

Conserva los cambios pendientes del usuario. Revisa el código y los recursos actuales antes de actuar: el proyecto se itera visualmente y las notas antiguas pueden describir versiones descartadas. No restaures diseños, textos ni imágenes anteriores basándote solo en el historial de conversación.

## Finalidad y tono

Esta es la web promocional en español de **Cuántica S.L.**, una webserie de comedia sobre una empresa que fabrica aparatos científicos descabellados. La historia gira alrededor de la empresa y su equipo; David, su CEO visionario, protagoniza la entrada visual, pero la web no es su página personal.

El tono mezcla lenguaje corporativo y científico con humor absurdo: inventos extraordinarios, necesidades inventadas y consecuencias cuestionables. La tienda es ficticia: comprar abre el episodio en un modal, no un checkout real. Mantén clara esa intención y evita añadir comercio real, cuentas o servicios externos sin una petición.

## Dirección visual

- **Hero cinematográfico:** universo a pantalla completa, estrellas y polvo cósmico, David como foco central y objetos orbitando. Logo y texto sobre la imagen. El centro debe funcionar al recortar los lados en móvil. Preserva nitidez y legibilidad sin añadir un filtro azul que ensucie el vídeo.
- **Paleta base:** universo oscuro `#050711`, tinta azul marino `#121d2d`, polvo `#2d3c53`, bruma `#a8bcd0`, luz estelar `#edf4f8` y acento azul `#73b5db`. Consulta los tokens y las reglas vigentes antes de cambiar colores. Los colores chillones se concentran en elementos brutalistas, especialmente la tienda.
- **Tipografía:** Space Grotesk para titulares, DM Sans para lectura, Manrope en el hero y monoespaciada en etiquetas. La tienda utiliza titulares pesados y recursos de teletienda. No generalices cursivas, colores o estilos de una sección a toda la página.
- **Tienda:** teletienda satírica, mayúsculas, marcos contundentes, sellos, ofertas y botones «COMPRA YA». Productos deliberadamente cutres sobre fondos neutros, sin texto incrustado en las imágenes. Precios y botones alineados abajo.
- **Intermedio corporativo:** «Primero cambiamos el mundo. Luego leemos las instrucciones». Brutalismo editorial con composición superpuesta y nota tipo post-it; diferenciado de la tienda, integrado en el fondo de la página. Gato asomando por la izquierda.
- **Equipo:** retratos de cintura para arriba, sesión pseudo-profesional coherente, marcos irregulares y etiquetas de cargo. Alternativas al pasar el ratón. Mantén el fondo, la iluminación, el encuadre y la identidad de cada persona entre ambas fotos.
- **Secundarios:** «Con la cuestionable ayuda de...», carrusel lento con etiquetas de nombre/cargo, fotos cuando existan y fondos vacíos cuando no. El botón de pausa comparte fila con el título.
- **Detalles:** símbolos y esquinas como decoración editorial, alineados con los márgenes de sección, sin recortes accidentales. Comprueba especialmente el ancho de unos 1100 px, además de escritorio amplio y móvil.

## Contenido y personajes

Los seis protagonistas actuales son David (CEO), Kike (hacker), Iria (investigadora), Nati (científica), Paula (redes) y Santi (becario). El orden, las etiquetas, las frases y los enlaces vigentes están en el código; no los deduzcas de versiones anteriores. El personaje antes llamado Raquel es Nati.

Los secundarios incluyen Antonio, Madre de Kike, Igor (Gourmet), Pitonisa (Clandestina), Sr. Bioverde, Srta. Gerania y Bobby 2.0 (Mascota). Bobby aparece aquí, no entre los seis principales.

La tienda presenta transportador cuántico, estimulador cerebral, tostadora, elixir del amor, analizador de rostros y planta bioluminiscente. Usa `site.ts` y la plantilla como fuentes del contenido vigente.

## Imágenes y vídeo

Las caras deben parecerse a las referencias reales suministradas o a los fotogramas del episodio. Para rehacer un retrato, parte preferiblemente de la foto principal aprobada y las referencias originales: encadenar generaciones degrada la identidad y el detalle.

Limita cada edición a lo pedido. Conserva especialmente sonrisa, ojos, ropa, color de fondo y textura cuando no sean el objeto del cambio. Comprueba visualmente el resultado antes de integrarlo. Los aparatos recurrentes —en particular el interfono de Kike— deben coincidir con sus referencias, no con una interpretación genérica.

Guarda versiones nuevas con nombres claros, mantén el original y actualiza la ruta usada por la web. No solicites imágenes alternativas inexistentes ni generes retratos para huecos vacíos sin indicación. El material fuente y las referencias archivadas no deben alterarse accidentalmente.

## Mapa del proyecto

- La raíz contiene la aplicación Astro activa. Lee también [AGENTS.md](../AGENTS.md).
- `src/pages/index.astro`: estructura, titulares, tarjetas y modal del episodio.
- `src/content/site.ts`: datos del sitio, protagonistas, secundarios y productos.
- `src/components/`: identidad visual y componentes compartidos, como enlaces sociales.
- `src/styles/global.css`: estilos generales y de secciones. Tiene reglas acumuladas: revisa la cascada y los breakpoints.
- `src/styles/celestial.css`: hero y adaptación móvil.
- `src/lib/experience.ts`: inicialización de la experiencia y comportamiento general.
- `src/lib/hero-motion.ts`: movimiento del hero con vídeos de avance y retroceso.
- `src/lib/supporting-carousel.ts`: interacción del carrusel de secundarios.
- `public/media/`: medios servidos por la web; retratos en `team/linkedin/`.
- Las referencias visuales y notas históricas se han archivado fuera del repositorio; no son dependencias de compilación.
- Las versiones anteriores, bocetos y el episodio fuente también se conservan en el archivo externo.
- `flake.nix` y `.envrc`: configuración del entorno local.

## Verificación

Para cambios visuales, comprueba el resultado en navegador a ancho amplio, alrededor de 1100 px y en móvil. Revisa desbordamientos, recortes, lectura de etiquetas y carga de imágenes. Para interacciones, comprueba hover, foco, pausa, movimiento reducido y modal según el alcance del cambio.

No sustituyas el comportamiento actual del hero por una implementación histórica de scroll sin petición. Conserva sus fallbacks y las preferencias de movimiento reducido.

El build se ejecuta con `npm run build`. Sigue todas las comprobaciones y reglas previas al merge de `CONTRIBUTING.md`; una comprobación visual no reemplaza el build.
