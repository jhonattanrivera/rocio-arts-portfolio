(function () {
  var WORKS = window.WORKS || [];
  var byId = {};
  WORKS.forEach(function (work) { byId[work.id] = work; });

  var IDS = window.GARDEN_IDS || [];

  /* Los cuadros livianos del jardín se piden ya, en paralelo con el motor 3D, y el
     jardín los encuentra en caché al colgarlos (mismo modo CORS que three.js).
     Con fetch, para no atrasar el evento load de la página. */
  if (document.getElementById("sala") && window.fetch) {
    var root = (window.SITE && window.SITE.root) || "";
    IDS.forEach(function (id) {
      window.fetch(root + "assets/media/garden/" + id + ".webp", { mode: "cors", credentials: "same-origin", priority: "low" }).catch(function () {});
    });
  }

  var sheet = document.getElementById("sheet");
  var photo = sheet && sheet.querySelector(".sheet-photo");
  var title = document.getElementById("sheet-title");
  var facts = sheet && sheet.querySelector(".sheet-facts");
  var desc = sheet && sheet.querySelector(".sheet-desc");
  var status = sheet && sheet.querySelector(".sheet-status");
  var ask = document.getElementById("sheet-ask");
  var more = document.getElementById("sheet-more");
  var lastFocus = null;
  var openId = "";

  function fill(work) {
    if (!sheet) return;
    photo.replaceChildren(window.artPicture(work, {
      sizes: "(min-width: 1100px) 600px, (min-width: 760px) 52vw, 92vw",
      eager: true
    }));
    photo.style.background = work.tone || "#e7e1d8";
    title.textContent = work.title;
    var bits = window.artFacts(work);
    facts.textContent = bits.join(" · ");
    facts.hidden = !bits.length;
    desc.textContent = window.workText ? window.workText(work) : work.description;
    status.hidden = !work.available;
    status.textContent = work.available ? (window.ui ? window.ui("available") : "Disponible") : "";
    ask.href = window.artWa(window.artAsk(work));
    ask.textContent = window.ui ? window.ui("consult") : "Consultar esta obra";
    more.href = "obras.html#" + work.id;
  }

  function open(id) {
    var work = byId[id];
    if (!work || !sheet) return false;
    lastFocus = document.activeElement;
    openId = id;
    fill(work);
    sheet.hidden = false;
    document.body.dataset.sheet = "open";
    requestAnimationFrame(function () { sheet.classList.add("is-in"); });
    var card = sheet.querySelector(".sheet-card");
    if (card) card.focus({ preventScroll: true });
    if (location.hash !== "#" + id) history.replaceState({ sheet: id }, "", "#" + id);
    return true;
  }

  function close() {
    if (!sheet || sheet.hidden) return;
    openId = "";
    sheet.classList.remove("is-in");
    sheet.hidden = true;
    delete document.body.dataset.sheet;
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest("[data-open-sheet]");
    if (opener) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
      event.preventDefault();
      open(opener.dataset.openSheet);
      return;
    }
    if (event.target.closest("[data-sheet-close]") || event.target === sheet) close();
  });

  document.addEventListener("keydown", function (event) {
    if (!sheet || sheet.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    var items = Array.prototype.slice.call(sheet.querySelectorAll("button, a"));
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  var start = decodeURIComponent(location.hash.replace("#", ""));
  if (start && byId[start]) open(start);

  window.SALA = {
    ids: IDS,
    byId: byId,
    open: open,
    close: close,
    get openId() { return openId; }
  };
})();
