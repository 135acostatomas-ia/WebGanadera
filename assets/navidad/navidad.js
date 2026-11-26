/* Capa Navidad 2026 — Ganadera Panamericana
   Se activa sola entre DESDE y HASTA. No modifica el código original.
   Forzar: ?navidad=on  ·  Apagar: ?navidad=off  ·  Animaciones aunque el sistema pida menos movimiento: ?movimiento=on */
(function () {
  var DESDE = '2026-12-01', HASTA = '2027-01-07'; // HASTA no incluido (cubre Reyes, 6 de enero)
  var CFG = { copos: 70, luces: true, gorro: true, trineo: true };

  var params = new URLSearchParams(location.search);
  var forzar = params.get('navidad');
  if (forzar === 'off') return;
  var hoy = new Date();
  if (forzar !== 'on' && (hoy < new Date(DESDE + 'T00:00:00') || hoy >= new Date(HASTA + 'T00:00:00'))) return;

  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/[^\/]*(\?.*)?$/, '') : 'assets/navidad/';
  var link = document.querySelector('[data-nv-css]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'navidad.css';
    document.head.appendChild(link);
  }
  document.documentElement.classList.add('nv-on');

  var forzarMov = params.get('movimiento') === 'on';
  if (forzarMov) document.documentElement.classList.add('nv-force-motion');
  var reduce = !forzarMov && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.innerWidth < 700;
  var dpr = Math.min(devicePixelRatio || 1, 2);
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var W = innerWidth, H = innerHeight;
  addEventListener('resize', function () { W = innerWidth; H = innerHeight; });

  function el(tag, cls, parent, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    e.setAttribute('aria-hidden', 'true');
    if (parent) parent.appendChild(e);
    return e;
  }
  function fitCanvas(cv) {
    var fit = function () { cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; };
    fit(); addEventListener('resize', fit);
  }

  var layer;

  /* ---------- Guirnalda de pino con moños, bolas, bayas y luces (colgada del menú) ---------- */
  function luces() {
    var hdr = document.querySelector('.page-header');
    if (!hdr) return;
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'nv-lights');
    svg.setAttribute('aria-hidden', 'true');
    var COLORS = ['#ff3b30', '#ffc83d', '#2fd16b', '#3aa0ff', '#fff0b8'];
    // Cuelga del borde inferior del menú azul; si el menú está oculto (mobile), del header
    function anfitrion() {
      var nav = document.querySelector('.main-nav');
      return nav && nav.offsetParent ? nav : hdr;
    }
    // pseudo-azar con semilla: la guirnalda no cambia de forma al redimensionar
    function prng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    function moño(x, y, s) {
      var o = '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + s + ')">';
      o += '<path d="M-1 3 L-7 17 L-2.4 13.6 L-0.4 18.4 L1 4Z" fill="#a8181f"/><path d="M1 3 L7 17 L2.4 13.6 L0.4 18.4 L-1 4Z" fill="#c4202a"/>';
      o += '<path d="M0 0 C-4 -7 -12 -6 -12 -1 C-12 4 -5 4 0 0Z" fill="#d7262e"/><path d="M0 0 C4 -7 12 -6 12 -1 C12 4 5 4 0 0Z" fill="#d7262e"/>';
      o += '<path d="M-1 0 C-4 -4 -9 -4 -10 -1" fill="none" stroke="#f2656b" stroke-width="1" opacity=".7"/><path d="M1 0 C4 -4 9 -4 10 -1" fill="none" stroke="#f2656b" stroke-width="1" opacity=".7"/>';
      o += '<circle cx="0" cy="0" r="3" fill="#a8181f"/><circle cx="-.7" cy="-.8" r="1" fill="#f2656b" opacity=".8"/></g>';
      return o;
    }
    function build() {
      var host = anfitrion();
      if (svg.parentNode !== host) host.appendChild(svg);
      var w = host.clientWidth, h = 56, seg = mobile ? 92 : 128, n = Math.max(1, Math.round(w / seg)), sw = w / n, sag = mobile ? 10 : 14, k = 4;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var R = prng(7);
      var html = '<defs>';
      COLORS.forEach(function (c, i) {
        html += '<radialGradient id="nvg' + i + '"><stop offset="0" stop-color="' + c + '" stop-opacity=".85"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>';
      });
      html += '<radialGradient id="nvbR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff7a7f"/><stop offset=".55" stop-color="#d7262e"/><stop offset="1" stop-color="#8f1219"/></radialGradient>';
      html += '<radialGradient id="nvbG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff0a8"/><stop offset=".55" stop-color="#e2b13c"/><stop offset="1" stop-color="#8f6a14"/></radialGradient></defs>';
      var base = '', needA = '', needB = '', needC = '', berries = '', balls = '', bulbs = '', bows = '', idx = 0;
      for (var i = 0; i < n; i++) {
        var x0 = i * sw, x1 = x0 + sw, cxm = (x0 + x1) / 2, cy = 2 + sag * 2;
        base += (i === 0 ? 'M' + x0.toFixed(1) + ' 2' : '') + ' Q' + cxm.toFixed(1) + ' ' + cy + ' ' + x1.toFixed(1) + ' 2';
        var pt = function (t) {
          var u = 1 - t;
          return { x: u * u * x0 + 2 * u * t * cxm + t * t * x1, y: u * u * 2 + 2 * u * t * cy + t * t * 2,
            tx: 2 * u * (cxm - x0) + 2 * t * (x1 - cxm), ty: 2 * u * (cy - 2) + 2 * t * (2 - cy) };
        };
        // agujas de pino a lo largo de la curva
        var steps = Math.round(sw / 2.6);
        for (var s = 0; s <= steps; s++) {
          var p = pt(s / steps), a0 = Math.atan2(p.ty, p.tx);
          for (var q = 0; q < 3; q++) {
            var side = R() < 0.5 ? -1 : 1, ang = a0 + side * (0.5 + R() * 0.95), len = 4.5 + R() * 5;
            var seg1 = 'M' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + 'l' + (Math.cos(ang) * len).toFixed(1) + ' ' + (Math.sin(ang) * len).toFixed(1);
            var r = R();
            if (r < 0.45) needA += seg1; else if (r < 0.85) needB += seg1; else needC += seg1;
          }
        }
        // bayas rojas, bola (alterna roja/dorada) y luces
        [0.27, 0.73].forEach(function (t) {
          var b = pt(t);
          berries += '<circle cx="' + (b.x - 2.2).toFixed(1) + '" cy="' + (b.y + 0.5).toFixed(1) + '" r="2.1" fill="#d7262e"/><circle cx="' + (b.x + 1.8).toFixed(1) + '" cy="' + (b.y - 1.4).toFixed(1) + '" r="2.1" fill="#d7262e"/><circle cx="' + (b.x + 0.4).toFixed(1) + '" cy="' + (b.y + 2.4).toFixed(1) + '" r="2.1" fill="#b51a23"/>';
        });
        var m = pt(0.5), gold = i % 2 === 1;
        balls += '<rect x="' + (m.x - 1.4).toFixed(1) + '" y="' + (m.y - 1).toFixed(1) + '" width="2.8" height="3" fill="#caa24a"/><circle cx="' + m.x.toFixed(1) + '" cy="' + (m.y + 6).toFixed(1) + '" r="5.6" fill="url(#' + (gold ? 'nvbG' : 'nvbR') + ')"/><circle cx="' + (m.x - 1.8).toFixed(1) + '" cy="' + (m.y + 4).toFixed(1) + '" r="1.5" fill="#fff" opacity=".6"/>';
        [0.125, 0.375, 0.625, 0.875].forEach(function (t) {
          var b = pt(t), c = COLORS[idx % COLORS.length], cls = ['a', 'b', 'c'][idx % 3], delay = -((idx * 0.41) % 3).toFixed(2);
          bulbs += '<g><circle class="nv-glow ' + cls + '" style="animation-delay:' + delay + 's" cx="' + b.x.toFixed(1) + '" cy="' + (b.y + 13).toFixed(1) + '" r="11" fill="url(#nvg' + (idx % COLORS.length) + ')"/>' +
            '<rect class="nv-sock" x="' + (b.x - 1.8).toFixed(1) + '" y="' + (b.y + 4).toFixed(1) + '" width="3.6" height="3.4" rx="1"/>' +
            '<ellipse cx="' + b.x.toFixed(1) + '" cy="' + (b.y + 12).toFixed(1) + '" rx="3.1" ry="4.6" fill="' + c + '"/>' +
            '<ellipse cx="' + (b.x - 1).toFixed(1) + '" cy="' + (b.y + 10.4).toFixed(1) + '" rx="0.9" ry="1.5" fill="#fff" opacity=".55"/></g>';
          idx++;
        });
      }
      // un moño en cada punto de enganche (también en los bordes), parejo y simétrico
      for (var j = 0; j <= n; j++) bows += moño(j * sw, 3, mobile ? 0.8 : 1);
      svg.innerHTML = html +
        '<path d="' + base + '" fill="none" stroke="#16482a" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="' + needA + '" stroke="#1f6b3d" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
        '<path d="' + needB + '" stroke="#2f8a50" stroke-width="1.5" stroke-linecap="round" fill="none"/>' +
        '<path d="' + needC + '" stroke="#5fb77a" stroke-width="1.3" stroke-linecap="round" fill="none"/>' +
        berries + balls + bulbs + bows;
    }
    build();
    var timer;
    addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(build, 120); });
    // al bajar con scroll el header queda fijo: la guirnalda se desvanece para no tapar el contenido
    var tick = false;
    addEventListener('scroll', function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () { tick = false; svg.classList.toggle('nv-off', (window.scrollY || pageYOffset) > 90); });
    }, { passive: true });
  }

  /* ---------- Bastones de caramelo flanqueando los títulos de sección ---------- */
  function bastones() {
    var t = document.querySelectorAll('.sec-title:not(.sec-title-frase) h2, .carrusel-header h2');
    for (var i = 0; i < t.length; i++) {
      t[i].insertBefore(el('span', 'nv-cane', null), t[i].firstChild);
      t[i].appendChild(el('span', 'nv-cane nv-cane-r', null));
    }
  }

  /* ---------- Gorro de Papá Noel sobre la G del logo ---------- */
  var HAT_SVG = '<svg viewBox="0 0 100 86" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 66C14 40 36 16 64 13C78 11 90 18 93 31C80 25 68 30 64 42C61 52 67 60 78 66Z" fill="#d7262e"/>' +
    '<path d="M12 66C14 40 36 16 64 13C58 30 46 50 38 66Z" fill="#b51a23" opacity=".55"/>' +
    '<rect x="6" y="60" width="78" height="19" rx="9.5" fill="#fff" stroke="#d7e0ef" stroke-width="1.5"/>' +
    '<circle cx="93" cy="32" r="8.5" fill="#fff" stroke="#d7e0ef" stroke-width="1.5"/>' +
    '</svg>';
  function gorro() {
    var txt = document.querySelector('.page-header .logo-text'), box = document.querySelector('.page-header .header-content');
    if (!txt || !box) return;
    var wrap = document.createElement('span');
    wrap.innerHTML = HAT_SVG;
    var hat = wrap.firstChild;
    hat.setAttribute('class', 'nv-hat');
    hat.setAttribute('aria-hidden', 'true');
    box.appendChild(hat);
    // la "G" ocupa ~4%–15% del ancho de la imagen y arranca al 8% de su alto
    var fit = function () {
      var r = txt.getBoundingClientRect(), br = box.getBoundingClientRect();
      var w = (r.height || 44) * (innerWidth < 700 ? 0.9 : 1);
      hat.style.setProperty('--w', w + 'px');
      hat.style.left = (r.left - br.left + r.width * 0.085) + 'px';
      // el borde de piel del gorro apoya justo sobre la G (apenas la roza); la punta no se sale por arriba de la pantalla
      var alto = w * 0.8 * 0.86;
      hat.style.top = Math.max(r.top - br.top + r.height * 0.11, alto * 0.92 + 1 - br.top) + 'px';
    };
    fit(); addEventListener('resize', fit); addEventListener('load', fit); link.addEventListener('load', fit);
    if (!txt.complete) txt.addEventListener('load', fit);
  }

  /* ---------- Nieve: cristales de seis puntas (sprites) + puntitos lejanos, con parallax y viento ---------- */
  var flakes = [], sc, sg, sprites = [];
  // Dibuja un cristal: 6 brazos con ramas, contorno azulado para que se vea sobre fondo claro y trazo blanco encima
  function dibujarCristal(g, R, tipo) {
    function brazos(ancho, color) {
      g.strokeStyle = color; g.lineWidth = ancho; g.lineCap = 'round'; g.lineJoin = 'round';
      for (var a = 0; a < 6; a++) {
        g.save(); g.rotate(a * Math.PI / 3);
        g.beginPath(); g.moveTo(0, 0); g.lineTo(R, 0);
        if (tipo === 0) {            // dendrita: dos pares de ramas
          g.moveTo(R * 0.42, 0); g.lineTo(R * 0.42 + R * 0.26, R * 0.26); g.moveTo(R * 0.42, 0); g.lineTo(R * 0.42 + R * 0.26, -R * 0.26);
          g.moveTo(R * 0.68, 0); g.lineTo(R * 0.68 + R * 0.2, R * 0.2); g.moveTo(R * 0.68, 0); g.lineTo(R * 0.68 + R * 0.2, -R * 0.2);
        } else if (tipo === 1) {     // brazo con horquilla en la punta
          g.moveTo(R * 0.55, 0); g.lineTo(R * 0.8, R * 0.3); g.moveTo(R * 0.55, 0); g.lineTo(R * 0.8, -R * 0.3);
          g.moveTo(R * 0.3, 0); g.lineTo(R * 0.42, R * 0.17); g.moveTo(R * 0.3, 0); g.lineTo(R * 0.42, -R * 0.17);
        } else {                     // estrella simple con ramas cortas
          g.moveTo(R * 0.5, 0); g.lineTo(R * 0.72, R * 0.22); g.moveTo(R * 0.5, 0); g.lineTo(R * 0.72, -R * 0.22);
        }
        g.stroke(); g.restore();
      }
      if (tipo !== 2) {              // hexágono central
        g.beginPath();
        for (var v = 0; v < 6; v++) { var an = v * Math.PI / 3 + Math.PI / 6; g.lineTo(Math.cos(an) * R * 0.2, Math.sin(an) * R * 0.2); }
        g.closePath(); g.stroke();
      }
    }
    brazos(R * 0.34, 'rgba(112,152,214,.55)');
    brazos(R * 0.15, '#ffffff');
  }
  function prepararSprites() {
    var R = 15, size = Math.ceil((R + 4) * 2 * dpr);
    for (var t = 0; t < 3; t++) {
      var c = document.createElement('canvas');
      c.width = c.height = size;
      var g = c.getContext('2d');
      g.translate(size / 2, size / 2); g.scale(dpr, dpr);
      dibujarCristal(g, R, t);
      sprites.push({ c: c, r: R + 4 });
    }
  }
  function nuevoCopo(inicio) {
    var d = rnd(0.2, 1);
    return { x: rnd(0, W), y: inicio ? rnd(0, H) : rnd(-30, -4), d: d, r: 1 + d * 1.5, vy: 20 + d * 46, ph: rnd(0, 6.28), sw: rnd(0.6, 1.4),
      a: 0.5 + d * 0.5, rot: rnd(0, 6.28), vr: rnd(-0.7, 0.7), cristal: d > 0.68, tipo: (Math.random() * 3) | 0, size: 11 + d * 13 };
  }
  function prepararNieve() {
    sc = el('canvas', 'nv-snow', layer);
    sg = sc.getContext('2d');
    fitCanvas(sc);
    prepararSprites();
    var n = mobile ? Math.round(CFG.copos / 2) : CFG.copos;
    for (var i = 0; i < n; i++) flakes.push(nuevoCopo(true));
  }
  function tickNieve(dt, t) {
    sg.setTransform(dpr, 0, 0, dpr, 0, 0);
    sg.clearRect(0, 0, W, H);
    var wind = Math.sin(t * 0.23) * 16 + Math.sin(t * 0.61) * 7;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.vy * dt;
      f.x += (wind * (0.4 + f.d * 0.6) + Math.sin(t * f.sw + f.ph) * 13) * dt;
      f.rot += f.vr * dt;
      if (f.y > H + 20) { flakes[i] = f = nuevoCopo(false); }
      if (f.x < -24) f.x = W + 20; else if (f.x > W + 24) f.x = -20;
      sg.globalAlpha = f.a;
      if (f.cristal) {
        var sp = sprites[f.tipo], s = f.size / (sp.r * 2);
        sg.save(); sg.translate(f.x, f.y); sg.rotate(f.rot); sg.scale(s, s);
        sg.drawImage(sp.c, -sp.r, -sp.r, sp.r * 2, sp.r * 2);
        sg.restore();
      } else {
        sg.fillStyle = 'rgba(112,152,214,.34)';
        sg.beginPath(); sg.arc(f.x, f.y, f.r + 0.9, 0, 6.2832); sg.fill();
        sg.fillStyle = '#fff';
        sg.beginPath(); sg.arc(f.x, f.y, f.r, 0, 6.2832); sg.fill();
      }
    }
    sg.globalAlpha = 1;
  }

  /* ---------- Trineo de Papá Noel con renos (dibujado por código) ---------- */
  var fcv, fx, sleigh = null, nextSleigh = 7, spark = [], sparkT = 0;
  function circ(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
  function reno(g, ph, nariz) {
    var piel = '#7b4a2a';
    g.lineCap = 'round'; g.lineJoin = 'round';
    // patas (galope)
    g.strokeStyle = piel; g.lineWidth = 2.3;
    [[-9, 0], [-5, 0.9], [8, 3.1], [12, 4]].forEach(function (L) {
      var a = Math.sin(ph + L[1]) * 0.75, y0 = 4;
      g.beginPath(); g.moveTo(L[0], y0); g.lineTo(L[0] + Math.sin(a) * 9, y0 + Math.cos(a) * 9); g.stroke();
    });
    g.fillStyle = piel;
    g.beginPath(); g.ellipse(0, 0, 14, 6.5, 0, 0, 6.2832); g.fill();           // cuerpo
    g.beginPath(); g.moveTo(8, -3); g.lineTo(17, -13); g.lineTo(21.5, -9.5); g.lineTo(12.5, 3); g.closePath(); g.fill(); // cuello
    g.beginPath(); g.ellipse(21.5, -12, 4.6, 3.4, 0.45, 0, 6.2832); g.fill();   // cabeza
    g.beginPath(); g.ellipse(25.5, -10.2, 2.6, 2, 0.45, 0, 6.2832); g.fill();   // hocico
    g.beginPath(); g.moveTo(18.5, -14.5); g.lineTo(17, -19); g.lineTo(21, -15.5); g.closePath(); g.fill(); // oreja
    circ(g, -14.5, -2, 2.3);                                                      // cola
    // astas
    g.strokeStyle = '#e0cfa6'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(20.5, -15); g.lineTo(18, -23); g.moveTo(19.2, -19); g.lineTo(23, -22); g.moveTo(18.6, -21.4); g.lineTo(15, -23.5); g.stroke();
    // nariz
    if (nariz) {
      var gr = g.createRadialGradient(27.4, -10, 0, 27.4, -10, 9);
      gr.addColorStop(0, 'rgba(255,60,60,.9)'); gr.addColorStop(1, 'rgba(255,60,60,0)');
      g.fillStyle = gr; circ(g, 27.4, -10, 9);
      g.fillStyle = '#ff2a2a';
    } else g.fillStyle = '#2b1a10';
    circ(g, 27.4, -10, 1.6);
    g.fillStyle = '#16100c'; circ(g, 22.4, -12.6, 0.8);                           // ojo
  }
  function trineo(g, ph) {
    // riendas
    g.strokeStyle = 'rgba(90,60,30,.8)'; g.lineWidth = 0.9;
    g.beginPath(); g.moveTo(-50, -4); g.quadraticCurveTo(0, -8, 62, -8); g.stroke();
    // renos (3, el de adelante con nariz roja)
    [[-22, 0, false], [20, 1.1, false], [62, 2.3, true]].forEach(function (R) {
      g.save(); g.translate(R[0], 6 + Math.sin(ph + R[1]) * 1.6); g.rotate(Math.sin(ph + R[1]) * 0.05); reno(g, ph * 1.0 + R[1], R[2]); g.restore();
    });
    g.save(); g.translate(-78, 0);
    // patines dorados
    g.strokeStyle = '#d4a72c'; g.lineWidth = 2.2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-28, 13); g.lineTo(22, 13); g.quadraticCurveTo(33, 13, 33, 4); g.stroke();
    g.lineWidth = 1.4; g.beginPath(); g.moveTo(-18, 13); g.lineTo(-18, 5); g.moveTo(8, 13); g.lineTo(8, 5); g.stroke();
    // casco
    g.fillStyle = '#c4262e';
    g.beginPath(); g.moveTo(-28, -9); g.quadraticCurveTo(-31, 6, -18, 7); g.lineTo(24, 7); g.quadraticCurveTo(34, 7, 34, -5); g.lineTo(28, -5); g.quadraticCurveTo(26, 1, 18, 1); g.lineTo(-20, 1); g.quadraticCurveTo(-23, -4, -21, -9); g.closePath(); g.fill();
    g.fillStyle = '#e8b93c'; g.fillRect(-18, 3, 40, 1.4);
    // bolsa de regalos
    g.fillStyle = '#2a8a4a'; circ(g, -13, -7, 8);
    g.fillStyle = '#e8b93c'; g.fillRect(-14, -16, 2, 5);
    // Papá Noel
    g.fillStyle = '#d7262e'; circ(g, -1, -6, 6);
    g.fillStyle = '#f2c9a0'; circ(g, -1, -14, 3.2);
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-0.5, -11.6, 3.4, 2.6, 0, 0, 6.2832); g.fill();
    g.fillStyle = '#d7262e'; g.beginPath(); g.moveTo(-4.4, -15.4); g.lineTo(-3, -21); g.lineTo(2.6, -15.8); g.closePath(); g.fill();
    g.fillStyle = '#fff'; circ(g, -3, -21.4, 1.5); g.fillRect(-4.6, -16.2, 7, 1.6);
    g.restore();
  }
  function estrella(g, x, y, r) {
    g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 0.28, y - r * 0.28); g.lineTo(x + r, y); g.lineTo(x + r * 0.28, y + r * 0.28);
    g.lineTo(x, y + r); g.lineTo(x - r * 0.28, y + r * 0.28); g.lineTo(x - r, y); g.lineTo(x - r * 0.28, y - r * 0.28); g.closePath(); g.fill();
  }
  function lanzarTrineo() {
    var dir = Math.random() < 0.5 ? 1 : -1;
    sleigh = { dir: dir, t: 0, x0: dir > 0 ? -260 : W + 260, y0: rnd(H * 0.16, H * 0.32), sp: mobile ? 95 : 125, amp: rnd(14, 26), f: rnd(0.5, 0.8), p: rnd(0, 6.28), sc: mobile ? 0.7 : 1 };
  }
  function tickTrineo(dt) {
    if (!sleigh && !spark.length) { nextSleigh -= dt; if (nextSleigh <= 0) { lanzarTrineo(); nextSleigh = rnd(26, 40); } return; }
    fx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fx.clearRect(0, 0, W, H);
    if (sleigh) {
      var s = sleigh;
      s.t += dt;
      var x = s.x0 + s.dir * s.sp * s.t;
      var prog = clamp((x - (s.dir > 0 ? 0 : W)) * s.dir / W, 0, 1);
      var y = s.y0 + Math.sin(s.t * s.f + s.p) * s.amp + Math.sin(prog * Math.PI) * H * 0.05;
      var vy = Math.cos(s.t * s.f + s.p) * s.amp * s.f;
      // chispas detrás del trineo
      sparkT -= dt;
      if (sparkT <= 0) {
        sparkT = 0.035;
        spark.push({ x: x - s.dir * s.sc * 108, y: y + 8 * s.sc + rnd(-4, 4), vx: -s.dir * rnd(8, 28), vy: rnd(6, 26), life: 0, max: rnd(0.9, 1.7), r: rnd(1.4, 3.2), c: ['#ffd54a', '#fff', '#ff8a7a'][(Math.random() * 3) | 0] });
      }
      fx.save();
      fx.translate(x, y); fx.scale(s.dir * s.sc, s.sc); fx.rotate(Math.atan2(vy, s.sp) * 0.9);
      trineo(fx, s.t * 9);
      fx.restore();
      if (x < -300 || x > W + 300) sleigh = null;
    }
    for (var i = spark.length - 1; i >= 0; i--) {
      var p = spark[i];
      p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.life >= p.max) { spark.splice(i, 1); continue; }
      var al = 1 - p.life / p.max;
      fx.globalAlpha = al * 0.95;
      fx.fillStyle = p.c;
      estrella(fx, p.x, p.y, p.r * (0.6 + al * 0.6));
    }
    fx.globalAlpha = 1;
    if (!sleigh && !spark.length) fx.clearRect(0, 0, W, H);
  }

  /* ---------- Carrito: trineo en lugar del carrito + Papá Noel que saluda desde el panel "Tu pedido" ---------- */
  var SANTA_SVG = "<svg viewBox=\"0 0 110 72\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"nvCoat\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e8434a\"/><stop offset=\"1\" stop-color=\"#b3202a\"/></linearGradient><linearGradient id=\"nvHat\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ef4a50\"/><stop offset=\".6\" stop-color=\"#d12a33\"/><stop offset=\"1\" stop-color=\"#a81c26\"/></linearGradient><linearGradient id=\"nvSkin\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ffe3c8\"/><stop offset=\"1\" stop-color=\"#f1b78c\"/></linearGradient><radialGradient id=\"nvCheek\"><stop offset=\"0\" stop-color=\"#ff7f7f\" stop-opacity=\".7\"/><stop offset=\"1\" stop-color=\"#ff7f7f\" stop-opacity=\"0\"/></radialGradient><g id=\"nvBeard\"><path d=\"M32.5 42C26.5 54 30.5 68 41 71C44 73 50 73 53 71C63.5 68 67.5 54 61.5 42C58 48.5 54 52.6 47 52.6C40 52.6 36 48.5 32.5 42Z\"/><circle cx=\"36\" cy=\"60\" r=\"6\"/><circle cx=\"40.5\" cy=\"67\" r=\"6\"/><circle cx=\"47\" cy=\"69.5\" r=\"6\"/><circle cx=\"53.5\" cy=\"67\" r=\"6\"/><circle cx=\"58\" cy=\"60\" r=\"6\"/></g><g id=\"nvStache\"><path d=\"M47 44.4C43 42 36 42.4 34.5 47C33.6 50 36.2 52 39.6 51.4C42.8 50.8 45.4 49 47 47C48.6 49 51.2 50.8 54.4 51.4C57.8 52 60.4 50 59.5 47C58 42.4 51 42 47 44.4Z\"/></g><g id=\"nvBand\"><rect x=\"25\" y=\"21.5\" width=\"44\" height=\"11\" rx=\"5.5\"/><circle cx=\"29.5\" cy=\"27\" r=\"5.5\"/><circle cx=\"64.5\" cy=\"27\" r=\"5.5\"/></g><g id=\"nvHand\"><rect x=\"7.4\" y=\"25\" width=\"11.4\" height=\"12.6\" rx=\"5.2\"/><path d=\"M9.4 27L8.4 20.6M12.4 26L12 19M15.4 26L15.8 19M17.8 27.4L19 21.4M7.6 32L3.6 28.8\" fill=\"none\" stroke-linecap=\"round\"/></g></defs><!-- traje --><path d=\"M20 72C20 59 29 53 46 53H50C65 53 74 59 74 72Z\" fill=\"url(#nvCoat)\"/><path d=\"M21 66C27 61 36 62 39 72H21Z\" fill=\"#a51a24\" opacity=\".35\"/><rect x=\"21\" y=\"66\" width=\"53\" height=\"6\" fill=\"#2a2430\"/><rect x=\"40.5\" y=\"64.6\" width=\"13\" height=\"9\" rx=\"1.8\" fill=\"#e8b93c\"/><rect x=\"43.6\" y=\"66.8\" width=\"6.8\" height=\"4.6\" rx=\"1\" fill=\"#2a2430\"/><g class=\"nv-sway\"><!-- gorro --><path d=\"M31 26C30 11 40 3 52 4C63 5 69 14 66 26Z\" fill=\"url(#nvHat)\"/><path d=\"M58 6C68 4 80 10 83 23C83.6 27 80.4 28 78.4 25C76 17 70 14 61 15Z\" fill=\"url(#nvHat)\"/><path d=\"M32 24C32 13 40 6 50 5.6C42 10 38 17 38 26Z\" fill=\"#fff\" opacity=\".14\"/><circle cx=\"81.6\" cy=\"27\" r=\"6\" fill=\"#fff\" stroke=\"#d2dbed\" stroke-width=\"1.1\"/><!-- cara --><ellipse cx=\"47\" cy=\"39.5\" rx=\"16\" ry=\"14\" fill=\"url(#nvSkin)\"/><circle cx=\"36.5\" cy=\"42.5\" r=\"5.5\" fill=\"url(#nvCheek)\"/><circle cx=\"57.5\" cy=\"42.5\" r=\"5.5\" fill=\"url(#nvCheek)\"/><!-- barba --><use href=\"#nvBeard\" fill=\"#fff\" stroke=\"#d2dbed\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><use href=\"#nvBeard\" fill=\"#fff\"/><path d=\"M39 58Q41 62 40 66M47 59V67M55 58Q53 62 54 66\" fill=\"none\" stroke=\"#e1e8f4\" stroke-width=\"1.1\" stroke-linecap=\"round\"/><!-- boca --><path d=\"M42.4 52.6Q47 59 51.6 52.6Z\" fill=\"#b02432\"/><path d=\"M44.6 55.4Q47 57 49.4 55.4Q47 54.4 44.6 55.4Z\" fill=\"#e46a74\"/><!-- bigote --><use href=\"#nvStache\" fill=\"#fff\" stroke=\"#d2dbed\" stroke-width=\"2\" stroke-linejoin=\"round\"/><use href=\"#nvStache\" fill=\"#fff\"/><!-- nariz, ojos, cejas --><ellipse cx=\"47\" cy=\"43.6\" rx=\"3.6\" ry=\"3.1\" fill=\"#f0a08e\"/><ellipse cx=\"46\" cy=\"42.7\" rx=\"1.1\" ry=\".8\" fill=\"#fff\" opacity=\".6\"/><path class=\"nv-eye\" d=\"M37.8 40Q41 36.6 44.2 40\" fill=\"none\" stroke=\"#2b2230\" stroke-width=\"1.9\" stroke-linecap=\"round\"/><path class=\"nv-eye\" d=\"M49.8 40Q53 36.6 56.2 40\" fill=\"none\" stroke=\"#2b2230\" stroke-width=\"1.9\" stroke-linecap=\"round\"/><path d=\"M36.4 35.8Q41 32.8 45.2 35.4M48.8 35.4Q53 32.8 57.6 35.8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><!-- piel del gorro --><use href=\"#nvBand\" fill=\"#fff\" stroke=\"#d2dbed\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><use href=\"#nvBand\" fill=\"#fff\"/></g><!-- brazo derecho apoyado en el borde --><path d=\"M71 63C77 63 83 66 87 70\" fill=\"none\" stroke=\"#c4262e\" stroke-width=\"9.2\" stroke-linecap=\"round\"/><rect x=\"83\" y=\"63.5\" width=\"14\" height=\"12\" rx=\"6\" fill=\"#fff\" stroke=\"#d2dbed\" stroke-width=\"1.2\"/><path d=\"M87.6 65V70M92.2 65V70\" stroke=\"#d2dbed\" stroke-width=\"1.1\" stroke-linecap=\"round\"/><!-- brazo izquierdo: saluda --><path d=\"M27 63C21 62 16.5 58 15 52\" fill=\"none\" stroke=\"#c4262e\" stroke-width=\"9.2\" stroke-linecap=\"round\"/><g class=\"nv-wave\"><path d=\"M15 52L12.6 37\" fill=\"none\" stroke=\"#c4262e\" stroke-width=\"9.2\" stroke-linecap=\"round\"/><rect x=\"7.2\" y=\"36.6\" width=\"11.2\" height=\"5.4\" rx=\"2.7\" fill=\"#fff\" stroke=\"#d2dbed\" stroke-width=\"1\"/><use href=\"#nvHand\" fill=\"none\" stroke=\"#d2dbed\" stroke-width=\"4.8\"/><use href=\"#nvHand\" fill=\"#fff\" stroke=\"#fff\" stroke-width=\"3.1\"/><rect x=\"7.4\" y=\"25\" width=\"11.4\" height=\"12.6\" rx=\"5.2\" fill=\"#fff\"/></g></svg>";
  var SLEIGH_SVG = '<path d="M2.5 20H16.5c3 0 4.8-1.8 4.8-4.6"/><path d="M4 7c.2 5 2.4 7.8 6.6 7.8H19.2c1.6 0 2.4-1.3 2.2-3.4"/><path d="M8 15v5M15.6 15v5"/><path d="M9.4 12.6C8.6 9.2 10 7.4 12.4 7.4S16.2 9.2 15.4 12.6z" fill="currentColor" stroke-width="1.4"/><path d="M10.9 6.2h3" stroke-width="1.6"/>';
  function carrito() {
    // el ícono del carrito (header en desktop y botón flotante en mobile) pasa a ser el trineo de Papá Noel
    ['.header-cart-icon svg', '.carrito-float > svg'].forEach(function (sel) {
      var ic = document.querySelector(sel);
      if (ic) ic.innerHTML = SLEIGH_SVG;
    });
    // Papá Noel asomado sobre el borde del encabezado del panel: saluda al abrirlo
    var cab = document.querySelector('.carrito-header');
    if (cab) {
      var box = el('span', 'nv-santa', cab);
      box.innerHTML = SANTA_SVG;
    }
  }

  /* ---------- Montaje + loop único ---------- */
  function montar() {
    layer = el('div', 'nv-layer', document.body);
    if (CFG.gorro) gorro();
    if (CFG.luces) luces();
    bastones();
    carrito();
    if (reduce) return;                       // sin movimiento: solo gorro, luces fijas y adornos CSS
    prepararNieve();
    if (CFG.trineo) { fcv = el('canvas', 'nv-flycv', layer); fx = fcv.getContext('2d'); fitCanvas(fcv); }
    var last = performance.now(), t = 0;
    (function loop(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!document.hidden) {
        t += dt;
        tickNieve(dt, t);
        if (CFG.trineo) tickTrineo(dt);
      }
      requestAnimationFrame(loop);
    })(last);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();
