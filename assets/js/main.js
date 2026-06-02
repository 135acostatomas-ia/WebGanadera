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
      const [nombre, categoria, precio] = line.split(",");
      return { nombre: nombre?.trim(), categoria: categoria?.trim(), precio: precio?.trim() };
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

  if (!cont) return;

  const totalUnidades = carrito.reduce((s, i) => s + i.cantidad, 0);
  badge.textContent = totalUnidades;
  badge.style.display = totalUnidades > 0 ? "flex" : "none";

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

function agregarAlCarrito(nombre, categoria, precio) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad += 0.5;
  } else {
    carrito.push({ nombre, categoria, precio: Number(precio), cantidad: 0.5 });
  }
  actualizarCarrito();
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
  return `
  <div class="prod-card">
    <div class="prod-thumb"><img src="${img}" alt="${p.nombre}"></div>
    <div class="prod-info">
      <div class="cat">${p.categoria}</div>
      <h4>${p.nombre}</h4>
      <div class="prod-price"><span class="now">$ ${formatPrecio(p.precio)}</span><span class="kg">/ kg</span></div>
      <button class="btn-agregar" onclick="agregarAlCarrito('${p.nombre.replace(/'/g, "\\'")}', '${p.categoria}', '${p.precio}')">
        + Agregar al carrito
      </button>
    </div>
  </div>`;
}

function renderFiltros(categorias, todos) {
  const cont = document.getElementById("filtros-cat");
  if (!cont) return;
  const cats = ["Todos", ...categorias];
  cont.innerHTML = cats.map(c => `
    <button class="filtro-btn ${c === "Todos" ? "active" : ""}" data-cat="${c}">${c}</button>
  `).join("");

  cont.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      cont.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.cat;
      const filtrados = cat === "Todos" ? todos : todos.filter(p => p.categoria === cat);
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
    const text = await res.text();
    todosLosProductos = parseCSV(text);
    const categorias = [...new Set(todosLosProductos.map(p => p.categoria))];
    renderFiltros(categorias, todosLosProductos);
    cont.innerHTML = todosLosProductos.map(tarjetaProducto).join("");
  } catch (e) {
    cont.innerHTML = `<p style="padding:20px;color:#e34b00">Error al cargar productos.</p>`;
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

document.addEventListener("DOMContentLoaded", () => {
  renderProductos();
  setFloatWhatsApp();
  initHeroDots();
  document.getElementById("carrito-overlay").addEventListener("click", cerrarCarrito);
});
function animarBadge() {
  const badge = document.getElementById("carrito-badge");
  badge.classList.remove("badge-bump");
  void badge.offsetWidth; // fuerza reflow para reiniciar la animación
  badge.classList.add("badge-bump");
}