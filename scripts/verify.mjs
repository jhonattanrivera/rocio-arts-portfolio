#!/usr/bin/env node
// Verificación de punta a punta del sitio de Rocio Villamizar con Chromium headless.
// Uso:
//   npm run verify          sirve la copia local bajo /rocio-arts-portfolio/ (como GitHub Pages) y la prueba
//   npm run verify:live     prueba https://jhonattanrivera.github.io/rocio-arts-portfolio/
//   node scripts/verify.mjs --url=https://otra-url/
// Capturas solo si algo falla, en .verify-tmp/ (ignorada por git).

import { createServer } from "node:http";
import { readFile, stat, mkdir, rm } from "node:fs/promises";
import { extname, join, normalize, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LIVE_URL = "https://jhonattanrivera.github.io/rocio-arts-portfolio/";
const PREFIX = "/rocio-arts-portfolio/";
const SHOTS = join(ROOT, ".verify-tmp");
const PAGES_ES = ["index.html", "obras.html", "galeria.html", "encargos.html", "la-artista.html", "disponible.html", "404.html"];
const PAGES_EN = PAGES_ES.map((p) => "en/" + p);
const NAV_ES = [["obras.html", "Obras"], ["galeria.html", "El jardín"], ["encargos.html", "Encargos"], ["la-artista.html", "La artista"]];

const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith("--url="));
const isLive = args.includes("--live") || !!urlArg;

const failures = [];
const fail = (msg) => failures.push(msg);

// ---------- Servidor local que imita GitHub Pages ----------
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml", ".txt": "text/plain",
  ".xml": "application/xml", ".ico": "image/x-icon", ".mp4": "video/mp4", ".webm": "video/webm",
  ".woff2": "font/woff2", ".glb": "model/gltf-binary", ".md": "text/plain",
};
function serve() {
  const server = createServer(async (req, res) => {
    const send404 = async () => {
      res.writeHead(404, { "content-type": TYPES[".html"] });
      res.end(await readFile(join(ROOT, "404.html")));
    };
    try {
      let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (!path.startsWith(PREFIX)) return send404();
      path = path.slice(PREFIX.length - 1);
      if (path.endsWith("/")) path += "index.html";
      const file = normalize(join(ROOT, path));
      if (!file.startsWith(ROOT) || /\/(node_modules|\.git|\.verify-tmp)(\/|$)/.test(file)) return send404();
      const info = await stat(file).catch(() => null);
      if (!info || !info.isFile()) return send404();
      const body = await readFile(file);
      // Rangos para el video, como cualquier servidor estático.
      const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
      const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
      if (range) {
        const start = range[1] ? +range[1] : 0;
        const end = range[2] ? Math.min(+range[2], body.length - 1) : body.length - 1;
        res.writeHead(206, { "content-type": type, "content-range": `bytes ${start}-${end}/${body.length}`, "accept-ranges": "bytes", "content-length": end - start + 1 });
        return res.end(body.subarray(start, end + 1));
      }
      res.writeHead(200, { "content-type": type, "accept-ranges": "bytes" });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end();
    }
  });
  return new Promise((ok) => server.listen(0, "127.0.0.1", () => ok(server)));
}

