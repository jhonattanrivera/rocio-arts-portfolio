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

  window.artPicture = function (work, opts) {
    opts = opts || {};
    var pic = document.createElement("picture");
    var avif = document.createElement("source");
    avif.type = "image/avif";
    avif.srcset = window.artSrcset(work, "avif");
    var webp = document.createElement("source");
    webp.type = "image/webp";
    webp.srcset = window.artSrcset(work, "webp");
    if (opts.sizes) {
      avif.sizes = opts.sizes;
      webp.sizes = opts.sizes;
    }
    var img = document.createElement("img");
    var list = widths(work);
    var mid = list.find(function (w) { return w >= 640 && w < work.w - 1; }) || list[0];
    img.src = asset(mid && mid < work.w - 1
      ? "assets/media/works/" + work.id + "-" + mid + ".jpg"
      : work.image);
    img.srcset = window.artSrcset(work, "jpg");
    if (opts.sizes) img.sizes = opts.sizes;
    img.alt = opts.alt || (window.artAlt ? window.artAlt(work) : work.title);
    img.width = work.w;
    img.height = work.h;
    img.decoding = "async";
    if (opts.eager) img.fetchPriority = "high";
    else img.loading = "lazy";
    pic.append(avif, webp, img);
    return pic;
  };

  window.artFacts = function (work) {
    var bits = [];
    if (work.year) bits.push(String(work.year));
    if (work.medium) bits.push(String(window.SITE && window.SITE.lang === "en" && work.mediumEn ? work.mediumEn : work.medium));
    if (work.widthCm && work.heightCm) bits.push(work.widthCm + " × " + work.heightCm + " cm");
    else if (work.widthCm) bits.push(work.widthCm + (window.ui ? window.ui("cmWide") : " cm"));
    else if (work.heightCm) bits.push(work.heightCm + (window.ui ? window.ui("cmHigh") : " cm"));
    if (work.available) bits.push(window.ui ? window.ui("price") : "Precio a consulta");
    return bits;
  };

  window.artWa = function (text) {
    return "https://wa.me/50689877207?text=" + encodeURIComponent(text);
  };

  window.artAsk = function (work) {
    var en = window.SITE && window.SITE.lang === "en";
    return work.available
      ? (en
        ? "Hello Rocio, I am interested in the work " + work.title + ". Is it still available?"
        : "Hola Rocio, me interesa la obra " + work.title + ". ¿Sigue disponible?")
      : (en
        ? "Hello Rocio, I am interested in the work " + work.title + ". Could you tell me if it is available?"
        : "Hola Rocio, me interesa la obra " + work.title + ". ¿Me cuentas si está disponible?");
  };
})();
