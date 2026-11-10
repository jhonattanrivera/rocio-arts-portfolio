(function () {
  var WORKS = window.WORKS || [];
  var byId = {};
  WORKS.forEach(function (work) { byId[work.id] = work; });

  var IDS = [
    "serenidad", "marilyn", "ocean-eyes",
    "el-camino", "forever", "cidade-maravilhosa", "summer", "oceano",
    "take-my-hand", "my-love", "familia", "junto-a-ti", "memorias-2",
    "mi-lugar-feliz", "urban-city", "abstracto-azul"
  ];

  var wall = document.querySelector("[data-wall]");
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

  if (wall && window.artPicture) {
    IDS.forEach(function (id) {
      var work = byId[id];
      if (!work) return;
      var link = document.createElement("a");
      link.className = "wall-card";
      link.href = "obras.html#" + work.id;
      link.dataset.openSheet = work.id;
      link.style.setProperty("--tone", work.tone || "#e7e1d8");
      link.append(window.artPicture(work, {
        sizes: "(min-width: 900px) 30vw, 46vw",
        alt: window.artAlt ? window.artAlt(work) : work.title
      }));
      var cap = document.createElement("span");
      cap.textContent = work.title;
      link.append(cap);
      wall.append(link);
    });
  }

  function fill(work) {
    if (!sheet) return;
    photo.replaceChildren(window.artPicture(work, {
      sizes: "(min-width: 700px) 520px, 92vw",
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
    var closeBtn = sheet.querySelector("[data-sheet-close]");
    if (closeBtn) closeBtn.focus();
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
