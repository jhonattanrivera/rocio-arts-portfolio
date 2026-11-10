# Espacios

Fotos con la Licencia Unsplash (uso libre, también comercial). La obra se coloca encima en el navegador; las fotos no se venden ni se redistribuyen solas.

| Archivo | Foto | Autor |
| --- | --- | --- |
| sala | https://unsplash.com/photos/9iljaLpo9uw | Jonathan Borba |
| escalera | https://unsplash.com/photos/YNaGwlNbTwY | Francesca Tosolini |
| habitacion | https://unsplash.com/photos/OZZOEgwxyfQ | Rohit Thakur |
| comedor | https://unsplash.com/photos/ozDFb-HMi6w | mindeurle lee |
| tarde | https://unsplash.com/photos/al0srakHkkY | Visual Laurence |
| entrada | https://unsplash.com/photos/HstwCJX0jT4 | Liana Mikah |

Ajustes:

- `sala`: se borró el cuadro de cuatro paneles y su sombra.
- `escalera`: se borraron los seis marcos de la pared, sin tocar el pasamanos.
- `habitacion`: se borró el tapiz sobre el cabecero.
- `comedor`: la lámpara se separó de la pared (`comedor-front.webp`) para que la obra quede detrás de ella.
- `tarde`: se borró el marco vacío de la pared.

Para sumar un espacio se exportan `{nombre}-1200` y `{nombre}-2000` en JPG y WebP, y se agrega una entrada en `js/room.js`. Si la pared se ve de frente basta `flat` (ancho en cm y zona de pared). Si se ve en perspectiva, `wall.quad` son las cuatro esquinas en la foto de un rectángulo de pared con medida conocida (`wall.cm`); la obra y su luz se proyectan con esa perspectiva.
