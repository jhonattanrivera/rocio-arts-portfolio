# Espacios

Las cinco fotos del visor "En tu espacio" son imágenes generadas por encargo de Rocío Villamizar: sala, comedor, pasillo, recepción y consultorio. Se ven de frente, con la pared vacía y luz de día.

| Archivo | Espacio |
| --- | --- |
| sala | Sala con sofá y ventanal |
| comedor | Comedor con mesa de madera |
| pasillo | Pasillo con consola y monstera |
| recepcion | Recepción con mostrador y sofá |
| consultorio | Consultorio con dos sillones |

Las originales llegaron a 1728 × 1152 px y se exportaron a 1200 y 2000 px (JPG y WebP) con sharp.

En el comedor y el pasillo, lo que queda delante de la pared (las flores del centro de la mesa, el florero con ramas) se recortó en `comedor-flores.webp` y `pasillo-ramas.webp`: la obra cuelga detrás. El recorte compara cada píxel con el color de la pared en su fila y le quita al borde el halo de la pared.

Para sumar un espacio se exportan `{nombre}-1200` y `{nombre}-2000` en JPG y WebP, y se agrega una entrada en `js/room.js`. Si la pared se ve de frente basta `flat`: el ancho de la foto en la pared en cm (medido con los muebles), la zona de pared libre, el punto por defecto y `blocks` para lo que sube por delante de la pared (floreros, ramas, plantas), que la obra no tapa. Si se ve en perspectiva, `wall.quad` son las cuatro esquinas en la foto de un rectángulo de pared con medida conocida (`wall.cm`); la obra y su luz se proyectan con esa perspectiva.
