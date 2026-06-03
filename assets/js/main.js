const WHATSAPP_NUMERO = "5491100000000";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vROVeMldIsOVsSeIQx_yBV7JFz_GaSDnlK1JuOTVnAmxtTHSBN4Q4oiFbelaHSQ_8dnynHz8yUo0PG1/pub?gid=1110466768&single=true&output=csv";

const IMG_CAT = {
  "Vacuno":     "assets/img/cat-vacuno.png",
  "Cerdo":      "assets/img/cat-cerdo.png",
  "Pollo":      "assets/img/cat-pollo.png",
  "Achuras":    "assets/img/cat-achuras.png",
  "Embutidos":  "assets/img/cat-vacuno.png",
  "Elaborados": "assets/img/cat-vacuno.png",
  "Combos":     "assets/img/cat-vacuno.png",
  "Almacén":    "assets/img/cat-vacuno.png",
  "Fiambrería": "assets/img/cat-vacuno.png",
};

let carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
let todosLosProductos = [];
let vistaActual = localStorage.getItem("vista-catalogo") || null; // null = no eligió todavía

function parseCSV(text) {
  const lines = text.trim().split("\n").slice(1);
  return lines
    .map(line => {
      const parts = line.split(",");
      const nombre = parts[0]?.trim();
      const categoria = parts[1]?.trim();
      const precio = parts[2]?.trim();
      const imagen = parts[3]?.trim() || "";
      return { nombre, categoria, precio, imagen };
    })
    .filter(p => p.nombre && p.categoria && p.precio);
}

function formatPrecio(precio) {
  return Number(precio).toLocaleString("es-AR");
}

// ---- CARRITO ----

function actualizarCarrito() {
  const cont = document.getElementById("carrito-items");
  const total = document.getElementById("carrito-total");
  const badge = document.getElementById("carrito-badge");
  const empty = document.getElementById("carrito-empty");
  const floatBadge = document.getElementById("float-carrito-badge");

  if (!cont) return;

  const totalUnidades = carrito.reduce((s, i) => s + i.cantidad, 0);

  badge.textContent = totalUnidades;
  badge.style.display = totalUnidades > 0 ? "flex" : "none";

  if (floatBadge) {
    floatBadge.textContent = totalUnidades;
    floatBadge.style.display = totalUnidades > 0 ? "flex" : "none";
  }

  if (carrito.length === 0) {
    empty.style.display = "block";
    cont.innerHTML = "";
    total.textContent = "$ 0";
    localStorage.setItem("carrito", JSON.stringify(carrito));
    return;
  }

  empty.style.display = "none";
  cont.innerHTML = carrito.map((item, idx) => `
    <div class="carrito-item">
      <div class="ci-info">
        <span class="ci-nombre">${item.nombre}</span>
        <span class="ci-cat">${item.categoria}</span>
      </div>
      <div class="ci-controles">
        <button onclick="cambiarCantidad(${idx}, -0.5)">−</button>
        <span>${item.cantidad} kg</span>
        <button onclick="cambiarCantidad(${idx}, 0.5)">+</button>
      </div>
      <div class="ci-precio">$ ${formatPrecio(item.precio * item.cantidad)}</div>
      <button class="ci-borrar" onclick="eliminarItem(${idx})">✕</button>
    </div>
  `).join("");

  const totalNum = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  total.textContent = "$ " + totalNum.toLocaleString("es-AR");
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(btn, nombre, categoria, precio) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad = Math.round((existente.cantidad + 0.5) * 10) / 10;
  } else {
    carrito.push({ nombre, categoria, precio: Number(precio), cantidad: 0.5 });
  }
  actualizarCarrito();
  animarBadge();
  actualizarControlTarjeta(nombre, categoria, precio);
}

function actualizarControlTarjeta(nombre, categoria, precio) {
  const id = "prod-" + nombre.replace(/[^a-zA-Z0-9]/g, "-");
  const cont = document.getElementById(id);
  if (!cont) return;
  const item = carrito.find(i => i.nombre === nombre);
  const nombreEscapado = nombre.replace(/'/g, "\\'");
  if (!item) {
    cont.innerHTML = `<button class="btn-agregar" onclick="agregarAlCarrito(this, '${nombreEscapado}', '${categoria}', '${precio}')">+ Agregar al carrito</button>`;
    return;
  }
  cont.innerHTML = `
    <div class="prod-controles">
      <button onclick="restarEnTarjeta('${nombreEscapado}', '${categoria}', '${precio}')">−</button>
      <span>${item.cantidad} kg</span>
      <button onclick="sumarEnTarjeta('${nombreEscapado}', '${categoria}', '${precio}')">+</button>
    </div>`;
}

function sumarEnTarjeta(nombre, categoria, precio) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad = Math.round((existente.cantidad + 0.5) * 10) / 10;
  } else {
    carrito.push({ nombre, categoria, precio: Number(precio), cantidad: 0.5 });
  }
  actualizarCarrito();
  animarBadge();
  actualizarControlTarjeta(nombre, categoria, precio);
}

