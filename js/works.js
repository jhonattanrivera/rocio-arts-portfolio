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
    "widths": [
      640,
      1280,
      1666
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "widths": [
      640,
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
    "title": "Sin título",
    "description": "Londres en un solo plano: Big Ben, el London Eye, Tower Bridge y un bus rojo, apoyados sobre la bandera.",
    "image": "assets/works/sin-titulo.jpg",
    "thumb": "assets/works/thumbs/sin-titulo.jpg",
    "w": 1163,
    "h": 952,
    "available": 0,
    "tone": "#9fd0db",
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
    "title": "Sin título",
    "description": "Dos figuras blancas caminan hacia los bordes y dejan en el centro un estallido de rosa, naranja y verde.",
    "image": "assets/works/sin-titulo-2.jpg",
    "thumb": "assets/works/thumbs/sin-titulo-2.jpg",
    "w": 2000,
    "h": 985,
    "available": 0,
    "tone": "#bc7177",
    "widths": [
      640,
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
    "title": "Sin título",
    "description": "Una familia en blanco y un globo con forma de corazón. En el globo se lee hope.",
    "image": "assets/works/sin-titulo-3.jpg",
    "thumb": "assets/works/thumbs/sin-titulo-3.jpg",
    "w": 2000,
    "h": 1206,
    "available": 0,
    "tone": "#c17f85",
    "widths": [
      640,
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
    "title": "Sin título",
    "description": "Una familia y un perro entre el color. En el lienzo está escrito omnia vincit amor.",
    "image": "assets/works/sin-titulo-4.jpg",
    "thumb": "assets/works/thumbs/sin-titulo-4.jpg",
    "w": 2000,
    "h": 1362,
    "available": 0,
    "tone": "#8ebfcb",
    "widths": [
      640,
      1280,
      2000
    ],
    "year": null,
    "medium": null,
    "widthCm": null,
    "heightCm": null
  }
];
