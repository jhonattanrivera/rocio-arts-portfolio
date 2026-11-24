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
      hanging: "Colgando las obras…",
      flatNow: "Ver las obras",
      noWebgl: "El jardín en tres dimensiones no está disponible en este navegador.",
      lost: "El jardín se detuvo. Puedes ver las obras en plano.",
      menu: "Menú",
      view: "Ver",
      seeRoom: "Verla en tu espacio",
      seeRoomShort: "En tu espacio",
      viewMode: "Vista",
      inRoom: "En tu espacio",
      artOnly: "La obra",
      roomLabel: "Espacio",
      size: "Tamaño",
      frame: "Marco",
      frameNone: "Lienzo",
      frameBlack: "Negro",
      frameOak: "Roble",
      simNote: "Simulación. La medida real te la confirmo yo.",
      realSize: "Medida real de la obra.",
      photoBy: "Foto del espacio:",
      dragHint: "Arrastra la obra para moverla",
      tools: "Ver opciones de la vista",
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
      hanging: "Hanging the works…",
      flatNow: "See the works",
      noWebgl: "The three-dimensional garden is not available in this browser.",
      lost: "The garden has stopped. You can see the works as a list.",
      menu: "Menu",
      view: "View",
      seeRoom: "See it in your space",
      seeRoomShort: "In your space",
      viewMode: "View",
      inRoom: "In your space",
      artOnly: "The work",
      roomLabel: "Space",
      size: "Size",
      frame: "Frame",
      frameNone: "Canvas",
      frameBlack: "Black",
      frameOak: "Oak",
      simNote: "A simulation. I will confirm the real size.",
      realSize: "The real size of the work.",
      photoBy: "Space photo:",
      dragHint: "Drag the work to move it",
      tools: "Show view options",
      loupeHint: "Click the work to see the brushwork",
      pinchHint: "Pinch to see the brushwork"
    }
  };

  window.DESC_EN = {
    "colibries": "Roses, yellow tulips and violet blooms in a green garden. Two hummingbirds cross the sky.",
    "amanecer-en-el-jardin": "A long, dense garden under a pale pink sky. Hydrangeas, daisies, irises and fuchsia blooms, all at once.",
    "hacia-el-cielo": "A path of colors crosses a field of flowers toward a turquoise sky with violet clouds. A girl in white walks along it.",
    "entre-mujeres": "A girl, a young woman and a woman walk hand in hand. Behind them, a tapestry of turquoise and pink patches, with hanging flowers.",
    "hortensias": "Lilac and blue hydrangeas open to the sides and leave a pale, almost white sky above.",
    "camino-rosa": "A golden path climbs between flowers toward a fuchsia sky. Below, a small girl begins to walk.",
    "ramo-de-color": "A woman holds a bouquet among green and fuchsia patches. Below, a red and turquoise arch.",
    "bruma-floral": "Soft pink, yellow and pale blue flowers that dissolve into a pearl-grey mist.",
    "leer-contigo": "Two figures read together on a garden bench. Above, drops of color fall and vines hang down.",
    "pradera": "A meadow of purple, pink and yellow flowers beneath a strip of turquoise sky.",
    "hermanas": "Three girls walk hand in hand between walls of patches, dots and a grey rainbow.",
    "campo-rosa": "A wide field of pink and magenta flowers under a pale, dripping sky.",
    "ella-florece": "A woman in profile, drawn in white, holds a bouquet. Around her hang roses, dots and bands of color.",
    "rosas-sobre-turquesa": "Red roses and wildflowers grow against a turquoise ground, among dark stems.",
    "de-paseo": "Two figures and a small dog stroll in front of a tapestry of flowers and turquoise stripes.",
    "nina-de-las-rosas": "A girl with a bouquet walks among red roses under a turquoise sky.",
    "la-puerta": "Children climb a white ladder toward an open door in the garden. To one side, a rainbow.",
    "primavera": "A green and yellow meadow with scattered flowers in pink, red and blue.",
    "nosotros": "A family of four, in white, holds hands over blue, red and gold patches.",
    "jardin-secreto": "A vertical garden of colored dots, large roses and crossing stems.",
    "hogar": "Parents, two girls and a dog, drawn in white, in front of a green wall of flowers and patches.",
    "luz-de-mayo": "Broad strokes of yellow, pink and blue, like a bouquet seen very close.",
    "retazos": "A wall of patches with dots, arches and small rainbows. Stems and leaves peek through.",
    "prado": "A tapestry of small yellow, pink and pale blue flowers among green leaves, with no sky.",
    "encuentro": "Several white figures gather in front of a wall of patches, dots and a rain of color.",
    "rosal": "A rosebush of pale pink flowers in deep green, in thick strokes.",
    "selva-azul": "A jungle of blues, leaves and drops. A hummingbird flies through the foliage.",
    "floracion": "Wine-red and yellow blooms open among leaves, in thick strokes.",
    "fiesta": "Patch forms in pink, orange and turquoise, with yellow dots and white vines.",
    "el-camino": "A girl in white, seen from behind, holding a bouquet. The landscape is pink and turquoise, and a cloud carries a line written by hand.",
    "dos-jardines": "A diptych: two canvases of dense foliage, with antique pinks, yellows and whites that carry on from one panel to the other."
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
    var tail = lang === "en" ? ", painting by Rocío Villamizar" : ", pintura de Rocío Villamizar";
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

})();
