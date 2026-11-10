(function () {
  var WORKS = window.WORKS || [];
  var byId = {};
  WORKS.forEach(function (work) { byId[work.id] = work; });
  var html = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var ROOT = (window.SITE && window.SITE.root) || "";

  var RAIL = ["marilyn", "ocean-eyes", "el-camino", "flores", "cidade-maravilhosa", "junto-a-ti", "abbey-road", "summer", "forever"];
  var DEMO = [["el-camino", "comedor"], ["ocean-eyes", "sala"], ["bruma-floral", "habitacion"], ["mi-lugar-feliz", "escalera"], ["flores", "tarde"], ["urban-city", "entrada"]];

  function t(key) { return window.ui ? window.ui(key) : key; }
  function wa(text) { return window.artWa ? window.artWa(text) : "https://wa.me/50689877207?text=" + encodeURIComponent(text); }
  function facts(work) { return window.artFacts ? window.artFacts(work) : []; }
  function askText(work) { return window.artAsk ? window.artAsk(work) : "Hola Rocio, me interesa la obra " + work.title + "."; }
  function textOf(work) { return window.workText ? window.workText(work) : work.description; }
  function altOf(work) { return window.artAlt ? window.artAlt(work) : work.title; }
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (err) { return null; }
    return value;
  }
  var SHOW_AVAILABLE = !!(window.SITE_FLAGS && window.SITE_FLAGS.showAvailable);
  if (!SHOW_AVAILABLE && document.body.classList.contains("page-disponible")) {
    location.replace("obras.html");
    return;
  }
  document.querySelectorAll(".filters").forEach(function (node) { node.hidden = !SHOW_AVAILABLE; });
  function availableList() {
    return WORKS.filter(function (work) { return work.available; })
      .sort(function (a, b) { return a.available - b.available; });
  }
  function pad2(n) { return String(n).padStart(2, "0"); }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* Navegación */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var menuOpen = false;
  var viewerOpen = false;
  var lockY = 0;

  function syncLock() {
    var on = menuOpen || viewerOpen;
    if (on) {
      if (!document.body.classList.contains("is-locked")) {
        lockY = window.scrollY;
        document.body.style.top = "-" + lockY + "px";
        document.body.classList.add("is-locked");
      }
    } else if (document.body.classList.contains("is-locked")) {
      document.body.classList.remove("is-locked");
      document.body.style.top = "";
      window.scrollTo(0, lockY);
    }
  }

  function setMenu(open) {
    menuOpen = open;
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    nav.classList.remove("is-tucked");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? t("close") : t("menu");
    document.querySelectorAll("main, .footer").forEach(function (node) {
      if (open) node.setAttribute("inert", "");
      else if (!viewerOpen) node.removeAttribute("inert");
    });
    syncLock();
  }

  if (toggle) toggle.addEventListener("click", function () { setMenu(!menuOpen); });
  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    var navTick = false;
    var navY = window.scrollY;
    function paintNav() {
      navTick = false;
      var y = window.scrollY;
      nav.classList.toggle("is-solid", y > 12);
      if (!menuOpen && y > navY + 4 && y > 240) nav.classList.add("is-tucked");
      if (y < navY - 4 || y < 120) nav.classList.remove("is-tucked");
      navY = y;
    }
    window.addEventListener("scroll", function () {
      if (navTick) return;
      navTick = true;
      requestAnimationFrame(paintNav);
    }, { passive: true });
    paintNav();
  }

  /* Aparición al hacer scroll */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  function watch(node) {
    if (!node) return;
    if (reduce) { node.classList.add("is-in"); return; }
    io.observe(node);
  }
  document.querySelectorAll(".reveal, .rise, .eyebrow").forEach(watch);

  /* Frases que se encienden palabra por palabra con el scroll */
  var glowing = [];
  document.querySelectorAll("[data-words]").forEach(function (node) {
    var words = [];
    function split(parent) {
      Array.prototype.slice.call(parent.childNodes).forEach(function (child) {
        if (child.nodeType === 1) { split(child); return; }
        if (child.nodeType !== 3) return;
        var holder = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { holder.append(part); return; }
          var span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          words.push(span);
          holder.append(span);
        });
        parent.replaceChild(holder, child);
      });
    }
    split(node);
    glowing.push({ node: node, words: words });
  });
  function paintWords() {
    var vh = window.innerHeight;
    glowing.forEach(function (item) {
      var r = item.node.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 1.5) return;
      var p = reduce ? 1 : Math.max(0, Math.min(1, (vh * 0.86 - r.top) / (vh * 0.55)));
      var lit = p * (item.words.length + 1);
      item.words.forEach(function (w, i) {
        w.style.opacity = String(0.16 + 0.84 * Math.max(0, Math.min(1, lit - i)));
      });
    });
  }

  /* Hero: la pintura se queda atrás al bajar */
  var heroPic = document.querySelector(".hero-media picture");
  function paintHero() {
    if (!heroPic || reduce) return;
    var y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    heroPic.style.transform = "translate3d(0," + (y * 0.2).toFixed(1) + "px,0)";
  }

  /* Riel de selección: el scroll vertical lo mueve de lado */
  var rail = document.querySelector("[data-rail]");
  var railTrack = rail && rail.querySelector("[data-mount='rail']");
  var railCount = rail && rail.querySelector("[data-rail-count]");
  var railBar = rail && rail.querySelector("[data-rail-bar]");
  var railCards = [];
  var railPinned = false;
  var railExtra = 0;
  if (railTrack && window.artPicture) {
    RAIL.forEach(function (id, i) {
      var work = byId[id];
      if (!work) return;
      var link = document.createElement("a");
      link.className = "rail-card";
      link.href = "obras.html#" + work.id;
      link.dataset.open = work.id;
      link.dataset.cursor = t("seeRoomShort");
      link.style.setProperty("--ratio", (work.w / work.h).toFixed(4));
      link.setAttribute("aria-label", t("open") + work.title);
      var frame = document.createElement("span");
      frame.className = "rail-frame";
      frame.append(window.artPicture(work, { sizes: "(min-width: 980px) 40vw, 80vw", alt: altOf(work) }));
      var cap = document.createElement("span");
      cap.className = "rail-cap";
      var n = document.createElement("span");
      n.className = "rail-n";
      n.textContent = pad2(i + 1);
      var title = document.createElement("span");
      title.className = "rail-title";
      title.textContent = work.title;
      cap.append(n, title);
      link.append(frame, cap);
      railTrack.append(link);
      railCards.push(link);
    });
    railPinned = !reduce;
    rail.classList.toggle("is-pinned", railPinned);
  }
  function sizeRail() {
    if (!railPinned || !railTrack) return;
    railExtra = Math.max(0, railTrack.scrollWidth - railTrack.clientWidth);
    rail.style.height = (window.innerHeight + railExtra) + "px";
  }
  function paintRail() {
    if (!railPinned || !railTrack) return;
    var r = rail.getBoundingClientRect();
    var p = railExtra ? Math.max(0, Math.min(1, -r.top / railExtra)) : 0;
    railTrack.style.transform = "translate3d(" + (-p * railExtra).toFixed(1) + "px,0,0)";
    if (railBar) railBar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    if (railCount && railCards.length) {
      var i = Math.min(railCards.length - 1, Math.round(p * (railCards.length - 1)));
      railCount.textContent = pad2(i + 1) + " / " + pad2(railCards.length);
    }
  }

  var scrollTick = false;
  function onScroll() {
    scrollTick = false;
    paintWords();
    paintHero();
    paintRail();
  }
  window.addEventListener("scroll", function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener("resize", function () { sizeRail(); onScroll(); });
  window.addEventListener("load", function () { sizeRail(); onScroll(); });
  if (railTrack) railTrack.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("load", sizeRail, { once: true });
  });
  sizeRail();
  onScroll();

  /* Intro: el brochazo, la firma, y la firma que vuela al menú */
  var intro = document.getElementById("intro");
  function heroGo() { html.classList.add("hero-go"); }
  if (intro && html.classList.contains("show-intro")) {
    var introDone = false;
    var logo = intro.querySelector(".intro-logo");
    var brand = document.querySelector(".nav .brand svg");
    var leaveTimer = window.setTimeout(leave, 2050);
    function leave() {
      if (introDone) return;
      introDone = true;
      window.clearTimeout(leaveTimer);
      try { sessionStorage.setItem("rocio-intro", "1"); } catch (err) { /* privado */ }
      if (logo && brand) {
        var a = logo.getBoundingClientRect();
        var b = brand.getBoundingClientRect();
        if (a.width && b.width) {
          logo.style.transformOrigin = "0 0";
          logo.style.transform = "translate(" + (b.left - a.left) + "px," + (b.top - a.top) + "px) scale(" + (b.width / a.width) + ")";
        }
      }
      intro.classList.add("is-leaving");
      heroGo();
      window.setTimeout(function () {
        html.classList.remove("show-intro");
        intro.remove();
      }, 1050);
    }
    intro.addEventListener("pointerdown", leave);
    document.addEventListener("keydown", function (event) {
      if (!introDone && (event.key === "Escape" || event.key === "Enter" || event.key === " ")) leave();
    });
  } else {
    if (intro) intro.remove();
    requestAnimationFrame(heroGo);
  }

  /* Cursor con palabra, solo con mouse */
  if (fine && !reduce) {
    var cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    var cursorWord = "";
    window.addEventListener("pointermove", function (event) {
      cursor.style.transform = "translate3d(" + event.clientX + "px," + event.clientY + "px,0)";
      var target = event.target.closest ? event.target.closest("[data-open], [data-cursor]") : null;
      if (target && target.closest(".viewer")) target = null;
      var next = target ? (target.dataset.cursor || t("view")) : "";
      if (next !== cursorWord) {
        cursorWord = next;
        cursor.textContent = next;
        cursor.classList.toggle("is-on", !!next);
      }
    }, { passive: true });
    document.addEventListener("pointerleave", function () { cursor.classList.remove("is-on"); });
  }

  /* Caminos: la imagen sigue al mouse */
  var paths = document.querySelector(".paths");
  if (paths && fine && !reduce) {
    var float = document.createElement("div");
    float.className = "path-float";
    float.setAttribute("aria-hidden", "true");
    document.body.append(float);
    paths.querySelectorAll("a").forEach(function (link) {
      var img = link.querySelector("img");
      link.addEventListener("pointerenter", function () {
        if (!img) return;
        float.style.backgroundImage = "url(\"" + (img.currentSrc || img.src) + "\")";
        float.classList.add("is-on");
      });
      link.addEventListener("pointerleave", function () { float.classList.remove("is-on"); });
      link.addEventListener("pointermove", function (event) {
        float.style.transform = "translate3d(" + (event.clientX + 28) + "px," + (event.clientY - 130) + "px,0) rotate(-2.5deg)";
      });
    });
  }

  /* Demostración de la sala en el inicio */
  var demoHost = document.querySelector("[data-mount='room-demo']");
  if (demoHost && window.Room) {
    var demo = window.Room.create(demoHost, { room: DEMO[0][1] });
    var demoI = 0;
    var demoLabel = document.querySelector("[data-demo-label]");
    var demoTimer = null;
    function demoShow(i) {
      var pair = DEMO[i % DEMO.length];
      var work = byId[pair[0]];
      if (!work) return;
      demo.setRoom(pair[1]);
      demo.setWork(work);
      demoHost.dataset.open = work.id;
      demoHost.dataset.mode = "room";
      demoHost.dataset.room = pair[1];
      if (demoLabel) demoLabel.textContent = work.title + " · " + window.Room.name(demo.room);
    }
    function demoTick() {
      demoI++;
      demoHost.classList.add("is-fading");
      window.setTimeout(function () {
        demoShow(demoI);
        window.setTimeout(function () { demoHost.classList.remove("is-fading"); }, 160);
      }, 450);
    }
    demoShow(0);
    new IntersectionObserver(function (entries) {
      window.clearInterval(demoTimer);
      if (entries[0].isIntersecting && !reduce) demoTimer = window.setInterval(demoTick, 4600);
    }, { threshold: 0.3 }).observe(demoHost);
  }

  /* Galería y catálogo */
  var masonry = document.querySelector("[data-mount='masonry']");
  var catalog = document.querySelector("[data-mount='catalog']");
  var countNode = document.querySelector("[data-count]");
  var visible = WORKS.slice();

  function card(work, opts) {
    var link = document.createElement("a");
    link.className = opts.className;
    link.href = opts.href || ("#" + work.id);
    link.dataset.open = work.id;
    if (opts.cursor) link.dataset.cursor = opts.cursor;
    link.style.setProperty("--tone", work.tone || "#e7e1d8");
    link.style.setProperty("--ratio", (work.w / work.h).toFixed(4));
    link.setAttribute("aria-label", t("open") + work.title);
    var frame = document.createElement("span");
    frame.className = "frame";
    if (window.artPicture) {
      frame.append(window.artPicture(work, { sizes: opts.sizes, eager: opts.eager, alt: altOf(work) }));
    }
    link.append(frame);
    return link;
  }

  function renderMasonry(list) {
    if (!masonry || !window.artPicture) return;
    visible = list;
    masonry.replaceChildren();
    list.forEach(function (work, i) {
      var link = card(work, {
        className: "card reveal",
        href: "#" + work.id,
        eager: i < 4,
        cursor: t("seeRoomShort"),
        sizes: "(min-width: 1280px) 23vw, (min-width: 900px) 30vw, (min-width: 560px) 45vw, 47vw"
      });
      link.style.setProperty("--d", ((i % 4) * 70) + "ms");
      var cap = document.createElement("span");
      cap.className = "card-cap";
      var title = document.createElement("span");
      title.className = "card-title";
      title.textContent = work.title;
      cap.append(title);
      if (work.available && SHOW_AVAILABLE) {
        var note = document.createElement("span");
        note.className = "card-note";
        note.textContent = t("available");
        cap.append(note);
      }
      link.append(cap);
      masonry.append(link);
      watch(link);
    });
    if (countNode) countNode.textContent = String(list.length);
  }

  function renderCatalog(list) {
    if (!catalog || !window.artPicture) return;
    catalog.replaceChildren();
    list.forEach(function (work, i) {
      var item = document.createElement("article");
      item.className = "catalog-item reveal";
      item.dataset.work = work.id;
      var link = card(work, {
        className: "catalog-frame",
        href: "obras.html#" + work.id,
        cursor: t("seeRoomShort"),
        sizes: "(min-width: 980px) 50vw, 92vw"
      });
      link.dataset.mode = "room";
      var copy = document.createElement("div");
      copy.className = "catalog-copy";
      var n = document.createElement("p");
      n.className = "catalog-n";
      n.textContent = pad2(i + 1);
      var heading = document.createElement("h2");
      heading.textContent = work.title;
      var meta = document.createElement("p");
      meta.className = "catalog-facts";
      var bits = facts(work);
      meta.textContent = bits.join(" · ");
      meta.hidden = !bits.length;
      var text = document.createElement("p");
      text.className = "catalog-text";
      text.textContent = textOf(work);
      var row = document.createElement("p");
      row.className = "catalog-actions";
      var roomBtn = document.createElement("button");
      roomBtn.type = "button";
      roomBtn.className = "button";
      roomBtn.dataset.open = work.id;
      roomBtn.dataset.mode = "room";
      roomBtn.textContent = t("seeRoom");
      var ask = document.createElement("a");
      ask.className = "text-link";
      ask.href = wa(askText(work));
      ask.target = "_blank";
      ask.rel = "noopener noreferrer";
      ask.textContent = t("consult");
      row.append(roomBtn, ask);
      copy.append(n, heading, meta, text, row);
      item.append(link, copy);
      catalog.append(item);
      watch(item);
    });
  }

  if (masonry) { masonry.dataset.cycle = "visible"; renderMasonry(WORKS); }
  if (catalog) { catalog.dataset.cycle = "available"; renderCatalog(availableList()); }

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-filter]").forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      var list = button.dataset.filter === "available" ? availableList() : WORKS.slice();
      renderMasonry(list);
    });
  });

  var pageDock = document.querySelector("[data-dock]");
  if (pageDock && catalog) {
    var dockTitle = pageDock.querySelector("[data-dock-title]");
    var currentDock = "";
    var dockObserver = new IntersectionObserver(function (entries) {
      var on = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!on.length) return;
      var id = on[0].target.dataset.work;
      var work = byId[id];
      if (!work || id === currentDock) return;
      currentDock = id;
      pageDock.hidden = false;
      pageDock.href = wa(askText(work));
      if (dockTitle) dockTitle.textContent = work.title;
    }, { threshold: [0.35, 0.6], rootMargin: "-20% 0px -30% 0px" });
    catalog.querySelectorAll(".catalog-item").forEach(function (item) { dockObserver.observe(item); });
    var dockY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (viewerOpen) pageDock.classList.add("is-away");
      else if (y > dockY + 8 && y > 80) pageDock.classList.add("is-away");
      else if (y < dockY - 8) pageDock.classList.remove("is-away");
      dockY = y;
    }, { passive: true });
  }

  if (document.body.classList.contains("page-sala")) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuOpen) setMenu(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 980 && menuOpen) setMenu(false);
    });
    return;
  }

  /* Visor: la obra sola, o colgada en una sala */
  var arrowL = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  var arrowR = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9.5 5 16.5 12l-7 7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  var viewer = document.createElement("div");
  viewer.className = "viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.setAttribute("aria-labelledby", "viewer-title");
  viewer.tabIndex = -1;
  var roomButtons = (window.Room ? window.Room.ROOMS : []).map(function (r) {
    return '<button type="button" class="pick" data-room="' + r.id + '" aria-pressed="false"><img alt="" width="96" height="64" data-src="' + window.Room.thumbJpg(r) + '"><span>' + window.Room.name(r) + "</span></button>";
  }).join("");
  viewer.innerHTML =
    '<div class="viewer-top">' +
      '<p class="viewer-count"></p>' +
      '<div class="modes" role="group" aria-label="' + t("viewMode") + '">' +
        '<button type="button" data-mode="room" aria-pressed="false">' + t("inRoom") + "</button>" +
        '<button type="button" data-mode="art" aria-pressed="false">' + t("artOnly") + "</button>" +
      "</div>" +
      '<button type="button" class="viewer-close" data-close>' + t("close") + "</button>" +
    "</div>" +
    '<div class="viewer-body">' +
      '<div class="viewer-stage">' +
        '<div class="viewer-photo"><div class="pinch"><picture><source class="src-avif" type="image/avif"><source class="src-webp" type="image/webp"><img alt=""></picture></div></div>' +
        '<div class="viewer-room"></div>' +
        '<button type="button" class="viewer-nav viewer-prev" aria-label="' + t("prev") + '">' + arrowL + "</button>" +
        '<button type="button" class="viewer-nav viewer-next" aria-label="' + t("next") + '">' + arrowR + "</button>" +
        '<p class="viewer-hint" aria-hidden="true"></p>' +
      "</div>" +
      '<aside class="viewer-side">' +
        '<button type="button" class="viewer-grip" aria-expanded="false" aria-label="' + t("tools") + '"><span></span></button>' +
        '<p class="viewer-status" hidden></p>' +
        '<h2 id="viewer-title"></h2>' +
        '<p class="viewer-facts"></p>' +
        '<p class="viewer-desc"></p>' +
        '<div class="viewer-tools">' +
          '<div class="tool"><p class="tool-label">' + t("roomLabel") + '</p><div class="picks">' + roomButtons + "</div></div>" +
          '<div class="tool tool-size"><p class="tool-label"><label for="viewer-size">' + t("size") + '</label> <output for="viewer-size"></output></p><input id="viewer-size" type="range" min="40" max="180" step="5" value="100"></div>' +
          '<div class="tool"><p class="tool-label">' + t("frame") + '</p><div class="seg" role="group" aria-label="' + t("frame") + '">' +
            '<button type="button" data-frame="none" aria-pressed="true">' + t("frameNone") + "</button>" +
            '<button type="button" data-frame="black" aria-pressed="false">' + t("frameBlack") + "</button>" +
            '<button type="button" data-frame="oak" aria-pressed="false">' + t("frameOak") + "</button>" +
          "</div></div>" +
          '<p class="tool-note"></p>' +
        "</div>" +
        '<a class="dock viewer-dock" target="_blank" rel="noopener noreferrer"><span><small>' + t("whatsapp") + '</small><strong class="dock-name"></strong></span><em>' + t("consult") + "</em></a>" +
        '<p class="viewer-credit"></p>' +
      "</aside>" +
    "</div>";
  document.body.append(viewer);

  function q(sel) { return viewer.querySelector(sel); }
  var viewerImg = q(".viewer-photo img");
  var srcAvif = q(".src-avif");
  var srcWebp = q(".src-webp");
  var pinch = q(".pinch");
  var photo = q(".viewer-photo");
  var roomHost = q(".viewer-room");
  var viewerCount = q(".viewer-count");
  var viewerTitle = q("#viewer-title");
  var viewerDesc = q(".viewer-desc");
  var viewerFacts = q(".viewer-facts");
  var viewerStatus = q(".viewer-status");
  var viewerAsk = q(".viewer-dock");
  var viewerName = q(".dock-name");
  var viewerHint = q(".viewer-hint");
  var viewerCredit = q(".viewer-credit");
  var sizeInput = q("#viewer-size");
  var sizeOut = q(".tool-size output");
  var toolNote = q(".tool-note");
  /* En el teléfono el panel tiene dos pasos: cerrado (la escena manda) y
     abierto (las herramientas). Se cambia con un gesto, nunca con el scroll. */
  var side = q(".viewer-side");
  var grip = q(".viewer-grip");
  var compact = false;
  var gestureLock = 0;
  function phone() { return window.innerWidth < 980; }
  function frameRoom() {
    if (!room || !phone()) return;
    var hostH = roomHost.offsetHeight;
    var ch = Math.max(window.innerHeight * 0.4, 230);
    var art = room.art.getBoundingClientRect();
    var host = roomHost.getBoundingClientRect();
    var shift = viewer.classList.contains("is-compact") ? parseFloat(viewer.style.getPropertyValue("--room-shift")) || 0 : 0;
    var cy = art.top - host.top + art.height / 2 - shift;
    var next = Math.max(ch - hostH, Math.min(0, ch / 2 - cy));
    viewer.style.setProperty("--room-shift", Math.round(next) + "px");
  }
  function setCompact(on) {
    if (!phone()) on = false;
    if (on === compact) return;
    if (on) frameRoom();
    compact = on;
    viewer.classList.toggle("is-compact", on);
    if (grip) grip.setAttribute("aria-expanded", on ? "true" : "false");
    if (!on) side.scrollTop = 0;
    gestureLock = performance.now() + 520;
  }
  var swipe = null;
  side.addEventListener("touchstart", function (event) {
    if (!phone()) return;
    var t = event.touches[0];
    swipe = { y: t.clientY, x: t.clientX, top: side.scrollTop, done: false };
  }, { passive: true });
  side.addEventListener("touchmove", function (event) {
    if (!swipe || !phone()) return;
    var t = event.touches[0];
    var dy = t.clientY - swipe.y;
    var dx = t.clientX - swipe.x;
    if (event.target.closest && event.target.closest(".picks") && Math.abs(dx) > Math.abs(dy)) return;
    if (event.target.closest && event.target.closest("input[type=range]")) return;
    if (!compact) {
      event.preventDefault();
      if (!swipe.done && dy < -18 && performance.now() > gestureLock) { swipe.done = true; setCompact(true); }
    } else if (swipe.top <= 0 && side.scrollTop <= 0 && dy > 0) {
      event.preventDefault();
      if (!swipe.done && dy > 22 && performance.now() > gestureLock) { swipe.done = true; setCompact(false); }
    }
  }, { passive: false });
  side.addEventListener("touchend", function () { swipe = null; }, { passive: true });
  side.addEventListener("wheel", function (event) {
    if (!phone()) return;
    if (!compact && event.deltaY > 4) { event.preventDefault(); if (performance.now() > gestureLock) setCompact(true); }
    else if (compact && side.scrollTop <= 0 && event.deltaY < -4) { event.preventDefault(); if (performance.now() > gestureLock) setCompact(false); }
  }, { passive: false });
  if (grip) grip.addEventListener("click", function () { setCompact(!compact); });
  window.addEventListener("resize", function () { if (!phone()) setCompact(false); });
  var view = { s: 1, x: 0, y: 0 };
  var pointers = new Map();
  var pinchStart = null;
  var cycle = WORKS;
  var index = 0;
  var lastFocus = null;
  var touchX = 0;
  var touchY = 0;
  var moved = false;
  var lastTap = 0;
  var lastOpener = null;
  var mode = store("rocio-view") === "art" ? "art" : "room";
  var room = null;
  var roomId = store("rocio-room") || "sala";
  var frameKind = store("rocio-frame") || "none";

  function ensureRoom() {
    if (room || !window.Room) return room;
    room = window.Room.create(roomHost, {
      interactive: true,
      room: roomId,
      frame: frameKind,
      size: Number(sizeInput.value),
      onChange: function (info) {
        sizeOut.textContent = "≈ " + info.cm + " cm";
        sizeInput.disabled = info.real;
        q(".tool-size").classList.toggle("is-real", info.real);
        toolNote.textContent = info.real ? t("realSize") : t("simNote");
        viewerCredit.textContent = t("photoBy") + " " + info.room.credit + " · Unsplash";
      },
      onMove: function () { viewer.classList.add("hint-done"); }
    });
    viewer.querySelectorAll(".pick img[data-src]").forEach(function (img) { img.src = img.dataset.src; });
    return room;
  }

  function syncPicks() {
    viewer.querySelectorAll(".pick").forEach(function (b) {
      b.setAttribute("aria-pressed", room && b.dataset.room === room.room.id ? "true" : "false");
    });
    viewer.querySelectorAll(".seg [data-frame]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.frame === frameKind ? "true" : "false");
    });
  }

  function setMode(next, quiet) {
    mode = next === "art" || !window.Room ? "art" : "room";
    if (!quiet) store("rocio-view", mode);
    viewer.dataset.mode = mode;
    viewer.querySelectorAll(".modes [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false");
    });
    viewerHint.textContent = mode === "room" ? t("dragHint") : (fine ? t("loupeHint") : t("pinchHint"));
    if (mode === "room") {
      ensureRoom();
      if (room && cycle[index] && room.work !== cycle[index]) room.setWork(cycle[index]);
      if (room) room.layout();
      syncPicks();
    }
  }

  function setPageHidden(on) {
    document.querySelectorAll(".nav, main, .footer, .dock:not(.viewer-dock)").forEach(function (node) {
      if (on) { node.setAttribute("inert", ""); node.setAttribute("aria-hidden", "true"); }
      else { node.removeAttribute("inert"); node.removeAttribute("aria-hidden"); }
    });
  }

  function listFor(node) {
    var mount = node && node.closest ? node.closest("[data-cycle]") : null;
    if (!mount) return WORKS;
    if (mount.dataset.cycle === "available") return availableList();
    if (mount.dataset.cycle === "rail") return RAIL.map(function (id) { return byId[id]; }).filter(Boolean);
    if (mount.dataset.cycle === "visible") return visible;
    return WORKS;
  }

  function renderPinch() {
    pinch.style.transform = "translate3d(" + view.x + "px," + view.y + "px,0) scale(" + view.s + ")";
  }
  function resetZoom() {
    view = { s: 1, x: 0, y: 0 };
    renderPinch();
    photo.classList.remove("is-loupe");
  }

  function paint() {
    var work = cycle[index];
    if (!work) return;
    resetZoom();
    if (window.artSrcset) {
      srcAvif.srcset = window.artSrcset(work, "avif");
      srcWebp.srcset = window.artSrcset(work, "webp");
      srcAvif.sizes = srcWebp.sizes = viewerImg.sizes = "(min-width: 980px) 66vw, 100vw";
      viewerImg.srcset = window.artSrcset(work, "jpg");
    }
    var list = work.widths || [];
    var mid = list.filter(function (w) { return w < work.w - 1; }).pop();
    viewerImg.src = ROOT + (mid ? "assets/media/works/" + work.id + "-" + mid + ".jpg" : work.image);
    viewerImg.width = work.w;
    viewerImg.height = work.h;
    viewerImg.alt = altOf(work);
    viewerCount.textContent = pad2(index + 1) + " / " + pad2(cycle.length);
    viewerTitle.textContent = work.title;
    viewerDesc.textContent = textOf(work);
    var bits = facts(work);
    viewerFacts.textContent = bits.join(" · ");
    viewerFacts.hidden = !bits.length;
    viewerStatus.hidden = !(work.available && SHOW_AVAILABLE);
    viewerStatus.textContent = work.available && SHOW_AVAILABLE ? t("available") : "";
    viewerName.textContent = work.title;
    viewerAsk.href = wa(askText(work));
    if (mode === "room" && room) room.setWork(work);
    if (compact) window.setTimeout(frameRoom, 60);
    [-1, 1].forEach(function (dir) {
      var neighbor = cycle[(index + dir + cycle.length) % cycle.length];
      if (!neighbor || !neighbor.widths) return;
      var pre = new Image();
      pre.src = ROOT + "assets/media/works/" + neighbor.id + "-" + (neighbor.widths[0] || 640) + ".jpg";
    });
  }

  function show() {
    gestureLock = 0;
    setCompact(false);
    side.scrollTop = 0;
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    setPageHidden(true);
    syncLock();
    if (pageDock) pageDock.classList.add("is-away");
    viewer.focus({ preventScroll: true });
  }

  function openWork(id, list, push, opts) {
    opts = opts || {};
    var nextList = list && list.length ? list : WORKS;
    var nextIndex = nextList.findIndex(function (work) { return work.id === id; });
    cycle = nextIndex >= 0 ? nextList : WORKS;
    if (nextIndex < 0) nextIndex = cycle.findIndex(function (work) { return work.id === id; });
    if (nextIndex < 0) return;
    index = nextIndex;
    lastFocus = document.activeElement;
    if (opts.mode) mode = opts.mode;
    var fromImg = lastOpener && lastOpener.querySelector ? lastOpener.querySelector(".frame img, .rail-frame img, picture img") : null;
    function run() {
      viewerOpen = true;
      show();
      setMode(mode, true);
      if (opts.room && room) { room.setRoom(opts.room); syncPicks(); }
      paint();
      var hash = "#" + id;
      if (push) history.pushState({ work: id }, "", hash);
      else if (location.hash !== hash) history.replaceState({ work: id }, "", hash);
    }
    if (!reduce && document.startViewTransition && fromImg) {
      try {
        fromImg.style.viewTransitionName = "obra";
        var transition = document.startViewTransition(function () {
          fromImg.style.viewTransitionName = "";
          run();
          var target = mode === "room" && room ? room.art : viewerImg;
          target.style.viewTransitionName = "obra";
        });
        transition.finished.finally(function () {
          viewerImg.style.viewTransitionName = "";
          if (room) room.art.style.viewTransitionName = "";
        }).catch(function () {});
        return;
      } catch (err) {
        fromImg.style.viewTransitionName = "";
      }
    }
    run();
  }

  function actuallyClose() {
    if (!viewerOpen) return;
    viewerOpen = false;
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    setPageHidden(false);
    syncLock();
    resetZoom();
    if (pageDock) pageDock.classList.remove("is-away");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function requestClose() {
    actuallyClose();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }
  function step(dir) {
    if (!cycle.length) return;
    index = (index + dir + cycle.length) % cycle.length;
    history.replaceState({ work: cycle[index].id }, "", "#" + cycle[index].id);
    viewer.classList.remove("is-step");
    void viewer.offsetWidth;
    viewer.classList.add("is-step");
    paint();
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest("[data-open]");
    if (!opener || viewer.contains(opener)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
    event.preventDefault();
    lastOpener = opener.querySelector("img") ? opener : (opener.closest(".catalog-item") || opener);
    openWork(opener.dataset.open, listFor(opener), true, { mode: opener.dataset.mode, room: opener.dataset.room });
  });

  viewer.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) { requestClose(); return; }
    var m = event.target.closest(".modes [data-mode]");
    if (m) { setMode(m.dataset.mode); return; }
    var pick = event.target.closest(".pick");
    if (pick && room) {
      room.setRoom(pick.dataset.room);
      if (compact) window.setTimeout(frameRoom, 450);
      store("rocio-room", pick.dataset.room);
      syncPicks();
      return;
    }
    var fr = event.target.closest(".seg [data-frame]");
    if (fr && room) {
      frameKind = fr.dataset.frame;
      store("rocio-frame", frameKind);
      room.setFrame(frameKind);
      syncPicks();
    }
  });
  sizeInput.addEventListener("input", function () { if (room) room.setSize(Number(sizeInput.value)); });
  q(".viewer-prev").addEventListener("click", function () { step(-1); });
  q(".viewer-next").addEventListener("click", function () { step(1); });

  /* Lupa con mouse; pellizco y doble toque en el teléfono */
  photo.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse") return;
    photo.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    touchX = event.clientX;
    touchY = event.clientY;
    moved = false;
    if (pointers.size === 2) {
      var pts = Array.from(pointers.values());
      pinchStart = { dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1, s: view.s };
    }
  });
  photo.addEventListener("pointermove", function (event) {
    if (event.pointerType === "mouse") {
      var rect = viewerImg.getBoundingClientRect();
      viewerImg.style.transformOrigin = ((event.clientX - rect.left) / rect.width * 100) + "% " + ((event.clientY - rect.top) / rect.height * 100) + "%";
      return;
    }
    if (!pointers.has(event.pointerId)) return;
    var prev = pointers.get(event.pointerId);
    var dx = event.clientX - prev.x;
    var dy = event.clientY - prev.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved = true;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2 && pinchStart) {
      var pts = Array.from(pointers.values());
      var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      view.s = Math.min(4, Math.max(1, pinchStart.s * (dist / pinchStart.dist)));
      if (view.s === 1) { view.x = 0; view.y = 0; }
      renderPinch();
    } else if (pointers.size === 1 && view.s > 1) {
      view.x += dx;
      view.y += dy;
      renderPinch();
    }
  });
  photo.addEventListener("click", function () {
    if (fine) photo.classList.toggle("is-loupe");
  });
  photo.addEventListener("pointerleave", function () { photo.classList.remove("is-loupe"); });
  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (event.type !== "pointerup" || event.pointerType === "mouse") return;
    var dx = event.clientX - touchX;
    var dy = event.clientY - touchY;
    if (view.s > 1) return;
    if (!moved) {
      var now = performance.now();
      if (now - lastTap < 280) {
        view = { s: 2.5, x: 0, y: 0 };
        renderPinch();
        lastTap = 0;
      } else lastTap = now;
      return;
    }
    if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  }
  photo.addEventListener("pointerup", endPointer);
  photo.addEventListener("pointercancel", endPointer);

  /* En la sala: deslizar fuera de la obra pasa de obra; doble clic acerca */
  var roomSwipe = null;
  var roomZoom = 1;
  roomHost.addEventListener("pointerdown", function (event) {
    if (event.target.closest(".room-art")) return;
    roomSwipe = { x: event.clientX, y: event.clientY, t: performance.now() };
  });
  roomHost.addEventListener("pointerup", function (event) {
    if (!roomSwipe) return;
    var dx = event.clientX - roomSwipe.x;
    var dy = event.clientY - roomSwipe.y;
    var quick = performance.now() - roomSwipe.t < 600;
    roomSwipe = null;
    if (quick && Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  });
  roomHost.addEventListener("dblclick", function () {
    if (!room) return;
    roomZoom = roomZoom > 1 ? 1 : 1.75;
    room.setZoom(roomZoom);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (viewerOpen) requestClose();
      else if (menuOpen) setMenu(false);
      return;
    }
    if (!viewerOpen) return;
    var tag = event.target && event.target.matches ? event.target : null;
    if (tag && (tag.matches("input[type=range]") || tag.matches(".room-art"))) return;
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    if (event.key !== "Tab") return;
    var items = Array.prototype.slice.call(viewer.querySelectorAll("button:not([disabled]), a, input:not([disabled]), [tabindex='0']")).filter(function (n) { return n.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.addEventListener("popstate", function () {
    var id = decodeURIComponent(location.hash.replace("#", ""));
    if (id && byId[id]) openWork(id, cycle.length ? cycle : WORKS, false);
    else actuallyClose();
  });

  var start = decodeURIComponent(location.hash.replace("#", ""));
  if (start && byId[start]) openWork(start, WORKS, false);

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 980 && menuOpen) setMenu(false);
  });
})();
