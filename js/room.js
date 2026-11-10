/* La obra colgada en tu espacio.
   Cada espacio es una foto real. La pared se describe como un rectángulo
   de centímetros reales y dónde cae ese rectángulo en la foto:
     wall.quad  esquinas del rectángulo en la foto (0 a 1): arriba-izq, arriba-der, abajo-der, abajo-izq
     wall.cm    ancho y alto reales de ese rectángulo
     box        zona donde puede colgarse la obra, en cm dentro del rectángulo
     at         punto por defecto en cm; con atBottom, la altura es el borde inferior
     rail       línea (en cm) que la obra no baja, como un pasamanos
     ceil       línea (en cm) que la obra no sube, como el borde de la foto
     light      hacia dónde cae la sombra, en la pared
     tint       cuánto color de la luz de la pared pasa a la obra (0 a 1)
     ref        brillo de pared que cuenta como luz plena (si falta, se mide)
     front      lo que queda delante de la obra, como una lámpara
   Con una pared de frente basta flat: cm (ancho de la foto en la pared),
   box en fracciones de la foto, x y bottom (o y).
   La luz se toma de la misma foto, punto por punto, a través de la perspectiva.
   Fotos con licencia Unsplash. Créditos en assets/rooms/CREDITS.md. */
(function () {
  var ROOMS = [
    {
      id: "sala", file: "sala", w: 2000, h: 3000,
      wall: { quad: [[0.25, 0.1885], [0.7417, 0.0238], [0.7417, 0.6005], [0.25, 0.5925]], cm: [306, 380] },
      box: [10, 6, 296, 350], at: [172, 344], atBottom: true,
      light: [0.12, 1], tint: 0.45, warm: 1,
      credit: "Jonathan Borba", name: { es: "Sala", en: "Living room" }
    },
    {
      id: "escalera", file: "escalera", w: 2000, h: 3000,
      wall: { quad: [[0.373, 0.2754], [0.973, -0.0382], [0.973, 0.4735], [0.373, 0.5105]], cm: [330, 190] },
      box: [6, -160, 318, 188], at: [235, 120], atBottom: true,
      rail: [[0, -26], [330, 170]], railGap: 14,
      ceil: [[48, -188], [337, 19]], ceilGap: 4,
      light: [0.35, 0.9], tint: 0.3, warm: 0,
      credit: "Francesca Tosolini", name: { es: "Escalera", en: "Staircase" }
    },
    {
      id: "habitacion", file: "habitacion", w: 2000, h: 1337,
      flat: { cm: 557, box: [0.305, 0.085, 0.695, 0.472], x: 0.4975, bottom: 0.44 },
      light: [0, 1], tint: 0.3, warm: 1,
      credit: "Rohit Thakur", name: { es: "Habitación", en: "Bedroom" }
    },
    {
      id: "comedor", file: "comedor", w: 2000, h: 1500,
      flat: { cm: 350, box: [0.03, 0.02, 0.855, 0.655], x: 0.47, bottom: 0.632 },
      light: [-0.7, 0.6], tint: 0.65, warm: 1, ref: 205,
      front: { file: "comedor-front", rect: [985 / 2400, 0, 1305 / 2400, 690 / 1800] },
      credit: "mindeurle lee", name: { es: "Comedor", en: "Dining room" }
    },
    {
      id: "tarde", file: "tarde", w: 2400, h: 1350,
      flat: { cm: 365, box: [0.2, 0.04, 0.66, 0.6], x: 0.487, y: 0.34 },
      light: [1, 0.55], tint: 0.9, warm: 1,
      credit: "Visual Laurence", name: { es: "Luz de tarde", en: "Afternoon light" }
    },
    {
      id: "entrada", file: "entrada", w: 2400, h: 1600,
      flat: { cm: 230, box: [0.548, 0.03, 0.985, 0.665], x: 0.765, bottom: 0.655 },
      light: [0.6, 0.8], tint: 0.3, warm: 0,
      credit: "Liana Mikah", name: { es: "Entrada", en: "Entryway" }
    }
  ];
  var byId = {};
  ROOMS.forEach(function (room) { byId[room.id] = room; });

  function root() { return (window.SITE && window.SITE.root) || ""; }
  function lang() { return (window.SITE && window.SITE.lang) || "es"; }
  function roomSrc(room, w, ext) { return root() + "assets/rooms/" + room.file + "-" + w + "." + ext; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* Homografías: de un plano a otro con cuatro puntos. */
  function solve(src, dst) {
    var A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i][0], y = src[i][1], X = dst[i][0], Y = dst[i][1];
      A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X);
      A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y);
    }
    for (var c = 0; c < 8; c++) {
      var p = c;
      for (var r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      var t = A[c]; A[c] = A[p]; A[p] = t; t = b[c]; b[c] = b[p]; b[p] = t;
      for (var r2 = c + 1; r2 < 8; r2++) {
        var f = A[r2][c] / A[c][c];
        if (!f) continue;
        for (var k = c; k < 8; k++) A[r2][k] -= f * A[c][k];
        b[r2] -= f * b[c];
      }
    }
    var h = new Array(8);
    for (var r3 = 7; r3 >= 0; r3--) {
      var s = b[r3];
      for (var k2 = r3 + 1; k2 < 8; k2++) s -= A[r3][k2] * h[k2];
      h[r3] = s / A[r3][r3];
    }
    h.push(1);
    return h;
  }
  function apply(H, x, y) {
    var w = H[6] * x + H[7] * y + H[8];
    return [(H[0] * x + H[1] * y + H[2]) / w, (H[3] * x + H[4] * y + H[5]) / w];
  }
  function invert(m) {
    var a = m[0], b = m[1], c = m[2], d = m[3], e = m[4], f = m[5], g = m[6], h = m[7], i = m[8];
    var A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
    var det = a * A + b * B + c * C;
    return [A / det, -(b * i - c * h) / det, (b * f - c * e) / det, B / det, (a * i - c * g) / det, -(a * f - c * d) / det, C / det, -(a * h - b * g) / det, (a * e - b * d) / det];
  }
  function matrix3d(H) {
    var n = function (v) { return Number(v.toPrecision(10)); };
    return "matrix3d(" + [n(H[0]), n(H[3]), 0, n(H[6]), n(H[1]), n(H[4]), 0, n(H[7]), 0, 0, 1, 0, n(H[2]), n(H[5]), 0, n(H[8])].join(",") + ")";
  }

  /* Geometría de cada espacio, calculada una vez. */
  function prep(room) {
    if (room._g) return room._g;
    var iw = room.w, ih = room.h, quad, W, Hh, box, at, bottom;
    if (room.flat) {
      var f = room.flat, ppc = iw / f.cm, b = f.box;
      W = (b[2] - b[0]) * iw / ppc;
      Hh = (b[3] - b[1]) * ih / ppc;
      quad = [[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]];
      box = [0, 0, W, Hh];
      bottom = f.bottom != null;
      at = [(f.x - b[0]) * iw / ppc, ((bottom ? f.bottom : f.y) - b[1]) * ih / ppc];
    } else {
      quad = room.wall.quad;
      W = room.wall.cm[0];
      Hh = room.wall.cm[1];
      box = room.box || [0, 0, W, Hh];
      at = room.at || [W / 2, Hh / 2];
      bottom = !!room.atBottom;
    }
    var H = solve([[0, 0], [W, 0], [W, Hh], [0, Hh]], quad.map(function (p) { return [p[0] * iw, p[1] * ih]; }));
    room._g = { H: H, Hi: invert(H), box: box, at: at, bottom: bottom };
    return room._g;
  }
  function lineAt(r, u) {
    return r[0][1] + (u - r[0][0]) * (r[1][1] - r[0][1]) / (r[1][0] - r[0][0]);
  }
  /* Lo que deja libre la pared para una obra que ocupa de uL a uR:
     el pasamanos por abajo y el borde de la foto o el techo por arriba. */
  function span(room, g, uL, uR, strict) {
    var b = g.box, top = b[1], bottom = b[3];
    if (room.rail) bottom = Math.min(bottom, lineAt(room.rail, uL), lineAt(room.rail, uR)) - (room.railGap || 10);
    if (room.ceil && strict) top = Math.max(top, lineAt(room.ceil, uL), lineAt(room.ceil, uR)) + (room.ceilGap || 6);
    return [top, bottom];
  }

  /* La foto en pequeño, para leer la luz de la pared. */
  var samples = {};
  var grain = { img: null, ready: false, waiting: [] };
  function sampler(room) {
    if (samples[room.id]) return samples[room.id];
    var entry = { ready: false, data: null, w: 0, h: 0, k: 1 };
    samples[room.id] = entry;
    var img = new Image();
    img.onload = function () {
      try {
        var w = Math.min(800, img.naturalWidth);
        var h = Math.round(w * img.naturalHeight / img.naturalWidth);
        var c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        var x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(img, 0, 0, w, h);
        entry.data = x.getImageData(0, 0, w, h).data;
        entry.w = w;
        entry.h = h;
        entry.k = w / room.w;
        entry.ready = true;
        entry.ref = room.ref || measureRef(room, entry);
        (entry.waiting || []).forEach(function (fn) { fn(); });
        entry.waiting = null;
      } catch (err) { /* sin muestra: la obra queda sin mapa de luz */ }
    };
    img.src = roomSrc(room, 1200, "jpg");
    return entry;
  }
  function pixel(s, x, y, out) {
    x = clamp(x, 0, s.w - 1.001);
    y = clamp(y, 0, s.h - 1.001);
    var x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, d = s.data, w = s.w;
    var i00 = (y0 * w + x0) * 4, i10 = i00 + 4, i01 = i00 + w * 4, i11 = i01 + 4;
    for (var c = 0; c < 3; c++) {
      var top = d[i00 + c] + (d[i10 + c] - d[i00 + c]) * fx;
      var bot = d[i01 + c] + (d[i11 + c] - d[i01 + c]) * fx;
      out[c] = top + (bot - top) * fy;
    }
    return out;
  }
  function measureRef(room, s) {
    var g = prep(room), b = g.box, vals = [], px = [0, 0, 0];
    for (var i = 0; i <= 30; i++) {
      var u = b[0] + (b[2] - b[0]) * i / 30, lim = span(room, g, u, u, true);
      for (var j = 0; j <= 30; j++) {
        var p = apply(g.H, u, lim[0] + (lim[1] - lim[0]) * j / 30);
        if (p[0] < 0 || p[1] < 0 || p[0] >= room.w || p[1] >= room.h) continue;
        pixel(s, p[0] * s.k, p[1] * s.k, px);
        vals.push(0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]);
      }
    }
    vals.sort(function (a, b2) { return a - b2; });
    var top = vals.length ? vals[Math.floor(vals.length * 0.97)] : 220;
    return Math.max(80, top / 0.97);
  }

  function create(host, opts) {
    opts = opts || {};
    var el = document.createElement("div");
    el.className = "room" + (opts.interactive ? " is-live" : "");
    el.innerHTML =
      '<div class="room-view">' +
        '<picture class="room-photo"><source type="image/webp"><img alt="" decoding="async"></picture>' +
        '<div class="room-art"' + (opts.interactive ? ' tabindex="0" role="img"' : "") + '>' +
          '<canvas class="room-render" width="2" height="2"></canvas><span class="room-paint" aria-hidden="true"></span>' +
        "</div>" +
        '<img class="room-front" alt="" decoding="async" hidden>' +
      "</div>";
    host.append(el);

    var view = el.querySelector(".room-view");
    var photo = el.querySelector(".room-photo");
    var photoSrc = photo.querySelector("source");
    var photoImg = photo.querySelector("img");
    var art = el.querySelector(".room-art");
    var paint = el.querySelector(".room-paint");
    var render = el.querySelector(".room-render");
    var front = el.querySelector(".room-front");
    var renderCtx = render.getContext("2d");
    var light = document.createElement("canvas");
    var lightCtx = light.getContext("2d");
    var lightReady = false;
    var look = null;

    var state = {
      work: null,
      room: byId[opts.room] || ROOMS[0],
      size: opts.size || 100,
      frame: opts.frame || "none",
      pos: null,
      cur: null,
      zoom: 1,
      cam: null
    };
    var last = { cm: 0, real: false };
    var paintImg = null;
    var lightKey = "";

    function setPhoto() {
      var room = state.room;
      photoSrc.srcset = roomSrc(room, 1200, "webp") + " 1200w, " + roomSrc(room, 2000, "webp") + " 2000w";
      photoImg.srcset = roomSrc(room, 1200, "jpg") + " 1200w, " + roomSrc(room, 2000, "jpg") + " 2000w";
      photoImg.src = roomSrc(room, 1200, "jpg");
      photoImg.width = room.w;
      photoImg.height = room.h;
      if (room.front) {
        front.src = root() + "assets/rooms/" + room.front.file + ".webp";
        front.hidden = false;
      } else {
        front.hidden = true;
        front.removeAttribute("src");
      }
      el.dataset.room = room.id;
      el.classList.toggle("is-warm", !!room.warm);
      lightKey = "";
      lightReady = false;
      var s = sampler(room);
      if (!s.ready) {
        s.waiting = s.waiting || [];
        s.waiting.push(function () { if (state.room === room) { lightKey = ""; layout(true); } });
      }
    }

    function setPaint() {
      var work = state.work;
      if (!work) return;
      paint.replaceChildren();
      paintImg = null;
      if (window.artPicture) {
        var pic = window.artPicture(work, { sizes: "600px", eager: true, alt: "" });
        paint.append(pic);
        paintImg = pic.querySelector("img");
        paintImg.addEventListener("load", draw);
      }
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

    /* Dónde puede quedar el centro de la obra: lo más cerca posible de donde se pidió. */
    function place(room, g, cu, cv, ow, oh, strict) {
      var b = g.box, lo = b[0] + ow / 2, hi = Math.max(lo, b[2] - ow / 2);
      cu = clamp(cu, lo, hi);
      var fits = function (u, st) { var v = span(room, g, u - ow / 2, u + ow / 2, st); return v[1] - v[0] >= oh - 0.01; };
      var search = function (st) {
        if (fits(cu, st)) return cu;
        var step = (hi - lo) / 80 || 1;
        for (var n = 1; n <= 80; n++) {
          if (cu - n * step >= lo && fits(cu - n * step, st)) return cu - n * step;
          if (cu + n * step <= hi && fits(cu + n * step, st)) return cu + n * step;
        }
        return null;
      };
      var found = strict ? search(true) : null;
      if (found == null) { strict = false; found = search(false); }
      if (found != null) cu = found;
      var v = span(room, g, cu - ow / 2, cu + ow / 2, strict);
      cv = clamp(cv, v[0] + oh / 2, Math.max(v[0] + oh / 2, v[1] - oh / 2));
      return [cu, cv];
    }
    /* El alto más grande que cabe para un ancho dado, en el mejor lugar de la pared. */
    function roomFor(room, g, ow) {
      var b = g.box, best = 0;
      if (!room.rail && !room.ceil) return b[3] - b[1];
      for (var n = 0; n <= 24; n++) {
        var uL = b[0] + (b[2] - b[0] - ow) * n / 24, v = span(room, g, uL, uL + ow);
        best = Math.max(best, v[1] - v[0]);
      }
      return best;
    }

    function paintLight(room, g, corner, ow, oh, s) {
      var key = room.id + ":" + corner[0].toFixed(1) + ":" + corner[1].toFixed(1) + ":" + ow.toFixed(1) + ":" + oh.toFixed(1);
      if (key === lightKey) return;
      lightKey = key;
      var nx = clamp(Math.round(ow / 1.6), 16, 150);
      var ny = clamp(Math.round(oh / 1.6), 16, 150);
      if (light.width !== nx || light.height !== ny) { light.width = nx; light.height = ny; }
      var img = lightCtx.createImageData(nx, ny), d = img.data, px = [0, 0, 0];
      var ref = s.ref || 230, t = room.tint == null ? 0.3 : room.tint;
      for (var j = 0; j < ny; j++) {
        for (var i = 0; i < nx; i++) {
          var p = apply(g.H, corner[0] + (i + 0.5) / nx * ow, corner[1] + (j + 0.5) / ny * oh);
          pixel(s, p[0] * s.k, p[1] * s.k, px);
          var lum = Math.max(1, 0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2]);
          var k = lum / ref, o = (j * nx + i) * 4;
          for (var c = 0; c < 3; c++) d[o + c] = clamp(k * (1 - t + t * px[c] / lum), 0, 1) * 255;
          d[o + 3] = 255;
        }
      }
      lightCtx.putImageData(img, 0, 0);
      lightReady = true;
    }

    /* La obra se pinta en un solo lienzo: marco, obra, luz de la pared, brillo y grano. */
    function draw() {
      var L = look;
      if (!L) return;
      var max = 2000 / Math.max(L.lw, L.lh, 1);
      var sc = Math.min(L.dpr, max);
      var cw = Math.max(2, Math.round(L.lw * sc)), ch = Math.max(2, Math.round(L.lh * sc));
      if (render.width !== cw || render.height !== ch) { render.width = cw; render.height = ch; }
      var x = renderCtx;
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.globalCompositeOperation = "source-over";
      x.globalAlpha = 1;
      x.filter = "none";
      x.clearRect(0, 0, cw, ch);
      var rim = L.rim * sc, gap = L.gap * sc, pad = L.pad * sc;
      if (L.frame === "black" || L.frame === "oak") {
        if (L.frame === "oak") {
          var gr = x.createLinearGradient(0, 0, cw, ch);
          gr.addColorStop(0, "#c79f72"); gr.addColorStop(0.45, "#a9805a"); gr.addColorStop(0.7, "#c49b6d"); gr.addColorStop(1, "#9c7550");
          x.fillStyle = gr;
        } else x.fillStyle = "#1f1b19";
        x.fillRect(0, 0, cw, ch);
        x.fillStyle = L.frame === "oak" ? "#3a2c20" : "#0f0d0c";
        x.fillRect(rim, rim, cw - 2 * rim, ch - 2 * rim);
        x.strokeStyle = L.frame === "oak" ? "rgba(255,240,220,.18)" : "rgba(255,255,255,.07)";
        x.lineWidth = Math.max(1, sc * 0.6);
        x.strokeRect(x.lineWidth / 2, x.lineWidth / 2, cw - x.lineWidth, ch - x.lineWidth);
      }
      var iw = cw - 2 * pad, ih = ch - 2 * pad;
      x.fillStyle = L.tone;
      x.fillRect(pad, pad, iw, ih);
      var im = paintImg;
      if (im && im.complete && im.naturalWidth) {
        try { x.filter = "contrast(.95) saturate(.96) brightness(.99)"; } catch (err) { /* sin filtro */ }
        x.drawImage(im, pad, pad, iw, ih);
        x.filter = "none";
      }
      if (L.frame === "none") {
        x.strokeStyle = "rgba(0,0,0,.08)";
        x.lineWidth = Math.max(1, sc * 0.5);
        x.strokeRect(x.lineWidth / 2, x.lineWidth / 2, cw - x.lineWidth, ch - x.lineWidth);
      } else {
        x.strokeStyle = "rgba(0,0,0,.45)";
        x.lineWidth = Math.max(1, gap * 0.5);
        x.strokeRect(pad - x.lineWidth / 2, pad - x.lineWidth / 2, iw + x.lineWidth, ih + x.lineWidth);
      }
      if (lightReady) {
        x.globalCompositeOperation = "multiply";
        x.imageSmoothingEnabled = true;
        x.imageSmoothingQuality = "high";
        x.drawImage(light, 0, 0, cw, ch);
      }
      var dx = Math.sin(L.ang), dy = -Math.cos(L.ang), len = Math.abs(cw * dx) + Math.abs(ch * dy);
      var sh = x.createLinearGradient(cw / 2 - dx * len / 2, ch / 2 - dy * len / 2, cw / 2 + dx * len / 2, ch / 2 + dy * len / 2);
      sh.addColorStop(0, L.warm ? "rgba(255,236,200,.2)" : "rgba(255,255,255,.1)");
      sh.addColorStop(L.warm ? 0.48 : 0.44, "rgba(255,255,255,0)");
      x.globalCompositeOperation = "soft-light";
      x.fillStyle = sh;
      x.fillRect(0, 0, cw, ch);
      var gi = grainImage();
      if (gi) {
        var pat = x.createPattern(gi, "repeat");
        if (pat && pat.setTransform && window.DOMMatrix) pat.setTransform(new DOMMatrix().scale(220 * sc / gi.naturalWidth));
        x.globalCompositeOperation = "overlay";
        x.globalAlpha = 0.16;
        x.fillStyle = pat;
        x.fillRect(0, 0, cw, ch);
      }
      x.globalCompositeOperation = "source-over";
      x.globalAlpha = 1;
    }
    function grainImage() {
      if (grain.ready) return grain.img;
      if (!grain.img) {
        grain.img = new Image();
        grain.img.onload = function () { grain.ready = true; grain.waiting.forEach(function (fn) { fn(); }); grain.waiting = []; };
        grain.img.src = root() + "assets/brand/grain.png";
      }
      if (grain.waiting.indexOf(draw) < 0) grain.waiting.push(draw);
      return null;
    }

    function layout(keepCamera) {
      if (!state.work) return;
      var room = state.room;
      var g = prep(room);
      var W = view.clientWidth;
      var H = view.clientHeight;
      if (!W || !H) return;
      var iw = room.w, ih = room.h;
      var d = dims();
      var rim = state.frame === "none" ? 0 : 2.6;
      var gap = state.frame === "none" ? 0 : 0.9;
      var ow = d.w + 2 * (rim + gap);
      var oh = d.h + 2 * (rim + gap);
      var b = g.box;
      var k = Math.min(1, (b[2] - b[0]) / ow, (b[3] - b[1]) / oh);
      for (var n = 0; n < 3; n++) k = Math.min(k, roomFor(room, g, ow * k) / oh);
      ow *= k;
      oh *= k;
      var cmShown = Math.round(Math.max(d.w, d.h) * k);
      var cu, cv;
      if (state.pos) {
        cu = state.pos[0];
        cv = state.pos[1];
      } else {
        cu = g.at[0];
        cv = g.bottom ? g.at[1] - oh / 2 : g.at[1];
      }
      var c = place(room, g, cu, cv, ow, oh, !state.pos);
      cu = c[0];
      cv = c[1];
      if (state.pos) state.pos = [cu, cv];
      state.cur = [cu, cv];

      var cam = state.cam;
      if (!keepCamera || !cam || cam.W !== W || cam.H !== H) {
        var s = Math.max(W / iw, H / ih) * state.zoom;
        var vw = W / s, vh = H / s;
        var focus = state.zoom > 1 ? apply(g.H, cu, cv) : apply(g.H, g.at[0], g.bottom ? g.at[1] - 35 : g.at[1]);
        var ox = clamp(focus[0] - vw / 2, 0, Math.max(0, iw - vw));
        var oy = clamp(focus[1] - vh * (state.zoom > 1 ? 0.5 : 0.52), 0, Math.max(0, ih - vh));
        cam = state.cam = { s: s, ox: ox, oy: oy, W: W, H: H };
      }
      var sc = cam.s;
      photoImg.style.width = iw * sc + "px";
      photoImg.style.height = ih * sc + "px";
      photoImg.style.transform = "translate3d(" + (-cam.ox * sc) + "px," + (-cam.oy * sc) + "px,0)";
      photoImg.sizes = Math.round(iw * sc) + "px";
      if (room.front) {
        var fr = room.front.rect;
        front.style.width = (fr[2] - fr[0]) * iw * sc + "px";
        front.style.height = (fr[3] - fr[1]) * ih * sc + "px";
        front.style.transform = "translate3d(" + (fr[0] * iw - cam.ox) * sc + "px," + (fr[1] * ih - cam.oy) * sc + "px,0)";
      }

      function screen(u, v) {
        var p = apply(g.H, u, v);
        return [(p[0] - cam.ox) * sc, (p[1] - cam.oy) * sc];
      }
      var x0 = cu - ow / 2, y0 = cv - oh / 2;
      var quad = [screen(x0, y0), screen(x0 + ow, y0), screen(x0 + ow, y0 + oh), screen(x0, y0 + oh)];
      var e1 = screen(cu - 0.5, cv), e2 = screen(cu + 0.5, cv), e3 = screen(cu, cv - 0.5), e4 = screen(cu, cv + 0.5);
      var u = Math.max(0.5, Math.hypot(e2[0] - e1[0], e2[1] - e1[1]), Math.hypot(e4[0] - e3[0], e4[1] - e3[1]));
      var lw = ow * u, lh = oh * u;
      art.style.width = lw + "px";
      art.style.height = lh + "px";
      art.style.transform = matrix3d(solve([[0, 0], [lw, 0], [lw, lh], [0, lh]], quad));

      var pad = (rim + gap) * u * k;
      el.dataset.frame = state.frame;

      var lx = room.light[0], ly = room.light[1];
      var depth = state.frame === "none" ? 1 : 0.8;
      art.style.boxShadow =
        (lx * 0.5 * u) + "px " + (ly * 0.8 * u * depth) + "px " + (1.4 * u) + "px rgba(28,20,12," + (room.warm ? 0.34 : 0.28) + ")," +
        (lx * 3.2 * u) + "px " + (ly * 4.6 * u * depth) + "px " + (11 * u) + "px rgba(28,20,12," + (room.warm ? 0.24 : 0.18) + ")";
      var smp = sampler(room);
      lightReady = lightReady && smp.ready;
      if (smp.ready) paintLight(room, g, [x0, y0], ow, oh, smp);
      else lightReady = false;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      if (paintImg) paintImg.sizes = Math.round((Math.max(lw, lh) - 2 * pad) * dpr) + "px";
      look = { lw: lw, lh: lh, rim: rim * u * k, gap: gap * u * k, pad: pad, frame: state.frame, ang: Math.atan2(ly, lx) + Math.PI / 2, warm: !!room.warm, tone: state.work.tone || "#ddd", dpr: dpr };
      draw();

      if (cmShown !== last.cm || d.real !== last.real || room.id !== last.room) {
        last = { cm: cmShown, real: d.real, room: room.id };
        if (opts.onChange) opts.onChange({ cm: cmShown, real: d.real, room: room });
      }
    }

    function wallAt(clientX, clientY) {
      var vr = view.getBoundingClientRect();
      var cam = state.cam;
      var g = prep(state.room);
      return apply(g.Hi, (clientX - vr.left) / cam.s + cam.ox, (clientY - vr.top) / cam.s + cam.oy);
    }

    var drag = null;
    if (opts.interactive) {
      art.addEventListener("pointerdown", function (event) {
        if (event.button || !state.cam || !state.cur) return;
        event.preventDefault();
        art.setPointerCapture(event.pointerId);
        drag = { at: wallAt(event.clientX, event.clientY), start: state.cur.slice() };
        el.classList.add("is-dragging");
      });
      art.addEventListener("pointermove", function (event) {
        if (!drag) return;
        var now = wallAt(event.clientX, event.clientY);
        state.pos = [drag.start[0] + now[0] - drag.at[0], drag.start[1] + now[1] - drag.at[1]];
        layout(true);
      });
      var end = function () {
        if (!drag) return;
        drag = null;
        el.classList.remove("is-dragging");
        if (opts.onMove) opts.onMove();
      };
      art.addEventListener("pointerup", end);
      art.addEventListener("pointercancel", end);
      art.addEventListener("keydown", function (event) {
        var step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
        if (!step || !state.cur) return;
        event.preventDefault();
        event.stopPropagation();
        var b = prep(state.room).box;
        state.pos = [state.cur[0] + step[0] * (b[2] - b[0]) * 0.02, state.cur[1] + step[1] * (b[3] - b[1]) * 0.02];
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
        lightKey = "";
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
