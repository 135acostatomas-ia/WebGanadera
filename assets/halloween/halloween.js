/* Capa Halloween v2 — Ganadera Panamericana
   Se activa sola entre DESDE y HASTA. No modifica el código original.
   Forzar: ?halloween=on  ·  Apagar: ?halloween=off */
(function () {
  var DESDE = '2026-10-01', HASTA = '2026-11-01'; // HASTA no incluido
  var CFG = { murcielagos: 6, aranas: 2, fantasmas: 3, telaranas: true };

  var forzar = new URLSearchParams(location.search).get('halloween');
  if (forzar === 'off') return;
  var hoy = new Date();
  if (forzar !== 'on' && (hoy < new Date(DESDE + 'T00:00:00') || hoy >= new Date(HASTA + 'T00:00:00'))) return;

  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*(\?.*)?$/, '') : 'assets/halloween/';
  var link = document.querySelector('[data-hw-css],meta[name="hw-css-inline"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'halloween.css';
    document.head.appendChild(link);
  }
  document.documentElement.classList.add('hw-on');

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.innerWidth < 700;
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var W = innerWidth, H = innerHeight;
  addEventListener('resize', function () { W = innerWidth; H = innerHeight; });

  var mouse = { x: -9999, y: -9999 }, touchTimer;
  addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  addEventListener('pointerdown', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; clearTimeout(touchTimer); }, { passive: true });
  addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'mouse') touchTimer = setTimeout(function () { mouse.x = mouse.y = -9999; }, 900);
  }, { passive: true });
  document.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });

  function el(tag, cls, parent, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    e.setAttribute('aria-hidden', 'true');
    if (parent) parent.appendChild(e);
    return e;
  }

  var layer, tickers = [];

  /* ---------- Telarañas en las esquinas (dibujadas por código) ---------- */
  function telarana(lado) {
    var size = mobile ? 110 : 170, dpr = Math.min(devicePixelRatio || 1, 2);
    var c = el('canvas', 'hw-web hw-web-' + lado, layer);
    c.width = c.height = size * dpr;
    c.style.width = c.style.height = size + 'px';
    var g = c.getContext('2d');
    g.scale(dpr, dpr);
    if (lado === 'r') { g.translate(size, 0); g.scale(-1, 1); }
    g.strokeStyle = 'rgba(28,30,44,.42)';
    g.lineWidth = 0.9;
    var rayos = 8, pts = [];
    for (var i = 0; i < rayos; i++) {
      var a = (i / (rayos - 1)) * Math.PI / 2 + rnd(-0.04, 0.04);
      var len = size * rnd(0.88, 1.05);
      pts.push({ a: a, len: len });
      g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * len, Math.sin(a) * len); g.stroke();
    }
    for (var k = 1; k <= 7; k++) {
      g.beginPath();
      for (var j = 0; j < rayos; j++) {
        var r = (k / 7.6) * pts[j].len * rnd(0.97, 1.03);
        var x = Math.cos(pts[j].a) * r, y = Math.sin(pts[j].a) * r;
        if (j === 0) { g.moveTo(x, y); continue; }
        var pr = (k / 7.6) * pts[j - 1].len, pa = pts[j - 1].a;
        var mx = (Math.cos(pa) * pr + x) / 2, my = (Math.sin(pa) * pr + y) / 2;
        g.quadraticCurveTo(mx * 0.86, my * 0.86, x, y);
      }
      g.stroke();
    }
    // hilo suelto
    g.beginPath(); g.moveTo(size * 0.42, size * 0.42); g.quadraticCurveTo(size * 0.5, size * 0.75, size * 0.47, size * 1.0); g.stroke();
  }

  /* ---------- Murciélagos: dibujados por código (alas articuladas) + vuelo en bandada ---------- */
  var bats = [], flock = null, nextFlight = 1.5, cv, cx, dprB = Math.min(devicePixelRatio || 1, 2);
  function prepararCanvas() {
    cv = el('canvas', 'hw-batcv', layer);
    cx = cv.getContext('2d');
    var fit = function () { cv.width = W * dprB; cv.height = H * dprB; cv.style.width = W + 'px'; cv.style.height = H + 'px'; };
    fit(); addEventListener('resize', fit);
  }
  // Murciélago clásico de Halloween: silueta negra, alas festoneadas con punta
  function rot2(p, o, a) { var c = Math.cos(a), s = Math.sin(a), dx = p[0] - o[0], dy = p[1] - o[1]; return [o[0] + dx * c - dy * s, o[1] + dx * s + dy * c]; }
  function alaClasica(g, side, th, bend) {
    var S = [2, -1];
    // borde superior: hombro → muñeca → punta; borde inferior: 3 festones
    var P = { wr: [13, -8], tip: [31, -3], b1: [24, 4], b2: [16, 4.5], b3: [8, 5.5], root: [2, 5] };
    var o = {};
    for (var k in P) {
      var p = rot2(P[k], S, -th);
      var far = Math.max(0, (P[k][0] - 12) / 19);
      p = rot2(p, rot2(P.wr, S, -th), -bend * far);
      o[k] = [p[0] * side, p[1]];
    }
    var sx = S[0] * side;
    var cu = function (a, b, up) { var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; return [mx + (o.wr[0] - mx) * up, my + (o.wr[1] - my) * up]; };
    g.beginPath();
    g.moveTo(sx, S[1]);
    g.quadraticCurveTo((sx + o.wr[0]) / 2, o.wr[1] - 1, o.wr[0], o.wr[1]);
    g.quadraticCurveTo((o.wr[0] + o.tip[0]) / 2, Math.min(o.wr[1], o.tip[1]) - 2.5, o.tip[0], o.tip[1]);
    var seq = [o.tip, o.b1, o.b2, o.b3, o.root];
    for (var m = 1; m < seq.length; m++) { var c = cu(seq[m - 1], seq[m], 0.3); g.quadraticCurveTo(c[0], c[1], seq[m][0], seq[m][1]); }
    g.closePath();
    g.fill();
  }
  function dibujarMurcielago(g, th, bend) {
    g.fillStyle = '#111014';
    alaClasica(g, 1, th, bend); alaClasica(g, -1, th, bend);
    g.beginPath(); g.ellipse(0, 1.5, 3.6, 6, 0, 0, 6.2832); g.fill();
    g.beginPath(); g.arc(0, -5, 3.2, 0, 6.2832); g.fill();
    g.beginPath(); g.moveTo(-3, -6); g.lineTo(-2.6, -11); g.lineTo(-0.6, -7.6); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(3, -6); g.lineTo(2.6, -11); g.lineTo(0.6, -7.6); g.closePath(); g.fill();
  }
  function pose(ph) {
    return { th: 0.1 + 0.62 * Math.sin(ph), bend: -0.32 * Math.cos(ph) };
  }

  function lanzarVuelo() {
    var dir = Math.random() < 0.5 ? 1 : -1;
    flock = { dir: dir, t: 0, x0: dir > 0 ? -120 : W + 120, y0: rnd(H * 0.15, H * 0.42),
      sp: rnd(150, 200), a1: rnd(50, 110), f1: rnd(0.7, 1.1), p1: rnd(0, 6.28), a2: rnd(15, 35), f2: rnd(2, 3), dip: rnd(0.3, 0.7) };
    var n = mobile ? Math.ceil(CFG.murcielagos / 2) : CFG.murcielagos;
    for (var i = 0; i < n; i++) {
      var depth = rnd(0.5, 1);
      bats.push({
        depth: depth, size: 0.55 + depth * 0.5, alpha: 0.55 + depth * 0.45,
        x: flock.x0 - dir * rnd(0, 160), y: flock.y0 + rnd(-60, 60), vx: dir * flock.sp, vy: 0,
        lag: i * rnd(0.12, 0.28), ox: rnd(-70, 70), oy: rnd(-55, 55), op: rnd(0, 6.28),
        wing: rnd(0, 6.28), rate: rnd(20, 26), glide: 0, gl: 0, nextGlide: rnd(1, 3), nextJink: rnd(0.4, 1.6)
      });
    }
  }
  function lider(tt) {
    var f = flock, x = f.x0 + f.dir * f.sp * tt;
    var prog = clamp((x - (f.dir > 0 ? 0 : W)) * f.dir / W, 0, 1);
    var swoop = Math.sin(prog * Math.PI) * H * 0.18 * f.dip;
    return { x: x, y: f.y0 + swoop + Math.sin(tt * f.f1 + f.p1) * f.a1 + Math.sin(tt * f.f2) * f.a2 };
  }
  function tickBats(dt) {
    if (!bats.length) { nextFlight -= dt; if (nextFlight <= 0) { lanzarVuelo(); nextFlight = rnd(10, 18); } return; }
    flock.t += dt;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, cv.width, cv.height);
    for (var i = bats.length - 1; i >= 0; i--) {
      var b = bats[i];
      var L = lider(Math.max(0, flock.t - b.lag));
      b.op += dt * 0.9;
      var tx = L.x + b.ox * Math.cos(b.op) * b.depth, ty = L.y + b.oy * Math.sin(b.op * 1.3);
      b.vx += ((tx - b.x) * 3.2 - (b.vx - flock.dir * flock.sp) * 1.2) * dt;
      b.vy += ((ty - b.y) * 3.2 - b.vy * 1.6) * dt;
      b.nextJink -= dt;
      if (b.nextJink <= 0) { b.vy += rnd(-260, 260); b.vx += rnd(-90, 90); b.nextJink = rnd(0.5, 1.8); }
      var dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 180 && d > 0) { var k = (1 - d / 180) * 2600 * dt; b.vx += dx / d * k; b.vy += dy / d * k; b.glide = 0; }
      b.x += b.vx * dt; b.y += b.vy * dt;
      // aleteo: más rápido al subir; planeo con alas abiertas
      b.nextGlide -= dt;
      if (b.glide > 0) b.glide -= dt;
      else if (b.nextGlide <= 0 && b.vy > -40) { b.glide = rnd(0.3, 0.7); b.nextGlide = rnd(1.5, 4); }
      b.gl += ((b.glide > 0 ? 1 : 0) - b.gl) * Math.min(1, dt * 8);
      var climb = clamp(-b.vy / 200, -0.4, 1);
      b.wing += dt * b.rate * (1 + climb * 0.4) * (1 - b.gl * 0.9);
      var ps = pose(b.wing);
      var th = ps.th * (1 - b.gl) + 0.08 * b.gl, bend = ps.bend * (1 - b.gl);
      var bank = clamp(b.vx * 0.0009 + b.vy * 0.0012 * (b.vx > 0 ? 1 : -1), -0.45, 0.45);
      var bob = th * 2.6;
      cx.setTransform(dprB * b.size, 0, 0, dprB * b.size, dprB * b.x, dprB * (b.y + bob));
      cx.rotate(bank);
      cx.globalAlpha = b.alpha;
      dibujarMurcielago(cx, th, bend);
      if (b.x < -260 || b.x > W + 260 || b.y < -260 || b.y > H + 260) bats.splice(i, 1);
    }
    cx.globalAlpha = 1;
    if (!bats.length) { cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height); }
  }

  /* ---------- Arañas que caminan a saltos y huyen del cursor ---------- */
  function crearArana(i) {
    var s = { el: el('div', 'hw-sp', layer), x: i % 2 ? W - rnd(40, 90) : rnd(40, 90), y: rnd(20, 60), a: Math.PI / 2,
      tx: 0, ty: 0, walk: 0, pause: rnd(1, 3), flee: false };
    for (var k = 0; k < 8; k++) el('i', '', s.el).style.setProperty('--a', [-55, -20, 15, 48][k % 4] * (k < 4 ? 1 : -1) + (k < 4 ? 0 : 180) + 'deg');
    el('b', 'hw-sp-body', s.el); el('b', 'hw-sp-head', s.el);
    nuevoDestino(s);
    return s;
  }
  function nuevoDestino(s) {
    s.tx = clamp(s.x + rnd(-260, 260), 20, W - 20);
    s.ty = clamp(s.y + rnd(-200, 220), 20, H - 20);
    s.walk = rnd(0.5, 1.6);
  }
  var spiders = [];
  function tickSpiders(dt) {
    spiders.forEach(function (s) {
      var dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 150) {
        s.flee = true; s.pause = 0; s.walk = 0.6;
        s.tx = clamp(s.x + (dx / d) * 260, 15, W - 15); s.ty = clamp(s.y + (dy / d) * 260, 15, H - 15);
      }
      var moving = false;
      if (s.pause > 0) s.pause -= dt;
      else {
        var ex = s.tx - s.x, ey = s.ty - s.y, de = Math.hypot(ex, ey);
        var sp = s.flee ? 380 : 70;
        if (de > 3 && s.walk > 0) {
          var target = Math.atan2(ey, ex), diff = Math.atan2(Math.sin(target - s.a), Math.cos(target - s.a));
          s.a += diff * Math.min(1, dt * (s.flee ? 18 : 7));
          s.x += Math.cos(s.a) * sp * dt; s.y += Math.sin(s.a) * sp * dt;
          s.walk -= dt; moving = true;
        } else { s.flee = false; s.pause = rnd(0.6, 2.6); nuevoDestino(s); }
      }
      s.x = clamp(s.x, 10, W - 10); s.y = clamp(s.y, 10, H - 10);
      s.el.classList.toggle('walk', moving);
      s.el.classList.toggle('fast', moving && s.flee);
      s.el.style.transform = 'translate3d(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px,0) rotate(' + (s.a * 57.3 + 90).toFixed(1) + 'deg)';
    });
  }

  /* ---------- Fantasmas translúcidos en curvas suaves ---------- */
  var ghosts = [];
  function crearFantasma(i) {
    var g = { el: el('span', 'hw-gh', layer), life: 0, dur: 0, wait: 2 + i * 4.5, t0: rnd(0, 50), shy: 0 };
    var body = el('span', 'hw-gh-i', g.el);
    el('span', 'hw-gh-face', body);
    g.el.addEventListener('click', function () { g.shy = 1; });
    return g;
  }
  function respawn(g) {
    g.cx = rnd(W * 0.15, W * 0.85); g.cy = rnd(H * 0.25, H * 0.8);
    g.ax = rnd(80, 160); g.ay = rnd(30, 70); g.fa = rnd(0.25, 0.4); g.fb = rnd(0.4, 0.7);
    g.life = 0; g.dur = rnd(11, 16); g.shy = 0;
    g.el.firstChild.style.setProperty('--s', rnd(0.8, 1.25).toFixed(2));
  }
  function tickGhosts(dt, t) {
    ghosts.forEach(function (g) {
      if (g.wait > 0) { g.wait -= dt; g.el.style.opacity = 0; g.el.style.pointerEvents = 'none'; if (g.wait <= 0) respawn(g); return; }
      g.life += dt;
      var tt = t + g.t0;
      var x = g.cx + Math.sin(tt * g.fa) * g.ax, y = g.cy + Math.sin(tt * g.fb + 1.3) * g.ay;
      var d = Math.hypot(x - mouse.x, y - mouse.y);
      if (d < 110) g.shy = Math.min(1, g.shy + dt * 3);
      var fade = Math.min(1, g.life / 2, (g.dur - g.life) / 2);
      var op = Math.max(0, fade) * 0.78 * (1 - g.shy);
      var vx = Math.cos(tt * g.fa) * g.ax * g.fa;
      g.el.style.opacity = op.toFixed(3);
      g.el.style.pointerEvents = op > 0.15 ? 'auto' : 'none';
      g.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (y - g.shy * 40).toFixed(1) + 'px,0) rotate(' + clamp(vx * 0.12, -12, 12).toFixed(1) + 'deg) scale(' + (1 + g.shy * 0.3).toFixed(2) + ')';
      if (g.life >= g.dur || g.shy >= 1) { g.wait = rnd(5, 12); g.el.style.opacity = 0; }
    });
  }

  /* ---------- Sombrero de bruja en el logo ---------- */
  function sombrero() {
    var txt = document.querySelector('.page-header .logo-text'), box = document.querySelector('.page-header .header-content');
    if (!txt || !box) return;
    var hat = el('span', 'hw-hat', box);
    el('span', 'hw-hat-cone', hat); el('span', 'hw-hat-brim', hat);
    // la "G" ocupa ~4%–15% del ancho de la imagen y arranca al 8% de su alto
    var fit = function () {
      var r = txt.getBoundingClientRect(), br = box.getBoundingClientRect();
      hat.style.setProperty('--w', (r.height || 44) + 'px');
      hat.style.left = (r.left - br.left + r.width * 0.095) + 'px';
      hat.style.top = (r.top - br.top - r.height * 0.08) + 'px';
    };
    fit(); addEventListener('resize', fit); addEventListener('load', fit); link.addEventListener('load', fit);
    if (!txt.complete) txt.addEventListener('load', fit);
  }

  /* ---------- Montaje + loop único ---------- */
  function montar() {
    layer = el('div', 'hw-layer', document.body);
    sombrero();
    if (CFG.telaranas) { telarana('l'); telarana('r'); }
    if (reduce) return;
    prepararCanvas();
    for (var i = 0; i < (mobile ? 1 : CFG.aranas); i++) spiders.push(crearArana(i));
    for (var j = 0; j < (mobile ? 2 : CFG.fantasmas); j++) ghosts.push(crearFantasma(j));
    var last = performance.now(), t = 0;
    (function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!document.hidden) {
        t += dt;
        tickBats(dt); tickSpiders(dt); tickGhosts(dt, t);
      }
      requestAnimationFrame(loop);
    })(last);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
