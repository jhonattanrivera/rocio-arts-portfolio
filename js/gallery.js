import * as THREE from "./vendor/three.module.min.js?v=20261112c";

/* El jardín: una exposición al aire libre.
   Un pasillo de losas entre setos, flores con los colores de las obras,
   árboles que dejan pasar el sol en manchas, y un sol que se mueve. */

var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var coarse = window.matchMedia("(pointer: coarse)").matches;
var saveData = navigator.connection && navigator.connection.saveData;

function hasWebGL() {
  try {
    var test = document.createElement("canvas");
    var gl = test.getContext("webgl2", { failIfMajorPerformanceCaveat: false })
      || test.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    var lose = gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
    return true;
  } catch (err) {
    return false;
  }
}

var enterBtn = document.getElementById("enter");
var canvas = document.getElementById("sala");
var aim = document.getElementById("aim");
var note = document.getElementById("load-note");
var reticle = document.querySelector(".reticle");
var listBtn = document.getElementById("to-list");
var returnBtn = document.getElementById("return-walk");

function ui(key, fallback) { return window.ui ? window.ui(key) : fallback; }

function showFlat(message) {
  document.documentElement.classList.add("sala-flat");
  if (enterBtn) {
    enterBtn.textContent = ui("flatNow", "Ver las obras");
    enterBtn.addEventListener("click", function () {
      var muro = document.getElementById("muro");
      if (muro) muro.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  }
  if (note && message) note.textContent = message;
}

if (!canvas || !window.SALA || !hasWebGL()) {
  showFlat("");
} else {
  boot();
}

function boot() {
  var mobile = Math.min(window.innerWidth, window.innerHeight) < 760;
  var low = mobile || saveData;
  var HEDGE_X = 3.75;
  var HEDGE_H = 1.15;
  var END_Z = -31.6;
  var START_Z = 5.4;
  var WALK = { x: 2.0, z0: -29.3, z1: 4.2 };

  var renderer, scene, camera, clock, sun, hemi, sky, skyMat, pmrem, pollen, envTarget;
  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var pickables = [];
  var glows = [];
  var trees = [];
  var started = false;
  var running = false;
  var raf = 0;
  var stick = { x: 0, y: 0, id: null };
  var keys = new Set();
  var yaw = 0;
  var pitch = 0.1;
  var aimed = "";
  var look = null;
  var pos = new THREE.Vector3(0, 1.6, 4.4);
  var introT = 0;
  var preview = false;
  var previewSeen = true;
  var tour = { t: 0, blink: false };
  var skip = 0;
  var loader = new THREE.TextureLoader();
  var queue = [];
  var inflight = 0;
  var loaded = 0;
  var total = 0;
  var concurrency = saveData ? 1 : 2;
  var wind = { value: 0 };
  var seed = 20261110;

  function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function between(a, b) { return a + (b - a) * rand(); }
  function noise3(x, y, z) {
    return Math.sin(x * 1.7 + Math.sin(z * 2.3) * 1.3) * 0.45 +
      Math.sin(z * 3.1 + y * 1.9 + Math.sin(x * 2.1)) * 0.33 +
      Math.sin(x * 6.3 + z * 5.1 + y * 4.7) * 0.22;
  }

  /* Un sol de mañana, constante: lo que se mueve son las hojas. */
  var MORNING = { az: -10, el: 42, sun: 0xfff1da, i: 5.4, zen: 0x5a97d6, hor: 0xe4eef2, hemi: 0.95, ground: 0x6f7448 };
  var sunDir = new THREE.Vector3();

  function asset(path) {
    var root = (window.SITE && window.SITE.root) || "";
    if (!path || /^(https?:|\.\.)/.test(path)) return path;
    return root + path;
  }

  /* La textura usa el mismo ancho de siempre: el 960 es solo para la cuadrícula de Obras. */
  function texWidth(work) {
    var list = work.widths || [];
    var chosen = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i] >= 600 && list[i] <= (low ? 960 : 1300) && list[i] !== 960) chosen = list[i];
    }
    return chosen || list[0];
  }
  function texUrl(work) {
    var chosen = texWidth(work);
    if (!chosen || chosen >= work.w - 1) return asset(work.image);
    return asset("assets/media/works/" + work.id + "-" + chosen + ".jpg");
  }
  /* La misma imagen en WebP, más liviana; si el navegador no la abre, queda el JPG. */
  function texWebp(work) {
    var chosen = texWidth(work);
    return chosen ? asset("assets/media/works/" + work.id + "-" + chosen + ".webp") : "";
  }

  /* Texturas pintadas en código */
  function paint(w, h, draw, color) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    var tex = new THREE.CanvasTexture(c);
    if (color !== false) tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 8;
    return tex;
  }
  function hex(r, g, b, a) { return "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a + ")"; }

  function grassTex() {
    return paint(512, 512, function (g, w, h) {
      g.fillStyle = "#4d7536";
      g.fillRect(0, 0, w, h);
      for (var i = 0; i < 900; i++) {
        var x = rand() * w, y = rand() * h, r = between(10, 40);
        var grd = g.createRadialGradient(x, y, 0, x, y, r);
        var tone = rand() > 0.5 ? [84, 124, 58] : [62, 98, 44];
        grd.addColorStop(0, hex(tone[0], tone[1], tone[2], 0.35));
        grd.addColorStop(1, hex(tone[0], tone[1], tone[2], 0));
        g.fillStyle = grd;
        g.fillRect(x - r, y - r, r * 2, r * 2);
      }
      var greens = [[52, 88, 38], [70, 110, 48], [96, 138, 62], [118, 156, 74], [40, 70, 30], [134, 166, 88]];
      for (var j = 0; j < 22000; j++) {
        var c = greens[(rand() * greens.length) | 0];
        g.strokeStyle = hex(c[0], c[1], c[2], between(0.35, 0.8));
        g.lineWidth = between(0.6, 1.4);
        var x0 = rand() * w, y0 = rand() * h, len = between(3, 9), ang = between(-0.6, 0.6) - Math.PI / 2;
        g.beginPath();
        g.moveTo(x0, y0);
        g.lineTo(x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len);
        g.stroke();
      }
    });
  }

  function stoneTex() {
    return paint(256, 160, function (g, w, h) {
      g.fillStyle = "#ddd0b8";
      g.fillRect(0, 0, w, h);
      for (var v = 0; v < 7; v++) {
        g.strokeStyle = hex(196, 178, 150, between(0.15, 0.35));
        g.lineWidth = between(1, 3);
        g.beginPath();
        var y = rand() * h;
        g.moveTo(0, y);
        for (var x = 0; x <= w; x += 16) g.lineTo(x, y + Math.sin(x * 0.05 + v) * 4 + between(-2, 2));
        g.stroke();
      }
      var img = g.getImageData(0, 0, w, h);
      for (var i = 0; i < img.data.length; i += 4) {
        var n = between(-10, 10);
        img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n * 0.9;
      }
      g.putImageData(img, 0, 0);
      for (var p = 0; p < 260; p++) {
        g.fillStyle = hex(150, 130, 104, between(0.2, 0.5));
        g.beginPath();
        g.ellipse(rand() * w, rand() * h, between(0.6, 2.2), between(0.4, 1.2), rand() * 3, 0, Math.PI * 2);
        g.fill();
      }
      g.strokeStyle = "rgba(120,100,76,.35)";
      g.lineWidth = 2;
      g.strokeRect(1, 1, w - 2, h - 2);
    });
  }

  function leafTex(bump) {
    return paint(512, 512, function (g, w, h) {
      g.fillStyle = bump ? "#555" : "#27431f";
      g.fillRect(0, 0, w, h);
      var greens = bump
        ? [[60, 60, 60], [110, 110, 110], [170, 170, 170], [220, 220, 220]]
        : [[38, 66, 30], [50, 84, 36], [64, 102, 44], [82, 122, 54], [104, 142, 66], [30, 54, 26]];
      for (var i = 0; i < 16000; i++) {
        var c = greens[(rand() * greens.length) | 0];
        g.fillStyle = hex(c[0], c[1], c[2], between(0.6, 1));
        g.beginPath();
        g.ellipse(rand() * w, rand() * h, between(1.6, 4.2), between(0.9, 2.2), rand() * Math.PI, 0, Math.PI * 2);
        g.fill();
      }
    }, !bump);
  }

  function leafCard() {
    return paint(256, 256, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      var greens = [[52, 86, 38], [70, 108, 48], [92, 132, 58], [116, 150, 70], [42, 72, 32]];
      for (var i = 0; i < 150; i++) {
        var a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.7) * w * 0.42;
        var x = w / 2 + Math.cos(a) * r, y = h / 2 + Math.sin(a) * r;
        var c = greens[(rand() * greens.length) | 0];
        g.fillStyle = hex(c[0], c[1], c[2], 1);
        g.save();
        g.translate(x, y);
        g.rotate(rand() * Math.PI);
        g.beginPath();
        g.ellipse(0, 0, between(5, 11), between(2.5, 5), 0, 0, Math.PI * 2);
        g.fill();
        g.strokeStyle = hex(c[0] + 30, c[1] + 30, c[2] + 20, 0.5);
        g.lineWidth = 0.8;
        g.beginPath();
        g.moveTo(-8, 0);
        g.lineTo(8, 0);
        g.stroke();
        g.restore();
      }
    });
  }

  function bladeTex() {
    return paint(128, 128, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      var greens = [[60, 98, 42], [82, 124, 54], [104, 146, 64], [50, 84, 36], [126, 160, 80]];
      for (var i = 0; i < 34; i++) {
        var c = greens[(rand() * greens.length) | 0];
        var x = between(8, w - 8), top = between(6, h * 0.55), bend = between(-14, 14), bw = between(1.6, 3.4);
        g.fillStyle = hex(c[0], c[1], c[2], 1);
        g.beginPath();
        g.moveTo(x - bw, h);
        g.quadraticCurveTo(x + bend * 0.4, (h + top) / 2, x + bend, top);
        g.quadraticCurveTo(x + bend * 0.4 + 1, (h + top) / 2, x + bw, h);
        g.fill();
      }
    });
  }

  function woodTex() {
    return paint(64, 256, function (g, w, h) {
      g.fillStyle = "#a57d55";
      g.fillRect(0, 0, w, h);
      for (var i = 0; i < 40; i++) {
        g.strokeStyle = hex(between(120, 150), between(86, 104), between(56, 70), between(0.2, 0.5));
        g.lineWidth = between(0.5, 2);
        var x = rand() * w;
        g.beginPath();
        g.moveTo(x, 0);
        for (var y = 0; y <= h; y += 16) g.lineTo(x + Math.sin(y * 0.03 + i) * 2, y);
        g.stroke();
      }
    });
  }

  function blossomCard() {
    return paint(256, 256, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      var pinks = [[240, 150, 186], [228, 112, 156], [250, 196, 214], [214, 92, 140], [255, 222, 232]];
      for (var i = 0; i < 40; i++) {
        var a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.7) * w * 0.4;
        g.fillStyle = hex(between(70, 100), between(110, 140), between(50, 66), 1);
        g.beginPath();
        g.ellipse(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, between(5, 9), between(2.5, 4), rand() * 3, 0, Math.PI * 2);
        g.fill();
      }
      for (var j = 0; j < 190; j++) {
        var a2 = rand() * Math.PI * 2, r2 = Math.pow(rand(), 0.65) * w * 0.43;
        var c = pinks[(rand() * pinks.length) | 0];
        var x = w / 2 + Math.cos(a2) * r2, y = h / 2 + Math.sin(a2) * r2;
        g.fillStyle = hex(c[0], c[1], c[2], 1);
        for (var p = 0; p < 5; p++) {
          var pa = p / 5 * Math.PI * 2 + rand();
          g.beginPath();
          g.ellipse(x + Math.cos(pa) * 3, y + Math.sin(pa) * 3, 3.4, 2, pa, 0, Math.PI * 2);
          g.fill();
        }
        g.fillStyle = "rgba(250,220,120,.9)";
        g.beginPath();
        g.arc(x, y, 1.2, 0, Math.PI * 2);
        g.fill();
      }
    });
  }

  function mountainStrip() {
    return paint(2048, 512, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      var layers = [
        { base: 290, amp: 110, col: [178, 196, 212], fade: 0.7 },
        { base: 350, amp: 80, col: [160, 182, 192], fade: 0.8 },
        { base: 410, amp: 50, col: [146, 170, 170], fade: 0.9 }
      ];
      layers.forEach(function (L, li) {
        var ph = [rand() * 6, rand() * 6, rand() * 6, rand() * 6];
        g.beginPath();
        g.moveTo(0, h);
        for (var x = 0; x <= w; x += 4) {
          var t = x / w * Math.PI * 2;
          var y = L.base - L.amp * (0.55 * Math.sin(t * 2 + ph[0]) + 0.3 * Math.sin(t * 5 + ph[1]) + 0.15 * Math.sin(t * 11 + ph[2]) + 0.06 * Math.sin(t * 29 + ph[3]));
          g.lineTo(x, y);
        }
        g.lineTo(w, h);
        g.closePath();
        var grd = g.createLinearGradient(0, L.base - L.amp, 0, h);
        grd.addColorStop(0, hex(L.col[0], L.col[1], L.col[2], L.fade));
        grd.addColorStop(1, hex(L.col[0] + 30, L.col[1] + 30, L.col[2] + 28, L.fade));
        g.fillStyle = grd;
        g.fill();
        void li;
      });
      var haze = g.createLinearGradient(0, h * 0.62, 0, h);
      haze.addColorStop(0, "rgba(228,238,242,0)");
      haze.addColorStop(1, "rgba(228,238,242,1)");
      g.fillStyle = haze;
      g.fillRect(0, h * 0.62, w, h * 0.38);
    });
  }

  /* Sombra moteada de una copa, para los árboles lejanos */
  function blobTex() {
    return paint(256, 256, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      for (var i = 0; i < 260; i++) {
        var a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.6) * w * 0.44;
        var x = w / 2 + Math.cos(a) * r, y = h / 2 + Math.sin(a) * r;
        var rr = between(6, 18) * (1 - r / (w * 0.6));
        var grd = g.createRadialGradient(x, y, 0, x, y, rr);
        grd.addColorStop(0, "rgba(255,255,255,.5)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grd;
        g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
      var core = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.46);
      core.addColorStop(0, "rgba(255,255,255,.5)");
      core.addColorStop(0.7, "rgba(255,255,255,.22)");
      core.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = core;
      g.fillRect(0, 0, w, h);
    }, false);
  }

  function barkTex() {
    return paint(128, 256, function (g, w, h) {
      g.fillStyle = "#7d6e60";
      g.fillRect(0, 0, w, h);
      for (var i = 0; i < 140; i++) {
        g.strokeStyle = hex(between(70, 140), between(62, 122), between(52, 104), between(0.3, 0.7));
        g.lineWidth = between(1, 4);
        var x = rand() * w;
        g.beginPath();
        g.moveTo(x, 0);
        for (var y = 0; y <= h; y += 20) g.lineTo(x + between(-3, 3), y);
        g.stroke();
      }
    });
  }

  function dotTex() {
    return paint(64, 64, function (g, w, h) {
      var grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      grd.addColorStop(0, "rgba(255,250,236,1)");
      grd.addColorStop(0.35, "rgba(255,240,210,.45)");
      grd.addColorStop(1, "rgba(255,240,210,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
    });
  }

  function fadeTex() {
    return paint(16, 128, function (g, w, h) {
      var grd = g.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(0,0,0,1)");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
    }, false);
  }

  function labelTex(title) {
    return paint(512, 120, function (g, w, h) {
      g.fillStyle = "#f3ede2";
      g.fillRect(0, 0, w, h);
      g.fillStyle = "#1a1614";
      g.font = "400 50px Fraunces, Georgia, serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      var text = title.length > 22 ? title.slice(0, 21) + "…" : title;
      g.fillText(text, w / 2, h / 2 + 2);
    });
  }

  /* Viento para el pasto y las flores */
  function windify(mat, amp, byHeight) {
    mat.onBeforeCompile = function (shader) {
      shader.uniforms.uTime = wind;
      shader.vertexShader = "uniform float uTime;\n" + shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n" +
        "#ifdef USE_INSTANCING\n vec3 ip = instanceMatrix[3].xyz;\n#else\n vec3 ip = vec3(0.0);\n#endif\n" +
        " float wv = sin(uTime * 1.6 + ip.x * 0.9 + ip.z * 0.55) + 0.45 * sin(uTime * 2.7 + ip.z * 1.4 + ip.x * 0.3);\n" +
        (byHeight
          ? " float hh = max(position.y, 0.0);\n transformed.x += wv * " + amp.toFixed(3) + " * hh * hh * 6.0;\n transformed.z += wv * " + (amp * 0.5).toFixed(3) + " * hh * hh * 6.0;\n"
          : " transformed.x += wv * " + amp.toFixed(3) + ";\n transformed.z += wv * " + (amp * 0.5).toFixed(3) + ";\n")
      );
    };
  }

  function planarUV(geo, tile) {
    var p = geo.attributes.position, n = geo.attributes.normal, uv = geo.attributes.uv;
    for (var i = 0; i < p.count; i++) {
      var nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i)), nz = Math.abs(n.getZ(i));
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (nx >= ny && nx >= nz) uv.setXY(i, z / tile, y / tile);
      else if (ny >= nx && ny >= nz) uv.setXY(i, x / tile, z / tile);
      else uv.setXY(i, x / tile, y / tile);
    }
    uv.needsUpdate = true;
  }

  function lumpy(geo, amp, freq) {
    var p = geo.attributes.position;
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var len = Math.hypot(x, y, z) || 1;
      var k = 1 + noise3(x * freq, y * freq, z * freq) * amp;
      p.setXYZ(i, x * k, y * k, z * k);
      geo.attributes.normal.setXYZ(i, x / len, y / len, z / len);
    }
    geo.attributes.normal.needsUpdate = true;
    return geo;
  }

  /* Cielo con el sol */
  function buildSky() {
    skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uZen: { value: new THREE.Color() },
        uHor: { value: new THREE.Color() },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uSun: { value: new THREE.Color() },
        uTime: wind
      },
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; }",
      fragmentShader:
        "uniform vec3 uZen; uniform vec3 uHor; uniform vec3 uSunDir; uniform vec3 uSun; uniform float uTime; varying vec3 vDir;" +
        "float hsh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }" +
        "float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hsh(i), hsh(i + vec2(1.0, 0.0)), f.x), mix(hsh(i + vec2(0.0, 1.0)), hsh(i + vec2(1.0, 1.0)), f.x), f.y); }" +
        "float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }" +
        "void main(){ float h = clamp(vDir.y, -0.2, 1.0); vec3 col = mix(uHor, uZen, pow(max(h, 0.0), 0.6));" +
        " col = mix(col, uHor * 0.92, smoothstep(0.0, -0.2, h));" +
        " float s = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);" +
        " if (vDir.y > 0.0) { vec2 cp = vDir.xz / (vDir.y + 0.14) * 0.85 + vec2(uTime * 0.008, uTime * 0.003);" +
        "  float c = smoothstep(0.5, 0.8, fbm(cp * 1.3)) * smoothstep(0.02, 0.22, vDir.y);" +
        "  vec3 cc = mix(vec3(1.0), uHor, 0.2) * (0.9 + 0.1 * fbm(cp * 3.7));" +
        "  col = mix(col, cc, c * 0.85); }" +
        " col += uSun * (pow(s, 900.0) * 3.0 + pow(s, 18.0) * 0.32 + pow(s, 3.0) * 0.08);" +
        " gl_FragColor = vec4(col, 1.0);\n#include <colorspace_fragment>\n}"
    });
    sky = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), skyMat);
    sky.renderOrder = -1;
    scene.add(sky);
  }

  function refreshEnv() {
    if (!pmrem) return;
    var envScene = new THREE.Scene();
    var copy = new THREE.Mesh(new THREE.SphereGeometry(40, 24, 12), skyMat);
    envScene.add(copy);
    var ground = new THREE.Mesh(new THREE.CircleGeometry(39, 24), new THREE.MeshBasicMaterial({ color: 0x55703a }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    envScene.add(ground);
    var target = pmrem.fromScene(envScene, 0.02, 0.1, 100);
    if (envTarget) envTarget.dispose();
    envTarget = target;
    scene.environment = target.texture;
    copy.geometry.dispose();
    ground.geometry.dispose();
  }

  function applyLight() {
    var L = MORNING;
    var az = THREE.MathUtils.degToRad(L.az), el = THREE.MathUtils.degToRad(L.el);
    sunDir.set(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)).normalize();
    sun.color.set(L.sun);
    sun.intensity = L.i;
    hemi.intensity = L.hemi;
    hemi.color.set(L.zen).lerp(new THREE.Color(0xffffff), 0.45);
    hemi.groundColor.set(L.ground);
    skyMat.uniforms.uZen.value.set(L.zen);
    skyMat.uniforms.uHor.value.set(L.hor);
    skyMat.uniforms.uSun.value.copy(sun.color);
    skyMat.uniforms.uSunDir.value.copy(sunDir);
    scene.fog.color.set(L.hor);
    renderer.toneMappingExposure = 0.86;
  }

  function placeSun() {
    var cx = pos.x, cz = pos.z - 7;
    sun.target.position.set(cx, 0, cz);
    sun.position.set(cx + sunDir.x * 50, sunDir.y * 50, cz + sunDir.z * 50);
    sun.target.updateMatrixWorld();
  }


  /* El jardín */
  function buildGarden() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe4eef2, low ? 0.024 : 0.021);
    camera = new THREE.PerspectiveCamera(mobile ? 66 : 52, 1, 0.08, 120);
    camera.position.copy(pos);

    buildSky();
    hemi = new THREE.HemisphereLight(0xdbe7f2, 0x6b6a3f, 1.15);
    scene.add(hemi);
    sun = new THREE.DirectionalLight(0xffdcae, 2.9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
    var sc = sun.shadow.camera;
    sc.left = -21; sc.right = 21; sc.top = 21; sc.bottom = -21; sc.near = 2; sc.far = 110;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.04;
    sun.shadow.radius = 3;
    scene.add(sun, sun.target);

    var len = START_Z - END_Z;
    var midZ = (START_Z + END_Z) / 2;

    var grass = grassTex();
    grass.repeat.set(136, 136);
    var ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ map: grass, roughness: 1, metalness: 0, color: 0xe8f0dc })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    var stone = stoneTex();
    var paverMat = new THREE.MeshStandardMaterial({ map: stone, roughness: 0.82, metalness: 0, color: 0xffffff });
    var paverGeo = new THREE.BoxGeometry(1.04, 0.05, 0.6);
    var rows = Math.floor((len - 1.6) / 0.66);
    var pavers = new THREE.InstancedMesh(paverGeo, paverMat, rows * 2);
    var m = new THREE.Matrix4();
    var q = new THREE.Quaternion();
    var s = new THREE.Vector3();
    var v = new THREE.Vector3();
    var e = new THREE.Euler();
    var k = 0;
    for (var r = 0; r < rows; r++) {
      var z = START_Z - 0.9 - r * 0.66;
      [-0.545, 0.545].forEach(function (x) {
        e.set(0, between(-0.02, 0.02), 0);
        q.setFromEuler(e);
        v.set(x + between(-0.015, 0.015), 0.018 + between(-0.004, 0.004), z + between(-0.015, 0.015));
        s.set(1, 1, 1);
        m.compose(v, q, s);
        pavers.setMatrixAt(k++, m);
      });
    }
    pavers.receiveShadow = true;
    scene.add(pavers);

    var leaf = leafTex(false);
    var leafBump = leafTex(true);
    var hedgeMat = new THREE.MeshStandardMaterial({ map: leaf, bumpMap: leafBump, bumpScale: 3, roughness: 0.95, metalness: 0, color: 0xdfe8d2 });
    function hedge(w, h, d, x, z) {
      var geo = new THREE.BoxGeometry(w, h, d, Math.max(2, Math.round(w * 5)), Math.round(h * 5), Math.max(2, Math.round(d * 5)));
      var p = geo.attributes.position;
      for (var i = 0; i < p.count; i++) {
        var px = p.getX(i), py = p.getY(i), pz = p.getZ(i);
        var wx = px + x, wz = pz + z;
        var n = noise3(wx * 1.6, py * 1.6, wz * 1.6) * 0.05;
        var top = (py + h / 2) / h;
        var round = Math.pow(Math.max(0, top - 0.86) / 0.14, 2) * 0.1;
        p.setXYZ(i,
          px + Math.sign(px) * (n - round) * (Math.abs(px) > w / 2 - 0.01 ? 1 : 0),
          py + n * 0.6 * (py > h / 2 - 0.01 ? 1 : 0),
          pz + Math.sign(pz) * (n - round) * (Math.abs(pz) > d / 2 - 0.01 ? 1 : 0));
      }
      geo.computeVertexNormals();
      planarUV(geo, 1.4);
      var mesh = new THREE.Mesh(geo, hedgeMat);
      mesh.position.set(x, h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }
    hedge(0.95, HEDGE_H, len, -HEDGE_X, midZ);
    hedge(0.95, HEDGE_H, len, HEDGE_X, midZ);
    hedge(HEDGE_X * 2 + 0.95, 1.75, 1.1, 0, END_Z - 0.55);

    var fade = fadeTex();
    var aoMat = new THREE.MeshBasicMaterial({ color: 0x0f1a0a, alphaMap: fade, transparent: true, opacity: 0.42, depthWrite: false });
    [[-HEDGE_X + 0.47, 1], [HEDGE_X - 0.47, -1]].forEach(function (pair) {
      var ao = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.1), aoMat);
      ao.rotation.x = -Math.PI / 2;
      ao.rotation.z = pair[1] > 0 ? Math.PI / 2 : -Math.PI / 2;
      ao.position.set(pair[0] + pair[1] * 0.55, 0.012, midZ);
      scene.add(ao);
    });
    var aoEnd = new THREE.Mesh(new THREE.PlaneGeometry(HEDGE_X * 2, 1.1), aoMat);
    aoEnd.rotation.x = -Math.PI / 2;
    aoEnd.position.set(0, 0.012, END_Z + 0.55);
    scene.add(aoEnd);

    /* Canteros: arbustos y flores al pie de los setos */
    var shrubGeo = lumpy(new THREE.IcosahedronGeometry(0.36, 3), 0.16, 4.2);
    planarUV(shrubGeo, 0.9);
    var shrubMat = new THREE.MeshStandardMaterial({ map: leaf, bumpMap: leafBump, bumpScale: 2, roughness: 0.92, color: 0xffffff });
    var spots = [];
    [-1, 1].forEach(function (side) {
      for (var z2 = START_Z - 0.4; z2 > END_Z + 1.2; z2 -= low ? 1.1 : 0.8) {
        spots.push({ x: side * between(2.95, 3.25), z: z2 + between(-0.2, 0.2) });
      }
    });
    for (var ex = -HEDGE_X + 0.8; ex < HEDGE_X - 0.6; ex += low ? 0.6 : 0.42) spots.push({ x: ex + between(-0.1, 0.1), z: END_Z + between(0.35, 0.75) });
    var shrubs = new THREE.InstancedMesh(shrubGeo, shrubMat, spots.length);
    var shrubTint = new THREE.Color();
    spots.forEach(function (spot, i) {
      var sc2 = spot.small ? between(0.55, 0.8) : between(0.8, 1.25);
      var sy = sc2 * between(0.62, 0.9);
      v.set(spot.x, sy * 0.24, spot.z);
      q.setFromEuler(e.set(0, rand() * 6.28, 0));
      s.set(sc2, sy, sc2 * between(0.9, 1.2));
      m.compose(v, q, s);
      shrubs.setMatrixAt(i, m);
      shrubTint.setHSL(between(0.24, 0.31), between(0.25, 0.45), between(0.42, 0.62));
      shrubs.setColorAt(i, shrubTint);
    });
    shrubs.castShadow = !low;
    shrubs.receiveShadow = true;
    scene.add(shrubs);


    /* Matas de flores pintadas: cuatro especies en una sola textura */
    function flowerAtlas() {
      return paint(1024, 256, function (g, w, h) {
        g.clearRect(0, 0, w, h);
        var kinds = [
          { petals: ["#e0577f", "#f29ab6", "#d8446a"], center: "#f3cf5a", shape: "cosmos" },
          { petals: ["#9a7ad0", "#b784d6", "#c9a4e6"], center: null, shape: "spike" },
          { petals: ["#fbf6ef", "#ffffff", "#f3ece2"], center: "#e9b93a", shape: "daisy" },
          { petals: ["#ff8c66", "#f3cf5a", "#f6a24d"], center: "#a5512d", shape: "zinnia" }
        ];
        kinds.forEach(function (kind, cell) {
          var ox = cell * 256;
          for (var st = 0; st < 9; st++) {
            var bx = ox + between(40, 216), top = between(30, 130), lean = between(-26, 26);
            g.strokeStyle = hex(between(60, 90), between(100, 130), between(44, 60), 1);
            g.lineWidth = between(2, 3.2);
            g.beginPath();
            g.moveTo(bx, h);
            g.quadraticCurveTo(bx + lean * 0.3, (h + top) / 2, bx + lean, top);
            g.stroke();
            for (var lf = 0; lf < 3; lf++) {
              var ly = between(top + 30, h - 10), lx = bx + lean * ((h - ly) / (h - top)) * 0.6;
              g.fillStyle = hex(between(64, 96), between(108, 140), between(46, 64), 1);
              g.save();
              g.translate(lx, ly);
              g.rotate(between(-1.2, 1.2));
              g.beginPath();
              g.ellipse(between(-8, 8), 0, between(9, 16), between(3, 5), 0, 0, Math.PI * 2);
              g.fill();
              g.restore();
            }
            var fx = bx + lean, fy = top;
            var col = kind.petals[(rand() * kind.petals.length) | 0];
            if (kind.shape === "spike") {
              for (var d = 0; d < 16; d++) {
                g.fillStyle = kind.petals[(rand() * 3) | 0];
                g.beginPath();
                g.arc(fx + between(-4, 4), fy + d * 4.2, between(2.6, 4.2) * (1 - d / 22), 0, Math.PI * 2);
                g.fill();
              }
            } else {
              var n = kind.shape === "daisy" ? 14 : kind.shape === "zinnia" ? 12 : 8;
              var r = kind.shape === "zinnia" ? between(9, 13) : between(10, 15);
              for (var pt = 0; pt < n; pt++) {
                var ang = (pt / n) * Math.PI * 2 + rand() * 0.2;
                g.fillStyle = col;
                g.save();
                g.translate(fx, fy);
                g.rotate(ang);
                g.scale(1, 0.62);
                g.beginPath();
                g.ellipse(r * 0.55, 0, r * 0.55, r * (kind.shape === "daisy" ? 0.16 : 0.3), 0, 0, Math.PI * 2);
                g.fill();
                g.restore();
              }
              if (kind.center) {
                g.fillStyle = kind.center;
                g.beginPath();
                g.ellipse(fx, fy, r * 0.26, r * 0.18, 0, 0, Math.PI * 2);
                g.fill();
              }
            }
          }
        });
      });
    }

    function clumpGeo(wd, ht) {
      var plane = new THREE.PlaneGeometry(wd, ht);
      plane.translate(0, ht / 2, 0);
      var a = plane.toNonIndexed();
      var b = plane.clone().rotateY(Math.PI / 2).toNonIndexed();
      var geo = new THREE.BufferGeometry();
      ["position", "uv"].forEach(function (name) {
        var x1 = a.attributes[name].array, x2 = b.attributes[name].array;
        var merged = new Float32Array(x1.length + x2.length);
        merged.set(x1, 0);
        merged.set(x2, x1.length);
        geo.setAttribute(name, new THREE.BufferAttribute(merged, a.attributes[name].itemSize));
      });
      var up = new Float32Array(geo.attributes.position.count * 3);
      for (var i = 0; i < up.length; i += 3) up[i + 1] = 1;
      geo.setAttribute("normal", new THREE.BufferAttribute(up, 3));
      return geo;
    }

    function buildFlowers() {
      var places = [];
      var step = low ? 0.34 : 0.2;
      [-1, 1].forEach(function (side) {
        for (var z = START_Z - 0.5; z > END_Z + 1; z -= step) {
          places.push([side * between(2.35, 2.75), z + between(-0.08, 0.08)]);
          if (rand() > 0.35) places.push([side * between(2.75, 3.2), z + between(-0.1, 0.1)]);
        }
      });
      for (var x = -HEDGE_X + 0.6; x < HEDGE_X - 0.5; x += step) {
        places.push([x + between(-0.05, 0.05), END_Z + between(0.25, 0.9)]);
      }
      [-1.45, 1.45].forEach(function (ax) {
        for (var k2 = 0; k2 < 14; k2++) places.push([ax + between(-0.45, 0.45), START_Z - 0.2 + between(-0.6, 0.6)]);
      });
      for (var o = 0; o < (low ? 120 : 260); o++) {
        var a = rand() * Math.PI * 2, r = between(0.4, 2.2);
        var cx = [-6.8, 6.5, -4.6, 4.2][o % 4], cz = [START_Z + 3.5, START_Z + 6, -12, -20][o % 4];
        places.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r * 0.7]);
      }
      var geo = clumpGeo(0.5, 0.56);
      var cells = new Float32Array(places.length);
      var mat = new THREE.MeshStandardMaterial({ map: flowerAtlas(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.75, metalness: 0, color: 0xffffff });
      mat.onBeforeCompile = function (shader) {
        shader.uniforms.uTime = wind;
        shader.vertexShader = "uniform float uTime;\nattribute float aCell;\n" + shader.vertexShader
          .replace("#include <uv_vertex>", "#include <uv_vertex>\n#ifdef USE_MAP\n vMapUv.x = vMapUv.x * 0.25 + aCell * 0.25;\n#endif")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\n vec3 ip = instanceMatrix[3].xyz;\n float wv = sin(uTime * 1.5 + ip.x * 0.9 + ip.z * 0.6) + 0.4 * sin(uTime * 2.6 + ip.z * 1.2);\n float hh = max(position.y, 0.0);\n transformed.x += wv * 0.1 * hh * hh;\n transformed.z += wv * 0.05 * hh * hh;");
      };
      var mesh = new THREE.InstancedMesh(geo, mat, places.length);
      var bias = [0, 0, 1, 2, 3, 3, 0, 2];
      places.forEach(function (pl, i) {
        v.set(pl[0], 0, pl[1]);
        q.setFromEuler(e.set(0, rand() * 6.28, 0));
        var sc = between(0.75, 1.35);
        s.set(sc, sc * between(0.85, 1.25), sc);
        m.compose(v, q, s);
        mesh.setMatrixAt(i, m);
        cells[i] = bias[(Math.abs(Math.floor(pl[1] * 0.45 + (pl[0] > 0 ? 3 : 0))) + ((rand() * 2) | 0)) % bias.length];
      });
      geo.setAttribute("aCell", new THREE.InstancedBufferAttribute(cells, 1));
      mesh.receiveShadow = true;
      scene.add(mesh);
    }

    /* El arco de la entrada, con enredadera */
    function buildArch() {
      var oak = new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.75, color: 0xd8c4a8 });
      var z0 = START_Z - 0.2;
      var parts = [];
      [-1.45, 1.45].forEach(function (x) {
        [z0 - 0.35, z0 + 0.35].forEach(function (z) { parts.push([0.12, 2.75, 0.12, x, 1.375, z]); });
      });
      [z0 - 0.35, z0 + 0.35].forEach(function (z) { parts.push([3.3, 0.14, 0.14, 0, 2.72, z]); });
      for (var rx = -1.5; rx <= 1.51; rx += 0.5) parts.push([0.07, 0.1, 1.15, rx, 2.84, z0]);
      parts.forEach(function (p) {
        var b = new THREE.Mesh(new THREE.BoxGeometry(p[0], p[1], p[2]), oak);
        b.position.set(p[3], p[4], p[5]);
        b.castShadow = true;
        b.receiveShadow = true;
        scene.add(b);
      });
      var vineMat = new THREE.MeshStandardMaterial({ map: leafCard(), alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.85, color: 0xffffff });
      var n = low ? 90 : 170;
      var vine = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.55, 0.55), vineMat, n);
      var tint = new THREE.Color();
      for (var i = 0; i < n; i++) {
        var onTop = rand() > 0.42;
        var side = rand() > 0.5 ? 1 : -1;
        if (onTop) v.set(between(-1.7, 1.7), 2.85 + between(-0.12, 0.28), z0 + between(-0.6, 0.6));
        else v.set(side * (1.45 + between(-0.2, 0.2)), between(0.3, 2.7), z0 + between(-0.55, 0.55));
        q.setFromEuler(e.set(rand() * 6.28, rand() * 6.28, rand() * 6.28));
        var sc = between(0.6, 1.1);
        s.set(sc, sc, sc);
        m.compose(v, q, s);
        vine.setMatrixAt(i, m);
        tint.setHSL(between(0.22, 0.3), between(0.3, 0.5), between(0.55, 0.75));
        vine.setColorAt(i, tint);
      }
      vine.castShadow = true;
      vine.receiveShadow = true;
      scene.add(vine);
    }

    buildFlowers();

    /* Pasto alto en los bordes */
    var plane = new THREE.PlaneGeometry(0.34, 0.34);
    plane.translate(0, 0.17, 0);
    var a1 = plane.toNonIndexed();
    var a2 = plane.clone().rotateY(Math.PI / 2).toNonIndexed();
    var tuftGeo = new THREE.BufferGeometry();
    ["position", "uv"].forEach(function (name) {
      var x1 = a1.attributes[name].array, x2 = a2.attributes[name].array;
      var merged = new Float32Array(x1.length + x2.length);
      merged.set(x1, 0);
      merged.set(x2, x1.length);
      tuftGeo.setAttribute(name, new THREE.BufferAttribute(merged, a1.attributes[name].itemSize));
    });
    var up = new Float32Array(tuftGeo.attributes.position.count * 3);
    for (var u2 = 0; u2 < up.length; u2 += 3) up[u2 + 1] = 1;
    tuftGeo.setAttribute("normal", new THREE.BufferAttribute(up, 3));
    var tuftMat = new THREE.MeshStandardMaterial({ map: bladeTex(), alphaTest: 0.5, side: THREE.DoubleSide, roughness: 1, color: 0xe6efd8 });
    windify(tuftMat, 0.05, true);
    var tuftN = low ? 1300 : 3600;
    var tufts = new THREE.InstancedMesh(tuftGeo, tuftMat, tuftN);
    for (var t2 = 0; t2 < tuftN; t2++) {
      var side2 = rand() > 0.5 ? 1 : -1;
      var tx = side2 * (rand() > 0.2 ? between(1.14, 2.5) : between(0.02, 1.1));
      var tz = between(END_Z + 0.8, START_Z + 2);
      if (Math.abs(tx) < 1.1) {
        tx = side2 * (rand() > 0.5 ? 0.02 : 1.08) + between(-0.02, 0.02);
      }
      v.set(tx, 0, tz);
      q.setFromEuler(e.set(0, rand() * 6.28, 0));
      var ts = Math.abs(tx) < 1.12 ? between(0.3, 0.5) : between(0.55, 1.15);
      s.set(ts, ts * between(0.8, 1.3), ts);
      m.compose(v, q, s);
      tufts.setMatrixAt(t2, m);
    }
    tufts.receiveShadow = true;
    scene.add(tufts);

    /* Árboles con ramas: el follaje se agrupa en copas sobre cada rama,
       y las hojas tiemblan con el viento (también en la sombra). */
    function flutter(mat, amp) {
      mat.onBeforeCompile = function (shader) {
        shader.uniforms.uTime = wind;
        shader.vertexShader = "uniform float uTime;\n" + shader.vertexShader.replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\n vec3 lp = instanceMatrix[3].xyz;\n float ph = lp.x * 1.7 + lp.y * 2.3 + lp.z * 1.1;\n" +
          " float gs = 0.65 + 0.35 * sin(uTime * 0.23) * sin(uTime * 0.11 + 1.3);\n" +
          " transformed += vec3(sin(uTime * 2.2 + ph), sin(uTime * 2.9 + ph * 1.3) * 0.5, cos(uTime * 1.8 + ph)) * " + amp.toFixed(3) + " * gs;"
        );
      };
      return mat;
    }
    function foliage(tex) {
      var mat = flutter(new THREE.MeshStandardMaterial({ map: tex, alphaTest: 0.42, side: THREE.DoubleSide, roughness: 0.82, metalness: 0, color: 0xffffff }), 0.06);
      var depth = flutter(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.42, side: THREE.DoubleSide }), 0.06);
      return { mat: mat, depth: depth };
    }
    var card = leafCard();
    var green = foliage(card);
    var pink = foliage(blossomCard());
    var cardMat = green.mat;
    var bark = barkTex();
    bark.repeat.set(1, 2);
    var trunkMat = new THREE.MeshStandardMaterial({ map: bark, roughness: 0.95, color: 0xcfc6bc });
    var cardGeo = new THREE.PlaneGeometry(0.95, 0.95);
    var upV = new THREE.Vector3(0, 1, 0);

    function limb(group, from, dir, len, r0, r1) {
      var geo = new THREE.CylinderGeometry(r1, r0, len, 7, 1);
      geo.translate(0, len / 2, 0);
      var mesh = new THREE.Mesh(geo, trunkMat);
      mesh.position.copy(from);
      mesh.quaternion.setFromUnitVectors(upV, dir);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return from.clone().addScaledVector(dir, len);
    }

    var blobs = [];
    function makeTree(x, z, o) {
      var group = new THREE.Group();
      var th = o.h || between(2.5, 3.3);
      var tilt = new THREE.Vector3(between(-0.08, 0.08), 1, between(-0.08, 0.08)).normalize();
      var r0 = (o.r || 0.2) * 0.85;
      var top = limb(group, new THREE.Vector3(0, -0.1, 0), tilt, th, r0, r0 * 0.5);
      var foot = new THREE.Mesh(new THREE.CylinderGeometry(r0 * 1.05, r0 * 1.9, 0.45, 9, 1), trunkMat);
      foot.position.y = 0.12;
      foot.castShadow = !!o.shadow;
      group.add(foot);
      var tips = [top.clone().add(new THREE.Vector3(0, 0.75, 0))];
      var nb = o.branches || (4 + ((rand() * 3) | 0));
      for (var b = 0; b < nb; b++) {
        var az = (b / nb) * Math.PI * 2 + between(-0.45, 0.45);
        var el = between(0.5, 1.05);
        var dir = new THREE.Vector3(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el));
        var start = new THREE.Vector3(0, th * between(0.72, 0.95), 0).addScaledVector(tilt, 0);
        start.x += tilt.x * th * 0.8;
        start.z += tilt.z * th * 0.8;
        var len = between(1.2, 2.1) * (o.spread || 1);
        var tip = limb(group, start, dir, len, 0.085, 0.03);
        tips.push(tip);
        if (rand() > 0.35) {
          var mid = start.clone().addScaledVector(dir, len * between(0.45, 0.65));
          var d2 = dir.clone().applyAxisAngle(upV, between(-0.9, 0.9));
          d2.y += 0.35;
          d2.normalize();
          tips.push(limb(group, mid, d2, len * between(0.4, 0.6), 0.045, 0.018));
        }
      }
      var per = o.cards;
      var leaves = new THREE.InstancedMesh(cardGeo, o.kind.mat, tips.length * per);
      var tint = new THREE.Color();
      var k = 0;
      tips.forEach(function (tp, ti) {
        var rc = between(0.75, 1.15) * (o.spread || 1) * (ti === 0 ? 1.25 : 1);
        for (var c = 0; c < per; c++) {
          var u = rand() * Math.PI * 2, w = Math.acos(between(-1, 1)), rr = Math.cbrt(rand());
          v.set(tp.x + Math.sin(w) * Math.cos(u) * rc * rr, tp.y + 0.15 + Math.cos(w) * rc * 0.72 * rr, tp.z + Math.sin(w) * Math.sin(u) * rc * rr);
          q.setFromEuler(e.set(rand() * 6.28, rand() * 6.28, rand() * 6.28));
          var ls = between(0.7, 1.2);
          s.set(ls, ls, ls);
          m.compose(v, q, s);
          leaves.setMatrixAt(k, m);
          if (o.pinkTree) tint.setHSL(between(0.92, 0.98), between(0.1, 0.3), between(0.8, 0.95));
          else tint.setHSL(between(0.2, 0.3), between(0.28, 0.5), between(0.52, 0.8));
          leaves.setColorAt(k, tint);
          k++;
        }
      });
      leaves.castShadow = !!o.shadow;
      leaves.receiveShadow = !low && !!o.shadow;
      if (o.shadow) leaves.customDepthMaterial = o.kind.depth;
      group.add(leaves);
      group.position.set(x, 0, z);
      if (!o.shadow) blobs.push({ x: x, z: z, h: th + 1.2 * (o.spread || 1), r: 1.9 * (o.spread || 1) });
      group.rotation.y = rand() * 6.28;
      group.userData.phase = rand() * 6.28;
      scene.add(group);
      trees.push(group);
      return group;
    }

    var treeSpots = [];
    for (var tz2 = START_Z - 1; tz2 > END_Z - 2; tz2 -= 6.4) {
      treeSpots.push([-between(4.8, 5.4), tz2 + between(-1.2, 1.2)]);
      treeSpots.push([between(4.8, 5.4), tz2 - 3.2 + between(-1.2, 1.2)]);
    }
    treeSpots.push([-2.6, END_Z - 3.6], [3.4, END_Z - 4.4], [-5.5, START_Z + 5], [4.8, START_Z + 8.5], [-1.5, START_Z + 13], [9.5, START_Z + 2], [-10, -9], [10.5, -17], [-9, -24], [8.5, -3]);
    treeSpots.forEach(function (spot, ti) {
      var isPink = ti % 3 === 1;
      makeTree(spot[0], spot[1], { kind: isPink ? pink : green, pinkTree: isPink, cards: low ? 20 : 36, shadow: true, spread: between(0.95, 1.2) });
    });

    /* Árboles sueltos en los prados, más allá del jardín */
    var meadowN = low ? 12 : 26;
    for (var mt = 0; mt < meadowN; mt++) {
      var mx, mz, tries = 0;
      do {
        var ang = rand() * Math.PI * 2, rad = between(13, 34);
        mx = Math.cos(ang) * rad;
        mz = midZ + Math.sin(ang) * rad;
        tries++;
      } while (tries < 30 && Math.abs(mx) < 9 && mz > END_Z - 8 && mz < START_Z + 9);
      var mp = rand() > 0.72;
      makeTree(mx, mz, { kind: mp ? pink : green, pinkTree: mp, cards: low ? 12 : 22, shadow: false, h: between(2.8, 4.2), r: 0.26, spread: between(1.1, 1.5) });
    }

    /* Fondo: un anillo de árboles de verdad que se pierde en la bruma,
       y montañas muy suaves detrás, sin bordes. */
    var ringN = low ? 34 : 70;
    for (var rt = 0; rt < ringN; rt++) {
      var row = rt % 2;
      var ra = (rt / ringN) * Math.PI * 2 + between(-0.05, 0.05);
      var rr2 = (row ? between(38, 46) : between(27, 34));
      var rx2 = Math.cos(ra) * rr2 * 0.9, rz2 = midZ + Math.sin(ra) * rr2;
      var rp = rand() > 0.8;
      makeTree(rx2, rz2, { kind: rp ? pink : green, pinkTree: rp, cards: low ? 14 : 26, shadow: false, h: between(3.4, 5.2), r: 0.3, spread: between(1.5, 1.9), branches: 6 });
    }
    var ridgeTex = mountainStrip();
    ridgeTex.repeat.set(3, 1);
    ridgeTex.wrapT = THREE.ClampToEdgeWrapping;
    ridgeTex.generateMipmaps = false;
    ridgeTex.minFilter = THREE.LinearFilter;
    var ridge = new THREE.Mesh(
      new THREE.CylinderGeometry(86, 86, 40, 128, 1, true),
      new THREE.MeshBasicMaterial({ map: ridgeTex, transparent: true, depthWrite: false, side: THREE.BackSide, fog: false, opacity: 0.85 })
    );
    ridge.position.set(0, 15, midZ);
    ridge.renderOrder = -1;
    scene.add(ridge);

    var farN = low ? 30 : 64;
    for (var ft = 0; ft < farN; ft++) {
      var fa = (ft / farN) * Math.PI * 2 + between(-0.04, 0.04);
      var fr = between(52, 74);
      var fpk = rand() > 0.82;
      makeTree(Math.cos(fa) * fr, midZ + Math.sin(fa) * fr, { kind: fpk ? pink : green, pinkTree: fpk, cards: low ? 6 : 9, shadow: false, h: between(4, 6), r: 0.34, spread: between(2.1, 2.7), branches: 4 });
    }

    var blobGeo = new THREE.PlaneGeometry(1, 1);
    blobGeo.rotateX(-Math.PI / 2);
    var blobMat = new THREE.MeshBasicMaterial({ color: 0x14220f, alphaMap: blobTex(), transparent: true, opacity: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    var blobMesh = new THREE.InstancedMesh(blobGeo, blobMat, blobs.length);
    var off = new THREE.Vector2(-sunDir.x / sunDir.y, -sunDir.z / sunDir.y);
    blobs.forEach(function (b, bi) {
      v.set(b.x + off.x * b.h * 0.8, 0.02, b.z + off.y * b.h * 0.8);
      q.setFromEuler(e.set(0, rand() * 6.28, 0));
      s.set(b.r * 2.2, 1, b.r * 2.2 * (1 + Math.abs(off.y) * 0.35));
      m.compose(v, q, s);
      blobMesh.setMatrixAt(bi, m);
    });
    blobMesh.renderOrder = 1;
    scene.add(blobMesh);
    buildArch();

    /* Las obras, en atriles de roble */
    var oakMat = new THREE.MeshStandardMaterial({ map: woodTex(), roughness: 0.72, metalness: 0 });
    var postGeo = new THREE.BoxGeometry(0.065, 1, 0.065);
    var hang = buildHang();
    var posts = new THREE.InstancedMesh(postGeo, oakMat, hang.length * 2);
    var pi = 0;
    var holder = new THREE.Object3D();
    scene.add(holder);
    hang.forEach(function (item) {
      var group = new THREE.Group();
      var tone = new THREE.Color(item.work.tone || "#e4ddd4");
      var edge = new THREE.MeshStandardMaterial({ color: tone.clone().multiplyScalar(0.8), roughness: 0.9 });
      var back = new THREE.MeshStandardMaterial({ color: 0xd9cfbe, roughness: 1 });
      var art = new THREE.MeshStandardMaterial({ color: tone, roughness: 0.66, metalness: 0, envMapIntensity: 0.45 });
      var box = new THREE.Mesh(new THREE.BoxGeometry(item.w, item.h, 0.038), [edge, edge, edge, edge, art, back]);
      box.castShadow = true;
      box.receiveShadow = true;
      box.userData.id = item.work.id;
      var glow = new THREE.Mesh(new THREE.PlaneGeometry(item.w + 0.12, item.h + 0.12), new THREE.MeshBasicMaterial({ color: 0xc8456f }));
      glow.position.z = -0.024;
      glow.visible = false;
      glow.userData.id = item.work.id;
      var label = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.127), new THREE.MeshStandardMaterial({ map: labelTex(item.work.title), roughness: 0.9 }));
      label.position.set(0, -item.h / 2 - 0.13, 0.005);
      label.receiveShadow = true;
      group.add(glow, box, label);
      group.position.set(item.x, item.y, item.z);
      group.rotation.y = item.rot;
      scene.add(group);
      group.updateMatrixWorld();
      var top = item.y + item.h / 2 + 0.1;
      [-1, 1].forEach(function (side) {
        holder.position.set(side * (item.w / 2 + 0.045), 0, -0.035);
        group.add(holder);
        group.updateMatrixWorld(true);
        v.setFromMatrixPosition(holder.matrixWorld);
        v.y = top / 2;
        q.setFromEuler(e.set(0, item.rot, 0));
        s.set(1, top, 1);
        m.compose(v, q, s);
        posts.setMatrixAt(pi++, m);
        group.remove(holder);
      });
      glows.push(glow);
      pickables.push(box);
      queue.push({ url: texWebp(item.work) || texUrl(item.work), fallback: texUrl(item.work), mat: art, x: item.x, z: item.z });
    });
    posts.castShadow = true;
    posts.receiveShadow = true;
    scene.add(posts);

    /* Polen en la luz */
    var pn = low ? 140 : 320;
    var pp = new Float32Array(pn * 3);
    for (var p2 = 0; p2 < pn; p2++) {
      pp[p2 * 3] = between(-3, 3);
      pp[p2 * 3 + 1] = between(0.3, 3.2);
      pp[p2 * 3 + 2] = between(END_Z + 1, START_Z);
    }
    var pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    pollen = new THREE.Points(pg, new THREE.PointsMaterial({
      size: low ? 0.05 : 0.04,
      map: dotTex(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xfff1d2,
      opacity: 0.75
    }));
    scene.add(pollen);

    pmrem = new THREE.PMREMGenerator(renderer);
    applyLight();
    refreshEnv();
    placeSun();

    queue.sort(function (a, b) { return Math.abs(a.z - pos.z) - Math.abs(b.z - pos.z); });
    total = queue.length;
    pump();
  }

  function buildHang() {
    var by = window.SALA.byId;
    var left = ["el-camino", "forever", "cidade-maravilhosa", "summer", "oceano", "take-my-hand", "my-love"];
    var right = ["familia", "junto-a-ti", "memorias-2", "mi-lugar-feliz", "urban-city", "abstracto-azul"];
    var end = ["marilyn", "serenidad", "ocean-eyes"];
    var out = [];
    function size(work, maxW, maxH) {
      var ratio = work.w / work.h;
      var h = maxH, w = h * ratio;
      if (w > maxW) { w = maxW; h = w / ratio; }
      return { w: w, h: h };
    }
    var turn = THREE.MathUtils.degToRad(52);
    left.forEach(function (id, i) {
      var work = by[id];
      if (!work) return;
      var d = size(work, 1.9, 1.45);
      out.push({ work: work, w: d.w, h: d.h, x: -2.58, y: 1.5, z: 1.2 - i * 4.25, rot: turn });
    });
    right.forEach(function (id, i) {
      var work = by[id];
      if (!work) return;
      var d = size(work, 1.9, 1.45);
      out.push({ work: work, w: d.w, h: d.h, x: 2.58, y: 1.5, z: -0.9 - i * 4.25, rot: -turn });
    });
    end.forEach(function (id, i) {
      var work = by[id];
      if (!work) return;
      var big = id === "serenidad";
      var d = size(work, big ? 1.7 : 1.4, big ? 1.95 : 1.4);
      out.push({ work: work, w: d.w, h: d.h, x: (i - 1) * 2.35, y: big ? 1.62 : 1.48, z: END_Z + 1.25 + (big ? 0 : 0.25), rot: (i - 1) * -0.18 });
    });
    return out;
  }

  function pump() {
    while (inflight < concurrency && queue.length) loadOne(queue.shift());
  }

  function loadOne(item) {
    inflight += 1;
    loader.load(item.url, function (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      item.mat.map = tex;
      item.mat.emissiveMap = tex;
      item.mat.emissive.set(0xffffff);
      item.mat.emissiveIntensity = 0.13;
      item.mat.color.set(0xffffff);
      item.mat.needsUpdate = true;
      loaded += 1;
      inflight -= 1;
      if (note) note.textContent = loaded < total ? ui("hanging", "") + loaded + " / " + total : "";
      pump();
    }, undefined, function () {
      inflight -= 1;
      if (item.fallback && item.url !== item.fallback) {
        item.url = item.fallback;
        loadOne(item);
        return;
      }
      loaded += 1;
      pump();
    });
  }

  function resize() {
    if (!renderer || !camera) return;
    var width = canvas.clientWidth || window.innerWidth;
    var height = canvas.clientHeight || window.innerHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function applyLook() {
    pitch = clamp(pitch, -0.55, 0.6);
    var cy = Math.cos(pitch);
    camera.position.copy(pos);
    camera.lookAt(pos.x + Math.sin(yaw) * cy, pos.y + Math.sin(pitch), pos.z - Math.cos(yaw) * cy);
  }

  function update(dt, now) {
    wind.value = now;
    introT += dt;
    if (!look && introT < 2.4 && !reduce) {
      var u = Math.min(1, introT / 2.4);
      var ease = 1 - Math.pow(1 - u, 3);
      pitch = 0.12 - ease * 0.15;
      if (!keys.size && !stick.x && !stick.y) pos.z = 4.4 - ease * 1.2;
    }
    var gust = 0.65 + 0.35 * Math.sin(now * 0.23) * Math.sin(now * 0.11 + 1.3);
    trees.forEach(function (tree) {
      var ph = tree.userData.phase;
      tree.rotation.z = (Math.sin(now * 0.9 + ph) * 0.014 + Math.sin(now * 2.1 + ph * 2) * 0.004) * gust;
      tree.rotation.x = (Math.sin(now * 0.7 + ph * 1.3) * 0.01 + Math.sin(now * 1.7 + ph) * 0.003) * gust;
    });
    if (pollen) {
      var arr = pollen.geometry.attributes.position.array;
      for (var i = 0; i < arr.length; i += 3) {
        arr[i] += Math.sin(now * 0.4 + i) * 0.0016;
        arr[i + 1] += 0.0014 + Math.sin(now * 0.7 + i * 0.3) * 0.0012;
        if (arr[i + 1] > 3.4) arr[i + 1] = 0.25;
      }
      pollen.geometry.attributes.position.needsUpdate = true;
    }

    if (preview) {
      if (!reduce) {
        tour.t += dt;
        var dur = 66;
        var u2 = (tour.t % dur) / dur;
        pos.z = 4.1 - u2 * 31;
        pos.x = Math.sin(tour.t * 0.19) * 0.4;
        yaw = Math.sin(tour.t * 0.15) * 0.45;
        pitch = -0.035 + Math.sin(tour.t * 0.1) * 0.02;
        var blink = u2 > 0.972 || u2 < 0.012;
        if (blink !== tour.blink) {
          tour.blink = blink;
          var st = document.getElementById("stage");
          if (st) st.classList.toggle("is-blink", blink);
        }
      }
      pos.y = 1.62;
      placeSun();
      applyLook();
      return;
    }

    var forward = 0;
    var strafe = 0;
    if (keys.has("w") || keys.has("arrowup")) forward += 1;
    if (keys.has("s") || keys.has("arrowdown")) forward -= 1;
    if (keys.has("a") || keys.has("arrowleft")) strafe -= 1;
    if (keys.has("d") || keys.has("arrowright")) strafe += 1;
    if (keys.has("q")) yaw -= 1.15 * dt;
    if (keys.has("e")) yaw += 1.15 * dt;
    forward = clamp(forward + (-stick.y), -1, 1);
    strafe = clamp(strafe + stick.x, -1, 1);
    if (forward || strafe) {
      var speed = 2.2;
      pos.x = clamp(pos.x + (Math.sin(yaw) * forward + Math.cos(yaw) * strafe) * speed * dt, -WALK.x, WALK.x);
      pos.z = clamp(pos.z + (-Math.cos(yaw) * forward + Math.sin(yaw) * strafe) * speed * dt, WALK.z0, WALK.z1);
    }
    pos.y = 1.6 + Math.sin(now * 1.1) * 0.006;
    placeSun();
    applyLook();
    if (!document.body.dataset.sheet) aimCenter();
    canvas.dataset.pos = pos.x.toFixed(2) + "," + pos.z.toFixed(2);
    canvas.dataset.yaw = yaw.toFixed(3);
  }

  function setHot(id) {
    if (id === aimed) return;
    aimed = id || "";
    glows.forEach(function (glow) { glow.visible = glow.userData.id === aimed; });
    var work = aimed && window.SALA.byId[aimed];
    if (aim) aim.textContent = work ? work.title : "";
    if (reticle) reticle.classList.toggle("is-hot", !!work);
  }

  function cast(ndc) {
    raycaster.setFromCamera(ndc, camera);
    raycaster.far = 9;
    var hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? hits[0].object.userData.id : "";
  }
  function aimCenter() { pointer.set(0, 0); setHot(cast(pointer)); }
  function rayAt(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    return cast(pointer);
  }

  var fpsN = 0;
  var fpsAcc = 0;
  function loop() {
    if (!running) return;
    raf = window.requestAnimationFrame(loop);
    if (document.hidden || document.body.dataset.sheet) return;
    if (preview && low && (skip = (skip + 1) % 2)) return;
    var dt = Math.min(0.1, clock.getDelta());
    update(dt, clock.elapsedTime);
    renderer.render(scene, camera);
    fpsN += 1;
    fpsAcc += dt;
    if (fpsAcc >= 0.8) {
      canvas.dataset.fps = String(Math.round(fpsN / fpsAcc));
      fpsN = 0;
      fpsAcc = 0;
    }
  }
  function startLoop() {
    if (!clock) return;
    running = true;
    clock.getDelta();
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(loop);
  }
  function stopLoop() {
    running = false;
    window.cancelAnimationFrame(raf);
  }

  function fullRatio(light) {
    var dpr = window.devicePixelRatio || 1;
    return light ? Math.min(dpr, low ? 1 : 1.25) : Math.min(dpr, low ? 1.5 : 2);
  }

  function build() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !low, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = low ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(fullRatio(preview));
    buildGarden();
    resize();
    applyLook();
    renderer.render(scene, camera);
    clock = new THREE.Clock();
    started = true;
    canvas.dataset.ready = "1";
    if (returnBtn) returnBtn.hidden = false;
  }

  function enterSala() {
    var fromPreview = preview;
    preview = false;
    document.body.classList.remove("is-preview");
    document.body.classList.add("is-walking", "left-cover");
    var st = document.getElementById("stage");
    if (st) st.classList.remove("is-blink");
    if (fromPreview) {
      document.body.classList.add("no-flash");
      introT = 99;
      pos.x = clamp(pos.x, -WALK.x, WALK.x);
      pos.z = clamp(pos.z, WALK.z0, WALK.z1);
    }
    window.requestAnimationFrame(function () {
      try {
        if (!started) build();
        else renderer.setPixelRatio(fullRatio(false));
        resize();
        startLoop();
      } catch (err) {
        stopLoop();
        document.body.classList.remove("is-walking");
        showFlat(ui("noWebgl", ""));
      }
    });
  }

  enterBtn.addEventListener("click", enterSala);
  if (returnBtn) returnBtn.addEventListener("click", enterSala);


  if (listBtn) {
    listBtn.addEventListener("click", function () {
      stopLoop();
      document.body.classList.remove("is-walking");
      document.body.classList.add("left-cover");
      var muro = document.getElementById("muro");
      if (muro) muro.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
  }

  var joy = document.getElementById("joystick");
  var knob = joy && joy.querySelector(".joystick-knob");
  function resetStick() {
    stick.x = 0;
    stick.y = 0;
    stick.id = null;
    if (knob) knob.style.transform = "translate(0px, 0px)";
  }
  function moveStick(clientX, clientY) {
    var rect = joy.getBoundingClientRect();
    var max = rect.width * 0.32;
    var nx = (clientX - (rect.left + rect.width / 2)) / max;
    var ny = (clientY - (rect.top + rect.height / 2)) / max;
    var mag = Math.hypot(nx, ny);
    if (mag > 1) { nx /= mag; ny /= mag; }
    stick.x = nx;
    stick.y = ny;
    if (knob) knob.style.transform = "translate(" + (nx * max) + "px," + (ny * max) + "px)";
  }
  if (joy) {
    joy.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      stick.id = event.pointerId;
      try { joy.setPointerCapture(event.pointerId); } catch (err) { /* sin captura */ }
      moveStick(event.clientX, event.clientY);
    });
    joy.addEventListener("pointermove", function (event) {
      if (stick.id !== event.pointerId) return;
      event.preventDefault();
      moveStick(event.clientX, event.clientY);
    });
    function endStick(event) { if (stick.id === event.pointerId) resetStick(); }
    joy.addEventListener("pointerup", endStick);
    joy.addEventListener("pointercancel", endStick);
    joy.addEventListener("touchmove", function (event) { event.preventDefault(); }, { passive: false });
  }

  function stopGesture(event) { event.preventDefault(); }
  canvas.addEventListener("touchmove", stopGesture, { passive: false });
  var stage = document.getElementById("stage");
  if (stage) stage.addEventListener("gesturestart", stopGesture);

  canvas.addEventListener("pointerdown", function (event) {
    if (stick.id === event.pointerId) return;
    if (event.button !== undefined && event.button !== 0) return;
    if (look && look.id !== event.pointerId) return;
    try { canvas.setPointerCapture(event.pointerId); } catch (err) { /* sin captura */ }
    look = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  });
  canvas.addEventListener("pointermove", function (event) {
    if (!look || event.pointerId !== look.id) return;
    var dx = event.clientX - look.x;
    var dy = event.clientY - look.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) look.moved = true;
    var sens = coarse ? 0.0072 : 0.0052;
    yaw += dx * sens;
    pitch -= dy * sens;
    look.x = event.clientX;
    look.y = event.clientY;
  });
  function endLook(event) {
    if (!look || event.pointerId !== look.id) return;
    if (!look.moved) {
      var id = rayAt(event.clientX, event.clientY);
      if (id) window.SALA.open(id);
    }
    look = null;
  }
  canvas.addEventListener("pointerup", endLook);
  canvas.addEventListener("pointercancel", endLook);

  window.addEventListener("keydown", function (event) {
    if (!document.body.classList.contains("is-walking")) return;
    if (event.target && event.target.closest && event.target.closest("input, textarea")) return;
    var key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", "q", "e"].indexOf(key) >= 0) {
      event.preventDefault();
      keys.add(key);
    }
    if (event.key === " ") event.preventDefault();
    if (event.key === "Enter" && aimed && !document.body.dataset.sheet && !(event.target && event.target.closest && event.target.closest("button, a"))) {
      event.preventDefault();
      window.SALA.open(aimed);
    }
  });
  window.addEventListener("keyup", function (event) { keys.delete(event.key.toLowerCase()); });
  window.addEventListener("blur", function () { keys.clear(); resetStick(); });

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopLoop();
    else if (document.body.classList.contains("is-walking") || (preview && previewSeen)) startLoop();
  });

  canvas.addEventListener("webglcontextlost", function (event) {
    event.preventDefault();
    stopLoop();
    document.body.classList.remove("is-walking");
    showFlat(ui("lost", ""));
  }, false);

  function startPreview() {
    var cover = document.getElementById("cover");
    if (!cover) return;
    preview = true;
    document.body.classList.add("is-preview");
    try {
      build();
    } catch (err) {
      preview = false;
      document.body.classList.remove("is-preview");
      return;
    }
    introT = 99;
    tour.t = 3;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        previewSeen = entries[0].isIntersecting;
        if (!preview) return;
        if (previewSeen) startLoop();
        else stopLoop();
      }, { threshold: 0.05 }).observe(cover);
    }
    startLoop();
  }

  var params = new URLSearchParams(location.search);
  if (params.get("entrar") === "1") enterSala();
  else if (!saveData) {
    if (document.readyState === "complete") startPreview();
    else window.addEventListener("load", startPreview, { once: true });
  }
  window.JARDIN = {
    goto: function (x, z, y, p) { pos.x = x; pos.z = z; if (y != null) yaw = y; if (p != null) pitch = p; introT = 99; },
    shot: function (type, q) { placeSun(); applyLook(); renderer.render(scene, camera); return canvas.toDataURL(type || "image/jpeg", q || 0.88); },
    light: function () { return MORNING; }
  };
}
