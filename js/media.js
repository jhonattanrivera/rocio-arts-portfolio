(function () {
  function widths(work) {
    return work.widths || [];
  }

  function asset(path) {
    var root = (window.SITE && window.SITE.root) || "";
    if (!path || /^(https?:|data:|\.\.)/.test(path)) return path;
    return root + path;
  }

  window.artSrcset = function (work, ext) {
    var list = widths(work);
    if (!list.length) return "";
    if (ext === "avif" && work.avif === false) return "";
    if (ext === "jpg") {
      var small = list.filter(function (w) { return w < work.w - 1; }).map(function (w) {
        return asset("assets/media/works/" + work.id + "-" + w + ".jpg") + " " + w + "w";
      });
      small.push(asset(work.image) + " " + work.w + "w");
      return small.join(", ");
    }
    return list.map(function (w) {
      return asset("assets/media/works/" + work.id + "-" + w + "." + ext) + " " + w + "w";
    }).join(", ");
  };

  /* Vista previa de cada obra: una cuadrícula mínima de sus colores
     (work.blur, "columnas.base64 RGB") que se agranda con una curva
     B-spline. Queda como un campo de color difuminado, igual a la obra
     desenfocada, y está lista antes de que llegue la imagen. */
  var blurCache = {};
  var blurCanvas = null;
  var SCALE = 6;
  function bspline(t) {
    var t2 = t * t, t3 = t2 * t;
    return [(1 - 3 * t + 3 * t2 - t3) / 6, (4 - 6 * t2 + 3 * t3) / 6, (1 + 3 * t + 3 * t2 - 3 * t3) / 6, t3 / 6];
  }
  /* para cada pixel de salida: los 4 vecinos de la cuadrícula y su peso */
  function taps(n, m) {
    var list = [];
    for (var o = 0; o < m; o++) {
      var u = (o + 0.5) / SCALE - 0.5;
      var i = Math.floor(u);
      var w = bspline(u - i);
      var idx = [];
      for (var k = 0; k < 4; k++) idx.push(Math.min(n - 1, Math.max(0, i - 1 + k)));
      list.push({ i: idx, w: w });
    }
    return list;
  }
  window.artBlur = function (work) {
    if (!work || !work.blur) return "";
    if (blurCache[work.id]) return blurCache[work.id];
    try {
      var dot = work.blur.indexOf(".");
      var cols = parseInt(work.blur.slice(0, dot), 10);
      var bin = window.atob(work.blur.slice(dot + 1));
      var rows = Math.round(bin.length / 3 / cols);
      var grid = new Float32Array(cols * rows * 3);
      for (var b = 0; b < grid.length; b++) grid[b] = bin.charCodeAt(b);
      var W = cols * SCALE, H = rows * SCALE;
      /* primero a lo ancho, fila por fila; luego a lo alto */
      var tx = taps(cols, W), ty = taps(rows, H);
      var wide = new Float32Array(W * rows * 3);
      var tall = new Float32Array(W * H * 3);
      var r, x, y, k, ch, t, s;
      for (r = 0; r < rows; r++) for (x = 0; x < W; x++) {
        t = tx[x];
        for (ch = 0; ch < 3; ch++) {
          s = 0;
          for (k = 0; k < 4; k++) s += t.w[k] * grid[(r * cols + t.i[k]) * 3 + ch];
          wide[(r * W + x) * 3 + ch] = s;
        }
      }
      for (y = 0; y < H; y++) {
        t = ty[y];
        for (x = 0; x < W; x++) for (ch = 0; ch < 3; ch++) {
          s = 0;
          for (k = 0; k < 4; k++) s += t.w[k] * wide[(t.i[k] * W + x) * 3 + ch];
          tall[(y * W + x) * 3 + ch] = s;
        }
      }
      if (!blurCanvas) blurCanvas = document.createElement("canvas");
      blurCanvas.width = W;
      blurCanvas.height = H;
      var ctx = blurCanvas.getContext("2d");
      var img = ctx.createImageData(W, H);
      for (var p = 0; p < W * H; p++) {
        img.data[p * 4] = tall[p * 3];
        img.data[p * 4 + 1] = tall[p * 3 + 1];
        img.data[p * 4 + 2] = tall[p * 3 + 2];
        img.data[p * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      blurCache[work.id] = blurCanvas.toDataURL("image/png");
    } catch (err) {
      blurCache[work.id] = "";
    }
    return blurCache[work.id];
  };

  /* La imagen nítida aparece sobre la vista previa cuando ya está
     decodificada, para que el fundido no se trabe a mitad de camino.
     Las que llegan lejos de la pantalla se marcan listas sin más. */
  function settle(pic, img) {
    if (pic.classList.contains("is-ready")) return;
    function show() { pic.classList.add("is-ready"); }
    var r = img.getBoundingClientRect();
    var near = r.bottom > -window.innerHeight && r.top < window.innerHeight * 2;
    if (near && img.decode) img.decode().then(show, show);
    else show();
  }

  /* El orden importa: loading, sizes y las <source> tienen que estar
     antes de dar src. Si no, Safari descarga la imagen al instante
     (sin esperar al scroll) y en JPG, y luego otra vez en AVIF o WebP. */
  window.artPicture = function (work, opts) {
    opts = opts || {};
    var pic = document.createElement("picture");
    var avif = document.createElement("source");
    avif.type = "image/avif";
    var webp = document.createElement("source");
    webp.type = "image/webp";
    if (opts.sizes) {
      avif.sizes = opts.sizes;
      webp.sizes = opts.sizes;
    }
    avif.srcset = window.artSrcset(work, "avif");
    webp.srcset = window.artSrcset(work, "webp");
    if (avif.srcset) pic.append(avif);
    pic.append(webp);
    var img = document.createElement("img");
    if (opts.eager) img.fetchPriority = opts.priority || "high";
    else img.loading = "lazy";
    img.decoding = "async";
    img.alt = opts.alt || (window.artAlt ? window.artAlt(work) : work.title);
    img.width = work.w;
    img.height = work.h;
    if (opts.sizes) img.sizes = opts.sizes;
    pic.append(img);
    var list = widths(work);
    var mid = list.find(function (w) { return w >= 640 && w < work.w - 1; }) || list[0];
    var blur = opts.blur ? window.artBlur(work) : "";
    if (blur) {
      pic.className = "art-blur";
      pic.style.setProperty("--blur", 'url("' + blur + '")');
      img.addEventListener("load", function () { settle(pic, img); });
      img.addEventListener("error", function () { pic.classList.add("is-ready"); });
    }
    img.srcset = window.artSrcset(work, "jpg");
    img.src = asset(mid && mid < work.w - 1
      ? "assets/media/works/" + work.id + "-" + mid + ".jpg"
      : work.image);
    /* ya en memoria: sin fundido */
    if (blur && img.complete && img.naturalWidth) pic.classList.add("is-ready");
    return pic;
  };

  /* sizes de la cuadrícula de Obras. La precarga del inicio usa el mismo,
     para que el navegador elija exactamente el mismo archivo. */
  window.ART_GRID_SIZES = "(min-width: 1280px) 23vw, (min-width: 900px) 30vw, (min-width: 560px) 45vw, 47vw";

  /* Precarga en segundo plano: nunca con ahorro de datos ni en 2G. */
  window.artCanWarm = function () {
    var c = navigator.connection;
    if (!c) return true;
    if (c.saveData) return false;
    return !/(^|-)2g$/.test(c.effectiveType || "");
  };

  /* Espera a que la página haya cargado y el navegador esté libre. */
  window.artWhenIdle = function (fn, delay) {
    function idle() {
      window.setTimeout(function () {
        if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 4000 });
        else fn();
      }, delay || 0);
    }
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  };

  window.artFacts = function (work) {
    var bits = [];
    if (work.year) bits.push(String(work.year));
    if (work.medium) bits.push(String(window.SITE && window.SITE.lang === "en" && work.mediumEn ? work.mediumEn : work.medium));
    if (work.widthCm && work.heightCm) bits.push(work.widthCm + " × " + work.heightCm + " cm");
    else if (work.widthCm) bits.push(work.widthCm + (window.ui ? window.ui("cmWide") : " cm"));
    else if (work.heightCm) bits.push(work.heightCm + (window.ui ? window.ui("cmHigh") : " cm"));
    if (work.available && window.SITE_FLAGS && window.SITE_FLAGS.showAvailable) bits.push(window.ui ? window.ui("price") : "Precio a consulta");
    return bits;
  };

  window.artWa = function (text) {
    return "https://wa.me/50689877207?text=" + encodeURIComponent(text);
  };

  window.artAsk = function (work) {
    var en = window.SITE && window.SITE.lang === "en";
    return work.available && window.SITE_FLAGS && window.SITE_FLAGS.showAvailable
      ? (en
        ? "Hello Rocio, I am interested in the work " + work.title + ". Is it still available?"
        : "Hola Rocio, me interesa la obra " + work.title + ". ¿Sigue disponible?")
      : (en
        ? "Hello Rocio, I am interested in the work " + work.title + ". Could you tell me if it is available?"
        : "Hola Rocio, me interesa la obra " + work.title + ". ¿Me cuentas si está disponible?");
  };
})();