function restarEnTarjeta(nombre, categoria, precio) {
  const idx = carrito.findIndex(i => i.nombre === nombre);
  if (idx === -1) return;
  carrito[idx].cantidad = Math.round((carrito[idx].cantidad - 0.5) * 10) / 10;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  actualizarCarrito();
  actualizarControlTarjeta(nombre, categoria, precio);
}

function animarBadge() {
  const badge = document.getElementById("carrito-badge");
  badge.classList.remove("badge-bump");
  void badge.offsetWidth;
  badge.classList.add("badge-bump");
}

function cambiarCantidad(idx, delta) {
  carrito[idx].cantidad = Math.round((carrito[idx].cantidad + delta) * 10) / 10;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  actualizarCarrito();
}

function eliminarItem(idx) {
  const item = carrito[idx];
  carrito.splice(idx, 1);
  actualizarCarrito();
  if (item) actualizarControlTarjeta(item.nombre, item.categoria, item.precio);
}

function abrirCarrito() {
  document.getElementById("carrito-drawer").classList.add("open");
  document.getElementById("carrito-overlay").classList.add("open");
}

function cerrarCarrito() {
  document.getElementById("carrito-drawer").classList.remove("open");
  document.getElementById("carrito-overlay").classList.remove("open");
}

function finalizarPedido() {
  if (carrito.length === 0) return;
  const lineas = carrito.map(i => `• ${i.nombre}: ${i.cantidad} kg — $${formatPrecio(i.precio * i.cantidad)}`).join("\n");
  const totalNum = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const texto = `Hola! Quiero hacer el siguiente pedido:\n\n${lineas}\n\nTOTAL: $${totalNum.toLocaleString("es-AR")}`;
  window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`, "_blank");
}

// ---- VISTA GRID / LIST ----

function elegirVista(v) {
  vistaActual = v;
  localStorage.setItem("vista-catalogo", v);
  const selector = document.getElementById("vista-selector");
  if (selector) selector.style.display = "none";
  aplicarVista(v);
  renderGridConVista();
}

function setVista(v) {
  vistaActual = v;
  localStorage.setItem("vista-catalogo", v);
  aplicarVista(v);
  renderGridConVista();
}

function aplicarVista(v) {
  const grid = document.getElementById("prod-grid");
  if (!grid) return;
  grid.classList.toggle("prod-grid-list", v === "list");
  document.getElementById("btn-vista-grid")?.classList.toggle("active", v === "grid");
  document.getElementById("btn-vista-list")?.classList.toggle("active", v === "list");
}

function renderGridConVista() {
  const cat = document.querySelector(".filtro-btn.active")?.dataset.cat;
  if (!cat || !todosLosProductos.length) return;
  const filtrados = todosLosProductos.filter(p => p.categoria === cat);
  document.getElementById("prod-grid").innerHTML = filtrados.map(tarjetaProducto).join("");
  carrito.forEach(item => actualizarControlTarjeta(item.nombre, item.categoria, item.precio));
}

// ---- PRODUCTOS ----

function tarjetaProducto(p) {
  const carpeta = p.categoria.toLowerCase().replace(/[^a-z]/g, "");
  const imgProducto = p.imagen ? `assets/img/${carpeta}/${p.imagen}` : (IMG_CAT[p.categoria] || "assets/img/cat-vacuno.png");
  const nombreEscapado = p.nombre.replace(/'/g, "\\'");
  const id = "prod-" + p.nombre.replace(/[^a-zA-Z0-9]/g, "-");
  return `
  <div class="prod-card">
    <div class="prod-thumb"><img src="${imgProducto}" alt="${p.nombre}"></div>
    <div class="prod-info">
      <div class="cat">${p.categoria}</div>
      <h4>${p.nombre}</h4>
      <div class="prod-price"><span class="now">$ ${formatPrecio(p.precio)}</span><span class="kg">/ kg</span></div>
      <div class="prod-cantidad" id="${id}">
        <button class="btn-agregar" onclick="agregarAlCarrito(this, '${nombreEscapado}', '${p.categoria}', '${p.precio}')">
          + Agregar al carrito
        </button>
      </div>
    </div>
  </div>`;
}

function renderFiltros(categorias, todos) {
  const cont = document.getElementById("filtros-cat");
  if (!cont) return;

  const urlCat = new URLSearchParams(window.location.search).get("cat");
  const catInicial = (urlCat && categorias.includes(urlCat)) ? urlCat : categorias[0];

  cont.innerHTML = categorias.map(c => `
    <button class="filtro-btn ${c === catInicial ? "active" : ""}" data-cat="${c}">${c}</button>
  `).join("");

  // Mostrar u ocultar selector de vista
  const selector = document.getElementById("vista-selector");
  const grid = document.getElementById("prod-grid");

  if (vistaActual) {
    // Ya eligió antes — mostrar productos directamente
    if (selector) selector.style.display = "none";
    const filtradosIniciales = todos.filter(p => p.categoria === catInicial);
    grid.innerHTML = filtradosIniciales.map(tarjetaProducto).join("");
    aplicarVista(vistaActual);
    carrito.forEach(item => actualizarControlTarjeta(item.nombre, item.categoria, item.precio));
  } else {
    // Primera vez — mostrar selector, ocultar grid
    if (selector) selector.style.display = "flex";
    grid.innerHTML = "";
  }

  cont.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cont.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (!vistaActual) return; // si no eligió vista todavía, no renderizar
      const cat = btn.dataset.cat;
      const filtrados = todos.filter(p => p.categoria === cat);
      document.getElementById("prod-grid").innerHTML = filtrados.map(tarjetaProducto).join("");
      carrito.forEach(item => actualizarControlTarjeta(item.nombre, item.categoria, item.precio));
    });
  });
}

function renderCarrusel(productos) {
  const track = document.getElementById("carrusel-track");
  if (!track) return;
  const categorias = [...new Set(productos.map(p => p.categoria))];
  let seleccionados = [];
  categorias.forEach(cat => {
    const conImg = productos.filter(p => p.categoria === cat && p.imagen);
    const sinImg = productos.filter(p => p.categoria === cat && !p.imagen);
    const pool = conImg.length > 0 ? conImg : sinImg;
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, 3);
    seleccionados = seleccionados.concat(shuffled);
  });
  seleccionados = seleccionados.sort(() => Math.random() - 0.5);
  const items = [...seleccionados, ...seleccionados];
  track.innerHTML = items.map(p => {
    const carpeta = p.categoria.toLowerCase().replace(/[^a-z]/g, "");
    const img = p.imagen ? `assets/img/${carpeta}/${p.imagen}` : (IMG_CAT[p.categoria] || "assets/img/cat-vacuno.png");
    return `
      <div class="carrusel-card" onclick="abrirCategoria('${encodeURIComponent(p.categoria)}')">
        <img class="carrusel-card-img" src="${img}" alt="${p.nombre}">
        <div class="carrusel-card-body">
          <div class="carrusel-card-cat">${p.categoria}</div>
          <div class="carrusel-card-nombre">${p.nombre}</div>
        </div>
      </div>`;
  }).join("");

  const section = track.closest(".carrusel-section");
  if (section) section.classList.add("loaded");

  // ---- DRAG TÁCTIL ----
  const wrap = track.parentElement;
  let startX = 0;
  let scrollLeft = 0;
  let isDragging = false;

  wrap.addEventListener("touchstart", e => {
    isDragging = true;
    startX = e.touches[0].clientX;
    scrollLeft = wrap.scrollLeft;
    track.style.animationPlayState = "paused";
  }, { passive: true });

  wrap.addEventListener("touchmove", e => {
    if (!isDragging) return;
    const dx = startX - e.touches[0].clientX;
    wrap.scrollLeft = scrollLeft + dx;
  }, { passive: true });

  wrap.addEventListener("touchend", () => {
    isDragging = false;
    setTimeout(() => { track.style.animationPlayState = "running"; }, 2000);
  });
}

function abrirCategoria(cat) {
  const body = document.getElementById("catalogo-body");
  const arrow = document.getElementById("catalogo-arrow");
  if (body && !body.classList.contains("open")) {
    body.classList.add("open");
    if (arrow) arrow.classList.add("open");
  }
  const decoded = decodeURIComponent(cat);
  const btn = document.querySelector(`.filtro-btn[data-cat="${decoded}"]`);
  if (btn) btn.click();
  document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
}

async function renderProductos() {
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    todosLosProductos = parseCSV(text);
    const categorias = [...new Set(todosLosProductos.map(p => p.categoria))];
    const cont = document.getElementById("prod-grid");
    if (cont) renderFiltros(categorias, todosLosProductos);
    renderCarrusel(todosLosProductos);
  } catch (e) {
    const cont = document.getElementById("prod-grid");
    if (cont) cont.innerHTML = `<p style="padding:20px;color:#e34b00">Error al cargar productos. Intentá recargar la página.</p>`;
    console.error("Error cargando CSV:", e);
  }
}

function setFloatWhatsApp() {
  const f = document.getElementById("wsp-float");
  if (f) {
    const texto = "Hola! Quiero hacer una consulta sobre los productos.";
    f.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
  }
}

function initHeroDots() {
  const dots = document.querySelectorAll(".hero-dots span");
  if (!dots.length) return;
  let i = 0;
  setInterval(() => {
    dots.forEach(d => d.classList.remove("active"));
    i = (i + 1) % dots.length;
    dots[i].classList.add("active");
  }, 3000);
}

function toggleCatalogo() {
  const body = document.getElementById("catalogo-body");
  const arrow = document.getElementById("catalogo-arrow");
  if (body) body.classList.toggle("open");
  if (arrow) arrow.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  renderProductos();
  setFloatWhatsApp();
  initHeroDots();
  document.getElementById("carrito-overlay").addEventListener("click", cerrarCarrito);
});