(function () {
  var WORKS = window.WORKS || [];
  var byId = {};
  WORKS.forEach(function (work) { byId[work.id] = work; });
  var html = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var ROOT = (window.SITE && window.SITE.root) || "";

  /* Las obras del muro del inicio, en orden de lectura (fila por fila) */
  var WALL = ["rosal", "respirar", "hacia-el-cielo", "dos-jardines", "luz-de-mayo", "nina-de-las-rosas",
    "entre-mujeres", "camino-rosa", "hortensias", "la-puerta", "prado", "leer-contigo"];
  var DEMO = [["dos-jardines", "sala"], ["prado", "comedor"], ["luz-de-mayo", "pasillo"], ["respirar", "recepcion"], ["hacia-el-cielo", "consultorio"]];

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

  /* Tema claro u oscuro. Claro por defecto; la elección queda guardada.
     El cambio se revela en círculo desde el botón, con la página misma. */
  var themeButtons = document.querySelectorAll("[data-theme-toggle]");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var schemeMeta = document.querySelector('meta[name="color-scheme"]');
  function themeNow() { return html.dataset.theme === "dark" ? "dark" : "light"; }
  function paintTheme(theme) {
    if (theme === "dark") html.dataset.theme = "dark";
    else delete html.dataset.theme;
    if (themeMeta) themeMeta.content = getComputedStyle(html).getPropertyValue("--paper").trim();
    if (schemeMeta) schemeMeta.content = theme === "dark" ? "dark" : "light";
    themeButtons.forEach(function (button) { button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false"); });
  }
  function setTheme(theme, from) {
    store("rocio-theme", theme);
    if (reduce || !document.startViewTransition || !from) { paintTheme(theme); return; }
    var box = from.getBoundingClientRect();
    var x = box.left + box.width / 2;
    var y = box.top + box.height / 2;
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    html.classList.add("is-theming");
    var shift = document.startViewTransition(function () { paintTheme(theme); });
    shift.ready.then(function () {
      html.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + r + "px at " + x + "px " + y + "px)"] },
        { duration: 760, easing: "cubic-bezier(.65, 0, .35, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
    shift.finished.finally(function () { html.classList.remove("is-theming"); });
  }
  paintTheme(themeNow());
  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () { setTheme(themeNow() === "dark" ? "light" : "dark", button); });
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

  var scrollTick = false;
  function onScroll() {
    scrollTick = false;
    paintWords();
    paintHero();
  }
  window.addEventListener("scroll", function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Intro: el verde oliva, la firma que se escribe, y la firma que vuela al menú.
     Espera a la fuente para no escribir la firma con otra letra. */
  var intro = document.getElementById("intro");
  function heroGo() { html.classList.add("hero-go"); }
  if (intro && html.classList.contains("show-intro")) {
    var introDone = false;
    var logo = intro.querySelector(".intro-logo");
    var brand = document.querySelector(".nav .brand .wordmark");
    var leaveTimer = 0;
    var introStart = Date.now();
    /* La espera por la letra se descuenta del tiempo de la intro: el telón no se
       alarga, solo queda lo justo para que la firma termine de escribirse. */
    function begin() {
      if (leaveTimer || introDone) return;
      intro.classList.add("is-ready");
      leaveTimer = window.setTimeout(leave, Math.max(1700, 2150 - (Date.now() - introStart)));
    }
    /* la letra la pidió el <head> (WORDMARK_FONTS); si tarda, la firma sale igual */
    if (window.WORDMARK_FONTS) {
      window.WORDMARK_FONTS.then(begin, begin);
      window.setTimeout(begin, 900);
    } else begin();
    function leave() {
      if (introDone) return;
      introDone = true;
      window.clearTimeout(leaveTimer);
      intro.classList.add("is-ready");
      try { sessionStorage.setItem("rocio-intro", "1"); } catch (err) { /* privado */ }
      if (logo && brand) {
        var a = logo.getBoundingClientRect();
        var b = brand.getBoundingClientRect();
        if (a.width && b.width) {
          logo.style.transformOrigin = "0 0";
          logo.style.transform = "translate(" + (b.left - a.left) + "px," + (b.top - a.top) + "px) scale(" + (b.width / a.width) + ")";
          /* llega con el color que le toca en la barra: claro sobre la foto, tinta sobre el papel */
          logo.style.color = window.getComputedStyle(brand).color;
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

  /* Demostración de la sala en el inicio. Se arma recién cuando se acerca a la
     pantalla: la foto del espacio y la pintura no compiten con la portada. */
  var demoHost = document.querySelector("[data-mount='room-demo']");
  if (demoHost && window.Room) {
    var demo = null;
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
    var startDemo = function () {
      demo = window.Room.create(demoHost, { room: DEMO[0][1] });
      demoShow(0);
      new IntersectionObserver(function (entries) {
        window.clearInterval(demoTimer);
        if (entries[0].isIntersecting && !reduce) demoTimer = window.setInterval(demoTick, 4600);
      }, { threshold: 0.3 }).observe(demoHost);
    };
    var demoNear = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      demoNear.disconnect();
      startDemo();
    }, { rootMargin: "700px 0px" });
    demoNear.observe(demoHost);
  }

  /* Galería y catálogo */
  var masonry = document.querySelector("[data-mount='masonry']");
  var catalog = document.querySelector("[data-mount='catalog']");
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
      frame.append(window.artPicture(work, { sizes: opts.sizes, eager: opts.eager, alt: altOf(work), blur: true }));
    }
    link.append(frame);
    return link;
  }

  /* Ninguna obra espera al scroll: todas ocupan su lugar desde el
     principio, con su vista previa. Solo las de la primera pantalla
     entran una vez, en orden de lectura, con un fundido lento. */
  function enterMasonry() {
    if (reduce) return;
    var vh = window.innerHeight;
    var first = [];
    Array.prototype.forEach.call(masonry.children, function (link) {
      var r = link.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) first.push({ link: link, top: r.top, left: r.left });
    });
    first.sort(function (a, b) { return (a.top - b.top) || (a.left - b.left); });
    first.forEach(function (f, k) {
      var link = f.link;
      link.style.setProperty("--d", Math.min(k, 7) * 110 + "ms");
      link.classList.add("is-arriving");
      link.addEventListener("animationend", function done(e) {
        if (e.target !== link || e.animationName !== "card-rise") return;
        link.removeEventListener("animationend", done);
        link.classList.remove("is-arriving");
        link.style.removeProperty("--d");
      });
    });
  }

  /* La tarjeta de la cuadrícula: la misma en Obras y en el muro del inicio */
  function gridCard(work, opts) {
    var link = card(work, {
    className: "card",
    href: opts.href || ("#" + work.id),
    eager: opts.eager,
    cursor: t("seeRoomShort"),
    sizes: opts.sizes
    });
    var stage = document.createElement("span");
    stage.className = "card-stage";
    stage.append(link.querySelector(".frame"));
    link.prepend(stage);
    var cap = document.createElement("span");
    cap.className = "card-cap";
    var title = document.createElement("span");
    title.className = "card-title";
    title.textContent = work.title;
    cap.append(title);
    var bits = facts(work);
    if (bits.length) {
      var meta = document.createElement("span");
      meta.className = "card-facts";
      meta.textContent = bits.join(" · ");
      cap.append(meta);
    }
    if (work.available && SHOW_AVAILABLE) {
      var note = document.createElement("span");
      note.className = "card-note";
      note.textContent = t("available");
      cap.append(note);
    }
    link.append(cap);
    return link;
  }

  function renderMasonry(list) {
    if (!masonry || !window.artPicture) return;
    visible = list;
    masonry.replaceChildren();
    list.forEach(function (work, i) {
      masonry.append(gridCard(work, { eager: i < 4, sizes: window.ART_GRID_SIZES }));
    });
    enterMasonry();
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

  /* Inicio: el muro de obras en tres franjas. Al bajar, cada franja corre de
     lado mientras está a la vista (la primera y la tercera hacia la izquierda,
     la del medio hacia la derecha), como pasar frente a una pared de galería.
     Cada una recorre justo lo que le sobra, así todas sus obras pasan enteras
     por la pantalla. Con "menos animación" las franjas se deslizan a mano. */
  var flow = document.querySelector("[data-flow]");
  var flowHost = flow && flow.querySelector("[data-mount='wall']");
  if (flowHost && window.artPicture) {
    var flowRows = [0, 1, 2].map(function (r) {
      var el = document.createElement("div");
      el.className = "flow-row";
      el.style.setProperty("--d", r * 140 + "ms");
      flowHost.append(el);
      return { el: el, dir: r === 1 ? 1 : -1, x: 0, goal: 0, span: 0, hold: 0 };
    });
    WALL.forEach(function (id, i) {
      var work = byId[id];
      if (!work) return;
      flowRows[i % 3].el.append(gridCard(work, { href: "obras.html#" + work.id, sizes: "(min-width: 1600px) 480px, (min-width: 1100px) 30vw, (min-width: 720px) 40vw, 64vw" }));
    });

    var flowRaf = 0;
    var flowLast = 0;
    var drawRows = function (now) {
      flowRaf = 0;
      /* un poco de inercia: la rueda del mouse salta de a 100 px, las franjas no */
      var dt = flowLast ? Math.min(64, now - flowLast) : 16.7;
      flowLast = now;
      var k = 1 - Math.pow(0.84, dt / 16.7);
      var moving = false;
      flowRows.forEach(function (row) {
        var d = row.goal - row.x;
        row.x = Math.abs(d) < 0.4 ? row.goal : row.x + d * k;
        if (row.x !== row.goal) moving = true;
        row.el.style.transform = "translate3d(" + row.x.toFixed(1) + "px,0,0)";
      });
      if (moving) flowRaf = requestAnimationFrame(drawRows);
      else flowLast = 0;
    };
    var readRows = function () {
      if (reduce) return;
      var vh = window.innerHeight;
      var box = flowHost.getBoundingClientRect();
      if (box.bottom < -vh || box.top > 2 * vh) return;
      var now = performance.now();
      flowRows.forEach(function (row) {
        if (row.hold > now) return;
        var r = row.el.getBoundingClientRect();
        /* 0 cuando la franja asoma por abajo, 1 cuando se va por arriba */
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
        row.goal = row.dir < 0 ? -p * row.span : -(1 - p) * row.span;
      });
      if (!flowRaf) flowRaf = requestAnimationFrame(drawRows);
    };
    var measureRows = function () {
      if (reduce) return;
      var vw = flowHost.clientWidth;
      flowRows.forEach(function (row) { row.span = Math.max(0, row.el.offsetWidth - vw); });
      readRows();
      flowRows.forEach(function (row) { row.x = row.goal; });
      drawRows(0);
    };
    var flowResize = 0;
    window.addEventListener("resize", function () {
      cancelAnimationFrame(flowResize);
      flowResize = requestAnimationFrame(measureRows);
    });
    window.addEventListener("scroll", readRows, { passive: true });
    measureRows();

    /* con el teclado, la obra enfocada se trae a la vista dentro de su franja */
    flowHost.addEventListener("focusin", function (event) {
      if (reduce) return;
      var card = event.target.closest(".flow-row > *");
      var row = card && flowRows.filter(function (r) { return r.el === card.parentNode; })[0];
      if (!row) return;
      var edge = parseFloat(getComputedStyle(row.el).paddingLeft) || 0;
      var vw = flowHost.clientWidth;
      var left = card.offsetLeft + row.goal;
      var goal = row.goal;
      if (left < edge) goal += edge - left;
      else if (left + card.offsetWidth > vw - edge) goal -= left + card.offsetWidth - (vw - edge);
      row.goal = Math.max(-row.span, Math.min(0, goal));
      row.hold = performance.now() + 1500;
      if (!flowRaf) flowRaf = requestAnimationFrame(drawRows);
    });

    /* Las franjas corridas dejan obras fuera de la pantalla por los lados, donde
       la carga diferida no las ve venir: al acercarse el muro se piden todas. */
    var flowImgs = flowHost.querySelectorAll("img[loading='lazy']");
    var warmRows = function () { flowImgs.forEach(function (img) { img.loading = "eager"; }); };

    /* entrada: las franjas aparecen una tras otra, una sola vez */
    if (!("IntersectionObserver" in window)) { flowHost.classList.add("is-in"); warmRows(); }
    else {
      var flowNear = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        flowNear.disconnect();
        warmRows();
      }, { rootMargin: "120% 0px" });
      flowNear.observe(flowHost);
      var flowIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        flowIo.disconnect();
        flowHost.classList.add("is-in");
      }, { threshold: 0.12 });
      flowIo.observe(flowHost);
    }
  }

  /* Obras: cuando la página ya cargó, las imágenes que esperaban el scroll
     se bajan de a tres (de a una en 3G), empezando por las más cercanas.
     Son las mismas <img> de la página: mismo formato y tamaño. */
  function viewerBusy() { return !!document.querySelector(".viewer.is-open"); }
  if (masonry && window.artCanWarm && window.artCanWarm()) {
    window.artWhenIdle(function () {
      var running = 0;
      var paused = false;
      function pending() {
        var top = window.scrollY;
        return Array.prototype.slice.call(masonry.querySelectorAll("img"))
          .filter(function (img) { return !img.dataset.warm && !(img.complete && img.naturalWidth); })
          .map(function (img) { return { img: img, d: Math.abs(img.getBoundingClientRect().top + window.scrollY - top) }; })
          .sort(function (a, b) { return a.d - b.d; });
      }
      var c = navigator.connection;
      var lanes = c && /3g/.test(c.effectiveType || "") ? 1 : 3;
      function next() {
        if (running >= lanes) return;
        if (viewerBusy()) {
          if (!paused) { paused = true; window.setTimeout(function () { paused = false; next(); }, 1500); }
          return;
        }
        var item = pending()[0];
        if (!item) return;
        var img = item.img;
        img.dataset.warm = "1";
        running += 1;
        var done = false;
        function finish() {
          if (done) return;
          done = true;
          running -= 1;
          next();
        }
        img.addEventListener("load", finish, { once: true });
        img.addEventListener("error", finish, { once: true });
        window.setTimeout(finish, 10000);
        img.fetchPriority = "low";
        img.loading = "eager";
        next();
      }
      next();
    }, 300);
  }

  /* El jardín, listo antes de entrar: con el navegador libre, las demás páginas
     dejan en caché su motor 3D y la primera pasada de cuadros (unos 500 KB). Al
     apuntar o tocar un enlace al jardín se piden al instante. Nunca con ahorro de
     datos ni en 2G. */
  var gardenLink = document.querySelector("[data-prefetch]");
  if (gardenLink && window.artCanWarm && window.artCanWarm()) {
    var gardenWarm = false;
    var warmGarden = function () {
      if (gardenWarm) return;
      gardenWarm = true;
      var root = (window.SITE && window.SITE.root) || "";
      var files = gardenLink.dataset.prefetch.split(/\s+/).filter(Boolean);
      (window.GARDEN_IDS || []).forEach(function (id) { files.push("assets/media/garden/" + id + ".webp"); });
      files.forEach(function (file) {
        var link = document.createElement("link");
        link.rel = "prefetch";
        link.href = root + file;
        if (/\.webp$/.test(file)) link.crossOrigin = "anonymous";
        document.head.append(link);
      });
    };
    window.artWhenIdle(warmGarden, 2500);
    document.querySelectorAll('a[href$="galeria.html"]').forEach(function (a) {
      ["pointerenter", "touchstart", "focus"].forEach(function (type) { a.addEventListener(type, warmGarden, { once: true, passive: true }); });
    });
  }

  /* Inicio: con el navegador libre, deja listas en caché las obras de la
     primera pantalla de Obras. Columnas y alto de fila se leen del propio CSS
     con una muestra invisible que se quita enseguida. */
  if (document.body.classList.contains("page-home") && window.artPicture && window.artCanWarm && window.artCanWarm()) {
    window.artWhenIdle(function () {
      var probe = document.createElement("div");
      probe.className = "masonry";
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;";
      probe.innerHTML = '<span class="card"><span class="card-stage"></span><span class="card-cap"><span class="card-title">Ag</span></span></span>';
      document.body.append(probe);
      var grid = window.getComputedStyle(probe);
      var cols = grid.gridTemplateColumns.split(" ").filter(Boolean).length || 2;
      var rowH = probe.firstChild.getBoundingClientRect().height + (parseFloat(grid.rowGap) || 0);
      probe.remove();
      if (!rowH) return;
      /* la cuadrícula es pareja: la primera pantalla de Obras son sus primeras filas */
      var rows = Math.ceil(window.innerHeight / rowH) + 1;
      var queue = WORKS.slice(0, Math.min(14, cols * rows));
      var keep = [];
      var running = 0;
      function next() {
        while (running < 2 && queue.length) {
          var work = queue.shift();
          var pic = window.artPicture(work, { sizes: window.ART_GRID_SIZES, eager: true, priority: "low", alt: "" });
          var img = pic.querySelector("img");
          keep.push(pic);
          running += 1;
          (function (img) {
            var done = false;
            function finish() { if (done) return; done = true; running -= 1; next(); }
            img.addEventListener("load", finish, { once: true });
            img.addEventListener("error", finish, { once: true });
            window.setTimeout(finish, 10000);
          })(img);
        }
      }
      next();
    }, 1500);
  }
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

  /* Visor: la obra sola, o colgada en tu espacio */
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
      '<button type="button" class="viewer-back" data-back>' + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' + t("backRoom") + "</button>" +
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
        '<button type="button" class="viewer-detail text-link" data-detail>' + t("seeDetail") + "</button>" +
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
    if (!swipe || !phone() || mode === "art") return;
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
    if (!phone() || mode === "art") return;
    if (!compact && event.deltaY > 4) { event.preventDefault(); if (performance.now() > gestureLock) setCompact(true); }
    else if (compact && side.scrollTop <= 0 && event.deltaY < -4) { event.preventDefault(); if (performance.now() > gestureLock) setCompact(false); }
  }, { passive: false });
  if (grip) grip.addEventListener("click", function () { setCompact(!compact); });
  window.addEventListener("resize", function () { if (!phone()) setCompact(false); });
  var view = { s: 1, x: 0, y: 0 };
  var cycle = WORKS;
  var index = 0;
  var lastFocus = null;
  var lastTap = 0;
  var lastOpener = null;
  /* El visor abre siempre con la obra colgada en el espacio; tocarla abre su detalle. */
  var mode = "room";
  var tapSeen = store("rocio-tap") === "1";
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
        viewerCredit.textContent = info.room.credit ? t("photoBy") + " " + info.room.credit + " · Unsplash" : "";
      },
      onMove: function () { viewer.classList.add("hint-done"); },
      onTap: function () { seenTap(); setMode("art"); },
      tapLabel: t("seeDetail")
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

  /* La gotita y su aviso invitan a tocar la obra; desaparecen para siempre al primer toque */
  function seenTap() {
    if (tapSeen) return;
    tapSeen = true;
    store("rocio-tap", "1");
    viewer.classList.remove("tap-hint");
  }
  function tapHint() {
    viewer.classList.remove("tap-hint");
    if (tapSeen || reduce || mode !== "room") return;
    void viewer.offsetWidth;
    viewer.classList.add("tap-hint");
  }
  function setMode(next) {
    var was = mode;
    mode = next === "art" || !window.Room ? "art" : "room";
    viewer.dataset.mode = mode;
    if (was !== mode) { setCompact(false); side.scrollTop = 0; }
    viewerHint.textContent = mode === "room"
      ? (tapSeen ? t("dragHint") : (fine ? t("tapHintFine") : t("tapHintTouch")))
      : (fine ? t("loupeHint") : t("pinchHint"));
    tapHint();
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
    if (mount.dataset.cycle === "wall") return WALL.map(function (id) { return byId[id]; }).filter(Boolean);
    if (mount.dataset.cycle === "visible") return visible;
    return WORKS;
  }

  /* La obra acercada no se sale de su marco: se puede correr hasta su borde, no más */
  function renderPinch(ease) {
    var mx = Math.max(0, (view.s - 1) * viewerImg.offsetWidth / 2);
    var my = Math.max(0, (view.s - 1) * viewerImg.offsetHeight / 2);
    view.x = Math.max(-mx, Math.min(mx, view.x));
    view.y = Math.max(-my, Math.min(my, view.y));
    pinch.classList.toggle("is-easing", !!ease);
    pinch.style.transform = "translate3d(" + view.x.toFixed(1) + "px," + view.y.toFixed(1) + "px,0) scale(" + view.s.toFixed(3) + ")";
    if (view.s > 1.2) wantDetail();
  }
  function resetZoom() {
    view = { s: 1, x: 0, y: 0 };
    renderPinch();
    photo.classList.remove("is-loupe");
  }
  /* Al acercarse se pide la foto original (2000 px), no la de pantalla: así se ve
     la textura de la pintura. Mientras llega, sigue la que estaba. */
  var detailOn = false;
  function wantDetail() {
    if (detailOn || !cycle[index] || cycle[index].w <= 1280) return;
    detailOn = true;
    srcAvif.media = srcWebp.media = "not all";
    viewerImg.sizes = cycle[index].w + "px";
  }

  var preloads = [];
  function paint() {
    var work = cycle[index];
    if (!work) return;
    resetZoom();
    detailOn = false;
    srcAvif.media = srcWebp.media = "";
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
    /* Precarga la vecina en el mismo formato y ancho que usará el visor,
       para que al deslizar ya esté en caché. */
    preloads = [-1, 1].map(function (dir) {
      var neighbor = cycle[(index + dir + cycle.length) % cycle.length];
      if (!neighbor || !neighbor.widths || !window.artPicture) return null;
      return window.artPicture(neighbor, { sizes: "(min-width: 980px) 66vw, 100vw", eager: true, priority: "low", alt: "" });
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
    mode = opts.mode === "art" ? "art" : "room";
    var fromImg = lastOpener && lastOpener.querySelector ? lastOpener.querySelector(".frame img, picture img") : null;
    function run() {
      viewerOpen = true;
      show();
      setMode(mode);
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
    if (event.target.closest("[data-back]")) { setMode("room"); return; }
    if (event.target.closest("[data-detail]")) { seenTap(); setMode("art"); return; }
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

  /* Lupa con mouse */
  photo.addEventListener("pointermove", function (event) {
    if (event.pointerType !== "mouse") return;
    var rect = viewerImg.getBoundingClientRect();
    viewerImg.style.transformOrigin = ((event.clientX - rect.left) / rect.width * 100) + "% " + ((event.clientY - rect.top) / rect.height * 100) + "%";
  });
  photo.addEventListener("click", function () {
    if (!fine) return;
    photo.classList.toggle("is-loupe");
    if (photo.classList.contains("is-loupe")) { wantDetail(); viewer.classList.add("zoom-done"); }
  });
  photo.addEventListener("pointerleave", function () { photo.classList.remove("is-loupe"); });

  /* Teléfono: pellizco (acerca donde están los dedos), arrastre con la obra
     acercada, doble toque y deslizar para pasar de obra. Va con eventos táctiles
     y no con pointer: en el iPhone, Safari se queda con el pellizco para su
     propio zoom y le cancela los pointer a la página. */
  var tch = null;
  function center() {
    var r = pinch.getBoundingClientRect();
    /* el centro de .pinch sin su transform: su caja menos el corrimiento actual */
    return { x: r.left + r.width / 2 - view.x, y: r.top + r.height / 2 - view.y };
  }
  function zoomAt(s, fx, fy, from) {
    /* el punto de la obra que estaba bajo (from) queda bajo (fx, fy) */
    var c = center();
    var px = (from.fx - c.x - from.x) / from.s;
    var py = (from.fy - c.y - from.y) / from.s;
    view.s = Math.min(4, Math.max(1, s));
    view.x = fx - c.x - view.s * px;
    view.y = fy - c.y - view.s * py;
  }
  function twoFingers(e) {
    var a = e.touches[0], b = e.touches[1];
    return { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) || 1, x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }
  photo.addEventListener("touchstart", function (event) {
    event.preventDefault();
    if (event.touches.length >= 2) {
      var f = twoFingers(event);
      tch = { pinch: { d: f.d, fx: f.x, fy: f.y, s: view.s, x: view.x, y: view.y }, moved: true };
    } else if (event.touches.length === 1 && !tch) {
      var t = event.touches[0];
      tch = { x0: t.clientX, y0: t.clientY, x: t.clientX, y: t.clientY, moved: false, pinch: null };
    }
  }, { passive: false });
  photo.addEventListener("touchmove", function (event) {
    event.preventDefault();
    if (!tch) return;
    if (event.touches.length >= 2 && tch.pinch) {
      var f = twoFingers(event);
      zoomAt(tch.pinch.s * f.d / tch.pinch.d, f.x, f.y, tch.pinch);
      renderPinch();
      return;
    }
    var t = event.touches[0];
    if (!t) return;
    if (tch.pinch) {
      /* quedó un dedo después del pellizco: sigue arrastrando desde ahí */
      tch.pinch = null;
      tch.x = t.clientX;
      tch.y = t.clientY;
      return;
    }
    var dx = t.clientX - tch.x;
    var dy = t.clientY - tch.y;
    tch.x = t.clientX;
    tch.y = t.clientY;
    if (Math.abs(t.clientX - tch.x0) + Math.abs(t.clientY - tch.y0) > 8) tch.moved = true;
    if (view.s > 1) {
      view.x += dx;
      view.y += dy;
      renderPinch();
    }
  }, { passive: false });
  function touchEnd(event) {
    if (!tch) return;
    if (event.touches.length) {
      /* de dos dedos a uno: el que queda sigue arrastrando */
      if (tch.pinch && event.touches.length === 1) {
        var t = event.touches[0];
        tch = { x0: t.clientX, y0: t.clientY, x: t.clientX, y: t.clientY, moved: true, pinch: null };
      }
      return;
    }
    var done = tch;
    tch = null;
    if (event.type === "touchcancel") return;
    if (view.s < 1.05) { view = { s: 1, x: 0, y: 0 }; renderPinch(true); }
    if (view.s > 1) viewer.classList.add("zoom-done");
    var end = event.changedTouches[0];
    if (!done.moved) {
      var now = performance.now();
      if (now - lastTap < 300) {
        lastTap = 0;
        if (view.s > 1) view = { s: 1, x: 0, y: 0 };
        else zoomAt(2.5, end.clientX, end.clientY, { fx: end.clientX, fy: end.clientY, s: 1, x: 0, y: 0 });
        renderPinch(true);
        viewer.classList.add("zoom-done");
      } else lastTap = now;
      return;
    }
    if (view.s > 1 || done.pinch) return;
    var sx = end.clientX - done.x0;
    var sy = end.clientY - done.y0;
    if (Math.abs(sx) > 52 && Math.abs(sx) > Math.abs(sy) * 1.2) step(sx < 0 ? 1 : -1);
  }
  photo.addEventListener("touchend", touchEnd);
  photo.addEventListener("touchcancel", touchEnd);
  /* Safari: que el pellizco sobre la obra no acerque la página entera */
  ["gesturestart", "gesturechange"].forEach(function (type) {
    photo.addEventListener(type, function (event) { event.preventDefault(); });
  });

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
