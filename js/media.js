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
    img.srcset = window.artSrcset(work, "jpg");
    img.src = asset(mid && mid < work.w - 1
      ? "assets/media/works/" + work.id + "-" + mid + ".jpg"
      : work.image);
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
