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
    "id": "dos-jardines",
    "title": "Dos jardines",
    "description": "Un díptico: dos lienzos de follaje denso, con rosas viejas, amarillos y blancos que siguen de un panel al otro.",
    "image": "assets/works/dos-jardines.jpg",
    "thumb": "assets/works/thumbs/dos-jardines.jpg",
    "w": 2000,
    "h": 1127,
    "available": 0,
    "tone": "#828960",
    "blur": "8.tKaCm5Vro5pvr6F1tK5+oJxfkZdZl49Nl51zkqJvsaxsiY5glqJxlplin6pfhohUdoNQgpJifI1fcYdTiI1ifYdLfZdeiX9DhoZRiJJnZ4xYcYI/h41liJdSfIlHbXpAbHZPd4VhfoFGYXE9kIhtl4VCkX9LZVdA",
    "panels": [
      [
        0,
        0.4873
      ],
      [
        0.5209,
        1
      ]
    ],
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
    "id": "selva-azul",
    "title": "Selva azul",
    "description": "Una selva de azules, hojas y gotas. Entre la vegetación vuela un colibrí.",
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
  }
];
