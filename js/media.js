(function () {
  function widths(work) {
    return work.widths || [];
  }

  window.artSrcset = function (work, ext) {
    var list = widths(work);
    if (!list.length) return "";
    if (ext === "jpg") {
      var small = list.filter(function (w) { return w < work.w - 1; }).map(function (w) {
        return "assets/media/works/" + work.id + "-" + w + ".jpg " + w + "w";
      });
      small.push(work.image + " " + work.w + "w");
      return small.join(", ");
    }
    return list.map(function (w) {
      return "assets/media/works/" + work.id + "-" + w + "." + ext + " " + w + "w";
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
    img.src = mid && mid < work.w - 1
      ? "assets/media/works/" + work.id + "-" + mid + ".jpg"
      : work.image;
    img.srcset = window.artSrcset(work, "jpg");
    if (opts.sizes) img.sizes = opts.sizes;
    img.alt = opts.alt || (work.title + ", pintura de Rocío Villamizar");
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
    if (work.medium) bits.push(String(work.medium));
    if (work.widthCm && work.heightCm) bits.push(work.widthCm + " × " + work.heightCm + " cm");
    else if (work.widthCm) bits.push(work.widthCm + " cm de ancho");
    else if (work.heightCm) bits.push(work.heightCm + " cm de alto");
    if (work.available) bits.push("Precio a consulta");
    return bits;
  };

  window.artWa = function (text) {
    return "https://wa.me/50689877207?text=" + encodeURIComponent(text);
  };

  window.artAsk = function (work) {
    return work.available
      ? "Hola Rocío, me interesa la obra " + work.title + ". ¿Sigue disponible?"
      : "Hola Rocío, me interesa la obra " + work.title + ". ¿Me cuentas si está disponible?";
  };
})();
