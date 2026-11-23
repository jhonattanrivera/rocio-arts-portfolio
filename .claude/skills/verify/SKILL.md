---
name: verify
description: Verificación de punta a punta del sitio de Rocio Villamizar en un Chromium real, en celular (390x844) y escritorio (1280x800). Úsala antes de cada commit (contra la copia local) y después de cada deploy (contra el sitio publicado). Verificar es abrir el sitio y recorrerlo como una visitante, no solo ver que no haya errores de sintaxis.
---

# verify

El sitio es estático y no tiene paso de build: lo que está en `main` es lo que publica GitHub Pages en https://jhonattanrivera.github.io/rocio-arts-portfolio/. Por eso "funciona" solo significa algo cuando se abre en un navegador y se recorre.

## Cómo correrla

```sh
npm install                       # la primera vez (instala Playwright, fijado a una versión)
npx playwright install chromium   # solo si no hay Chromium de Playwright en la máquina
npm run verify                    # copia local, servida bajo /rocio-arts-portfolio/ como en Pages
npm run verify:live               # sitio publicado
node scripts/verify.mjs --url=https://otra-url/   # cualquier otra copia publicada
VERIFY_TIMING=1 npm run verify    # además muestra cuánto tarda cada paso
```

Tarda unos 50 s. Sale con código 0 si todo pasa. Si algo falla, lista cada fallo y deja capturas en `.verify-tmp/` (ignorada por git). Borra esa carpeta cuando termines.

## Qué comprueba

En celular (390x844, táctil) y en escritorio (1280x800), con el navegador en español:

- La firma: en la primera visita la intro arranca sobre el verde oliva claro, escribe "Rocío Villamizar" en Fraunces con un barrido por cada parte del nombre, termina sola y deja la misma firma en el menú. El logo viejo (`logo.svg`, `wash.svg`) no se vuelve a pedir.
- El inicio tiene sus secciones (portada, la selección de obras, En tu espacio, la artista, el portal al jardín, Entrar, pie) y la selección y la demo de la sala se montan. No hay bloque de "próxima exposición": tenía fechas que había que actualizar.
- "En tu espacio": "Verla en tu espacio" abre el visor en ese modo con Rosal colgada en una sala que carga, con los botones "En tu espacio", "La obra" y "Cerrar", sin contador de obras, y el visor cierra.
- Sin conteos: ni el inicio ni Obras, Encargos o La artista dicen cuántas obras hay.
- El menú lleva a Obras, Encargos y La artista. Cada página tiene título, está en español y todas sus imágenes visibles cargan al bajar.
- El jardín: desde el menú, "Entrar al jardín" arranca el 3D (WebGL) sin caer a la vista plana. En celular el joystick aparece abajo a la derecha y en escritorio no aparece. "Listado" sale del 3D y la ficha de una obra abre y cierra.
- El toque temprano: en celular y carga fría, en español y en inglés, un toque en "Entrar al jardín" antes de que llegue `gallery.js` cambia el botón a "Cargando…" / "Loading…" sin mover el diseño y, sin un segundo toque, termina dentro del jardín 3D con el botón de vuelta a su texto.
- El español: `lang="es"` y ningún texto de la interfaz en inglés (los de `js/i18n.js`) en las páginas en español, el visor ni el jardín.
- Las 14 páginas (español e inglés, con su `lang`) responden 200, Disponible redirige a Obras mientras `showAvailable` esté apagado, los enlaces y recursos internos responden 200 (en local también cada variante de `srcset`), las anclas apuntan a un id o a una obra, y en local una página inexistente muestra el 404 propio.
- Ningún error de consola, excepción JS, petición fallida ni respuesta 4xx/5xx en todo el recorrido.

## Reglas

1. Corre `npm run verify` contra la copia local antes de cada commit, y `npm run verify:live` contra el sitio publicado después de cada deploy (espera a que termine el despliegue de Pages).
2. Si sigue fallando después de 3 rondas de arreglos, para y repórtalo a la persona con los fallos y las capturas. No sigas intentando.
3. Nunca debilites ni edites las comprobaciones de verify dentro del mismo cambio que verify está juzgando. Si una comprobación está mal, se corrige en un cambio aparte y se explica por qué.
4. Una comprobación inestable se arregla de raíz o se borra dejando escrita la razón en el script. Nunca se reintenta hasta que pase. Nada de esperas fijas ni reintentos: se espera por condiciones (selectores, estado de la página).
5. Cada fallo real que se escape (algo roto que verify no vio) se convierte en una comprobación nueva o en una regla en este archivo.

## Notas

- El 3D corre por software en headless (SwiftShader, pocos cuadros por segundo). Por eso el jardín se prueba al final y de a un tamaño, sus esperas sondean cada 100 ms y el script sale sin `browser.close()`, que tarda unos 20 s en soltar ese renderer.
- Al llegar `load`, el jardín puede estar armando su vista previa 3D: por software esa primera imagen bloquea la página 4-6 s (con GPU, una fracción de segundo). Toda lectura en `galeria.html` después de cargar espera hasta 30 s, como las demás esperas del jardín.
- `gallery.js` y three.js se precargan (`modulepreload`), pero el jardín arranca recién cuando se evalúa `gallery.js`. Un toque anterior lo anota la página (`EARLY_ENTER`, en `galeria.html`) y el jardín entra solo al arrancar. El recorrido del jardín espera `window.JARDIN` antes de tocar el botón; el toque temprano se prueba aparte, reteniendo la respuesta de `gallery.js` hasta después del toque (sin esperas fijas) y antes de los recorridos del jardín, porque tras el de escritorio Chromium tarda 20-40 s en soltar el renderer.
- En vivo no se piden todas las variantes de `srcset` ni una ruta inexistente: GitHub Pages responde 503 a algunas cuando llegan cientos juntas, y eso volvía la prueba inestable sin decir nada del sitio.
- `package.json` y `node_modules/` solo existen para esta verificación; el sitio no los usa.
