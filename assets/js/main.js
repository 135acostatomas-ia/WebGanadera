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

let carrito = [];
let todosLosProductos = [];

function parseCSV(text) {
  const lines = text.trim().split("\n").slice(1);
  return lines
    .map(line => {
      const parts = line.split(",");
      const nombre = parts[0]?.trim();
      const categoria = parts[1]?.trim();
      const precio = parts[2]?.trim();
      return { nombre, categoria, precio };
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

  // badge header
  badge.textContent = totalUnidades;
  badge.style.display = totalUnidades > 0 ? "flex" : "none";

  // badge flotante
  if (floatBadge) {
    floatBadge.textContent = totalUnidades;
    floatBadge.style.display = totalUnidades > 0 ? "flex" : "none";
  }

  if (carrito.length === 0) {
    empty.style.display = "block";
    cont.innerHTML = "";
    total.textContent = "$ 0";
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

function feedbackBoton(btn) {
  if (!btn) return;
  const original = btn.innerHTML;
  btn.innerHTML = "✓ Agregado";
  btn.disabled = true;
  btn.style.background = "#2a7a2a";
  setTimeout(() => {
    btn.innerHTML = original;
    btn.disabled = false;
    btn.style.background = "";
  }, 1200);
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
  carrito.splice(idx, 1);
  actualizarCarrito();
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

// ---- PRODUCTOS ----

function tarjetaProducto(p) {
  const img = IMG_CAT[p.categoria] || "assets/img/cat-vacuno.png";
  const nombreEscapado = p.nombre.replace(/'/g, "\\'");
  const id = "prod-" + p.nombre.replace(/[^a-zA-Z0-9]/g, "-");
  return `
  <div class="prod-card">
    <div class="prod-thumb"><img src="${img}" alt="${p.nombre}"></div>
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

  // Lee ?cat=X de la URL para preseleccionar categoría
  const urlCat = new URLSearchParams(window.location.search).get("cat");
  const catInicial = (urlCat && categorias.includes(urlCat)) ? urlCat : categorias[0];

  cont.innerHTML = categorias.map(c => `
    <button class="filtro-btn ${c === catInicial ? "active" : ""}" data-cat="${c}">${c}</button>
  `).join("");

  // Mostrar productos de la categoría inicial
  const filtradosIniciales = todos.filter(p => p.categoria === catInicial);
  document.getElementById("prod-grid").innerHTML = filtradosIniciales.map(tarjetaProducto).join("");

  cont.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cont.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.cat;
      const filtrados = todos.filter(p => p.categoria === cat);
      document.getElementById("prod-grid").innerHTML = filtrados.map(tarjetaProducto).join("");
    });
  });
}

async function renderProductos() {
  const cont = document.getElementById("prod-grid");
  if (!cont) return;
  cont.innerHTML = `<p style="padding:20px;color:#929292">Cargando productos...</p>`;
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    todosLosProductos = parseCSV(text);
    const categorias = [...new Set(todosLosProductos.map(p => p.categoria))];
    renderFiltros(categorias, todosLosProductos);
    cont.innerHTML = todosLosProductos.map(tarjetaProducto).join("");
  } catch (e) {
    cont.innerHTML = `<p style="padding:20px;color:#e34b00">Error al cargar productos. Intentá recargar la página.</p>`;
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
  // En catalogo.html el catálogo arranca abierto
  if (window.location.pathname.includes("catalogo")) {
    const body = document.getElementById("catalogo-body");
    const arrow = document.getElementById("catalogo-arrow");
    if (body) body.classList.add("open");
    if (arrow) arrow.classList.add("open");
    renderProductos();
  } else {
    renderProductos();
  }
  setFloatWhatsApp();
  initHeroDots();
  document.getElementById("carrito-overlay").addEventListener("click", cerrarCarrito);
});