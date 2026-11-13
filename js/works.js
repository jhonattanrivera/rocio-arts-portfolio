/* Catálogo. Los títulos son los de cada obra.
   Las descripciones son una lectura de la imagen: se pueden editar aquí.
   Ficha de comprador, lista para completar. No inventar valores:
   si el dato no existe, queda en null y el sitio no lo muestra.
     year       número o texto
     medium     técnica, por ejemplo "Acrílico sobre lienzo"
     widthCm    ancho en centímetros
     heightCm   alto en centímetros
   tone es un color derivado de la propia imagen, para el fondo de la ficha.
   widths son los anchos reales de assets/media/works/{id}-{ancho}.webp|avif
   (el JPG de respaldo está en image, y en los anchos menores). */
/* showAvailable: true vuelve a marcar las obras disponibles, el filtro y la página Disponible. */
window.SITE_FLAGS = { showAvailable: false };

window.WORKS = [
  {
    "id": "serenidad",
    "title": "Serenidad",
    "description": "Un perfil con los ojos cerrados. El cabello se disuelve en rosa, naranja y azul, y una flor pequeña queda en la oreja.",
    "image": "assets/works/serenidad.jpg",
    "thumb": "assets/works/thumbs/serenidad.jpg",
    "w": 1667,
    "h": 2000,
    "available": 0,
    "tone": "#d0aeab",
    "blur": "7.sp+up6azmr/TwJeg43l00YKFk8LgmqKXmZqQkLC4fKrEwoiVtJ+oxJiWgJWyr5elpKCeoJ+sx3+HurLLpJOrfZS4roWKtaKQw4eMvpWWtpGSiK7YknqQdJ+8lZKrlX2Lh4+qooOKn6DGbn+nZICrcpnGk4yQrYaOtX2JnKK+fo24b5zMeJ/HpK3BkpCcd4i7Tn3lmnWXdoi+m4uemKa4iqTCkY+Yg5DR",
    "widths": [
      640,
      960,
      1280,
      1666
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "colibries",
    "title": "Colibríes",
    "description": "Rosas, tulipanes amarillos y flores violeta en un jardín verde. Dos colibríes cruzan el cielo.",
    "image": "assets/works/colibries.jpg",
    "thumb": "assets/works/thumbs/colibries.jpg",
    "w": 2000,
    "h": 1734,
    "available": 0,
    "tone": "#b0beb8",
    "blur": "8.c8eedMqifNCpf9OzjNKmqs+IksaAd8uUkp91dKCQea6XYLiMcbyMlbx8caF7WapseJeYooWmvpeZg5t3ZoiLuYRadYyWVIlogI97oIGKhHt5fndmjoSRU2tiU2xbbm+AhX6No56qOGthU3yKUIp9PW9LVH16a5OYtYZOr4p7iZCZY5O3SmiIZIiWpoqLfoBgK4eBU5N9ZG6XdYOzhGmLPIV/Vm1tLE5e",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "amanecer-en-el-jardin",
    "title": "Amanecer en el jardín",
    "description": "Un jardín largo y denso bajo un cielo rosa pálido. Hortensias, margaritas, lirios y flores fucsia, todo a la vez.",
    "image": "assets/works/amanecer-en-el-jardin.jpg",
    "thumb": "assets/works/thumbs/amanecer-en-el-jardin.jpg",
    "w": 2000,
    "h": 1210,
    "available": 0,
    "tone": "#bebaae",
    "blur": "8.0LWazrOe2Lqp28it38u249PAyLun0K+UpIiBZYd5p3FZuaFOyplSvYF+fI51g4lNhoubl4hRk31GgZZ/hKWA1pV9molvko9inXM9Z19fb28+a29Vh21Wj3yIqY5Ql3dce2JTSVtVcHlKe0xSfnJLY2RNcGBkYl4n",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "hacia-el-cielo",
    "title": "Hacia el cielo",
    "description": "Un camino de colores cruza un campo de flores hacia un cielo turquesa con nubes violeta. Una niña de blanco lo recorre.",
    "image": "assets/works/hacia-el-cielo.jpg",
    "thumb": "assets/works/thumbs/hacia-el-cielo.jpg",
    "w": 2000,
    "h": 1702,
    "available": 0,
    "tone": "#b7c4be",
    "blur": "8.Qb/AOcXFNsTCKsLBNMHDUsfKRb++Orq5dtDLcczPXsbLTMDJZa3Ghq23fq+yXbS4prKFlsmue8K6dLjHi6m7naa6qrSul5VZjJx3epeCnrmUroSScI1xqY2AsKJrdmpco6eRd3OJrLFFtqGJiG9SnHBpnXKOk3Ztt55SUX1WoaiIi4ZLcpx5pqBczJ9vppFocVZWgHpViY5SjIV1kJCVjoqFoHyAcG01",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "entre-mujeres",
    "title": "Entre mujeres",
    "description": "Una niña, una joven y una mujer van de la mano. Detrás, un tapiz de retazos turquesa y rosa, con flores que cuelgan.",
    "image": "assets/works/entre-mujeres.jpg",
    "thumb": "assets/works/thumbs/entre-mujeres.jpg",
    "w": 2000,
    "h": 1325,
    "available": 0,
    "tone": "#b3c2c1",
    "blur": "8.Ycisx2l1gpVTdI6WEIO6mZpgr25lVoJocLC9lMXXg7SZUpyvWIq8jrCChKS0doGJmZqzVrDkWL3LW53FbpLBXsi/NI66rY+ysZ1PlrWyjaWdppy10Zepe7KeZIpzhZO6X4uPhZ6tjo1vpKGLmZOEeJmYRX5dTHmF",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "hortensias",
    "title": "Hortensias",
    "description": "Hortensias lilas y azules que se abren hacia los lados y dejan arriba un cielo claro, casi blanco.",
    "image": "assets/works/hortensias.jpg",
    "thumb": "assets/works/thumbs/hortensias.jpg",
    "w": 764,
    "h": 511,
    "available": 0,
    "tone": "#bfc2bf",
    "blur": "8.y8vAzcq+y8e4y8a0xsS6yMW9yMa/wL+0jJqKubm7z8/Fzs3Fz8zGwsfEtrquk6mpiZqFjHZ7jpGiqa+usrOYn4qhoo9+Zm5sfYiGeX10fZGXm5CGm5afiWlgWGRpXmZgZIJzeouBS1F3VXJ+U3J2coJxSFtZUW1Z",
    "widths": [
      640
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "camino-rosa",
    "title": "Camino rosa",
    "description": "Un sendero dorado sube entre flores hacia un cielo fucsia. Abajo, una niña pequeña empieza a caminar.",
    "image": "assets/works/camino-rosa.jpg",
    "thumb": "assets/works/thumbs/camino-rosa.jpg",
    "w": 962,
    "h": 1101,
    "available": 0,
    "tone": "#b4a8a3",
    "blur": "7.YBE3fxJLqjVvxW1v1JCD3aKt5ZuuY1dFcEBJs0ZywU5y02qF0GWO1FyKTWFqi2tOmWhJwmliwWpmy2poqnRgTWBZUk5QNVVIam9RmZE9em9sbm5wUUUye0w+dVxRi3lDo4JFjFY2bW9nVEYzUEg8cVgrpoc9fVlJW1xXa2QwgGI2a2ptZlkvbGsde25FgF08lWc6ZlBSX2ZZSUknWlJQU0g0XVpdflU1",
    "widths": [
      640
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "ramo-de-color",
    "title": "Ramo de color",
    "description": "Una mujer sostiene un ramo entre retazos verdes y fucsia. Abajo, un arco rojo y turquesa.",
    "image": "assets/works/ramo-de-color.jpg",
    "thumb": "assets/works/thumbs/ramo-de-color.jpg",
    "w": 2000,
    "h": 1727,
    "available": 0,
    "tone": "#b7b3b0",
    "blur": "8.I1uew2lmOXyO+DZWZZRVx2e1zV+pOmioN2Guvmx2XnmLxF12XKqBwZmhpJB0V25ma3CYi4Kze4lgO4WeooyRupJvgIZhtmlYdF1Sg6OdbKpeLYmN1XOGsI+JeZ6hmmg8jTg7s3l1p5pxgYprkZpnmaqWmLGdinZBelhwc3GPk21KsWZEu4xigJaHg2JTzU5LgVxebnOGoHVTxGlEeXBpa3pttmZ3jGNI",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "bruma-floral",
    "title": "Bruma floral",
    "description": "Flores suaves, rosas, amarillas y celestes, que se disuelven en una bruma gris perla.",
    "image": "assets/works/bruma-floral.jpg",
    "thumb": "assets/works/thumbs/bruma-floral.jpg",
    "w": 2000,
    "h": 1180,
    "available": 0,
    "tone": "#cdc9c2",
    "blur": "8.l5GH08ChtrSzzci+ysGlmp6pqqiYsqmjinFxu5ONuZ2QsauUsK+UvZCFmJOVnZ6NkpOJv5qGy5yKw66RxZ17nYtvp5Z7sqCMs6mRy62KpLmoubqUmJ+ahqKTvK6HqpqUqJSFybWUt7aivbKlxaydra2emZmOnJSR",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "leer-contigo",
    "title": "Leer contigo",
    "description": "Dos figuras leen juntas en una banca del jardín. Arriba caen gotas de color y cuelgan enredaderas.",
    "image": "assets/works/leer-contigo.jpg",
    "thumb": "assets/works/thumbs/leer-contigo.jpg",
    "w": 2000,
    "h": 1783,
    "available": 0,
    "tone": "#a8baba",
    "blur": "8.QoI/Sn8zQYx2BXeiObzhU4OqQWRwJHIiVYmMYplrUZinEoa2PMLsXpXCWWqHGXYanV6hhKjOjo7Im32QLo5Va5PEX3+JSIJVuI+6mbWffZGYPZJbPYdOVH6wcIiMooR6pLnEyKy8TqCdSsHFP4WhVYCgdoKV7qPFipmyoJ+rY6TFWL66V4Z5ZIV2WndqZ3+ncX+Mcn6CdHqTZXyFYnZ1b2R3T3JqX36f",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "pradera",
    "title": "Pradera",
    "description": "Una pradera de flores moradas, rosas y amarillas bajo una franja de cielo turquesa.",
    "image": "assets/works/pradera.jpg",
    "thumb": "assets/works/thumbs/pradera.jpg",
    "w": 2000,
    "h": 959,
    "available": 0,
    "tone": "#babdb7",
    "blur": "8.f56deKulZKetX6WoYJqoXp+gV5GZa5CLlo99rKKChYCDdpSCjoWDqpJmkpGNhX5ogZB3p4hzn5ySkJVplZpnhZiNf4NooIWJiIuDk3yAlYqCnXNytI92b4FknHJtfHhZ",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "hermanas",
    "title": "Hermanas",
    "description": "Tres niñas caminan de la mano entre muros de retazos, lunares y un arcoíris gris.",
    "image": "assets/works/hermanas.jpg",
    "thumb": "assets/works/thumbs/hermanas.jpg",
    "w": 2000,
    "h": 1545,
    "available": 0,
    "tone": "#b2b4b3",
    "blur": "8.KqiaRnxbxElCxV9gMGBxe2BlZ4lcIZV/qXyBWIZtmXRvr3d/MW6D1HVsd4JBh0tSaH+jr4lsXn+agqCjSomUpqKccohzjTZSTnmqtZqPsoGMbn6FqYqKn5CbhYuOgX59goKFY6G+gnJyg4eRZ3hjin2djo+MtX6CiINUbIqXcGlgj1lbOXdodGiUeZB1g3hh",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "campo-rosa",
    "title": "Campo rosa",
    "description": "Un campo extenso de flores rosas y magenta bajo un cielo claro que gotea.",
    "image": "assets/works/campo-rosa.jpg",
    "thumb": "assets/works/thumbs/campo-rosa.jpg",
    "w": 1664,
    "h": 1118,
    "available": 0,
    "tone": "#cac3bd",
    "blur": "8.1cCuw72gy8ST08qf1s6tvsGiwaqWzMKbuaKYt5+bwK6Zsq+NtaWQuqeNrnyDiYp7pY2MtoiLopuKmZeIs5aMuZWJnIt6r4Z9nJeKno+AnXt2upKDqYWDnoGHqHBuhnRnl36AeYR0mm1qinVrmoF9dWlch3d0eWte",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "ella-florece",
    "title": "Ella florece",
    "description": "Una mujer de perfil, trazada en blanco, sostiene un ramo. A su alrededor cuelgan rosas, lunares y franjas de color.",
    "image": "assets/works/ella-florece.jpg",
    "thumb": "assets/works/thumbs/ella-florece.jpg",
    "w": 1479,
    "h": 2000,
    "available": 0,
    "tone": "#b1b8b8",
    "blur": "6.Ln+iloCGhp+wbaOLs7BPSZI6xKqciaGhc668e6aTnKhpk31xnqSqWqGgN6S9sIGfdoarS6OxZ3+XbqSlLZS/yGeXmIWplqNkfZybb5uTVVuDy4uvmnObgmZtfZ2wYrK8XnjEkY+cb32BlWBjkoKRi42bjYCteYKNcoKPgGpYe296gJCLY1xgZFVaYWRpbnBn",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "rosas-sobre-turquesa",
    "title": "Rosas sobre turquesa",
    "description": "Rosas rojas y flores silvestres crecen sobre un fondo turquesa, entre tallos oscuros.",
    "image": "assets/works/rosas-sobre-turquesa.jpg",
    "thumb": "assets/works/thumbs/rosas-sobre-turquesa.jpg",
    "w": 2000,
    "h": 1745,
    "available": 0,
    "tone": "#a5b8b4",
    "blur": "8.Y6yuQtDTPtLTO9DLKdDLKczHPbu4eFhIY355bbLAcp+WP9fRN9TOTLu7Y46dmzpHVo2KjWt0Z4p+PJyOSaSNXYNpZ32ATFtvdHdoVIBrX4h1gG6HZo6PRZp9U5GOVFViWYRqZpBjZH5wNXyNR4heTYBnRHdiilFUeY1znmpbX4JGYntojmZzXnRzYopgN2pBMIh7XnJoXIF9gGyGPW1Zf4R2WHdWfHJg",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "de-paseo",
    "title": "De paseo",
    "description": "Dos figuras y un perro pequeño pasean frente a un tapiz de flores y franjas turquesa.",
    "image": "assets/works/de-paseo.jpg",
    "thumb": "assets/works/thumbs/de-paseo.jpg",
    "w": 2000,
    "h": 1091,
    "available": 0,
    "tone": "#b1bbbb",
    "blur": "8.HI6y1F52835PmIGKGq2r+FdbsWxdBWuHYnOlnJKubZ2igomFvle2nX2aV4+aKoymFH+lg6nFfZmXgaWKeX+xeo+hXKl4VYWfTnxrhGxPdoZ+XZl5cYF8k5WEf6GEjXtT",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "nina-de-las-rosas",
    "title": "Niña de las rosas",
    "description": "Una niña con un ramo camina entre rosas rojas bajo un cielo turquesa.",
    "image": "assets/works/nina-de-las-rosas.jpg",
    "thumb": "assets/works/thumbs/nina-de-las-rosas.jpg",
    "w": 1582,
    "h": 1335,
    "available": 0,
    "tone": "#b6c8c5",
    "blur": "8.Y8nEWLquatnrY9b2Y9X3XtD2WM/qV8rZWKSUR6mNbNvtXNn4Xdr7Ztb1XMjmTsXRgZeAr4abecvYTdPyzr65xpyvnLq1lH9bcJZzsoJek5+LY8GysK6ivaKer6ZswYF7tItyo6RvrJGBcaySUqKBa5Z9ipmTi4+NaoFel7CUX5N4fqKvaYeYN4KThXhbbIdSWn9ZhqOSeJV7UpWFfIuDhpRpa2dmUXxd",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "la-puerta",
    "title": "La puerta",
    "description": "Unos niños suben una escalera blanca hacia una puerta abierta en el jardín. A un lado, un arcoíris.",
    "image": "assets/works/la-puerta.jpg",
    "thumb": "assets/works/thumbs/la-puerta.jpg",
    "w": 1386,
    "h": 1163,
    "available": 0,
    "tone": "#b2b7a9",
    "blur": "8.QXIHPplPWZGk2YxK/4Ivl5SMM4gjMXMAQ4Qfeqtxh6WlmoZxyG8sxXdvS41Fg5MlN3Ysg8Kal7CyGpqVPXgUqmhKZoh/jbauPG8bkquFkZOAIZy5OMW1qYNtnolngJ+cfIFShYlwql5HlVNuuZZ8p59uI5Co1Uxgc3VTmGFkzVqBs3JspY93mqp/GZa3p1dqYHJZlWNlk3F3aHBRUnZWXnFaT2xRT2VW",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "primavera",
    "title": "Primavera",
    "description": "Un prado verde y amarillo con flores sueltas en rosa, rojo y azul.",
    "image": "assets/works/primavera.jpg",
    "thumb": "assets/works/thumbs/primavera.jpg",
    "w": 2000,
    "h": 1413,
    "available": 0,
    "tone": "#bdc8b3",
    "blur": "8.6N1n8eNM1uJiyOBuxt16tNJ5r9F4qsh1tcWJqcZwn8Z5fsaAhr5+t6dQic54frxniKdkuZh9n655mLyNm86dnKZ7sKxzkJxOjaODt6eCcKqVepp1eZlqk4VYY4RtbodsXaF1fKt8oJFsiJZ+dptvgH5ZVIRdRH5abYZdYXpxaoVxb4liP3VHXXlUOm5LMGxJ",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "nosotros",
    "title": "Nosotros",
    "description": "Una familia de cuatro, en blanco, se toma de la mano sobre retazos azules, rojos y dorados.",
    "image": "assets/works/nosotros.jpg",
    "thumb": "assets/works/thumbs/nosotros.jpg",
    "w": 2000,
    "h": 1738,
    "available": 0,
    "tone": "#a9b5b6",
    "blur": "8.D1mb0Yg6el0mo4BtbYd5rmc+qnIyAD15NGmrtJhsfnptoIx8eJiLpGhan2lEE1ODy3KYQr/BHJvAQYyuYoyxSYCdVm6GkomrxZ1fTbS5Qn6phZS7g5jBYm9+EYuNapV5+IxYa5WPP5jCe5fXPovhY6/YtoF5d3lgyoqEgaCwT8XZDo3AGW/bQXCaxmJSioCJZYFVfYNSVIhrW4lub29IVnpbYGRNinZB",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "jardin-secreto",
    "title": "Jardín secreto",
    "description": "Un jardín vertical de puntos de color, rosas grandes y tallos que se cruzan.",
    "image": "assets/works/jardin-secreto.jpg",
    "thumb": "assets/works/thumbs/jardin-secreto.jpg",
    "w": 1613,
    "h": 2000,
    "available": 0,
    "tone": "#bdbbb3",
    "blur": "6.k5utqaGenJyKtXhPu518urKQqKOktpyMmoxsfn5yrZh6sZmAe4twkpt/h5iFbHpYfZh3hoV7enRpYoZqdZJlU3hbWX5toYWAvoKRbpSfWG1xU3dytp2hsHp0n4drtYGRbGmXd4mXmqN4vJCEsZR9u5WRsrZeup1Au41SlHtwhYNhiJJ1fZ5QwH1mqn1qelpG",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "hogar",
    "title": "Hogar",
    "description": "Padres, dos niñas y un perro, trazados en blanco, frente a un muro verde de flores y retazos.",
    "image": "assets/works/hogar.jpg",
    "thumb": "assets/works/thumbs/hogar.jpg",
    "w": 1582,
    "h": 975,
    "available": 0,
    "tone": "#aabbbd",
    "blur": "8.asuscKCeVZrMunN9I3qQ1mWHL2d+JY9vVsLBhaiLZaPFd6WsKn6ijHCIKXeLLIeATpK7baS0bKrJY8K7TIqidpaMVZSjU2F1bZGfc5iYmK6qe7O7epqsd46PhGZ/ZHBee4R6lYJ8e497dJBua4J0b3ttTWdjaltM",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "luz-de-mayo",
    "title": "Luz de mayo",
    "description": "Pinceladas amplias de amarillo, rosa y azul, como un ramo visto muy de cerca.",
    "image": "assets/works/luz-de-mayo.jpg",
    "thumb": "assets/works/thumbs/luz-de-mayo.jpg",
    "w": 1521,
    "h": 2000,
    "available": 0,
    "tone": "#cbd1bf",
    "blur": "6.bcqt5bC1y4+Wt9h8qd+LhdiXtcKj8MzE68uuxMtj1rdTtMuB68+LwL2JxLuL8MVs7L1I38pd9ulbx8Bdyq9+88JW18Iv168o7fB4cpl5iaeuloub7q0mn86YjqxVUazBbJG/eIurv6+TmNG+gsuIcMvSwoikiIiQtqato7OyguTEZufcmMrImXmHla6wi8O8",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "retazos",
    "title": "Retazos",
    "description": "Un muro de retazos con lunares, arcos y arcoíris pequeños. Entre ellos asoman tallos y hojas.",
    "image": "assets/works/retazos.jpg",
    "thumb": "assets/works/thumbs/retazos.jpg",
    "w": 1305,
    "h": 609,
    "available": 0,
    "tone": "#b9bab6",
    "blur": "8.sn1Kv22ATItfxHGoUXiUfYWk0IaFUaqDmm1WhoCNfZNzfIXDj5SYgaW0na+on6l4lV5WjH2Dp6Ske5W0vY9uqIucpJd4npmee4Rqk4d6hI59U4yJhox4r3J0io5zjqKk",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "prado",
    "title": "Prado",
    "description": "Un tapiz de florecitas amarillas, rosas y celestes entre hojas verdes, sin cielo.",
    "image": "assets/works/prado.jpg",
    "thumb": "assets/works/thumbs/prado.jpg",
    "w": 2000,
    "h": 1378,
    "available": 0,
    "tone": "#c0c0aa",
    "blur": "8.lqOBoZ54jJhXj4tdlpJsmpdfm49nrZt0h4pri5hrl6FVi6FasaNpkKRmo5tVkZhZgIZMd4dem5Ffp5hXl55Lo6VVp6Rhp6JUlYRGhYtYn5ROo5dMjpxXqJhGuqBlsKtYbHdVnY9OuKZNiIlNq59lmotNrZNer5VZhntOioVXmpFQn4hTnoxNjZJMsJles6Bf",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "encuentro",
    "title": "Encuentro",
    "description": "Varias figuras blancas se reúnen frente a un muro de retazos, lunares y lluvia de color.",
    "image": "assets/works/encuentro.jpg",
    "thumb": "assets/works/thumbs/encuentro.jpg",
    "w": 1265,
    "h": 699,
    "available": 0,
    "tone": "#b7c1c5",
    "blur": "8.c6mQxoKiMrG7wpNYvoBSYpmbr19fJphZlJmUtrS9c7OyMZveTZTIQqComnp4iZKTopmos7S7gKCqV5rkh57CoIWOdYSahXmUkJ+nkKOre5u8wJKfmJWqjpCrcJWxc3dx",
    "widths": [
      640
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "rosal",
    "title": "Rosal",
    "description": "Un rosal de flores rosa pálido en un verde profundo, de trazo grueso.",
    "image": "assets/works/rosal.jpg",
    "thumb": "assets/works/thumbs/rosal.jpg",
    "w": 2000,
    "h": 1783,
    "available": 0,
    "tone": "#b7bd99",
    "blur": "8.fI0xVWsnT2QIbYgwfpZOsrNXppwpbHQAmqxbmKFLc5BOeZlBf55HtKUrjoohWWUIl69VoK1ZjZU+jZ45xa16u5pogogvVmwciKs8pqlulppToK4moZlMjYlNe5ImYX8jkqcyn5Vekp43h6IudIoPcoE2lpAsX4MpgZMnfpAwkY47ho4Yh5wsj5NJhYo8X40xlIcSXXYddYQtZYcZe4cjcn8WbYQqPWgi",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "selva-azul",
    "title": "Selva azul",
    "description": "Una selva de azules, hojas y gotas. Entre la vegetación asoma, apenas, un rostro.",
    "image": "assets/works/selva-azul.jpg",
    "thumb": "assets/works/thumbs/selva-azul.jpg",
    "w": 2000,
    "h": 1090,
    "available": 0,
    "tone": "#a5b5b9",
    "blur": "8.d2tkVWt7SXFuOXB/NWt9RGh2V3WRdXt1Z4F2nayTbJWSXqOzZZandI2CaoChVZuiQW2RXF59e5ynUXyOXo6qTJyvYYqDOpOnRYWqTIKYUnmKL3mHWoKTUo+8dZOhRYSO",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "floracion",
    "title": "Floración",
    "description": "Flores color vino y amarillas abiertas entre hojas, de pincelada gruesa.",
    "image": "assets/works/floracion.jpg",
    "thumb": "assets/works/thumbs/floracion.jpg",
    "w": 2000,
    "h": 1461,
    "available": 0,
    "tone": "#bbbaa1",
    "blur": "8.t55Zi4NVoIZUjodorZc9j3FFnYtbgHguqJRlhoxAdHdBgn89lpdDmY1SlZNOrZFApZhWqJ9pi49Kqo1In5JFpJZbhYBIpZFDrptVdoM8m5RHlpBQhn44gZFbgpBPfItUqY5WmpA5jog+npBLoZdLg4FHgIxNnZxQqpVoi449b38te4FTjH49nZdHkpNLqoZY",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "fiesta",
    "title": "Fiesta",
    "description": "Formas de retazos en rosa, naranja y turquesa, con lunares amarillos y enredaderas blancas.",
    "image": "assets/works/fiesta.jpg",
    "thumb": "assets/works/thumbs/fiesta.jpg",
    "w": 2000,
    "h": 1728,
    "available": 0,
    "tone": "#bbb0ae",
    "blur": "8.X5lhtY9CmYCjr5mO3ngduWFytHBVZIRKnmWXln1b/xtvunCCpXQzuY+VvJBshYpmwmOJeG9UuWiM112cs3p2ZaTDmISB1WF0rW9jV29fyXmj5FKywHmTYZi/Y3mNwk5gP5DDclo342eLu0p4g2wfunWilmh/j15GX4mvqXiDa5t/Sqa0pnAzxGx7jmNNXHxodY9mlI5wcplkcot0gHU3hnRogH1af35E",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "marilyn",
    "title": "Marilyn",
    "description": "Marilyn de frente, el cabello en oro y los labios en rojo, sobre turquesa y carmín.",
    "image": "assets/works/marilyn.jpg",
    "thumb": "assets/works/thumbs/marilyn.jpg",
    "w": 1162,
    "h": 1137,
    "available": 0,
    "tone": "#eddd9c",
    "blur": "8.zSEUymkgz5pB5sNk8M1p9MJPaaCxDJrDrTgr6MFn3K1K9tq29t3D88tquKltL3momkQd8NV0zLJ91cOy5tzQw7ul6MJbdmiRm2c97diP5cqR4sm76tHD3ce359BvYpWGtIlD2b126q6B4LimypyT7M+k59eIkYZKeWlX38aT0b2R0qGi18fDwKF2ysaOoGxAiU1G24lYq551fFNtlWiAgFxUc5WHl1FHJ0ZLWUJPU1VnQVRgY1hxQFhnRlx5UDpw",
    "widths": [
      640,
      1162
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "ocean-eyes",
    "title": "Ocean Eyes",
    "description": "Un rostro en calma. Dentro de los lentes hay una playa entera: cielo, mar y arena.",
    "image": "assets/works/ocean-eyes.jpg",
    "thumb": "assets/works/thumbs/ocean-eyes.jpg",
    "w": 1242,
    "h": 1467,
    "available": 0,
    "tone": "#e0bdac",
    "blur": "7.enq4a4a/qpqltIebrnOXd4e+b47Ed4K5qKGc37CW6LmdxqeZcqW5YaTPeWWieqXNhbjbsqawj8XliZO6mn2nTZrEoZSNyKCM25R5xbOih5qvSpvHemifjXef256FyHVf3KGOZYK6aY26nGODGFW8uYBuz5eCs2p8HofAVKjVSXu5SUaXvZWHxJGOn4yQLZTKoV+HbGKcXVmCm118jWV+U4K6dJK5s1uX",
    "widths": [
      640,
      1242
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "summer",
    "title": "Summer",
    "description": "Un retrato alto. Los lentes de aviador son crema y oro, y debajo aparece una ciudad de árboles y arcos.",
    "image": "assets/works/summer.jpg",
    "thumb": "assets/works/thumbs/summer.jpg",
    "w": 1112,
    "h": 2000,
    "available": 0,
    "tone": "#eac1a9",
    "blur": "4.k4KGbY96nYN2WZCUn4Rv35tm6p1ijXt5qbeQyL6OurKLwJKAi5OO6KeC6aV9toN7wXh84otk245im4x+cICnyHBr4odiqm+K5lh0lpKQfo+ft3GPx11wvFtTHGmQs11w",
    "widths": [
      640,
      1112
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "el-camino",
    "title": "El camino",
    "description": "Una niña de blanco, de espaldas, con un ramo. El paisaje es rosa y turquesa, y en una nube hay una frase escrita a mano.",
    "image": "assets/works/el-camino.jpg",
    "thumb": "assets/works/thumbs/el-camino.jpg",
    "w": 2000,
    "h": 1733,
    "available": 1,
    "tone": "#9eabb9",
    "blur": "8.PWR3RmWDOGx5/1mj+FujpTlMX1ZUTERFZ2WBfU1rKIaJno9sunJ3r36I25pNZVJd9WOK2T5eN5uhqKdiT3l+hp2f0aiKmFtnw2eHtj9dpHuAaneQSniQgYGDy01aj1l0fFxmf2eQvqKojoKATDlMkD5Kykh3d3B4n3puXXB8e4qXnmBmgE46SGpei01tp2d6noKChXakgnCdq3mGfHV3fmx5X2F8YmJF",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "junto-a-ti",
    "title": "Junto a ti",
    "description": "Dos personas vestidas de blanco van en bicicleta, de espaldas, tomadas de la mano. La ciudad alrededor es pura mancha de color.",
    "image": "assets/works/junto-a-ti.jpg",
    "thumb": "assets/works/thumbs/junto-a-ti.jpg",
    "w": 736,
    "h": 541,
    "available": 0,
    "tone": "#9fcfc9",
    "blur": "8.sZugo3VthJmZpZiiU5aRoXprfXN1nnJZoZOTgoZuwqV+i8y7k8O2vrKgj416uXBktKFxsoaN0LiCnLqQlKylq5SUjHl2kG5Wrp2F0LJWnKeTlY+saY+Rj4R2k4pvfnNxh7qxgbazdZecjJyZdpSLh2RilJB7iGx9snlqtGlrkW1xgXhscmRqY09UcWlgWWp1",
    "widths": [
      640,
      736
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "flores",
    "title": "Flores",
    "description": "Un ramo denso, casi redondo, en un jarrón blanco. El muro es gris y la mesa, azul.",
    "image": "assets/works/flores.jpg",
    "thumb": "assets/works/thumbs/flores.jpg",
    "w": 952,
    "h": 989,
    "available": 0,
    "tone": "#70abbc",
    "blur": "8.mLfMl7G4rL+0kKWynKm3hqK5l7vWjavGiKS2mJubl45/h4mDlYeEkJihlrDEpK/HqLCInpl0b3OAlnRwe4mbqX93l62XvMqyipWwa4iJf4B9gHl1j3J5k4JviKWuobfPhqK5faKvgnRxi2pqfXiEi3GHi6++oLzVhpy2dp21eYudkoCAl4N/dIumepm2hqTBH4KoF3SbGWiNioyQkpWjE5a9G6LFIarVOZyvP4+dNXCMLnCHG3mgGn6nLnWXCoyy",
    "widths": [
      640,
      952
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "cidade-maravilhosa",
    "title": "Cidade Maravilhosa",
    "description": "Río de Janeiro: el mar abajo, la ciudad en blanco y los morros cubiertos de círculos de color, con el Cristo en la cima.",
    "image": "assets/works/cidade-maravilhosa.jpg",
    "thumb": "assets/works/thumbs/cidade-maravilhosa.jpg",
    "w": 1165,
    "h": 937,
    "available": 0,
    "tone": "#6ebbca",
    "blur": "8.AI+sEZS5Cpe4AZe4A5O6AJS8Mn6GAJu0KYqfIJG0AKLSB5XQBInQAJ/LmVtLTomXkYFofmBdTYCTVXiNDnyyWYacplo+lGQ+r4Rgq2Uuq1EbgFw9jVtMn1c9s18tk14zr5mNnYmApIl3s5V+nop4o4h4q5N9j39pJFqVEVmfDFmfDk2RGlaRCEuMAz2DESlc",
    "widths": [
      640,
      1164
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "abbey-road",
    "title": "Abbey Road",
    "description": "Cuatro figuras blancas cruzan al paso de Abbey Road, contra un fondo de magenta y verde.",
    "image": "assets/works/abbey-road.jpg",
    "thumb": "assets/works/thumbs/abbey-road.jpg",
    "w": 993,
    "h": 807,
    "available": 0,
    "tone": "#ce7a7c",
    "blur": "8.1Rkjj1ZTSpOW+0CEuT+IekKNRCiua4ZCpT9CpzY4s1ly1jFaoFJdsVZS1kR/jYAzmkpUokYu0Tk9vlBUoWRa2FpVqnKAxZWNr6ayd1ZldGxp2pqgoXdlz4WVv1l44c3KtaeyhmSDpmty18XEx4uQ25qiq2515MPIl4qKpX+BvZV7tpqcs5iXtZ2kjG97wbe9fHNuinxxv5d7eHV2voaYjX+EqYiatnyV",
    "widths": [
      640,
      992
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "verano-memorable",
    "title": "Verano memorable",
    "description": "Rostro con lentes de aviador cubiertos de oro. Arriba aparece love y, abajo, let it be.",
    "image": "assets/works/verano-memorable.jpg",
    "thumb": "assets/works/thumbs/verano-memorable.jpg",
    "w": 1654,
    "h": 2000,
    "available": 0,
    "tone": "#cfab9c",
    "blur": "7.rIe4hp3SdI7CeJXVm3zBlJykgnnKkl6OzZevt7u93qWftoabwnWgqWZ6fIym0LOgwqyV5ZSfxaKXt46KkGabWYOstMamwr+Ou5SAo6iFpp+HXmmJR3mnsZOYzpOEyId4v5CFtnN5YmWKfGV4qm9sxod1qWFWwZeXl2dscHF3j1yaaFmBrG9ctYyTs2JRR2mWfn6yaDRgbVJmnYOMZZvHkKK+ZVV3eXK+",
    "widths": [
      640,
      960,
      1280,
      1654
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "the-crown",
    "title": "The Crown",
    "description": "Dos perfiles coronados, el rostro pintado con la Union Jack, y el skyline de Londres a los pies.",
    "image": "assets/works/the-crown.jpg",
    "thumb": "assets/works/thumbs/the-crown.jpg",
    "w": 985,
    "h": 985,
    "available": 0,
    "tone": "#8ebdbd",
    "blur": "8.JbK6dK+geqqVUWViUFpWc5+RkrKUpLeVOqettbWL16Fngop9WW1ss6+Wt5NhoK2LULq+b52evKGwhJ6cXIKFh5ecq6GolqmSZLGyoKGkr52iiamieZCHZZ6Xr41/aKmdZZGSwMDMwb/Ih5Wao6F+tqx40aVWtZ1fdZ2umKWvmp+miZ2ko5ZqrpReqIZLnoJLQWh5SVRiYoSQUm10Z3twamhSbXVaY3FVcHyPf4OGW2l5eHd2a3mJbHF2Wml0T1ZY",
    "widths": [
      640,
      984
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "elefantes",
    "title": "Elefantes",
    "description": "Tres elefantes de perfil, muy juntos, con un fondo dorado.",
    "image": "assets/works/elefantes.jpg",
    "thumb": "assets/works/thumbs/elefantes.jpg",
    "w": 1036,
    "h": 450,
    "available": 0,
    "tone": "#ae9c7b",
    "blur": "8.v6yPspZnrX9ItYE7rn9LkX1qvaBvyLuoinNTdFM/fk46bUg+dkUrZFBVbmNpraOahXhegm1fhm1Oi3pqmHpkqZR5joh+o6KW",
    "widths": [
      640,
      1036
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "forever",
    "title": "Forever",
    "description": "Una pareja de blanco, de la mano. Ella lleva un ramo. Detrás, una ciudad en fiesta.",
    "image": "assets/works/forever.jpg",
    "thumb": "assets/works/thumbs/forever.jpg",
    "w": 1600,
    "h": 1334,
    "available": 0,
    "tone": "#6bd0c9",
    "blur": "8.FMrKk5WetFlmxomR5Ftz1lFR61lICIawr45wtJtzhJZ2opOjnmt/wrmHt3tad4N1omVgp8Mqzqx9jau0cpmtr8S1LLyugISNjmZQe4t5qqScoriwfpCXtci4YcKcklpZVFl3jX4ScrqwjsS8pWFT1bKqfoGZUWyLm4YVh5owoJyBp7SnoJV/yXFifW5rgZ2eYVxmi0s9oIx9k6KeoqaAjGhmV4NIcnhc",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "40-graus",
    "title": "40 Graus",
    "description": "Una playa bajo el sol: sombrillas rojas, mar turquesa y un morro al fondo.",
    "image": "assets/works/40-graus.jpg",
    "thumb": "assets/works/thumbs/40-graus.jpg",
    "w": 2000,
    "h": 991,
    "available": 0,
    "tone": "#67ccda",
    "blur": "8.AKv1AK73AK3xBJfMSW18AHyrJHqkDHecH6/nHqriFZG8LJG1A5CwRJawqJaOo4d2AMjtAMfwN8PifL7KobCoq52Km1pDp25IjpieoIOKr1JPsGFRmDk3gVVUcCwriUAx",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "girasoles",
    "title": "Girasoles",
    "description": "Girasoles y flores pequeñas en un jarrón de vidrio, sobre una mesa oscura y un muro gris.",
    "image": "assets/works/girasoles.jpg",
    "thumb": "assets/works/thumbs/girasoles.jpg",
    "w": 919,
    "h": 1024,
    "available": 0,
    "tone": "#727b87",
    "blur": "7.orzdpr/fobrcjanQgaXOb5bDbJXCp77aobjQuZ+LloeIqI6EcIymZoy0m7rSpZWFkGxDg2hWoG44mnRcZ4WpoL3QrJVqmn9NrHQ4lWFCjG5NaYWpscPUqJiBem9Nh3BHo3dKZXKEXHmgt8jXpLbGbHJua1xFXFxrUm6UWHWbc4CNXXCBb2hql4NwQUhZKD1aKj1bLj9eLzZPHSxEFidAGDNXHjBJFydF",
    "widths": [
      640,
      918
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "cristo-redentor",
    "title": "Cristo Redentor",
    "description": "Los brazos abiertos otra vez. Ahora la figura está hecha de casas de color, sobre un cielo verde.",
    "image": "assets/works/cristo-redentor.jpg",
    "thumb": "assets/works/thumbs/cristo-redentor.jpg",
    "w": 955,
    "h": 658,
    "available": 0,
    "tone": "#6cccce",
    "blur": "8.GLrFHLS8AMvbANPlANbfAM7jAMvnAMXbTaKgdoeHAMHTAMTiAMDXAMXPAMnYALzNZ4OEhnhxIJahAK/BAK+5ALW5A77OALDCkGpdh3Bfom9Zi3deeXNrWn58YHV4OnyKfGFphWFad29ahWhbbmpqc2tmVWVzAH6YiWRKhnBVSWxzAIWTAISWAIySAICSAIWX",
    "widths": [
      640,
      954
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "family",
    "title": "Family",
    "description": "Cinco figuras blancas tomadas de la mano. Entre el color se lee united.",
    "image": "assets/works/family.jpg",
    "thumb": "assets/works/thumbs/family.jpg",
    "w": 1024,
    "h": 538,
    "available": 0,
    "tone": "#6fa0a8",
    "blur": "8.TmiHo2qLmp+hbn2JvmKDpKeWWnJ1BW+It5ZvcIqUoZOXP3yVUXyTnJyqi3N9mYdzXpmXdJSjgJ+lYKmjlYybq4ymbHeMppKdc2FicZKbn4uPcnyBkHWNeYSLh3uDdHRY",
    "widths": [
      640,
      1024
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "take-my-hand",
    "title": "Take my hand",
    "description": "Una pareja tomada de la mano. Ella lleva un ramo. El horizonte es ancho y está lleno de color.",
    "image": "assets/works/take-my-hand.jpg",
    "thumb": "assets/works/thumbs/take-my-hand.jpg",
    "w": 2000,
    "h": 1033,
    "available": 2,
    "tone": "#6caab9",
    "blur": "8.7yRb9RdUTHlqpmNkpmBvzIk1Rnp+EXB/vEpd3mdAPXqXlpSeeoOYlYuNEHiaAG+La3Z0g3CHgGl0ipKeXoOkjGt+jmJ+e25zY19bgl94cl5wi2FdVGt4h3KBem1+g1Zn",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "lazos-de-amor",
    "title": "Lazos de amor",
    "description": "Elefantes de varios tamaños, juntos, el cuerpo abierto en manchas y chorreados de color.",
    "image": "assets/works/lazos-de-amor.jpg",
    "thumb": "assets/works/thumbs/lazos-de-amor.jpg",
    "w": 2000,
    "h": 903,
    "available": 0,
    "tone": "#bdad9c",
    "blur": "8.u8DItrKxxr2xyMrRx8vWw8TCoai0y9HVt6qxy6RuyK+Bz7m1vrSxcYKLjHh2t7S4urq7sYdmqpF9sJGMm4x3aHR1gX14x7+8wL27ooZrnIZfmH15oHRmg2pnnnJjwLa5",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "vibras-de-playa",
    "title": "Vibras de playa",
    "description": "Un rostro al sol, diadema de flores y lentes que devuelven el mar.",
    "image": "assets/works/vibras-de-playa.jpg",
    "thumb": "assets/works/thumbs/vibras-de-playa.jpg",
    "w": 581,
    "h": 712,
    "available": 0,
    "tone": "#8cc0cc",
    "blur": "7.wXNkxXaN5ZZ66JSR/3t9/19nmrG802NVy3Zo0ZSF5KuH9Z+K3H15r4aNnWV+p6OmscbHzayWyca+v8XJzmaGqYWHgKCnb7W/3amVequ5erzLeIakxUljz4OB35+M6bKg8qSS04SGsG+as2Z2gIOX2JSG0W9yyJuWfoujmZ6k1DlWaXmMlWNqlYSPfWh1Q6bHy2KCjmt5c2yCuIKCg4WGenNcpo+IsGiQ",
    "widths": [
      580
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "my-love",
    "title": "My love",
    "description": "La pareja camina de la mano, más de cerca. El azul del fondo tiene una lluvia de líneas doradas.",
    "image": "assets/works/my-love.jpg",
    "thumb": "assets/works/thumbs/my-love.jpg",
    "w": 2000,
    "h": 1730,
    "available": 3,
    "tone": "#6ca9cb",
    "blur": "8.OIO0JYC2Z1B9jF9fwYBSjoKNJHi2F3O2JpbKP5CrdnJZnpuTunlxiZa1AHzUAHXIKr+5Oa6clZ9xdKSgfperkrS3ZXqEInaIVnd9YIeRe46PX4+hhrq2gsK4qYdev1FzYXaPsVtyz45vo6GknVlWgYSWVVNgTXyIX42LzlJKkIONkI5ttYRQg2tza3k7WGN7Q2xoeGhsU2JulllAh4c5NnVUanRjKVRa",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "meninas",
    "title": "Meninas",
    "description": "Dos niñas caminan sobre una línea blanca. Una levanta el brazo. Abajo se lee love.",
    "image": "assets/works/meninas.jpg",
    "thumb": "assets/works/thumbs/meninas.jpg",
    "w": 1024,
    "h": 788,
    "available": 0,
    "tone": "#abbcca",
    "blur": "8.a5i+aZa/kYWet3qks4+njpulhLnVaMTofJrDioaxvJuYU7bTgLfWj7G8gMLRbMjiy6aMTIuNrsbLi4e0h77WU5OVZ7vAja6xnWyQZGyJtK7KeaTJjdjmVk+EkVx9aIudlHGkpIGRk6+zSLS5WqaqWX24nZq6fKrSdipwlHtkdHyIUEtoTWOedG6wjWqsQ2+6",
    "widths": [
      640,
      1024
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "united",
    "title": "United",
    "description": "Una familia de cuatro, dibujada en blanco y tomada de la mano, delante de una ciudad azul y dorada.",
    "image": "assets/works/united.jpg",
    "thumb": "assets/works/thumbs/united.jpg",
    "w": 1024,
    "h": 624,
    "available": 0,
    "tone": "#6daabc",
    "blur": "8.dJqSoauEa5SvpkqEqZeCqHh5glp7b3+JV6K8YKa0YpO0V3a8FXfAdoGtapK6WmF+cmafh5/BfbbRQXGvHIi5d4Kahaa4fVl+R2qKmJOYYbHMcanGYpOsb6/Ag6SrY2ZjbXqcfoOUdKeaiJ6rfoR/bHNuXXl9clh0",
    "widths": [
      640,
      1024
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "amor-eterno",
    "title": "Amor eterno",
    "description": "Una mujer y una niña, de espaldas y de la mano, cruzan un campo de color.",
    "image": "assets/works/amor-eterno.jpg",
    "thumb": "assets/works/thumbs/amor-eterno.jpg",
    "w": 1600,
    "h": 975,
    "available": 0,
    "tone": "#6cbfcb",
    "blur": "8.6SdxHZjHTZbLl5XJqGZ6tkh2PXW1Eqq2jYC5n155rbzedJ7OoaiiiIy7vFJ8nbdRk4R5g3mkdrvsT77cX6rLDYGvzTkvMneo1UNCfGmca63aj7ugWZqsAD2hfI91Z3ShryVEjkJcP4ehu6knKmqTH0J6ApavAKe9",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "london-bridge",
    "title": "London Bridge",
    "description": "Londres en turquesa: el Gherkin, el reloj, la noria y una multitud al frente.",
    "image": "assets/works/london-bridge.jpg",
    "thumb": "assets/works/thumbs/london-bridge.jpg",
    "w": 1030,
    "h": 643,
    "available": 0,
    "tone": "#80d2d7",
    "blur": "8.LdDiIdHjHNHjDsndDcTXDcHSD7rKEbjIO8PUN7bLFsrgCs7jGNDkF77QIqCxHaKyfYaRbm2HW211R4iZYZGbdY2KTmp4V1tsb3B9e3V+k3ZxYWx0ZVlenW87iWQ0d2JOTkFybUNHX2poTlBYeUxHk2E5jl01g11R",
    "widths": [
      640,
      1030
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "por-do-sol-corcovado",
    "title": "Pôr do sol Corcovado",
    "description": "El Cristo con los brazos abiertos. El cuerpo está hecho de una trama menuda de color, y el fondo es oro.",
    "image": "assets/works/por-do-sol-corcovado.jpg",
    "thumb": "assets/works/thumbs/por-do-sol-corcovado.jpg",
    "w": 1170,
    "h": 782,
    "available": 0,
    "tone": "#e1ca9c",
    "blur": "8.llsauIxB2qIx4KtE6Llk6bVS36U6yYwpimdGm4xz38CE38ys69e9576F4qdH0ZEuXE5iW1xxYXSUXHGaaHqdb32WuJZjy59HXFNpY1hqkI5/rqeOu6qO17Z86MBy0a5iYV9yYl5tmoNWv5lI0ahg4LVe265SxKZf",
    "widths": [
      640,
      1170
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "mi-ser",
    "title": "Mi ser",
    "description": "Una familia camina con sus perros. Por dentro, las siluetas están llenas de hojas.",
    "image": "assets/works/mi-ser.jpg",
    "thumb": "assets/works/thumbs/mi-ser.jpg",
    "w": 1600,
    "h": 884,
    "available": 0,
    "tone": "#7fbebc",
    "blur": "8.DbTBKKi02Fxmv2d5Uom2nmliLKqgIZ6UVZaegoaEYYpzfJSsbJyou3RseXWEI3mWimR0x3aJYJqyVYaTgouaXpOakHCBrzpQW4NflXhkum9oYH1Cb25Gk01Tc1tAWGJX",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "floreciendo",
    "title": "Floreciendo",
    "description": "Una figura blanca de perfil sostiene un ramo, entre cadenas, arcos y flores.",
    "image": "assets/works/floreciendo.jpg",
    "thumb": "assets/works/thumbs/floreciendo.jpg",
    "w": 1600,
    "h": 1340,
    "available": 0,
    "tone": "#8cbfbb",
    "blur": "8.mIhqj39rk2RhQDs1RoNwfHqCqKehrHJqn1l6r3VfkH1912J+wYxRwpaJq56VQWp+XJeKkXhkc4ZseYuVt36Axp59v6KkKXl3upahkZF1vXFdoHZ9jnyQqJKTrYuNj4p8omVduEw103RpzJSYsoOBn3Bl05qbxoaCfVVQUWNabomdlaejm2xvm5Zzs31oSFRkb1ZVSGhkioCZf4F7nkVGU4temWNXPTss",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "familia",
    "title": "Familia",
    "description": "Padre, madre y dos niñas, de la mano, entre verde, flores y casas.",
    "image": "assets/works/familia.jpg",
    "thumb": "assets/works/thumbs/familia.jpg",
    "w": 2000,
    "h": 1233,
    "available": 4,
    "tone": "#68c1be",
    "blur": "8.V3k8UXI2gYuL91uZnUp3dnF6h3wtJWEmVHlCkIBjp41vMoCVK4+clY+SuHdkZ10nQpecwXBzfYyXP5SuJ6eweLG8uYCURXCQgnaHfpOOi4CKd6KSeqehfZ2jz2hqdnqLXEpeXG2AclhecoZpZ4lrVnB4XEFnbVJe",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "arcoiris",
    "title": "Arcoíris",
    "description": "Un arco de color limpio sobre una ciudad en gris y azul.",
    "image": "assets/works/arcoiris.jpg",
    "thumb": "assets/works/thumbs/arcoiris.jpg",
    "w": 1600,
    "h": 1048,
    "available": 0,
    "tone": "#6aadbd",
    "blur": "8.ytzflL7Jlr7Dnr+9lLvDm7u+rbO3w9LYo77QFY+uLaG5EJW6b3yEkGpSanR+ta2mo7zOBoStBnypSH2gg2ZJOnqhHqTPlcjds7i4VmluUGhwWm5xUWNnX3+DYXaBqK+1wczMip6ljqSoi5+jl6WkkqOokaSqvsPG",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "elefants-family",
    "title": "Elefants Family",
    "description": "Cinco elefantes en fila, en rosa, azul y verde, contra un cielo muy claro.",
    "image": "assets/works/elefants-family.jpg",
    "thumb": "assets/works/thumbs/elefants-family.jpg",
    "w": 1600,
    "h": 886,
    "available": 0,
    "tone": "#d0e3e8",
    "blur": "8.rN/0veP4weP1t+HzweTzxeDzwN7unOH0iLPIg5y9e46fgqbGhJ6zhHmcmX6ettLnkaa9bnOZdnyYWYitaIKlg3SefnigncTam7rMWnymfIWfV4exXoqne3uagoeloNfr",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "the-bridge",
    "title": "The Bridge",
    "description": "Londres con el cielo en rojo. La noria, el reloj y el puente van en oro, y el río en violeta.",
    "image": "assets/works/the-bridge.jpg",
    "thumb": "assets/works/thumbs/the-bridge.jpg",
    "w": 1157,
    "h": 959,
    "available": 0,
    "tone": "#df807c",
    "blur": "8./0hJ/0VJ/0FB/y8r+SMg+h0d7x0c9hsc/0pP/0tS/0dL/zMw+yQf/B4c7SEd4SIcrndpvGdkuGldq1Y+xyod0R0auzYhozompJt4jYBvkIR3eFpPW0I5bD05dldFeE5Inpd0dVVafGpfTV5fSk9ZRkhPblo+d2FNloSKeVN/aWB+VFNcPlJqQzxeXkVFVk9LTkmWdG2KR0mTd2ScXVeYVD+UYltxRzp1",
    "widths": [
      640,
      1156
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "amor-puro",
    "title": "Amor puro",
    "description": "Dos niños en un columpio. El trazo es blanco y el jardín, un mosaico de color.",
    "image": "assets/works/amor-puro.jpg",
    "thumb": "assets/works/thumbs/amor-puro.jpg",
    "w": 645,
    "h": 424,
    "available": 0,
    "tone": "#6dc0c9",
    "blur": "8.d4rTYnG+qmXHs4OHsKRNfYyjcsO5ZL64dJLBZpbAmY6piZapYoGMeYlvjLKQX6eRcpipIpawbpmgkam4jMfUfpmRapRJfp1LlaOQbKB0a5dUtmtywqljbY+QCKG3Y4OMZJODW7ywVKCIN2VkRXNdTFg6VHlmcnOA",
    "widths": [
      644
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "mi-bendicion",
    "title": "Mi bendición",
    "description": "Una familia camina entre casas, flores y un auto pequeño. Las personas quedan en blanco, como recortadas de la luz.",
    "image": "assets/works/mi-bendicion.jpg",
    "thumb": "assets/works/thumbs/mi-bendicion.jpg",
    "w": 934,
    "h": 596,
    "available": 0,
    "tone": "#aecd69",
    "blur": "8.WnVKR29UrZJW7Es4mnh5aKEAgL0AeccbZn9qXbKrtbOoyFVR5k5oTJ2TgLYRltIkkp5zeru3fbCmrIuMzoqqhK2dWmWlXGK/uZN3faavd4WCspGgzZav0ppxcrzDnLy3MHV6eIFacW49aII+ZpFwooOfV4R1ZGxP",
    "widths": [
      640,
      934
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "mi-refugio",
    "title": "Mi refugio",
    "description": "Padres, dos hijos y un perro, de la mano, bajo un arco. El suelo es un verde de hierba.",
    "image": "assets/works/mi-refugio.jpg",
    "thumb": "assets/works/thumbs/mi-refugio.jpg",
    "w": 1600,
    "h": 844,
    "available": 0,
    "tone": "#69bdcc",
    "blur": "8.MLbJO76/roGERKLWi4eypmdOHsbQMMPGAJbEG6e6kaKvFqHPCpLCl5apcKCgQoypq1+DqFZS5IqlZaO0TJi1iKe9in2O3ldznFJVlIONmJGWVnNdVXNboY2XglBNgHJx",
    "widths": [
      640,
      960,
      1280,
      1600
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "memorias",
    "title": "Memorias",
    "description": "Dos columpios. En uno, una niña con vestido. En el otro, una figura se mece hacia atrás.",
    "image": "assets/works/memorias.jpg",
    "thumb": "assets/works/thumbs/memorias.jpg",
    "w": 920,
    "h": 415,
    "available": 0,
    "tone": "#6c99a8",
    "blur": "8.QLG8rI2ydInSdeD7atv0Oa62OoSgJG2KIJfXjW+oUWyNZsjpVJLORbnRJ2iMDVuD44xrppiKZ4GRpDlkWW28ur2QrHJUhnSLf3Kog7OkP2yid6GvcHOnvWmLPlF0AXug",
    "widths": [
      640,
      920
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "memorias-2",
    "title": "Memorias",
    "description": "Una niña de blanco camina por una franja clara, ramo en mano, con el color de la ciudad a los lados.",
    "image": "assets/works/memorias-2.jpg",
    "thumb": "assets/works/thumbs/memorias-2.jpg",
    "w": 2000,
    "h": 934,
    "available": 8,
    "tone": "#7ea0b7",
    "blur": "8.MXKfJ1+IZSw9aW+MRmd1r3KoHm9SZY+Iz4bBnYXBQpiZUomecJCjh3euNG+ST3WNl1hobGiIUHiEVHaOfZGjqXujMHylu5ezklZvmHePgnSMWFiOammnlFCCjVNylzNf",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "dentro-de-la-floresta",
    "title": "Dentro de la floresta",
    "description": "Una mujer de blanco entra con un ramo a un bosque de formas rojas, rosas y azules.",
    "image": "assets/works/dentro-de-la-floresta.jpg",
    "thumb": "assets/works/thumbs/dentro-de-la-floresta.jpg",
    "w": 2000,
    "h": 998,
    "available": 0,
    "tone": "#6baebc",
    "blur": "8.4X+SjX98l4dj13Nax1hFooh+XWx3Im+L2JOhq4Vmg1FL2U1dwVlroH5dqnaONnKeo6+4bXGKql5Iq2tSgoKDxklOrlZsAISgfGJ0mVRnlj0/qWhNk41cllhNdFtUj1tx",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "mi-lugar-feliz",
    "title": "Mi lugar feliz",
    "description": "Una figura de blanco, con ramo, a la izquierda de un jardín abstracto.",
    "image": "assets/works/mi-lugar-feliz.jpg",
    "thumb": "assets/works/thumbs/mi-lugar-feliz.jpg",
    "w": 2000,
    "h": 1045,
    "available": 5,
    "tone": "#6ca1bc",
    "blur": "8.dqihwIiXiGhwaFuHpm5wx2JfSn55WG1ipaujsq2lY5iPVXicYWh/fG+CdXSFkXOAm4SMlnN0n2Jwrlh2jW1+eWN3t2mLZVJmgWhde3N6RXiBa1Zzl2RzVWFuY2BqX19t",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "urban-city",
    "title": "Urban city",
    "description": "Una ciudad de frente: edificios apilados en azul, rojo y amarillo, bajo un cielo grande.",
    "image": "assets/works/urban-city.jpg",
    "thumb": "assets/works/thumbs/urban-city.jpg",
    "w": 1965,
    "h": 2000,
    "available": 6,
    "tone": "#6cbcc8",
    "blur": "8.AIOnCXucG4eiCoWiCIupBoupEoyrDoWkAJm9AIGhApu1AJq6AJ/CCZy9B5m9AJW9NJGrF6W+E6zFAqzJAK3PGqnOJ6LDNJm7inV0a2x9d4WRZIuUOpGrcZakXXBqcUthg3hVgGBvknl0X3iCeXx7j3SEel9Cemxon2tPZ214hISSfYpfdXeJhlpebI2CZnd1SmNueH6FeIiJjIx5SWByinuQMmZ6YX2IPWJoOYKKSWJxblVcaGxzVGlxPFxpPnuI",
    "widths": [
      640,
      960,
      1280,
      1964
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "abstracto-azul",
    "title": "Abstracto azul",
    "description": "Azul, círculos y líneas, sin una figura que mande. El gesto queda suelto.",
    "image": "assets/works/abstracto-azul.jpg",
    "thumb": "assets/works/thumbs/abstracto-azul.jpg",
    "w": 2000,
    "h": 1339,
    "available": 7,
    "tone": "#9fdcdb",
    "blur": "8.ZpGecZCRja2wYYWSa56atop4RYWGRZKjdoaAiZeXd7S8XJKpi7zCWre5d7SlrMjQWsa9abHCk5SJSLnClqKocbG5dXOYa4BloKyDlqS1gpvFZMW4ZZ/Ge3NzuKiRR6i4fr+EecGzVKfAX3Vjc09Wb2dXmoWNQ7TT",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "otono",
    "title": "Otoño",
    "description": "Un lienzo vertical, casi abstracto, de verdes, amarillos y rojos que caen como follaje. La foto la muestra instalada, con marco dorado.",
    "image": "assets/works/otono.jpg",
    "thumb": "assets/works/thumbs/otono.jpg",
    "w": 1280,
    "h": 1600,
    "available": 0,
    "tone": "#eae0cf",
    "blur": "6.482w6di46Nax7Nqz69m459Kw4cyv2s+z1Na7zb+X7Nu56NSx4Mqt18isgZyDuJxN7Nu56NSx2sWp4tO6SkgopIVb6tq659KwwayQ697Fj3M2o5Bo6NvG49G6eGtT1sWspph+ppBz5trM4dPFupt7nY6IsqaYy7+14NLF4NPH5MuyuaeatJqEhX6Hv6qa49PG",
    "widths": [
      640,
      960,
      1280
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "amor",
    "title": "Amor",
    "description": "Cuatro figuras blancas tomadas de la mano en un paisaje azul. En el color se alcanza a leer love.",
    "image": "assets/works/amor.jpg",
    "thumb": "assets/works/thumbs/amor.jpg",
    "w": 508,
    "h": 258,
    "available": 0,
    "tone": "#6ca0ab",
    "blur": "8.Z62uYJqYS6yiD5yado2sarG+DnCXAXWSoMW6iaydlaW7XJmhPm6TLISXFXF/KHKIma6upsTDiayxnrewnMO/fpmacpKmgJeqaJiygJWrXn2hboyaa5KlTJucPoGnSm6O",
    "widths": [
      508
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "oceano",
    "title": "Océano",
    "description": "Una pieza muy horizontal, hecha de azules, como el agua vista de cerca.",
    "image": "assets/works/oceano.jpg",
    "thumb": "assets/works/thumbs/oceano.jpg",
    "w": 2000,
    "h": 923,
    "available": 0,
    "tone": "#6f9ecb",
    "blur": "8.eoWvYpTBaJiyYZC4Z4qpa5iiY5OXYXynTGqUQZ/PKoW3Q5K6J3+2Ana/C4bLQ2vJLkBnCXHZAHDXE3zeB4HdCXHTE2bESlyrko6Oh4SOnp6roaKzioygl5yvrbK9p6av",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "sin-titulo",
    "title": "Postal de Londres",
    "description": "Londres en un solo plano: Big Ben, el London Eye, Tower Bridge y un bus rojo, apoyados sobre la bandera.",
    "image": "assets/works/sin-titulo.jpg",
    "thumb": "assets/works/thumbs/sin-titulo.jpg",
    "w": 1163,
    "h": 952,
    "available": 0,
    "tone": "#9fd0db",
    "blur": "8.ksjcls3iVbvZYMrrmdbrvtXglczdj9LnY7DJYbvVQLbYccrloszbksbXiM7knNHjb4CGYH+TOmGFRnSTY4eYfam4eZqmlLPAtJt2nYmDhH2Xu5NgVlxmaltwhXt8lrG+u5hhkHt5bWB/o4uIal5td3B9rouGx450wI1DlYFokHp5cXuGW1JiiYKIqYCBwYBmg2Zlg2Jrg3uCbGqHbF5vcWp8hVhvd2F4",
    "widths": [
      640,
      1162
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "sin-titulo-2",
    "title": "Entre dos",
    "description": "Dos figuras blancas caminan hacia los bordes y dejan en el centro un estallido de rosa, naranja y verde.",
    "image": "assets/works/sin-titulo-2.jpg",
    "thumb": "assets/works/thumbs/sin-titulo-2.jpg",
    "w": 2000,
    "h": 985,
    "available": 0,
    "tone": "#bc7177",
    "blur": "8.iXyK9lknvElkkzeDpm12hjs6ZnlNcXiFx6Kas6lcdHdj+ytX11YclGdvjVJn12mDqpmnaaS5ilNroU5SwVAoqTs8mm9Rm3R3Zn+Ro2V7dHJfomZeoTQ2SDMzaWFRmC43",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "sin-titulo-3",
    "title": "Esperanza",
    "description": "Una familia en blanco y un globo con forma de corazón. En el globo se lee hope.",
    "image": "assets/works/sin-titulo-3.jpg",
    "thumb": "assets/works/thumbs/sin-titulo-3.jpg",
    "w": 2000,
    "h": 1206,
    "available": 0,
    "tone": "#c17f85",
    "blur": "8.u1lZrDVAXIqCi2U9m3sfm6VWomRbFDtyupdzqZSHi7GovF15l0R7sm+DlGdxQHCMya+op6imm7u4uIuIf5ipdKCqo1p4cXZFkZuFj5B5kJGenXd9sKyirrikXll+ioBfdz4x0mJnuG9nsnZwhnFdqHxvpEdHaTIz",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  },
  {
    "id": "sin-titulo-4",
    "title": "Omnia vincit amor",
    "description": "Una familia y un perro entre el color. En el lienzo está escrito omnia vincit amor.",
    "image": "assets/works/sin-titulo-4.jpg",
    "thumb": "assets/works/thumbs/sin-titulo-4.jpg",
    "w": 2000,
    "h": 1362,
    "available": 0,
    "tone": "#8ebfcb",
    "blur": "8.PZatepe4i5CjrIagYYeSo5OrLpGgJZS3lJ68i6/DhKK6pq/Nhpa5kMDOcJuzfoiTfZa7q6i/kZ+yaK3Ek6a6i3+WjHyVl2GDaI6xiX2UaYWpmo+thYKgkpy3boihe5KvPXuBNXaNfX6hnWKOkmyGmWN7l2aDYUld",
    "widths": [
      640,
      960,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  }
];
