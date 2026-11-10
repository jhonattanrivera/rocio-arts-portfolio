(function () {
  var path = location.pathname || "";
  var inEn = /\/en\/?$/.test(path) || path.indexOf("/en/") !== -1;
  var lang = inEn ? "en" : ((document.documentElement.lang || "es").slice(0, 2) === "en" ? "en" : "es");
  window.SITE = { lang: lang, root: inEn ? "../" : "", inEn: inEn };

  var ui = {
    es: {
      available: "Disponible",
      price: "Precio a consulta",
      cmWide: " cm de ancho",
      cmHigh: " cm de alto",
      consult: "Consultar esta obra",
      brush: "Pincelada",
      close: "Cerrar",
      prev: "Anterior",
      next: "Siguiente",
      whatsapp: "WhatsApp",
      open: "Abrir ",
      hanging: "Colgando ",
      flatNow: "Ver las obras",
      noWebgl: "El jardín en tres dimensiones no está disponible en este navegador.",
      lost: "El jardín se detuvo. Puedes ver las obras en plano.",
      suggest: "También puedes leer este sitio en inglés.",
      suggestGo: "Leer en inglés",
      suggestHide: "Ahora no",
      menu: "Menú",
      view: "Ver",
      seeRoom: "Verla en una sala",
      seeRoomShort: "Ver en sala",
      viewMode: "Vista",
      inRoom: "En una sala",
      artOnly: "La obra",
      roomLabel: "Sala",
      size: "Tamaño",
      frame: "Marco",
      frameNone: "Lienzo",
      frameBlack: "Negro",
      frameOak: "Roble",
      simNote: "Simulación. La medida real se confirma con Rocio.",
      realSize: "Medida real de la obra.",
      photoBy: "Foto de la sala:",
      dragHint: "Arrastra la obra para moverla",
      loupeHint: "Toca la obra para ver la pincelada",
      pinchHint: "Pellizca para ver la pincelada"
    },
    en: {
      available: "Available",
      price: "Price on request",
      cmWide: " cm wide",
      cmHigh: " cm high",
      consult: "Enquire about this work",
      brush: "Brushstroke",
      close: "Close",
      prev: "Previous",
      next: "Next",
      whatsapp: "WhatsApp",
      open: "Open ",
      hanging: "Hanging ",
      flatNow: "See the works",
      noWebgl: "The three-dimensional garden is not available in this browser.",
      lost: "The garden has stopped. You can see the works as a list.",
      suggest: "You can also read this site in Spanish.",
      suggestGo: "Leer en español",
      suggestHide: "Not now",
      menu: "Menu",
      view: "View",
      seeRoom: "See it in a room",
      seeRoomShort: "In a room",
      viewMode: "View",
      inRoom: "In a room",
      artOnly: "The work",
      roomLabel: "Room",
      size: "Size",
      frame: "Frame",
      frameNone: "Canvas",
      frameBlack: "Black",
      frameOak: "Oak",
      simNote: "A simulation. Rocio confirms the real size.",
      realSize: "The real size of the work.",
      photoBy: "Room photo:",
      dragHint: "Drag the work to move it",
      loupeHint: "Click the work to see the brushwork",
      pinchHint: "Pinch to see the brushwork"
    }
  };

  window.DESC_EN = {
    "serenidad": "A profile with closed eyes. The hair dissolves into pink, orange and blue, and a small flower rests at the ear.",
    "marilyn": "Marilyn, full face. Gold hair and red lips, set against turquoise and carmine.",
    "ocean-eyes": "A face at rest. Inside the lenses, a whole beach: sky, sea and sand.",
    "summer": "A tall portrait. The aviator lenses are cream and gold, and beneath them a city of trees and arches.",
    "el-camino": "A girl in white, seen from behind, holding a bouquet. The landscape is pink and turquoise, and a cloud carries a line written by hand.",
    "junto-a-ti": "Two figures in white ride away on bicycles, holding hands. The city around them is pure color.",
    "flores": "A dense, almost round bouquet in a white vase. The wall is gray and the table is blue.",
    "cidade-maravilhosa": "Rio de Janeiro: the sea below, the city in white, and the hills covered in circles of color, with Christ at the summit.",
    "abbey-road": "Four white figures cross at the Abbey Road walk, against magenta and green.",
    "verano-memorable": "A face in aviator glasses covered in gold. Above, love; below, let it be.",
    "the-crown": "Two crowned profiles, the face painted with the Union Jack, and the London skyline at their feet.",
    "elefantes": "Three elephants in profile, pressed close together, on a gold ground.",
    "forever": "A couple in white, hand in hand. She carries a bouquet. Behind them, a city in celebration.",
    "40-graus": "A beach in full sun: red umbrellas, turquoise water, and a hill in the distance.",
    "girasoles": "Sunflowers and small blooms in a glass vase, on a dark table against a gray wall.",
    "cristo-redentor": "The open arms again. This time the figure is built from colored houses, under a green sky.",
    "family": "Five white figures holding hands. Among the color, the word united.",
    "take-my-hand": "A couple holding hands. She carries a bouquet. The horizon is wide and full of color.",
    "lazos-de-amor": "Elephants of several sizes, gathered close, their bodies opened into stains and runs of color.",
    "vibras-de-playa": "A face in the sun, a crown of flowers, and lenses that give the sea back.",
    "my-love": "The couple walks hand in hand, seen closer. The blue ground is streaked with lines of gold.",
    "meninas": "Two girls walk along a white line. One raises an arm. Below, the word love.",
    "united": "A family of four, drawn in white and holding hands, before a city of blue and gold.",
    "amor-eterno": "A woman and a girl, seen from behind and hand in hand, cross a field of color.",
    "london-bridge": "London in turquoise: the Gherkin, the clock, the wheel, and a crowd in front.",
    "por-do-sol-corcovado": "Christ with open arms. The body is a fine weave of color, and the ground is gold.",
    "mi-ser": "A family walks with their dogs. Inside, the silhouettes are filled with leaves.",
    "floreciendo": "A white figure in profile holds a bouquet, among chains, arches and flowers.",
    "familia": "A father, a mother and two girls, hand in hand, among green, flowers and houses.",
    "arcoiris": "A clean arc of color over a city in gray and blue.",
    "elefants-family": "Five elephants in a line, in pink, blue and green, against a very pale sky.",
    "the-bridge": "London under a red sky. The wheel, the clock and the bridge are gold, and the river is violet.",
    "amor-puro": "Two children on a swing. The line is white and the garden is a mosaic of color.",
    "mi-bendicion": "A family walks among houses, flowers and a small car. The people stay white, as if cut out of the light.",
    "mi-refugio": "Parents, two children and a dog, hand in hand, beneath an arch. The ground is the green of grass.",
    "memorias": "Two swings. On one, a girl in a dress. On the other, a figure swings back.",
    "memorias-2": "A girl in white walks a pale strip, bouquet in hand, with the color of the city on either side.",
    "dentro-de-la-floresta": "A woman in white steps in with a bouquet, into a forest of red, pink and blue forms.",
    "mi-lugar-feliz": "A figure in white, with a bouquet, at the left of an abstract garden.",
    "urban-city": "A city seen head-on: buildings stacked in blue, red and yellow, under a wide sky.",
    "abstracto-azul": "Blue, circles and lines, with no figure in charge. The gesture stays loose.",
    "otono": "A vertical canvas, nearly abstract, of greens, yellows and reds falling like foliage. The photograph shows it installed, in a gold frame.",
    "amor": "Four white figures holding hands in a blue landscape. In the color, the word love can be read.",
    "oceano": "A very wide piece, made of blues, like water seen up close.",
    "sin-titulo": "London on a single plane: Big Ben, the London Eye, Tower Bridge and a red bus, resting on the flag.",
    "sin-titulo-2": "Two white figures walk toward the edges and leave, at the center, a burst of pink, orange and green.",
    "sin-titulo-3": "A family in white and a heart-shaped balloon. On the balloon, the word hope.",
    "sin-titulo-4": "A family and a dog among the color. On the canvas is written omnia vincit amor."
  };

  window.ui = function (key) {
    var pack = ui[lang] || ui.es;
    return pack[key] != null ? pack[key] : (ui.es[key] || key);
  };

  window.workText = function (work) {
    if (!work) return "";
    if (lang === "en" && window.DESC_EN && DESC_EN[work.id]) return DESC_EN[work.id];
    return work.description || "";
  };

  window.artAlt = function (work) {
    var tail = lang === "en" ? ", painting by Rocio Villamizar" : ", pintura de Rocio Villamizar";
    return work.title + tail;
  };

  window.pageFile = function () {
    var file = path.split("/").pop() || "index.html";
    if (!file || file.indexOf(".") === -1) return "index.html";
    return file;
  };

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("[data-set-lang]");
    if (!link) return;
    try { localStorage.setItem("rocio-lang", link.getAttribute("data-set-lang")); } catch (err) {}
  });

  function suggest() {
    var saved = "";
    var hidden = "";
    try {
      saved = localStorage.getItem("rocio-lang") || "";
      hidden = localStorage.getItem("rocio-suggest") || "";
    } catch (err) { return; }
    if (hidden === "off" && !saved) return;
    var nav = (navigator.language || "").toLowerCase();
    var file = window.pageFile();
    var show = false;
    var href = "";
    var label = "";
    var go = "";
    if (lang === "es" && (saved === "en" || (!saved && nav.indexOf("en") === 0))) {
      show = true;
      href = "en/" + file;
      label = ui.es.suggest;
      go = ui.es.suggestGo;
    } else if (lang === "en" && (saved === "es" || (!saved && nav.indexOf("es") === 0))) {
      show = true;
      href = "../" + file;
      label = ui.en.suggest;
      go = ui.en.suggestGo;
    }
    if (!show || !document.body) return;
    var bar = document.createElement("div");
    bar.className = "lang-suggest";
    bar.setAttribute("role", "status");
    bar.innerHTML = "<p></p><a></a><button type=\"button\"></button>";
    bar.querySelector("p").textContent = label;
    var a = bar.querySelector("a");
    a.href = href;
    a.textContent = go;
    a.setAttribute("data-set-lang", lang === "es" ? "en" : "es");
    var btn = bar.querySelector("button");
    btn.textContent = lang === "es" ? ui.es.suggestHide : ui.en.suggestHide;
    btn.addEventListener("click", function () {
      try { localStorage.setItem("rocio-suggest", "off"); } catch (err) {}
      bar.remove();
    });
    var main = document.getElementById("contenido");
    if (main) main.prepend(bar);
    else document.body.append(bar);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", suggest);
  else suggest();
})();
