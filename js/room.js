/* La obra colgada en una sala.
   Cada sala es una foto real con la pared de frente. Los números dicen
   dónde está la pared y a qué escala:
     cm      centímetros que mide todo el ancho de la foto, a la altura de la pared
     x, y    centro por defecto de la obra (0 a 1); bottom fija el borde inferior
     box     zona de pared donde puede colgarse: [izquierda, arriba, derecha, abajo]
     light   hacia dónde cae la sombra [x, y], según la luz de la foto
     tint    cuánto color de la luz de la pared pasa a la obra (0 a 1)
   Fotos con licencia Unsplash. Créditos en assets/rooms/CREDITS.md. */
(function () {
  var ROOMS = [
    { id: "sala", file: "sala-blanca", w: 2400, h: 1917, cm: 328, x: 0.375, bottom: 0.515, box: [0.03, 0.03, 0.8, 0.53], light: [0.25, 1], tint: 0.35, warm: 0, credit: "dada design", name: { es: "Sala", en: "Living room" } },
    { id: "tarde", file: "tarde", w: 2400, h: 1350, cm: 365, x: 0.487, y: 0.34, box: [0.2, 0.04, 0.66, 0.6], light: [1, 0.55], tint: 0.9, warm: 1, credit: "Visual Laurence", name: { es: "Luz de tarde", en: "Afternoon light" } },
    { id: "molduras", file: "molduras", w: 2400, h: 1800, cm: 450, x: 0.56, y: 0.44, box: [0.31, 0.11, 0.82, 0.8], light: [-0.8, 0.6], tint: 0.25, warm: 0, credit: "Isidore Decamon", name: { es: "Molduras", en: "Panelled wall" } },
    { id: "entrada", file: "entrada", w: 2400, h: 1600, cm: 230, x: 0.765, bottom: 0.655, box: [0.548, 0.03, 0.985, 0.665], light: [0.6, 0.8], tint: 0.3, warm: 0, credit: "Liana Mikah", name: { es: "Entrada", en: "Entryway" } },
    { id: "concreto", file: "concreto", w: 2400, h: 1309, cm: 555, x: 0.49, bottom: 0.47, box: [0.06, 0.04, 0.94, 0.48], light: [0, 1], tint: 0.12, warm: 0, credit: "Le Quan", name: { es: "Concreto", en: "Concrete" } }
  ];
  var byId = {};
  ROOMS.forEach(function (room) { byId[room.id] = room; });

  function root() { return (window.SITE && window.SITE.root) || ""; }
  function lang() { return (window.SITE && window.SITE.lang) || "es"; }
  function roomSrc(room, w, ext) { return root() + "assets/rooms/" + room.file + "-" + w + "." + ext; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  var samples = {};
  function sampler(room) {
    if (samples[room.id]) return samples[room.id];
    var entry = { ready: false, data: null, w: 0, h: 0 };
    samples[room.id] = entry;
    var img = new Image();
    img.onload = function () {
      try {
        var w = 240;
        var h = Math.round(w * room.h / room.w);
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(img, 0, 0, w, h);
        entry.data = x.getImageData(0, 0, w, h).data;
        entry.w = w;
        entry.h = h;
        entry.ready = true;
        if (entry.onready) entry.onready();
      } catch (err) { /* sin muestra: la obra queda sin mapa de luz */ }
    };
    img.src = roomSrc(room, 1200, "jpg");
    return entry;
  }

  function wallLevel(room, rect) {
    var s = sampler(room);
    if (!s.ready) return null;
    var x0 = Math.floor(rect[0] * s.w), y0 = Math.floor(rect[1] * s.h);
    var x1 = Math.ceil(rect[2] * s.w), y1 = Math.ceil(rect[3] * s.h);
    var sum = 0, n = 0;
    for (var y = Math.max(0, y0); y < Math.min(s.h, y1); y += 2) {
      for (var x = Math.max(0, x0); x < Math.min(s.w, x1); x += 2) {
        var i = (y * s.w + x) * 4;
        sum += Math.max(s.data[i], s.data[i + 1], s.data[i + 2]);
        n++;
      }
    }
    return n ? sum / n : null;
  }

  function create(host, opts) {
    opts = opts || {};
    var el = document.createElement("div");
    el.className = "room" + (opts.interactive ? " is-live" : "");
    el.innerHTML =
      '<div class="room-view">' +
        '<picture class="room-photo"><source type="image/webp"><img alt="" decoding="async"></picture>' +
        '<div class="room-art"' + (opts.interactive ? ' tabindex="0" role="img"' : "") + '>' +
          '<div class="room-canvas"><span class="room-paint"></span><span class="room-light"></span><span class="room-sheen"></span></div>' +
        "</div>" +
      "</div>";
    host.append(el);

    var view = el.querySelector(".room-view");
    var photo = el.querySelector(".room-photo");
    var photoSrc = photo.querySelector("source");
    var photoImg = photo.querySelector("img");
    var art = el.querySelector(".room-art");
    var canvas = el.querySelector(".room-canvas");
    var paint = el.querySelector(".room-paint");
    var light = el.querySelector(".room-light");
    var sheen = el.querySelector(".room-sheen");

    var state = {
      work: null,
      room: byId[opts.room] || ROOMS[0],
      size: opts.size || 100,
      frame: opts.frame || "none",
      pos: null,
      zoom: 1,
      cam: null
    };
    var last = { cm: 0, real: false };
    var paintImg = null;

    function setPhoto() {
      var room = state.room;
      photoSrc.srcset = roomSrc(room, 1200, "webp") + " 1200w, " + roomSrc(room, 2000, "webp") + " 2000w";
      photoImg.srcset = roomSrc(room, 1200, "jpg") + " 1200w, " + roomSrc(room, 2000, "jpg") + " 2000w";
      photoImg.src = roomSrc(room, 1200, "jpg");
      photoImg.width = room.w;
      photoImg.height = room.h;
      light.style.backgroundImage = "url(\"" + roomSrc(room, 1200, "jpg") + "\")";
      el.dataset.room = room.id;
      el.classList.toggle("is-warm", !!room.warm);
      var s = sampler(room);
      if (!s.ready) s.onready = function () { if (state.room === room) layout(); };
    }

    function setPaint() {
      var work = state.work;
      if (!work) return;
      paint.replaceChildren();
      if (window.artPicture) {
        var pic = window.artPicture(work, { sizes: "600px", eager: true, alt: "" });
        paint.append(pic);
        paintImg = pic.querySelector("img");
      }
      paint.style.background = work.tone || "#ddd";
      art.setAttribute("aria-label", work.title);
    }

    function dims() {
      var work = state.work;
      var real = !!(work && work.widthCm && work.heightCm);
      var ratio = work ? work.w / work.h : 1;
      var wcm, hcm;
      if (real) {
        wcm = Number(work.widthCm);
        hcm = Number(work.heightCm);
      } else if (ratio >= 1) {
        wcm = state.size;
        hcm = state.size / ratio;
      } else {
        hcm = state.size;
        wcm = state.size * ratio;
      }
      return { w: wcm, h: hcm, real: real };
    }

    function layout(keepCamera) {
      if (!state.work) return;
      var room = state.room;
      var W = view.clientWidth;
      var H = view.clientHeight;
      if (!W || !H) return;
      var iw = room.w, ih = room.h;
      var ppc = iw / room.cm;
      var d = dims();
      var rim = state.frame === "none" ? 0 : 2.6;
      var gap = state.frame === "none" ? 0 : 0.9;
      var ow = (d.w + 2 * (rim + gap)) * ppc;
      var oh = (d.h + 2 * (rim + gap)) * ppc;
      var bx0 = room.box[0] * iw, by0 = room.box[1] * ih, bx1 = room.box[2] * iw, by1 = room.box[3] * ih;
      var k = Math.min(1, (bx1 - bx0) / ow, (by1 - by0) / oh);
      ow *= k;
      oh *= k;
      var cmShown = Math.round(Math.max(d.w, d.h) * k);
      var cx, cy;
      if (state.pos) {
        cx = state.pos[0] * iw;
        cy = state.pos[1] * ih;
      } else {
        cx = room.x * iw;
        cy = room.bottom != null ? room.bottom * ih - oh / 2 : room.y * ih;
      }
      cx = clamp(cx, bx0 + ow / 2, bx1 - ow / 2);
      cy = clamp(cy, by0 + oh / 2, by1 - oh / 2);
      if (state.pos) state.pos = [cx / iw, cy / ih];

      var cam = state.cam;
      if (!keepCamera || !cam || cam.W !== W || cam.H !== H) {
        var s = Math.max(W / iw, H / ih) * state.zoom;
        var vw = W / s, vh = H / s;
        var fx = state.zoom > 1 ? cx : (room.x * iw);
        var fy = state.zoom > 1 ? cy : (room.bottom != null ? room.bottom * ih : room.y * ih);
        var ox = clamp(fx - vw / 2, 0, Math.max(0, iw - vw));
        var oy = clamp(fy - vh * (state.zoom > 1 ? 0.5 : 0.52), 0, Math.max(0, ih - vh));
        cam = state.cam = { s: s, ox: ox, oy: oy, W: W, H: H };
      }
      var sc = cam.s;
      photoImg.style.width = iw * sc + "px";
      photoImg.style.height = ih * sc + "px";
      photoImg.style.transform = "translate3d(" + (-cam.ox * sc) + "px," + (-cam.oy * sc) + "px,0)";
      photoImg.sizes = Math.round(iw * sc) + "px";

      var left = (cx - ow / 2 - cam.ox) * sc;
      var top = (cy - oh / 2 - cam.oy) * sc;
      art.style.width = ow * sc + "px";
      art.style.height = oh * sc + "px";
      art.style.transform = "translate3d(" + left + "px," + top + "px,0)";

      var u = ppc * sc * k;
      var pad = (rim + gap) * u;
      canvas.style.setProperty("--rim", rim * u + "px");
      canvas.style.setProperty("--gap", gap * u + "px");
      canvas.style.setProperty("--pad", pad + "px");
      el.dataset.frame = state.frame;

      var lx = room.light[0], ly = room.light[1];
      var depth = state.frame === "none" ? 1 : 0.8;
      art.style.boxShadow =
        (lx * 0.5 * u) + "px " + (ly * 0.8 * u * depth) + "px " + (1.4 * u) + "px rgba(28,20,12," + (room.warm ? 0.34 : 0.28) + ")," +
        (lx * 3.2 * u) + "px " + (ly * 4.6 * u * depth) + "px " + (11 * u) + "px rgba(28,20,12," + (room.warm ? 0.24 : 0.18) + ")";

      var outerLeft = cx - ow / 2;
      var outerTop = cy - oh / 2;
      var blur = Math.max(5, 2.2 * u);
      light.style.setProperty("--blur", blur + "px");
      light.style.backgroundSize = iw * sc + "px " + ih * sc + "px";
      light.style.backgroundPosition = (-(outerLeft - cam.ox) * sc + blur * 2) + "px " + (-(outerTop - cam.oy) * sc + blur * 2) + "px";
      light.style.setProperty("--tint", String(room.tint));
      var level = wallLevel(room, [(cx - ow / 2) / iw, (cy - oh / 2) / ih, (cx + ow / 2) / iw, (cy + oh / 2) / ih]);
      var gain = level ? clamp(248 / level, 1, 1.6) : 1.15;
      light.style.setProperty("--gain", gain.toFixed(3));
      sheen.style.setProperty("--ang", (Math.atan2(ly, lx) * 180 / Math.PI + 90).toFixed(0) + "deg");
      if (paintImg) paintImg.sizes = Math.round((ow - 2 * pad / sc) * sc) + "px";

      if (cmShown !== last.cm || d.real !== last.real || room.id !== last.room) {
        last = { cm: cmShown, real: d.real, room: room.id };
        if (opts.onChange) opts.onChange({ cm: cmShown, real: d.real, room: room });
      }
    }

    var drag = null;
    if (opts.interactive) {
      art.addEventListener("pointerdown", function (event) {
        if (event.button) return;
        event.preventDefault();
        art.setPointerCapture(event.pointerId);
        var room = state.room;
        var cur = state.pos || null;
        drag = { x: event.clientX, y: event.clientY, start: cur };
        if (!cur) {
          var r = art.getBoundingClientRect();
          var vr = view.getBoundingClientRect();
          var cam = state.cam;
          drag.start = [
            ((r.left - vr.left + r.width / 2) / cam.s + cam.ox) / room.w,
            ((r.top - vr.top + r.height / 2) / cam.s + cam.oy) / room.h
          ];
        }
        el.classList.add("is-dragging");
      });
      art.addEventListener("pointermove", function (event) {
        if (!drag) return;
        var cam = state.cam;
        var room = state.room;
        state.pos = [
          drag.start[0] + (event.clientX - drag.x) / cam.s / room.w,
          drag.start[1] + (event.clientY - drag.y) / cam.s / room.h
        ];
        layout(true);
      });
      function end() {
        if (!drag) return;
        drag = null;
        el.classList.remove("is-dragging");
        if (opts.onMove) opts.onMove();
      }
      art.addEventListener("pointerup", end);
      art.addEventListener("pointercancel", end);
      art.addEventListener("keydown", function (event) {
        var step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
        if (!step) return;
        event.preventDefault();
        event.stopPropagation();
        var cam = state.cam;
        var room = state.room;
        var r = art.getBoundingClientRect();
        var vr = view.getBoundingClientRect();
        var base = state.pos || [
          ((r.left - vr.left + r.width / 2) / cam.s + cam.ox) / room.w,
          ((r.top - vr.top + r.height / 2) / cam.s + cam.oy) / room.h
        ];
        state.pos = [base[0] + step[0] * 0.012, base[1] + step[1] * 0.012];
        layout(true);
      });
    }

    var ro = "ResizeObserver" in window ? new ResizeObserver(function () { layout(); }) : null;
    if (ro) ro.observe(view);
    else window.addEventListener("resize", function () { layout(); });

    setPhoto();

    return {
      el: el,
      art: art,
      paint: paint,
      rooms: ROOMS,
      get room() { return state.room; },
      get work() { return state.work; },
      setWork: function (work) {
        state.work = work;
        state.pos = null;
        setPaint();
        layout();
      },
      setRoom: function (id) {
        var next = byId[id];
        if (!next || next === state.room) return;
        state.room = next;
        state.pos = null;
        state.cam = null;
        el.classList.add("is-swapping");
        setPhoto();
        var done = function () {
          layout();
          requestAnimationFrame(function () { el.classList.remove("is-swapping"); });
        };
        if (photoImg.complete && photoImg.naturalWidth) done();
        else {
          photoImg.addEventListener("load", done, { once: true });
          photoImg.addEventListener("error", done, { once: true });
        }
      },
      setSize: function (cm) { state.size = cm; layout(true); },
      setFrame: function (kind) { state.frame = kind; layout(true); },
      setZoom: function (z) { state.zoom = z; state.cam = null; layout(); },
      layout: layout
    };
  }

  window.Room = {
    ROOMS: ROOMS,
    create: create,
    name: function (room) { return room.name[lang()] || room.name.es; },
    thumb: function (room) { return roomSrc(room, 1200, "webp"); },
    thumbJpg: function (room) { return roomSrc(room, 1200, "jpg"); }
  };
})();
