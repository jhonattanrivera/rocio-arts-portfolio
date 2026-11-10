import * as THREE from "./vendor/three.module.js?v=20261110d";

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
  var H = 3.9;
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
  var pos = new THREE.Vector3(0, 1.55, 2.6);
  var spotList = [];
  var bulbList = [];
  var lightT = 0;
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

  function canvasTex(draw) {
    var c = document.createElement("canvas");
    draw(c);
    var tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  function wallNoise() {
    return canvasTex(function (c) {
      c.width = c.height = 128;
      var g = c.getContext("2d");
      var img = g.createImageData(128, 128);
      for (var i = 0; i < img.data.length; i += 4) {
        var n = 228 + Math.random() * 27;
        img.data[i] = n;
        img.data[i + 1] = n - 2;
        img.data[i + 2] = n - 6;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
    });
  }

  function floorTex() {
    return canvasTex(function (c) {
      c.width = 256;
      c.height = 256;
      var g = c.getContext("2d");
      g.fillStyle = "#c9c0b3";
      g.fillRect(0, 0, 256, 256);
      for (var y = 0; y < 256; y += 1) {
        var shade = 188 + Math.sin(y * 0.37) * 10 + (y % 17 === 0 ? -14 : 0);
        g.fillStyle = "rgba(90, 78, 66," + (0.04 + (y % 5) * 0.012) + ")";
        g.fillRect(0, y, 256, 1);
        if (y % 23 === 0) {
          g.fillStyle = "rgba(255,255,255,0.05)";
          g.fillRect(0, y, 256, 2);
        }
        void shade;
      }
    });
  }

  function haloTex() {
    return canvasTex(function (c) {
      c.width = c.height = 256;
      var g = c.getContext("2d");
      var grd = g.createRadialGradient(128, 148, 8, 128, 128, 122);
      grd.addColorStop(0, "rgba(255, 236, 214, 0.9)");
      grd.addColorStop(0.42, "rgba(255, 228, 196, 0.28)");
      grd.addColorStop(1, "rgba(255, 228, 196, 0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
    });
  }

  function labelTex(title) {
    return canvasTex(function (c) {
      c.width = 512;
      c.height = 96;
      var g = c.getContext("2d");
      g.clearRect(0, 0, 512, 96);
      g.fillStyle = "rgba(246, 243, 238, 0.92)";
      g.fillRect(0, 0, 512, 96);
      g.fillStyle = "#161311";
      g.font = "500 42px Georgia, serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      var text = title.length > 22 ? title.slice(0, 21) + "…" : title;
      g.fillText(text, 256, 50);
    });
  }

  var sharedHalo = null;

  function addPainting(item) {
    var group = new THREE.Group();
    var tone = new THREE.Color(item.work.tone || "#e4ddd4");
    var frameMat = new THREE.MeshStandardMaterial({ color: 0x2a241f, roughness: 0.55, metalness: 0.18 });
    var matMat = new THREE.MeshStandardMaterial({ color: tone, roughness: 0.9, metalness: 0 });
    var artMat = new THREE.MeshStandardMaterial({
      color: tone,
      roughness: 0.86,
      metalness: 0,
      emissive: 0xffffff,
      emissiveIntensity: 0.05
    });
    var frame = new THREE.Mesh(new THREE.PlaneGeometry(item.w + 0.18, item.h + 0.18), frameMat);
    var mat = new THREE.Mesh(new THREE.PlaneGeometry(item.w + 0.07, item.h + 0.07), matMat);
    var art = new THREE.Mesh(new THREE.PlaneGeometry(item.w, item.h), artMat);
    frame.position.z = -0.02;
    mat.position.z = -0.01;
    frame.castShadow = true;
    art.castShadow = true;
    frame.userData.id = item.work.id;
    art.userData.id = item.work.id;
    if (!sharedHalo) sharedHalo = haloTex();
    var halo = new THREE.Mesh(
      new THREE.PlaneGeometry(item.w + 1.15, item.h + 1.35),
      new THREE.MeshBasicMaterial({ map: sharedHalo, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    halo.position.set(0, 0.18, -0.045);
    var label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.62, 0.12),
      new THREE.MeshBasicMaterial({ map: labelTex(item.work.title), transparent: true })
    );
    label.position.set(0, -item.h / 2 - 0.14, 0.02);
    group.add(halo, frame, mat, art, label);
    group.position.set(item.x, item.y, item.z);
    group.rotation.y = item.rot;
    scene.add(group);
    frames.push(frame);
    pickables.push(art, frame);

    var normal = new THREE.Vector3(Math.sin(item.rot), 0, Math.cos(item.rot));
    var allowSpot = !mobile || spotList.length < 4;
    if (allowSpot) {
      var spot = new THREE.SpotLight(0xfff0dc, 0, 8.5, mobile ? 0.9 : 0.48, 0.7, 1.2);
      spot.position.set(item.x + normal.x * 1.1, Math.min(H - 0.22, item.y + item.h * 0.55 + 0.85), item.z + normal.z * 1.1);
      spot.target.position.set(item.x + normal.x * 0.05, item.y, item.z + normal.z * 0.05);
      spot.userData.maxI = mobile ? 28 : 18;
      spot.userData.halo = halo;
      scene.add(spot, spot.target);
      spotList.push(spot);
    } else {
      spotList.push({ intensity: 0, userData: { maxI: 0, halo: halo } });
    }
    queue.push({ url: texUrl(item.work), mat: artMat, x: item.x, z: item.z });
  }

  function buildRoom() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe7e1d6);
    scene.fog = new THREE.Fog(0xe7e1d6, 8.5, 24);
    camera = new THREE.PerspectiveCamera(mobile ? 64 : 50, 1, 0.08, 40);
    camera.position.copy(pos);

    var noise = wallNoise();
    noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
    noise.repeat.set(3.2, 2.2);
    var wallMat = new THREE.MeshLambertMaterial({ color: 0xf3efe6, map: noise });
    function wall(width, height, x, y, z, rotY) {
      var mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), wallMat);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }
    wall(W, H, 0, H / 2, -D / 2, 0);
    wall(W, H, 0, H / 2, D / 2, Math.PI);
    wall(D, H, -W / 2, H / 2, 0, Math.PI / 2);
    wall(D, H, W / 2, H / 2, 0, -Math.PI / 2);
    var ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(W, D),
      new THREE.MeshStandardMaterial({ color: 0xe4ddd2, roughness: 0.95, metalness: 0 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = H;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    var concrete = floorTex();
    concrete.wrapS = concrete.wrapT = THREE.RepeatWrapping;
    concrete.repeat.set(2.2, 4);
    var floorMat = mobile
      ? new THREE.MeshStandardMaterial({ color: 0xcfc6b8, map: concrete, roughness: 0.55, metalness: 0.02 })
      : new THREE.MeshPhysicalMaterial({ color: 0xcfc6b8, map: concrete, roughness: 0.38, metalness: 0.04, clearcoat: 0.32, clearcoatRoughness: 0.42 });
    var floor = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, D - 0.02), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.012;
    floor.receiveShadow = true;
    scene.add(floor);

    var skirtMat = new THREE.MeshStandardMaterial({ color: 0xc3b5a2, roughness: 0.72, metalness: 0.04 });
    [[W, 0.12, 0.05, 0, 0.06, -D / 2 + 0.03], [W, 0.12, 0.05, 0, 0.06, D / 2 - 0.03], [0.05, 0.12, D, -W / 2 + 0.03, 0.06, 0], [0.05, 0.12, D, W / 2 - 0.03, 0.06, 0]].forEach(function (p) {
      var box = new THREE.Mesh(new THREE.BoxGeometry(p[0], p[1], p[2]), skirtMat);
      box.position.set(p[3], p[4], p[5]);
      box.castShadow = true;
      box.receiveShadow = true;
      scene.add(box);
    });
    [[0.18, 2.4, 0.18, -W / 2 + 0.12, 1.2, -D / 2 + 0.12], [0.18, 2.4, 0.18, W / 2 - 0.12, 1.2, -D / 2 + 0.12], [0.18, 2.4, 0.18, -W / 2 + 0.12, 1.2, D / 2 - 0.12], [0.18, 2.4, 0.18, W / 2 - 0.12, 1.2, D / 2 - 0.12]].forEach(function (p) {
      var ao = new THREE.Mesh(
        new THREE.BoxGeometry(p[0], p[1], p[2]),
        new THREE.MeshBasicMaterial({ color: 0x1a1612, transparent: true, opacity: 0.16, depthWrite: false })
      );
      ao.position.set(p[3], p[4], p[5]);
      scene.add(ao);
    });

    var dividerMat = new THREE.MeshStandardMaterial({ color: 0xf7f3ec, roughness: 0.9 });
    var divider = new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.45, 0.14), dividerMat);
    divider.position.set(-1.7, 1.22, -0.35);
    divider.castShadow = true;
    divider.receiveShadow = true;
    scene.add(divider);
    var divSkirt = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.18), skirtMat);
    divSkirt.position.set(-1.7, 0.06, -0.35);
    scene.add(divSkirt);

    var bench = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.42, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xb7a48c, roughness: 0.62, metalness: 0.02 })
    );
    bench.position.set(1.85, 0.21, 0.15);
    bench.castShadow = true;
    bench.receiveShadow = true;
    scene.add(bench);

    var env = new THREE.Scene();
    env.add(new THREE.HemisphereLight(0xfff8f1, 0xcbbba6, 1));
    var shellEnv = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 10), new THREE.MeshBasicMaterial({ color: 0xf3efe8, side: THREE.BackSide }));
    env.add(shellEnv);
    var pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(env, 0.04).texture;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xfff6ee, 0xc9b8a4, 0.28));
    scene.add(new THREE.AmbientLight(0xfff8f2, 0.06));
    var sun = new THREE.DirectionalLight(0xfff3e6, 0.22);
    sun.position.set(1.4, 7.4, 2.2);
    sun.castShadow = !mobile;
    sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 22;
    sun.shadow.camera.left = -7;
    sun.shadow.camera.right = 7;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);

    var railMat = new THREE.MeshStandardMaterial({ color: 0x2c2824, roughness: 0.4, metalness: 0.72 });
    [-1.15, 1.15].forEach(function (x) {
      var rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, D - 0.6), railMat);
      rail.position.set(x, H - 0.08, 0);
      scene.add(rail);
    });
    var bulbGeo = new THREE.SphereGeometry(0.045, 10, 8);
    for (var i = -5; i <= 5; i++) {
      [-1.15, 1.15].forEach(function (x) {
        var z = i * 1.25;
        var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 6), railMat);
        stem.position.set(x, H - 0.16, z);
        scene.add(stem);
        var head = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.08, 8), railMat);
        head.position.set(x, H - 0.26, z);
        scene.add(head);
        var bulbMat = new THREE.MeshStandardMaterial({ color: 0x3a342e, emissive: 0xffe2b8, emissiveIntensity: 0.05, roughness: 0.3 });
        var bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(x, H - 0.32, z);
        scene.add(bulb);
        bulbList.push(bulb);
      });
    }

    Object.keys(hang).forEach(function (wall) {
      var maxH = wall === "n" ? 2.05 : 1.55;
      place(wall, hang[wall], maxH).forEach(addPainting);
    });
    if (reduce) lightT = 3;

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
      item.mat.emissiveMap = tex;
      item.mat.emissive.set(0xffffff);
      item.mat.emissiveIntensity = 0.14;
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

  function ignite() {
    var n = Math.max(1, spotList.length);
    var i;
    for (i = 0; i < n; i++) {
      var start = (i / n) * 1.2;
      var local = Math.max(0, Math.min(1, (lightT - start) / 0.2));
      local = local * local * (3 - 2 * local);
      var spot = spotList[i];
      spot.intensity = spot.userData.maxI * local;
      if (spot.userData.halo) spot.userData.halo.material.opacity = 0.9 * local;
    }
    for (i = 0; i < bulbList.length; i++) {
      var bStart = (i / bulbList.length) * 1.2;
      var bLocal = Math.max(0, Math.min(1, (lightT - bStart) / 0.18));
      bulbList[i].material.emissiveIntensity = 0.04 + bLocal * 2.6;
    }
  }

  function applyLook() {
    pitch = clamp(pitch, -0.48, 0.62);
    var cy = Math.cos(pitch);
    camera.position.copy(pos);
    camera.lookAt(
      pos.x + Math.sin(yaw) * cy,
      pos.y + Math.sin(pitch),
      pos.z - Math.cos(yaw) * cy
    );
  }

  function blocked(x, z) {
    if (x > -2.6 && x < -0.8 && z > -0.55 && z < -0.12) return true;
    if (x > 1.25 && x < 2.5 && z > -0.15 && z < 0.48) return true;
    return false;
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
    lightT += dt;
    ignite();
    if (!look && lightT < 1.05 && !reduce) {
      var u = lightT / 1.05;
      pitch = -0.05 + Math.sin(u * Math.PI) * 0.28;
    } else if (!look && lightT < 1.25 && !reduce) {
      pitch = -0.05;
    }
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

  var fpsN = 0;
  var fpsAcc = 0;
  function loop() {
    if (!running) return;
    raf = window.requestAnimationFrame(loop);
    if (document.hidden || document.body.dataset.sheet) return;
    var dt = Math.min(0.05, clock.getDelta());
    update(dt);
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

  function build() {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: !mobile,
      alpha: false,
      powerPreference: "high-performance"
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = mobile ? 1.18 : 1.08;
    renderer.shadowMap.enabled = !mobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (mobile) ratio = Math.min(ratio, 1.6);
    renderer.setPixelRatio(ratio);
    renderer.setClearColor(0xe7e1d6, 1);
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
