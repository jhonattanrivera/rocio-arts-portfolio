(function () {
  var WORKS = window.WORKS || [];
  var byId = {};
  WORKS.forEach(function (work) { byId[work.id] = work; });
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var viewTimeline = !reduce && window.CSS && CSS.supports("animation-timeline: view()");
  if (viewTimeline) document.documentElement.classList.add("view-ok");

  var RAIL = ["marilyn", "ocean-eyes", "junto-a-ti", "flores", "cidade-maravilhosa", "abbey-road", "el-camino", "summer", "forever"];

  function wa(text) { return window.artWa ? window.artWa(text) : "https://wa.me/50689877207?text=" + encodeURIComponent(text); }
  function facts(work) { return window.artFacts ? window.artFacts(work) : []; }
  function askText(work) { return window.artAsk ? window.artAsk(work) : "Hola Rocio, me interesa la obra " + work.title + "."; }
  function textOf(work) { return window.workText ? window.workText(work) : work.description; }
  function altOf(work) { return window.artAlt ? window.artAlt(work) : work.title; }
  function label(key) { return window.ui ? window.ui(key) : key; }

  function availableList() {
    return WORKS.filter(function (work) { return work.available; })
      .sort(function (a, b) { return a.available - b.available; });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var menuOpen = false;
  var viewerOpen = false;
  var scrollY = 0;

  function syncLock() {
    var on = menuOpen || viewerOpen;
    if (on) {
      if (!document.body.classList.contains("is-locked")) {
        scrollY = window.scrollY;
        document.body.style.top = "-" + scrollY + "px";
        document.body.classList.add("is-locked");
      }
    } else if (document.body.classList.contains("is-locked")) {
      document.body.classList.remove("is-locked");
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    }
  }

  function setMenu(open) {
    menuOpen = open;
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Cerrar" : "Menú";
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
    var solidTick = false;
    function solidNav() {
      solidTick = false;
      nav.classList.toggle("is-solid", window.scrollY > 8);
    }
    window.addEventListener("scroll", function () {
      if (solidTick) return;
      solidTick = true;
      requestAnimationFrame(solidNav);
    }, { passive: true });
    solidNav();
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  function watch(node) {
    if (!node) return;
    if (reduce) {
      node.classList.add("is-in");
      return;
    }
    io.observe(node);
  }
  document.querySelectorAll(".reveal").forEach(watch);

  function bindBar(scroller) {
    if (!scroller) return;
    var block = scroller.closest(".scroller-block") || scroller.parentElement;
    var bar = block && block.querySelector("[data-progress]");
    if (!bar) return;
    var tick = false;
    function place() {
      tick = false;
      var max = scroller.scrollWidth - scroller.clientWidth;
      var p = max > 0 ? scroller.scrollLeft / max : 1;
      bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    }
    scroller.addEventListener("scroll", function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(place);
    }, { passive: true });
    window.addEventListener("resize", place);
    place();
  }

  var railMount = document.querySelector("[data-mount='rail']");
  if (railMount && window.artPicture) {
    var track = document.createElement("div");
    track.className = "rail-track";
    RAIL.forEach(function (id) {
      var work = byId[id];
      if (!work) return;
      var link = document.createElement("a");
      link.className = "rail-card";
      link.href = "obras.html#" + work.id;
      link.dataset.open = work.id;
      link.setAttribute("aria-label", label("open") + work.title);
      link.append(window.artPicture(work, {
        sizes: "(min-width: 980px) 52vw, 82vw",
        alt: altOf(work)
      }));
      var title = document.createElement("span");
      title.className = "rail-title";
      title.textContent = work.title;
      link.append(title);
      track.append(link);
    });
    railMount.append(track);
    var countEl = document.querySelector("[data-rail-count]");
    var cards = Array.prototype.slice.call(track.children);
    var railTick = false;
    function railPad() {
      var style = getComputedStyle(railMount);
      return parseFloat(style.scrollPaddingLeft) || parseFloat(style.paddingLeft) || 0;
    }
    function railIndex() {
      var origin = railMount.getBoundingClientRect().left + railPad();
      var best = 0;
      var bestDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(card.getBoundingClientRect().left - origin);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    }
    function paintRail() {
      railTick = false;
      if (!cards.length || !countEl) return;
      var i = railIndex();
      countEl.textContent = String(i + 1).padStart(2, "0") + " / " + String(cards.length).padStart(2, "0");
      railMount.dataset.index = String(i);
    }
    function requestRail() {
      if (railTick) return;
      railTick = true;
      requestAnimationFrame(paintRail);
    }
    function goRail(dir) {
      if (!cards.length) return;
      var i = Math.max(0, Math.min(cards.length - 1, railIndex() + dir));
      var delta = cards[i].getBoundingClientRect().left - railMount.getBoundingClientRect().left - railPad();
      railMount.scrollTo({ left: railMount.scrollLeft + delta, behavior: reduce ? "auto" : "smooth" });
    }
    railMount.addEventListener("scroll", requestRail, { passive: true });
    railMount.addEventListener("scrollend", paintRail);
    window.addEventListener("resize", requestRail);
    railMount.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") { event.preventDefault(); goRail(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); goRail(-1); }
    });
    var prevBtn = document.querySelector("[data-rail-prev]");
    var nextBtn = document.querySelector("[data-rail-next]");
    if (prevBtn) prevBtn.addEventListener("click", function () { goRail(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goRail(1); });
    requestRail();
  }

  document.querySelectorAll("[data-scroller]").forEach(bindBar);

  var pull = document.querySelector(".pull");
  if (pull) pull.classList.add("is-in");

  var intro = document.getElementById("intro");
  if (intro && document.documentElement.classList.contains("show-intro")) {
    var introDone = false;
    function finishIntro() {
      if (introDone) return;
      introDone = true;
      try { sessionStorage.setItem("rocio-intro", "1"); } catch (err) { /* privado */ }
      intro.classList.add("is-leaving");
      window.setTimeout(function () {
        document.documentElement.classList.remove("show-intro");
        intro.remove();
      }, 460);
    }
    intro.addEventListener("pointerdown", function (event) {
      if (event.target.closest && event.target.closest("a")) return;
      finishIntro();
    });
    window.setTimeout(finishIntro, 2300);
  }

  if (fine && !reduce) {
    var cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    var label = "";
    window.addEventListener("pointermove", function (event) {
      cursor.style.transform = "translate(" + event.clientX + "px," + event.clientY + "px)";
      var target = event.target.closest ? event.target.closest("[data-open], [data-cursor]") : null;
      var next = target ? (target.dataset.cursor || "Ver") : "";
      if (next !== label) {
        label = next;
        cursor.textContent = next;
        cursor.classList.toggle("is-on", !!next);
      }
    }, { passive: true });
  }

  var masonry = document.querySelector("[data-mount='masonry']");
  var catalog = document.querySelector("[data-mount='catalog']");
  var countNode = document.querySelector("[data-count]");
  var visible = WORKS.slice();
  var lastOpener = null;

  function card(work, opts) {
    var link = document.createElement("a");
    link.className = opts.className;
    link.href = opts.href || ("#" + work.id);
    link.dataset.open = work.id;
    link.style.setProperty("--tone", work.tone || "#e7e1d8");
    link.setAttribute("aria-label", "Abrir " + work.title);
    var frame = document.createElement("span");
    frame.className = "frame";
    var clip = document.createElement("span");
    clip.className = "clip";
    if (window.artPicture) {
      clip.append(window.artPicture(work, {
        sizes: opts.sizes,
        eager: opts.eager,
        alt: altOf(work)
      }));
    }
    frame.append(clip);
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
        eager: i < 2,
        sizes: "(min-width: 1100px) 30vw, (min-width: 720px) 46vw, 92vw"
      });
      var title = document.createElement("span");
      title.className = "card-title";
      title.textContent = work.title;
      link.append(title);
      if (work.available) {
        var note = document.createElement("span");
        note.className = "card-note";
        note.textContent = label("available");
        link.append(note);
      }
      masonry.append(link);
      watch(link);
    });
    if (countNode) countNode.textContent = String(list.length);
  }

  function renderCatalog(list) {
    if (!catalog || !window.artPicture) return;
    catalog.replaceChildren();
    list.forEach(function (work) {
      var item = document.createElement("article");
      item.className = "catalog-item reveal";
      item.dataset.work = work.id;
      var link = card(work, {
        className: "catalog-frame",
        href: "obras.html#" + work.id,
        sizes: "(min-width: 900px) 46vw, 92vw",
        eager: false
      });
      var copy = document.createElement("div");
      copy.className = "catalog-copy";
      var heading = document.createElement("h2");
      heading.textContent = work.title;
      var text = document.createElement("p");
      text.textContent = textOf(work);
      var meta = document.createElement("p");
      meta.className = "catalog-facts";
      var bits = facts(work);
      meta.textContent = bits.join(" · ");
      meta.hidden = !bits.length;
      var ask = document.createElement("a");
      ask.className = "text-link";
      ask.href = wa(askText(work));
      ask.target = "_blank";
      ask.rel = "noopener noreferrer";
      ask.textContent = label("consult");
      copy.append(heading, meta, text, ask);
      item.append(link, copy);
      catalog.append(item);
      watch(item);
    });
  }

  if (masonry) {
    masonry.dataset.cycle = "visible";
    renderMasonry(WORKS);
  }
  if (catalog) {
    catalog.dataset.cycle = "available";
    renderCatalog(availableList());
  }

  document.querySelectorAll("[data-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-filter]").forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      renderMasonry(button.dataset.filter === "available" ? availableList() : WORKS.slice());
    });
  });

  var pageDock = document.querySelector("[data-dock]");
  if (pageDock && catalog) {
    var dockTitle = pageDock.querySelector("[data-dock-title]");
    var currentDock = "";
    var dockObserver = new IntersectionObserver(function (entries) {
      var visibleOnes = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (!visibleOnes.length) return;
      var id = visibleOnes[0].target.dataset.work;
      var work = byId[id];
      if (!work || id === currentDock) return;
      currentDock = id;
      pageDock.hidden = false;
      pageDock.href = wa(askText(work));
      if (dockTitle) dockTitle.textContent = work.title;
    }, { threshold: [0.35, 0.6], rootMargin: "-20% 0px -30% 0px" });
    catalog.querySelectorAll(".catalog-item").forEach(function (item) { dockObserver.observe(item); });
    var lastY = window.scrollY;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (viewerOpen) pageDock.classList.add("is-away");
      else if (y > lastY + 8 && y > 80) pageDock.classList.add("is-away");
      else if (y < lastY - 8) pageDock.classList.remove("is-away");
      lastY = y;
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

  var viewer = document.createElement("div");
  viewer.className = "viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.setAttribute("aria-labelledby", "viewer-title");
  viewer.innerHTML =
    '<div class="viewer-bar">' +
      '<button type="button" class="viewer-prev" aria-label="' + label("prev") + '"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
      '<button type="button" class="viewer-zoom" aria-pressed="false">' + label("brush") + '</button>' +
      '<p class="viewer-count"></p>' +
      '<button type="button" class="viewer-next" aria-label="' + label("next") + '"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9.5 5 16.5 12l-7 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button>' +
      '<button type="button" class="viewer-close" data-close>' + label("close") + '</button>' +
    "</div>" +
    '<div class="viewer-stage"><div class="viewer-photo"><div class="pinch"><picture><source class="src-avif" type="image/avif"><source class="src-webp" type="image/webp"><img alt=""></picture></div></div></div>' +
    '<div class="viewer-copy"><p class="viewer-status" hidden></p><h2 id="viewer-title"></h2><p class="viewer-facts"></p><p class="viewer-desc"></p></div>' +
    '<a class="dock viewer-dock" target="_blank" rel="noopener noreferrer"><span><small>' + label("whatsapp") + '</small><strong class="dock-name"></strong></span><em>' + label("consult") + '</em></a>';
  document.body.append(viewer);

  var viewerImg = viewer.querySelector("img");
  var srcAvif = viewer.querySelector(".src-avif");
  var srcWebp = viewer.querySelector(".src-webp");
  var pinch = viewer.querySelector(".pinch");
  var photo = viewer.querySelector(".viewer-photo");
  var viewerCount = viewer.querySelector(".viewer-count");
  var viewerTitle = viewer.querySelector("#viewer-title");
  var viewerDesc = viewer.querySelector(".viewer-desc");
  var viewerFacts = viewer.querySelector(".viewer-facts");
  var viewerStatus = viewer.querySelector(".viewer-status");
  var viewerAsk = viewer.querySelector(".viewer-dock");
  var viewerName = viewer.querySelector(".dock-name");
  var zoomBtn = viewer.querySelector(".viewer-zoom");
  var zoomOn = false;
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

  function listFor(node) {
    var mount = node && node.closest ? node.closest("[data-cycle]") : null;
    if (!mount) return WORKS;
    if (mount.dataset.cycle === "available") return availableList();
    if (mount.dataset.cycle === "rail") return RAIL.map(function (id) { return byId[id]; }).filter(Boolean);
    if (mount.dataset.cycle === "visible") return visible;
    return WORKS;
  }

  function setPageHidden(on) {
    document.querySelectorAll(".nav, main, .footer, .dock:not(.viewer-dock)").forEach(function (node) {
      if (on) {
        node.setAttribute("inert", "");
        node.setAttribute("aria-hidden", "true");
      } else {
        node.removeAttribute("inert");
        node.removeAttribute("aria-hidden");
      }
    });
  }

  function renderPinch() {
    pinch.style.transform = "translate3d(" + view.x + "px," + view.y + "px,0) scale(" + view.s + ")";
  }

  function resetZoom() {
    view = { s: 1, x: 0, y: 0 };
    renderPinch();
    viewerImg.style.transform = "";
    viewerImg.style.transformOrigin = "";
  }

  function paint() {
    var work = cycle[index];
    if (!work) return;
    resetZoom();
    if (window.artSrcset) {
      srcAvif.srcset = window.artSrcset(work, "avif");
      srcWebp.srcset = window.artSrcset(work, "webp");
      srcAvif.sizes = "100vw";
      srcWebp.sizes = "100vw";
      viewerImg.srcset = window.artSrcset(work, "jpg");
    }
    var list = work.widths || [];
    var mid = list.filter(function (w) { return w < work.w - 1; }).pop();
    var root = (window.SITE && window.SITE.root) || "";
    viewerImg.src = root + (mid ? "assets/media/works/" + work.id + "-" + mid + ".jpg" : work.image);
    viewerImg.width = work.w;
    viewerImg.height = work.h;
    viewerImg.alt = altOf(work);
    photo.style.background = work.tone || "transparent";
    viewerCount.textContent = String(index + 1).padStart(2, "0") + "  /  " + String(cycle.length).padStart(2, "0");
    viewerTitle.textContent = work.title;
    viewerDesc.textContent = textOf(work);
    var bits = facts(work);
    viewerFacts.textContent = bits.join(" · ");
    viewerFacts.hidden = !bits.length;
    viewerStatus.hidden = !work.available;
    viewerStatus.textContent = work.available ? label("available") : "";
    viewerName.textContent = work.title;
    viewerAsk.href = wa(askText(work));
    [-1, 1].forEach(function (dir) {
      var neighbor = cycle[(index + dir + cycle.length) % cycle.length];
      if (!neighbor) return;
      var pre = new Image();
      pre.src = ((window.SITE && window.SITE.root) || "") + neighbor.image;
    });
  }

  function show() {
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    setPageHidden(true);
    syncLock();
    if (pageDock) pageDock.classList.add("is-away");
    viewer.querySelector(".viewer-close").focus();
  }

  function openWork(id, list, push) {
    var nextList = list && list.length ? list : WORKS;
    var nextIndex = nextList.findIndex(function (work) { return work.id === id; });
    cycle = nextIndex >= 0 ? nextList : WORKS;
    if (nextIndex < 0) nextIndex = cycle.findIndex(function (work) { return work.id === id; });
    if (nextIndex < 0) return;
    index = nextIndex;
    lastFocus = document.activeElement;
    var fromImg = lastOpener && lastOpener.querySelector("img");
    var run = function () {
      viewerOpen = true;
      paint();
      show();
      var hash = "#" + id;
      if (push) history.pushState({ work: id }, "", hash);
      else if (location.hash !== hash) history.replaceState({ work: id }, "", hash);
    };
    if (!reduce && document.startViewTransition && fromImg) {
      try {
        fromImg.style.viewTransitionName = "obra";
        var transition = document.startViewTransition(function () {
          fromImg.style.viewTransitionName = "";
          run();
          viewerImg.style.viewTransitionName = "obra";
        });
        transition.finished.finally(function () {
          viewerImg.style.viewTransitionName = "";
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
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function requestClose() {
    actuallyClose();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }

  function step(dir) {
    if (!cycle.length) return;
    index = (index + dir + cycle.length) % cycle.length;
    var work = cycle[index];
    history.replaceState({ work: work.id }, "", "#" + work.id);
    paint();
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest("[data-open]");
    if (!opener) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
    event.preventDefault();
    lastOpener = opener;
    openWork(opener.dataset.open, listFor(opener), true);
  });

  viewer.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) requestClose();
  });
  viewer.querySelector(".viewer-prev").addEventListener("click", function () { step(-1); });
  viewer.querySelector(".viewer-next").addEventListener("click", function () { step(1); });
  zoomBtn.addEventListener("click", function () {
    zoomOn = !zoomOn;
    zoomBtn.setAttribute("aria-pressed", zoomOn ? "true" : "false");
    photo.classList.toggle("is-loupe", zoomOn);
    if (!zoomOn) {
      viewerImg.style.transform = "";
      viewerImg.style.transformOrigin = "";
    }
  });

  photo.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && zoomOn) return;
    photo.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    touchX = event.clientX;
    touchY = event.clientY;
    moved = false;
    if (pointers.size === 2) {
      var pts = Array.from(pointers.values());
      pinchStart = {
        dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
        s: view.s
      };
    }
  });
  photo.addEventListener("pointermove", function (event) {
    if (zoomOn && event.pointerType === "mouse" && view.s === 1) {
      var rect = photo.getBoundingClientRect();
      var ox = ((event.clientX - rect.left) / rect.width) * 100;
      var oy = ((event.clientY - rect.top) / rect.height) * 100;
      viewerImg.style.transformOrigin = ox + "% " + oy + "%";
      viewerImg.style.transform = "scale(2.45)";
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
  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (event.type !== "pointerup") return;
    var dx = event.clientX - touchX;
    var dy = event.clientY - touchY;
    if (view.s > 1) return;
    if (!moved) {
      var now = performance.now();
      if (now - lastTap < 280) {
        view.s = 2.5;
        view.x = 0;
        view.y = 0;
        renderPinch();
        lastTap = 0;
      } else lastTap = now;
      return;
    }
    if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  }
  photo.addEventListener("pointerup", endPointer);
  photo.addEventListener("pointercancel", endPointer);
  photo.addEventListener("pointerleave", function () {
    if (zoomOn && view.s === 1) {
      viewerImg.style.transform = "";
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (intro && document.documentElement.classList.contains("show-intro") && !intro.classList.contains("is-leaving")) {
        var skipBtn = intro.querySelector(".intro-skip");
        if (skipBtn) skipBtn.click();
        return;
      }
      if (viewerOpen) requestClose();
      else if (menuOpen) setMenu(false);
      return;
    }
    if (!viewerOpen) return;
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    if (event.key !== "Tab") return;
    var items = Array.prototype.slice.call(viewer.querySelectorAll("button, a"));
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
