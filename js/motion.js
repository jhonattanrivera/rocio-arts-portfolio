(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function veil(className) {
    var el = document.createElement("div");
    el.className = "page-veil " + className;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    return el;
  }

  function armArrive() {
    var flag = "";
    try { flag = sessionStorage.getItem("rocio-wipe") || ""; } catch (err) { return; }
    if (flag !== "1" || reduce) {
      try { sessionStorage.removeItem("rocio-wipe"); } catch (err) {}
      return;
    }
    try { sessionStorage.removeItem("rocio-wipe"); } catch (err) {}
    var el = veil("is-out");
    el.addEventListener("animationend", function () { el.remove(); });
  }

  function leave(href) {
    if (reduce) {
      location.href = href;
      return;
    }
    veil("is-in");
    try { sessionStorage.setItem("rocio-wipe", "1"); } catch (err) {}
    window.setTimeout(function () { location.href = href; }, 560);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    if (link.dataset.open) return;
    if (link.target && link.target !== "_self") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    event.preventDefault();
    leave(url.href);
  });

  function magnetize() {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.querySelectorAll(".text-link, .nav-toggle, .enter, .filters button, .rail-arrow").forEach(function (el) {
      el.addEventListener("pointermove", function (event) {
        var rect = el.getBoundingClientRect();
        var x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        var y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        el.style.transform = "translate(" + (x * 7).toFixed(1) + "px," + (y * 5).toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  function scrollMotion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    var gsap = window.gsap;
    gsap.utils.toArray(".statement-photo, .bleed, .chapter picture, .person-media").forEach(function (node) {
      gsap.fromTo(node, { clipPath: "inset(16% 8% 16% 8%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power3.out",
        duration: 1.15,
        scrollTrigger: { trigger: node, start: "top 86%", once: true }
      });
    });
    gsap.utils.toArray(".steps em").forEach(function (node, i) {
      gsap.from(node, {
        y: 18,
        opacity: 0,
        duration: 0.7,
        delay: i * 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 90%", once: true }
      });
    });
    var heroPic = document.querySelector(".hero-media picture");
    if (heroPic) {
      gsap.to(heroPic, {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 }
      });
    }
    gsap.utils.toArray(".portal-stage img").forEach(function (img, i) {
      gsap.to(img, {
        yPercent: i === 1 ? -6 : 8,
        ease: "none",
        scrollTrigger: { trigger: ".portal", start: "top bottom", end: "bottom top", scrub: 0.8 }
      });
    });
  }

  function heroPaint() {
    var media = document.querySelector(".hero-media");
    var img = media && media.querySelector("img");
    if (!media || !img || reduce) return;
    var canvas = document.createElement("canvas");
    canvas.className = "hero-paint";
    media.appendChild(canvas);
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) {
      canvas.remove();
      return;
    }
    function shader(type, source) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      return sh;
    }
    var program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, "attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;v.y=1.0-v.y;gl_Position=vec4(p,0.0,1.0);}"));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, "precision mediump float;varying vec2 v;uniform sampler2D u;uniform vec2 m;uniform float t;uniform float ia;uniform float ca;vec2 cover(vec2 p){vec2 uv=p;if(ia>ca){uv.x=(p.x-0.5)*(ca/ia)+0.46;}else{uv.y=(p.y-0.5)*(ia/ca)+0.18;}return uv;}void main(){vec2 base=cover(v);vec2 q=v-m;float w=exp(-dot(q,q)*12.0);vec2 uv=base+vec2(q.y,-q.x)*w*0.05*sin(t*1.4)+q*w*0.07;gl_FragColor=texture2D(u,clamp(uv,0.002,0.998));}"));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.remove();
      return;
    }
    gl.useProgram(program);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var uM = gl.getUniformLocation(program, "m");
    var uT = gl.getUniformLocation(program, "t");
    var uIa = gl.getUniformLocation(program, "ia");
    var uCa = gl.getUniformLocation(program, "ca");
    canvas.style.opacity = "0";
    var mouse = { x: 0.46, y: 0.35 };
    var ready = false;
    var running = true;
    var start = performance.now();

    function upload() {
      if (!img.naturalWidth) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      ready = true;
      canvas.style.opacity = "1";
    }
    function resize() {
      var w = media.clientWidth;
      var h = media.clientHeight;
      if (!w || !h) return;
      var scale = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(2, Math.round(w * scale));
      canvas.height = Math.max(2, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function frame(now) {
      if (!running) return;
      if (ready) {
        gl.uniform2f(uM, mouse.x, mouse.y);
        gl.uniform1f(uT, (now - start) / 1000);
        gl.uniform1f(uIa, img.naturalWidth / img.naturalHeight);
        gl.uniform1f(uCa, canvas.width / canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      requestAnimationFrame(frame);
    }
    media.addEventListener("pointermove", function (event) {
      var rect = media.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width;
      mouse.y = (event.clientY - rect.top) / rect.height;
    }, { passive: true });
    if (img.complete && img.naturalWidth) upload();
    else img.addEventListener("load", upload, { once: true });
    resize();
    window.addEventListener("resize", resize);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) requestAnimationFrame(frame);
      });
      io.observe(media);
    }
    requestAnimationFrame(frame);
  }

  function boot() {
    armArrive();
    magnetize();
    scrollMotion();
    heroPaint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
