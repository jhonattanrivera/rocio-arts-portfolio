(function () {
  const WORKS = window.WORKS || [];
  const byId = Object.fromEntries(WORKS.map(function (work) { return [work.id, work]; }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const RAIL = ["marilyn", "ocean-eyes", "junto-a-ti", "flores", "cidade-maravilhosa", "abbey-road", "el-camino", "summer"];

  function wa(text) {
    return "https://wa.me/50689877207?text=" + encodeURIComponent(text);
  }

  function availableList() {
    return WORKS.filter(function (work) { return work.available; })
      .sort(function (a, b) { return a.available - b.available; });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  let menuOpen = false;
  let viewerOpen = false;
  let scrollY = 0;

  function syncLock() {
    const on = menuOpen || viewerOpen;
    if (on) {
      if (!document.body.classList.contains("is-locked")) {
        scrollY = window.scrollY;
        document.body.style.top = "-" + scrollY + "px";
        document.body.classList.add("is-locked");
      }
    } else {
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
    syncLock();
  }

  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(!menuOpen); });
  }
  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });

  function watch(node) {
    if (!node) return;
    if (reduce) {
      node.classList.add("is-in");
      return;
    }
    io.observe(node);
  }

  document.querySelectorAll(".reveal").forEach(watch);

  const railMount = document.querySelector("[data-mount='rail']");
  if (railMount) {
    const track = document.createElement("div");
    track.className = "rail-track";
    RAIL.forEach(function (id) {
      const work = byId[id];
      if (!work) return;
      track.append(workLink(work, { className: "rail-card", href: "obras.html#" + work.id, full: true }));
    });
    railMount.append(track);

    const countEl = document.querySelector("[data-rail-count]");
    const cards = Array.prototype.slice.call(track.children);
    let railTick = false;
    let drag = null;
    let dragged = false;

    function placeRail() {
      railTick = false;
      if (!cards.length) return;
      const view = railMount.getBoundingClientRect();
      const focus = view.left + Math.min(view.width * 0.34, 320);
      let best = 0;
      let bestDist = Infinity;
      cards.forEach(function (card, i) {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width * 0.5 - focus);
        const near = reduce ? 1 : Math.max(0, 1 - dist / (view.width * 0.8));
        card.style.setProperty("--near", near.toFixed(3));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (countEl) countEl.textContent = String(best + 1).padStart(2, "0");
    }

    function requestRail() {
      if (railTick) return;
      railTick = true;
      requestAnimationFrame(placeRail);
    }

    railMount.addEventListener("scroll", requestRail, { passive: true });
    window.addEventListener("resize", requestRail);
    railMount.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, left: railMount.scrollLeft };
      dragged = false;
      railMount.classList.add("is-dragging");
      railMount.setPointerCapture(event.pointerId);
    });
    railMount.addEventListener("pointermove", function (event) {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 4) dragged = true;
      railMount.scrollLeft = drag.left - dx;
    });
    function endDrag() {
      drag = null;
      railMount.classList.remove("is-dragging");
    }
    railMount.addEventListener("pointerup", endDrag);
    railMount.addEventListener("pointercancel", endDrag);
    railMount.addEventListener("click", function (event) {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
      dragged = false;
    }, true);
    track.querySelectorAll("img").forEach(function (img) {
      img.addEventListener("load", requestRail);
    });
    requestRail();
  }

  const heroFrame = document.querySelector(".hero-frame");
  if (heroFrame && !reduce) {
    let shiftTick = false;
    function shiftHero() {
      shiftTick = false;
      const rect = heroFrame.getBoundingClientRect();
      const travel = Math.min(Math.max(-rect.top, 0), rect.height);
      heroFrame.style.setProperty("--shift", String(Math.round(-36 + travel * 0.16)));
    }
    window.addEventListener("scroll", function () {
      if (shiftTick) return;
      shiftTick = true;
      requestAnimationFrame(shiftHero);
    }, { passive: true });
    shiftHero();
  }

  const pull = document.querySelector(".pull");
  const pullText = pull && pull.querySelector("p");
  if (pull && pullText) {
    const words = pullText.textContent.trim().split(/\s+/);
    pullText.textContent = "";
    words.forEach(function (word, i, all) {
      const span = document.createElement("span");
      span.className = "w";
      span.style.setProperty("--i", String(i));
      span.textContent = word;
      pullText.append(span);
      if (i < all.length - 1) pullText.append(" ");
    });
    pull.classList.add("is-ready");
    watch(pull);
  }

  document.querySelectorAll(".paths a").forEach(function (link, i) {
    link.style.setProperty("--d", (i * 140) + "ms");
    watch(link);
  });

  const masonry = document.querySelector("[data-mount='masonry']");
  const catalog = document.querySelector("[data-mount='catalog']");
  const countEl = document.querySelector("[data-count]");
  let visible = WORKS.slice();

  function workLink(work, opts) {
    const link = document.createElement("a");
    link.className = opts.className;
    link.href = opts.href || ("#" + work.id);
    link.dataset.open = work.id;
    link.setAttribute("aria-label", "Abrir " + work.title);
    const frame = document.createElement("span");
    frame.className = opts.frameClass || (opts.className.indexOf("rail") === 0 ? "" : "frame");
    if (!frame.className) {
      const img = imageFor(work, opts);
      const title = document.createElement("span");
      title.className = "rail-title";
      title.textContent = work.title;
      link.append(img, title);
      return link;
    }
    frame.append(imageFor(work, opts));
    link.append(frame);
    return link;
  }

  function imageFor(work, opts) {
    const img = document.createElement("img");
    img.src = opts.full ? work.image : work.thumb;
    img.width = work.w;
    img.height = work.h;
    img.alt = work.title + ", pintura de Rocío Villamizar";
    img.decoding = "async";
    if (!opts.eager) img.loading = "lazy";
    if (opts.srcset) {
      img.srcset = work.thumb + " 1000w, " + work.image + " " + Math.max(work.w, 1200) + "w";
      img.sizes = opts.sizes;
    }
    return img;
  }

  function renderMasonry(list) {
    if (!masonry) return;
    visible = list;
    masonry.replaceChildren();
    list.forEach(function (work, i) {
      const link = workLink(work, {
        className: "card reveal",
        href: "#" + work.id,
        eager: i < 2,
        srcset: true,
        sizes: "(min-width: 1100px) 30vw, (min-width: 720px) 46vw, 92vw"
      });
      link.style.setProperty("--d", (i % 3) * 70 + "ms");
      const title = document.createElement("span");
      title.className = "card-title";
      title.textContent = work.title;
      link.append(title);
      if (work.available) {
        const note = document.createElement("span");
        note.className = "card-note";
        note.textContent = "Disponible";
        link.append(note);
      }
      masonry.append(link);
      watch(link);
    });
    if (countEl) countEl.textContent = String(list.length);
  }

  function renderCatalog(list) {
    if (!catalog) return;
    catalog.replaceChildren();
    list.forEach(function (work) {
      const item = document.createElement("article");
      item.className = "catalog-item reveal";
      const link = document.createElement("a");
      link.className = "catalog-frame";
      link.href = "obras.html#" + work.id;
      link.dataset.open = work.id;
      link.setAttribute("aria-label", "Abrir " + work.title);
      link.append(imageFor(work, { full: true }));
      const copy = document.createElement("div");
      copy.className = "catalog-copy";
      const heading = document.createElement("h2");
      heading.textContent = work.title;
      const text = document.createElement("p");
      text.textContent = work.description;
      const ask = document.createElement("a");
      ask.className = "text-link";
      ask.href = wa("Hola Rocío, me interesa la obra " + work.title + ". ¿Sigue disponible?");
      ask.target = "_blank";
      ask.rel = "noopener noreferrer";
      ask.textContent = "Consultar esta obra";
      copy.append(heading, text, ask);
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

  const viewer = document.createElement("div");
  viewer.className = "viewer";
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-hidden", "true");
  viewer.setAttribute("aria-labelledby", "viewer-title");
  viewer.innerHTML =
    '<div class="viewer-bar"><p class="viewer-count"></p><button type="button" class="viewer-close" data-close>Cerrar</button></div>' +
    '<div class="viewer-stage"><button type="button" class="viewer-nav viewer-prev">Anterior</button><div class="viewer-photo"><img alt=""></div><button type="button" class="viewer-nav viewer-next">Siguiente</button></div>' +
    '<div class="viewer-copy"><p class="viewer-status" hidden></p><h2 id="viewer-title"></h2><p class="viewer-desc"></p><a class="text-link viewer-ask" target="_blank" rel="noopener noreferrer"></a></div>';
  document.body.append(viewer);

  const viewerImg = viewer.querySelector("img");
  const viewerCount = viewer.querySelector(".viewer-count");
  const viewerTitle = viewer.querySelector("#viewer-title");
  const viewerDesc = viewer.querySelector(".viewer-desc");
  const viewerStatus = viewer.querySelector(".viewer-status");
  const viewerAsk = viewer.querySelector(".viewer-ask");
  let cycle = WORKS;
  let index = 0;
  let pushed = false;
  let lastFocus = null;
  let touchX = 0;
  let touchY = 0;

  function listFor(node) {
    const mount = node && node.closest ? node.closest("[data-cycle]") : null;
    if (!mount) return WORKS;
    if (mount.dataset.cycle === "available") return availableList();
    if (mount.dataset.cycle === "rail") {
      return RAIL.map(function (id) { return byId[id]; }).filter(Boolean);
    }
    if (mount.dataset.cycle === "visible") return visible;
    return WORKS;
  }

  function setPageHidden(on) {
    document.querySelectorAll(".nav, main, .footer").forEach(function (node) {
      if (on) {
        node.setAttribute("inert", "");
        node.setAttribute("aria-hidden", "true");
      } else {
        node.removeAttribute("inert");
        node.removeAttribute("aria-hidden");
      }
    });
  }

  function paint() {
    const work = cycle[index];
    if (!work) return;
    viewerImg.src = work.image;
    viewerImg.width = work.w;
    viewerImg.height = work.h;
    viewerImg.alt = work.title + ", pintura de Rocío Villamizar";
    viewerCount.textContent = String(index + 1).padStart(2, "0") + "  /  " + String(cycle.length).padStart(2, "0");
    viewerTitle.textContent = work.title;
    viewerDesc.textContent = work.description;
    viewerStatus.hidden = !work.available;
    viewerStatus.textContent = work.available ? "Disponible" : "";
    viewerAsk.textContent = work.available ? "Consultar esta obra" : "Consultar disponibilidad";
    viewerAsk.href = wa(
      work.available
        ? "Hola Rocío, me interesa la obra " + work.title + ". ¿Sigue disponible?"
        : "Hola Rocío, me interesa la obra " + work.title + ". ¿Me cuentas si está disponible?"
    );
    [-1, 1].forEach(function (dir) {
      const neighbor = cycle[(index + dir + cycle.length) % cycle.length];
      if (!neighbor) return;
      const pre = new Image();
      pre.src = neighbor.image;
    });
  }

  function openWork(id, list, push) {
    const nextList = list && list.length ? list : WORKS;
    let nextIndex = nextList.findIndex(function (work) { return work.id === id; });
    cycle = nextIndex >= 0 ? nextList : WORKS;
    if (nextIndex < 0) nextIndex = cycle.findIndex(function (work) { return work.id === id; });
    if (nextIndex < 0) return;
    index = nextIndex;
    lastFocus = document.activeElement;
    viewerOpen = true;
    paint();
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    setPageHidden(true);
    syncLock();
    viewer.querySelector(".viewer-close").focus();
    const hash = "#" + id;
    if (push) {
      history.pushState({ work: id }, "", hash);
      pushed = true;
    } else if (location.hash !== hash) {
      history.replaceState({ work: id }, "", hash);
    }
  }

  function actuallyClose() {
    if (!viewerOpen) return;
    viewerOpen = false;
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    setPageHidden(false);
    syncLock();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function requestClose() {
    pushed = false;
    actuallyClose();
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  }

  function step(dir) {
    if (!cycle.length) return;
    index = (index + dir + cycle.length) % cycle.length;
    const work = cycle[index];
    history.replaceState({ work: work.id }, "", "#" + work.id);
    paint();
  }

  document.addEventListener("click", function (event) {
    const opener = event.target.closest("[data-open]");
    if (!opener) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
    event.preventDefault();
    openWork(opener.dataset.open, listFor(opener), true);
  });

  viewer.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]") || event.target.classList.contains("viewer-photo")) requestClose();
  });
  viewer.querySelector(".viewer-prev").addEventListener("click", function () { step(-1); });
  viewer.querySelector(".viewer-next").addEventListener("click", function () { step(1); });

  const photo = viewer.querySelector(".viewer-photo");
  photo.addEventListener("touchstart", function (event) {
    touchX = event.changedTouches[0].clientX;
    touchY = event.changedTouches[0].clientY;
  }, { passive: true });
  photo.addEventListener("touchend", function (event) {
    const dx = event.changedTouches[0].clientX - touchX;
    const dy = event.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.15) step(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) && viewer.scrollTop < 10) requestClose();
  }, { passive: true });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (viewerOpen) requestClose();
      else if (menuOpen) setMenu(false);
      return;
    }
    if (!viewerOpen) return;
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    if (event.key !== "Tab") return;
    const items = Array.from(viewer.querySelectorAll("button, a"));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.addEventListener("popstate", function () {
    const id = decodeURIComponent(location.hash.replace("#", ""));
    if (id && byId[id]) openWork(id, cycle.length ? cycle : WORKS, false);
    else actuallyClose();
  });

  const start = decodeURIComponent(location.hash.replace("#", ""));
  if (start && byId[start]) openWork(start, WORKS, false);

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900 && menuOpen) setMenu(false);
  });
})();
