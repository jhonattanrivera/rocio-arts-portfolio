import * as THREE from "./vendor/three.module.js";

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

function showFlat(message) {
  document.documentElement.classList.add("sala-flat");
  if (enterBtn) {
    enterBtn.textContent = window.ui ? window.ui("flatNow") : "Ver las obras";
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
  var W = 10;
  var D = 16;
  var H = 3.55;
  var mobile = Math.min(window.innerWidth, window.innerHeight) < 760;
  var renderer;
  var scene;
  var camera;
  var clock;
  var raycaster = new THREE.Raycaster();
  var pointer = new THREE.Vector2();
  var pickables = [];
  var frames = [];
  var started = false;
  var running = false;
  var raf = 0;
  var stick = { x: 0, y: 0, id: null };
  var keys = new Set();
  var yaw = 0;
  var pitch = -0.04;
  var aimed = "";
  var look = null;
  var pos = new THREE.Vector3(0, 1.55, -5.15);
  var loader = new THREE.TextureLoader();
  var queue = [];
  var inflight = 0;
  var loaded = 0;
  var total = 0;
  var concurrency = saveData ? 1 : 2;

  var hang = {
    n: ["marilyn", "serenidad", "ocean-eyes"],
    e: ["el-camino", "forever", "cidade-maravilhosa", "summer", "oceano"],
    w: ["take-my-hand", "my-love", "familia", "junto-a-ti", "memorias-2"],
    s: ["mi-lugar-feliz", "urban-city", "abstracto-azul"]
  };

  function asset(path) {
    var root = (window.SITE && window.SITE.root) || "";
    if (!path || /^(https?:|\.\.)/.test(path)) return path;
    return root + path;
  }

  function texUrl(work) {
    var list = work.widths || [];
    var chosen = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i] >= 480 && list[i] <= 960) {
        chosen = list[i];
        break;
      }
    }
    if (!chosen) chosen = list[0];
    if (!chosen || chosen >= work.w - 1) return asset(work.image);
    return asset("assets/media/works/" + work.id + "-" + chosen + ".jpg");
  }

  function place(wall, ids, maxH) {
    var entries = ids.map(function (id) {
      var work = window.SALA.byId[id];
      if (!work) return null;
      var aspect = work.w / work.h;
      var h = maxH;
      var w = h * aspect;
      if (w > 2.35) {
        w = 2.35;
        h = w / aspect;
      }
      if (h > 2.3) {
        h = 2.3;
        w = h * aspect;
      }
      return { work: work, w: w, h: h };
    }).filter(Boolean);
    var gap = 0.34;
    var margin = 0.85;
    var span = (wall === "n" || wall === "s" ? W : D) - margin * 2;
    var sum = entries.reduce(function (acc, item) { return acc + item.w; }, 0) + gap * Math.max(0, entries.length - 1);
    var scale = sum > span ? span / sum : 1;
    var totalW = sum * scale;
    var cursor = -totalW / 2;
    return entries.map(function (item) {
      var w = item.w * scale;
      var h = item.h * scale;
      var center = cursor + w / 2;
      cursor += w + gap * scale;
      var x = 0;
      var z = 0;
      var rot = 0;
      if (wall === "n") {
        x = center;
        z = -D / 2 + 0.2;
        rot = 0;
      } else if (wall === "s") {
        x = center;
        z = D / 2 - 0.2;
        rot = Math.PI;
      } else if (wall === "e") {
        x = W / 2 - 0.2;
        z = center;
        rot = -Math.PI / 2;
      } else {
        x = -W / 2 + 0.2;
        z = center;
        rot = Math.PI / 2;
      }
      return { work: item.work, x: x, y: 1.58, z: z, w: w, h: h, rot: rot };
    });
  }

  function addPainting(item) {
    var group = new THREE.Group();
    var tone = new THREE.Color(item.work.tone || "#e4ddd4");
    var frameMat = new THREE.MeshBasicMaterial({ color: 0x241e1a, side: THREE.DoubleSide });
    var matMat = new THREE.MeshBasicMaterial({ color: tone, side: THREE.DoubleSide });
    var artMat = new THREE.MeshBasicMaterial({ color: tone, side: THREE.DoubleSide });
    var frame = new THREE.Mesh(new THREE.PlaneGeometry(item.w + 0.1, item.h + 0.1), frameMat);
    var mat = new THREE.Mesh(new THREE.PlaneGeometry(item.w + 0.045, item.h + 0.045), matMat);
    var art = new THREE.Mesh(new THREE.PlaneGeometry(item.w, item.h), artMat);
    frame.position.z = -0.02;
    mat.position.z = -0.01;
    frame.userData.id = item.work.id;
    art.userData.id = item.work.id;
    group.add(frame, mat, art);
    group.position.set(item.x, item.y, item.z);
    group.rotation.y = item.rot;
    scene.add(group);
    frames.push(frame);
    pickables.push(art, frame);
    queue.push({ url: texUrl(item.work), mat: artMat, x: item.x, z: item.z });
  }

  function buildRoom() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3efe8);
    camera = new THREE.PerspectiveCamera(mobile ? 66 : 52, 1, 0.08, 40);
    camera.position.copy(pos);

    var shell = new THREE.Mesh(
      new THREE.BoxGeometry(W, H, D),
      new THREE.MeshBasicMaterial({ color: 0xf7f4ee, side: THREE.BackSide })
    );
    shell.position.y = H / 2;
    scene.add(shell);

    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(W - 0.04, D - 0.04),
      new THREE.MeshBasicMaterial({ color: 0xe6d9c8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.012;
    scene.add(floor);

    var skirtMat = new THREE.MeshBasicMaterial({ color: 0xd9cbb8 });
    [[W, 0.09, 0.03, 0, 0.045, -D / 2 + 0.02], [W, 0.09, 0.03, 0, 0.045, D / 2 - 0.02], [0.03, 0.09, D, -W / 2 + 0.02, 0.045, 0], [0.03, 0.09, D, W / 2 - 0.02, 0.045, 0]].forEach(function (p) {
      var box = new THREE.Mesh(new THREE.BoxGeometry(p[0], p[1], p[2]), skirtMat);
      box.position.set(p[3], p[4], p[5]);
      scene.add(box);
    });

    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.42, 0.46),
      new THREE.MeshBasicMaterial({ color: 0xd2c0a8 })
    );
    bench.position.set(0, 0.21, 0.2);
    scene.add(bench);

    scene.add(new THREE.HemisphereLight(0xfff8f1, 0xd9c8b4, 0.95));
    scene.add(new THREE.AmbientLight(0xffffff, 0.38));
    var sun = new THREE.DirectionalLight(0xfff5ea, 0.55);
    sun.position.set(2.2, 6, 3);
    scene.add(sun);

    Object.keys(hang).forEach(function (wall) {
      var maxH = wall === "n" ? 2.15 : 1.62;
      place(wall, hang[wall], maxH).forEach(addPainting);
    });

    queue.sort(function (a, b) {
      var da = (a.x * a.x) + ((a.z - pos.z) * (a.z - pos.z));
      var db = (b.x * b.x) + ((b.z - pos.z) * (b.z - pos.z));
      return da - db;
    });
    total = queue.length;
    pump();
  }

  function pump() {
    while (inflight < concurrency && queue.length) {
      loadOne(queue.shift());
    }
    if (note) {
      note.textContent = loaded && loaded < total ? (window.ui ? window.ui("hanging") : "") + loaded + " / " + total : (loaded >= total && total ? "" : note.textContent);
    }
  }

  function loadOne(item) {
    inflight += 1;
    loader.load(item.url, function (tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      item.mat.map = tex;
      item.mat.color.set(0xffffff);
      item.mat.needsUpdate = true;
      loaded += 1;
      inflight -= 1;
      if (note) note.textContent = loaded < total ? (window.ui ? window.ui("hanging") : "") + loaded + " / " + total : "";
      pump();
    }, undefined, function () {
      loaded += 1;
      inflight -= 1;
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

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function applyLook() {
    pitch = clamp(pitch, -0.5, 0.42);
    var cy = Math.cos(pitch);
    camera.position.copy(pos);
    camera.lookAt(
      pos.x + Math.sin(yaw) * cy,
      pos.y + Math.sin(pitch),
      pos.z - Math.cos(yaw) * cy
    );
  }

  function blocked(x, z) {
    return x > -0.82 && x < 0.82 && z > -0.12 && z < 0.52;
  }

  function move(nx, nz) {
    if (blocked(nx, nz)) {
      if (!blocked(nx, pos.z)) pos.x = nx;
      else if (!blocked(pos.x, nz)) pos.z = nz;
      return;
    }
    pos.x = nx;
    pos.z = nz;
  }

  function update(dt) {
    var forward = 0;
    var strafe = 0;
    if (keys.has("w") || keys.has("arrowup")) forward += 1;
    if (keys.has("s") || keys.has("arrowdown")) forward -= 1;
    if (keys.has("a") || keys.has("arrowleft")) strafe -= 1;
    if (keys.has("d") || keys.has("arrowright")) strafe += 1;
    if (keys.has("q")) yaw += 1.15 * dt;
    if (keys.has("e")) yaw -= 1.15 * dt;
    forward = clamp(forward + (-stick.y), -1, 1);
    strafe = clamp(strafe + stick.x, -1, 1);
    var speed = 2.05;
    var turn = 0;
    if (forward || strafe) {
      var nx = pos.x + (Math.sin(yaw) * forward + Math.cos(yaw) * strafe) * speed * dt;
      var nz = pos.z + (-Math.cos(yaw) * forward + Math.sin(yaw) * strafe) * speed * dt;
      nx = clamp(nx, -W / 2 + 0.9, W / 2 - 0.9);
      nz = clamp(nz, -D / 2 + 0.95, D / 2 - 0.95);
      move(nx, nz);
    }
    applyLook();
    if (!document.body.dataset.sheet) aimCenter();
    canvas.dataset.pos = pos.x.toFixed(2) + "," + pos.z.toFixed(2);
    canvas.dataset.yaw = yaw.toFixed(3);
    canvas.dataset.pitch = pitch.toFixed(3);
    return !!(forward || strafe || turn || look);
  }

  function setHot(id) {
    if (id === aimed) return;
    aimed = id || "";
    frames.forEach(function (frame) {
      frame.material.color.set(frame.userData.id === aimed ? 0x2a6480 : 0x241e1a);
    });
    var work = aimed && window.SALA.byId[aimed];
    if (aim) aim.textContent = work ? work.title : "";
    if (reticle) reticle.classList.toggle("is-hot", !!work);
  }

  function cast(ndc) {
    raycaster.setFromCamera(ndc, camera);
    var hits = raycaster.intersectObjects(pickables, false);
    return hits.length ? hits[0].object.userData.id : "";
  }

  function aimCenter() {
    pointer.set(0, 0);
    setHot(cast(pointer));
  }

  function rayAt(clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    return cast(pointer);
  }

  function loop() {
    if (!running) return;
    raf = window.requestAnimationFrame(loop);
    if (document.hidden || document.body.dataset.sheet) return;
    var dt = Math.min(0.05, clock.getDelta());
    update(dt);
    renderer.render(scene, camera);
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

  function build() {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !mobile,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6));
    renderer.setClearColor(0xf3efe8, 1);
    buildRoom();
    resize();
    applyLook();
    renderer.render(scene, camera);
    clock = new THREE.Clock();
    started = true;
    canvas.dataset.ready = "1";
    if (returnBtn) returnBtn.hidden = false;
  }

  function enterSala() {
    document.body.classList.add("is-walking", "left-cover");
    window.requestAnimationFrame(function () {
      try {
        if (!started) build();
        resize();
        startLoop();
      } catch (err) {
        stopLoop();
        document.body.classList.remove("is-walking");
        showFlat(window.ui ? window.ui("noWebgl") : "");
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
    var dx = clientX - (rect.left + rect.width / 2);
    var dy = clientY - (rect.top + rect.height / 2);
    var nx = dx / max;
    var ny = dy / max;
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
      try { joy.setPointerCapture(event.pointerId); } catch (err) {}
      moveStick(event.clientX, event.clientY);
    });
    joy.addEventListener("pointermove", function (event) {
      if (stick.id !== event.pointerId) return;
      event.preventDefault();
      moveStick(event.clientX, event.clientY);
    });
    function endStick(event) {
      if (stick.id !== event.pointerId) return;
      resetStick();
    }
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
    try { canvas.setPointerCapture(event.pointerId); } catch (err) {}
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
    if (event.key === " " && document.body.classList.contains("is-walking")) event.preventDefault();
    if (event.key === "Enter" && aimed && !document.body.dataset.sheet && !(event.target && event.target.closest && event.target.closest("button, a"))) {
      event.preventDefault();
      window.SALA.open(aimed);
    }
  });
  window.addEventListener("keyup", function (event) {
    keys.delete(event.key.toLowerCase());
  });
  window.addEventListener("blur", function () { keys.clear(); resetStick(); });

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopLoop();
    else if (document.body.classList.contains("is-walking")) startLoop();
  });

  canvas.addEventListener("webglcontextlost", function (event) {
    event.preventDefault();
    stopLoop();
    document.body.classList.remove("is-walking");
    showFlat(window.ui ? window.ui("lost") : "");
  }, false);

  var params = new URLSearchParams(location.search);
  if (params.get("entrar") === "1") enterSala();
}