// ---------- Vigilancia de errores ----------
function watch(page, label) {
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    // Los recursos fallidos ya los reportan los vigilantes de red, con su URL.
    if (m.text().startsWith("Failed to load resource")) return;
    fail(`${label}: error de consola en ${page.url()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => fail(`${label}: excepción JS en ${page.url()}: ${e.message}`));
  page.on("requestfailed", (r) => {
    const err = r.failure()?.errorText || "";
    // ERR_ABORTED es una cancelación: al navegar (nosotros o la redirección de Disponible a Obras)
    // el navegador corta lo que aún descargaba, o suelta un video que ya no necesita.
    // Un recurso roto de verdad aparece como respuesta 4xx/5xx o como otro error de red.
    if (err === "net::ERR_ABORTED") return;
    fail(`${label}: falló la petición ${r.url()} (${err})`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !(r.request().resourceType() === "document" && r.url().includes("no-existe-verify")))
      fail(`${label}: HTTP ${r.status()} en ${r.url()}`);
  });
}

async function shot(page, name) {
  try {
    await mkdir(SHOTS, { recursive: true });
    await page.screenshot({ path: join(SHOTS, `${name}.png`) });
  } catch { /* opcional */ }
}

// Textos de la interfaz en inglés (de js/i18n.js) que no deben aparecer en las páginas en español.
async function englishStrings(request, base) {
  const src = await (await request.get(new URL("js/i18n.js", base).href)).text();
  const block = (lang) => {
    const m = new RegExp(`\\n\\s{4}${lang}: \\{([\\s\\S]*?)\\n\\s{4}\\}`).exec(src);
    const out = {};
    if (m) for (const [, k, v] of m[1].matchAll(/(\w+): "([^"]*)"/g)) out[k] = v.trim();
    return out;
  };
  const es = block("es"), en = block("en");
  if (Object.keys(en).length < 20) fail("español: no pude leer los textos de js/i18n.js");
  return Object.keys(en).filter((k) => en[k] !== es[k] && en[k].length >= 4).map((k) => en[k]);
}

async function checkSpanish(page, label, english) {
  const lang = await page.evaluate(() => document.documentElement.lang);
  if (lang !== "es") fail(`${label}: ${page.url()} tiene lang="${lang}"`);
  const text = await page.evaluate(() => document.body.innerText);
  for (const s of english) if (text.includes(s)) fail(`${label}: texto en inglés en ${page.url()}: "${s}"`);
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = Math.round(innerHeight * 0.9);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    window.scrollTo(0, 0);
  });
}

async function checkImages(page, label) {
  await scrollThrough(page);
  // Solo cuentan las imágenes que se dibujan: con fuente y visibles en la maqueta.
  // Las ocultas por CSS (p. ej. las miniaturas de "Entrar" con mouse) no se descargan nunca.
  const shown = () => Array.from(document.images).filter((i) => (i.getAttribute("src") || i.getAttribute("srcset")) && i.getClientRects().length > 0);
  const done = await page.waitForFunction(
    (fn) => (0, eval)(fn)().every((i) => i.complete), shown.toString(), { timeout: 20000 }
  ).then(() => true, () => false);
  const broken = await page.evaluate((fn) =>
    (0, eval)(fn)().filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src), shown.toString());
  if (!done || broken.length) fail(`${label}: imágenes que no cargan en ${page.url()}: ${broken.slice(0, 5).join(", ") || "(timeout)"}${broken.length > 5 ? ` y ${broken.length - 5} más` : ""}`);
}

async function openMenuAndGo(page, label, href, text) {
  const toggle = page.locator(".nav-toggle");
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.waitForSelector(".nav.is-open", { timeout: 3000 }).catch(() => fail(`${label}: el menú no abre`));
  }
  const link = page.locator(`#menu a[href="${href}"]`);
  const got = (await link.textContent())?.trim();
  if (got !== text) fail(`${label}: el menú dice "${got}" y esperaba "${text}"`);
  await Promise.all([page.waitForURL((u) => u.pathname.endsWith("/" + href)), link.click()]);
}

// El jardín: entra al 3D, sin errores; en celular el joystick queda a la derecha.
// El 3D corre por software en headless (pocos cuadros por segundo), así que las esperas
// sondean cada 100 ms en vez de esperar cuadros de animación.
async function checkGarden(page, label, vp, english) {
  const poll = { polling: 100, timeout: 30000 };
  await page.waitForSelector("[data-wall] .wall-card", { timeout: 8000 }).catch(() => fail(`${label}: el jardín en plano quedó vacío`));
  // gallery.js (con three.js) llega como módulo después de la carga: hasta que arranca,
  // el botón todavía no hace nada. Se espera a que el jardín exponga window.JARDIN.
  await page.waitForFunction(() => window.JARDIN || document.documentElement.classList.contains("sala-flat"), null, poll)
    .catch(() => fail(`${label}: el módulo del jardín no arrancó`));
  await page.locator("#enter").click({ timeout: 30000 });
  await page.waitForFunction(() => document.body.classList.contains("is-walking") && document.getElementById("sala").dataset.ready === "1", null, poll)
    .catch(() => fail(`${label}: el jardín 3D no arrancó`));
  if (await page.evaluate(() => document.documentElement.classList.contains("sala-flat"))) fail(`${label}: el jardín cayó a la vista plana (sin 3D)`);
  const joy = await page.evaluate(() => {
    const el = document.getElementById("joystick");
    const r = el.getBoundingClientRect();
    return { shown: getComputedStyle(el).display !== "none" && r.width > 0, cx: r.left + r.width / 2, right: innerWidth - r.right, w: innerWidth };
  });
  if (vp.mobile) {
    if (!joy.shown) fail(`${label}: el joystick no aparece en celular`);
    else if (joy.cx <= joy.w / 2 || joy.right > 40) fail(`${label}: el joystick no está a la derecha (centro ${Math.round(joy.cx)} de ${joy.w})`);
  } else if (joy.shown) fail(`${label}: el joystick aparece en escritorio`);
  await page.locator("#to-list").click();
  await page.waitForFunction(() => !document.body.classList.contains("is-walking"), null, poll)
    .catch(() => fail(`${label}: "Listado" no sale del jardín`));
  await page.locator("[data-wall] .wall-card").first().click();
  await page.waitForSelector("#sheet:not([hidden])", { timeout: 5000 }).catch(() => fail(`${label}: la ficha de una obra del jardín no abre`));
  await checkSpanish(page, label + " (jardín)", english);
  await page.locator("[data-sheet-close]").click();
  await page.waitForSelector("#sheet[hidden]", { state: "attached", timeout: 5000 }).catch(() => fail(`${label}: la ficha del jardín no cierra`));
}

// ---------- Recorrido por tamaño de pantalla ----------
function newViewport(browser, vp) {
  return browser.newContext({
    viewport: vp.viewport, isMobile: vp.mobile, hasTouch: vp.mobile,
    deviceScaleFactor: vp.mobile ? 3 : 1, locale: "es-CO",
  });
}

async function runViewport(browser, base, vp, english) {
  const context = await newViewport(browser, vp);
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const label = vp.name;
  watch(page, label);
  const before = failures.length;
  let step = "inicio";
  const T = Date.now(); const mark = (s) => process.env.VERIFY_TIMING && console.log(label, s, ((Date.now() - T) / 1000).toFixed(1));
  try {
    // 1. La firma: la intro dibuja el logo y vuela al menú en la primera visita.
    step = "firma";
    const svg = page.waitForResponse((r) => r.url().includes("assets/brand/logo.svg"));
    const res = await page.goto(base, { waitUntil: "domcontentloaded" });
    if (res.status() !== 200) fail(`${label}: el inicio respondió ${res.status()}`);
    const logo = await svg;
    const svgText = await logo.text();
    if (logo.status() !== 200 || !/id="wash"/.test(svgText) || !/id="ink"/.test(svgText)) fail(`${label}: logo.svg no tiene #wash y #ink`);
    if (!(await page.evaluate(() => document.documentElement.classList.contains("show-intro")))) fail(`${label}: la intro de la firma no arrancó`);
    await page.locator("#intro .intro-logo").waitFor({ state: "visible" }).catch(() => fail(`${label}: la firma de la intro no se ve`));
    const ink = await page.evaluate(() => getComputedStyle(document.querySelector("#intro .intro-ink")).animationName);
    if (!ink || ink === "none") fail(`${label}: la firma no tiene animación`);
    await page.waitForFunction(() => !document.getElementById("intro") && !document.documentElement.classList.contains("show-intro") && document.documentElement.classList.contains("hero-go"), null, { timeout: 6000 })
      .catch(() => fail(`${label}: la intro de la firma no termina sola`));
    await page.locator(".nav .brand svg").waitFor({ state: "visible" });
    await page.waitForLoadState("load");

    // 2. Inicio en español, con sus secciones.
    step = "inicio";
    await checkSpanish(page, label, english);
    for (const sel of [".hero h1", "#ahora", "[data-rail]", ".walltest", ".statement", "a.portal", "nav.paths", "footer.footer"])
      if (!(await page.$(sel))) fail(`${label}: falta ${sel} en el inicio`);
    await page.waitForSelector(".rail-track > *", { timeout: 5000 }).catch(() => fail(`${label}: la selección de obras quedó vacía`));
    await page.waitForSelector("[data-mount='room-demo'] .room", { timeout: 5000 }).catch(() => fail(`${label}: la demo de "En tu espacio" no se montó`));

    // 3. "En tu espacio": el visor abre con la obra colgada en una sala.
    mark(step); step = "en tu espacio";
    await page.locator('.hero-actions a[data-mode="room"]').click();
    const viewer = page.locator(".viewer.is-open");
    await viewer.waitFor({ state: "visible" }).catch(() => fail(`${label}: el visor "En tu espacio" no abre`));
    const pressed = await page.getAttribute('.viewer-top button[data-mode="room"]', "aria-pressed");
    if (pressed !== "true") fail(`${label}: el visor no abre en modo "En tu espacio"`);
    await page.waitForFunction(() => {
      const room = document.querySelector(".viewer-room .room");
      const imgs = room ? Array.from(room.querySelectorAll("img")).filter((i) => i.getAttribute("src") && i.getClientRects().length) : [];
      const art = room && room.querySelector(".room-art");
      return imgs.length && imgs.every((i) => i.complete && i.naturalWidth > 0) && art && art.getBoundingClientRect().width > 20;
    }, null, { timeout: 10000 }).catch(() => fail(`${label}: la sala del visor no carga o no muestra la obra`));
    for (const t of ["En tu espacio", "La obra", "Cerrar"])
      if (!(await viewer.getByRole("button", { name: t, exact: true }).count())) fail(`${label}: el visor no tiene el botón "${t}"`);
    const title = (await page.textContent("#viewer-title"))?.trim();
    if (title !== "Serenidad") fail(`${label}: el visor muestra "${title}" y esperaba "Serenidad"`);
    await checkSpanish(page, label + " (visor)", english);
    await page.locator(".viewer-close").click();
    await page.waitForSelector(".viewer.is-open", { state: "detached", timeout: 5000 }).catch(() => fail(`${label}: el visor no cierra`));

    // 4. Imágenes del inicio.
    mark(step); step = "imágenes inicio";
    await checkImages(page, label);

    // 5. Menú: cada enlace lleva a su página, que carga en español y con imágenes.
    //    El jardín va aparte (runGarden) porque su 3D por software ocupa toda la CPU.
    for (const [href, text] of NAV_ES.filter(([h]) => h !== "galeria.html")) {
      mark(step); step = href;
      await page.goto(base, { waitUntil: "load" });
      await openMenuAndGo(page, label, href, text);
      await page.waitForLoadState("load");
      const h1 = await page.locator("main h1").first().textContent().catch(() => "");
      if (!h1?.trim()) fail(`${label}: ${href} no tiene título`);
      await checkSpanish(page, label, english);
      if (href === "obras.html") await page.waitForSelector("[data-mount='masonry'] > *", { timeout: 8000 }).catch(() => fail(`${label}: Obras quedó vacía`));
      await checkImages(page, label);
    }

    mark(step);
  } catch (e) {
    fail(`${label} (${step}): ${e.message.split("\n")[0]}`);
  }
  if (failures.length > before) await shot(page, label);
  await context.close();
}

// El jardín desde el menú, como segunda visita (sin intro).
async function runGarden(browser, base, vp, english) {
  const context = await newViewport(browser, vp);
  await context.addInitScript(() => { try { sessionStorage.setItem("rocio-intro", "1"); } catch (e) {} });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const label = vp.name + " jardín";
  watch(page, label);
  const before = failures.length;
  try {
    await page.goto(base, { waitUntil: "load" });
    await openMenuAndGo(page, label, "galeria.html", "El jardín");
    const h1 = (await page.locator("main h1").first().textContent())?.trim();
    if (!h1) fail(`${label}: galeria.html no tiene título`);
    await checkSpanish(page, label, english);
    await checkGarden(page, label, vp, english);
  } catch (e) {
    fail(`${label}: ${e.message.split("\n")[0]}`);
  }
  if (failures.length > before) await shot(page, label.replace(" ", "-"));
  await context.close();
}

// ---------- Todas las páginas y sus enlaces internos ----------
async function checkPagesAndLinks(browser, base) {
  const context = await browser.newContext({ locale: "es-CO" });
  // La intro solo se prueba en el recorrido; aquí se salta, como en una segunda visita.
  await context.addInitScript(() => { try { sessionStorage.setItem("rocio-intro", "1"); } catch (e) {} });
  // Con "ahorro de datos" el jardín no arranca su vista previa 3D: aquí solo importan
  // estados, idioma y enlaces, y el 3D ya se prueba en el recorrido.
  await context.addInitScript(() => { try { Object.defineProperty(navigator, "connection", { value: { saveData: true } }); } catch (e) {} });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  watch(page, "páginas");
  const works = await (await context.request.get(new URL("js/works.js", base).href)).text();
  const showAvailable = /showAvailable:\s*true/.test(works);
  const links = new Map(); // url sin hash -> Set de hashes
  let ids = new Set();
  for (const p of [...PAGES_ES, ...PAGES_EN]) {
    const url = new URL(p, base).href;
    if (p.endsWith("disponible.html") && !showAvailable) {
      // Con showAvailable apagado, Disponible manda a Obras.
      const res = await page.goto(url, { waitUntil: "commit" });
      if (res.status() !== 200) fail(`páginas: ${p} responde ${res.status()}`);
      await page.waitForURL((u) => u.pathname.endsWith("/obras.html"), { waitUntil: "load" })
        .catch(() => fail(`páginas: ${p} no redirige a Obras`));
      continue;
    }
    const res = await page.goto(url, { waitUntil: "load" }).catch((e) => { fail(`páginas: ${p} no abre (${e.message.split("\n")[0]})`); return null; });
    if (!res) continue;
    if (res.status() !== 200) fail(`páginas: ${p} responde ${res.status()}`);
    const want = p.startsWith("en/") ? "en" : "es";
    const lang = await page.evaluate(() => document.documentElement.lang);
    if (lang !== want) fail(`páginas: ${p} tiene lang="${lang}" y esperaba "${want}"`);
    if (!ids.size) ids = new Set(await page.evaluate(() => (window.WORKS || []).map((w) => w.id)));
    const found = await page.evaluate((local) => {
      const out = [];
      for (const a of document.querySelectorAll("a[href]")) out.push(a.href);
      for (const el of document.querySelectorAll("link[href], script[src], img[src], source[src], video[src]")) out.push(el.href || el.src);
      // Todas las variantes de srcset, solo en local (son archivos del repo). En vivo serían
      // cientos de peticiones seguidas y GitHub Pages responde 503 a algunas; lo que un visitante
      // carga de verdad ya lo vigilan los recorridos.
      if (local)
        for (const el of document.querySelectorAll("img[srcset], source[srcset]"))
          for (const part of el.srcset.split(",")) { const u = part.trim().split(/\s+/)[0]; if (u) out.push(new URL(u, location.href).href); }
      const ids = Array.from(document.querySelectorAll("[id]")).map((e) => e.id);
      return { out, ids, here: location.href.split("#")[0] };
    }, !isLive);
    for (const u of found.out) {
      if (!u.startsWith(new URL(base).origin) || !new URL(u).pathname.startsWith(new URL(base).pathname)) continue;
      const [clean, hash] = u.split("#");
      if (!links.has(clean)) links.set(clean, new Set());
      if (hash) links.get(clean).add(hash);
    }
    links.set(found.here + "::ids", new Set(found.ids));
  }
  // Recursos y páginas: todos con 200. Anclas: un id de la página o una obra (abren el visor).
  const urls = [...links.keys()].filter((k) => !k.endsWith("::ids"));
  // HEAD de a 12 a la vez: GitHub Pages deja colgadas las peticiones si llegan cientos juntas.
  const results = [];
  const queue = [...urls];
  await Promise.all(Array.from({ length: 12 }, async () => {
    for (let u = queue.shift(); u; u = queue.shift()) {
      const r = await context.request.fetch(u, { method: "HEAD", maxRedirects: 0, timeout: 15000 }).catch((e) => ({ status: () => e.message.split("\n")[0] }));
      results.push([u, r.status()]);
    }
  }));
  for (const [u, s] of results) if (s !== 200) fail(`enlaces: ${u} responde ${s}`);
  for (const u of urls) {
    const pageIds = links.get(u + "::ids") || links.get(u.replace(/\/$/, "/index.html") + "::ids");
    for (const h of links.get(u)) {
      if (ids.has(decodeURIComponent(h))) continue;
      if (pageIds && pageIds.has(h)) continue;
      if (!pageIds) continue; // página no recorrida (archivo suelto): basta con el 200
      fail(`enlaces: ${u}#${h} no apunta a nada`);
    }
  }
  if (!isLive) {
    const missing = await context.request.get(new URL("no-existe-verify.html", base).href);
    if (missing.status() !== 404 || !(await missing.text()).includes("Esta página no está")) fail("enlaces: una página inexistente no muestra el 404 propio");
  }
  await context.close();
  if (process.env.VERIFY_TIMING) console.log("páginas y enlaces listos");
  return urls.length;
}

async function main() {
  const t0 = Date.now();
  await rm(SHOTS, { recursive: true, force: true });
  let server = null;
  let base = urlArg ? urlArg.slice(6) : LIVE_URL;
  if (!isLive) {
    server = await serve();
    base = `http://127.0.0.1:${server.address().port}${PREFIX}`;
  }
  console.log(`verify: ${base}`);
  let browser;
  try {
    // SwiftShader: WebGL por software, para que el jardín 3D corra en headless igual en cualquier máquina.
    browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  } catch (e) {
    console.error("No se pudo abrir Chromium. Instálalo con: npx playwright install chromium");
    throw e;
  }
  try {
    const req = await browser.newContext();
    const english = await englishStrings(req.request, base);
    await req.close();
    const VPS = [
      { name: "movil-390", viewport: { width: 390, height: 844 }, mobile: true },
      { name: "escritorio-1280", viewport: { width: 1280, height: 800 }, mobile: false },
    ];
    const [counted] = await Promise.all([checkPagesAndLinks(browser, base), ...VPS.map((vp) => runViewport(browser, base, vp, english))]);
    if (process.env.VERIFY_TIMING) console.log("fase 1", ((Date.now() - t0) / 1000).toFixed(1));
    // El jardín al final y de a uno: su WebGL por software ocupa toda la CPU y volvería lento lo demás.
    for (const vp of VPS) await runGarden(browser, base, vp, english);
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    if (failures.length) {
      const list = [...new Set(failures)];
      console.error(`\nverify FALLÓ (${list.length}) en ${secs} s:`);
      for (const f of list) console.error(`  - ${f}`);
      console.error(`Capturas en ${SHOTS}`);
      process.exitCode = 1;
    } else {
      console.log(`verify OK en ${secs} s: ${PAGES_ES.length + PAGES_EN.length} páginas, 2 tamaños, ${counted} enlaces y recursos internos.`);
    }
  } finally {
    if (server) { server.closeAllConnections(); server.close(); }
  }
}

// Al terminar se sale sin browser.close(): Chromium tarda unos 20 s en soltar el renderer
// del jardín (WebGL por software) y el resultado ya está decidido. Playwright mata el
// navegador al salir el proceso.
main().then(() => process.exit(process.exitCode || 0), (e) => { console.error(e); process.exit(1); });
