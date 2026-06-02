/* =========================================================
   Ganadera Panamericana — lógica de catálogo + WhatsApp
   ========================================================= */

const WHATSAPP_NUMERO = "5491100000000";

const CSV_URL = "https://api.allorigins.win/raw?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vROVeMldIsOVsSeIQx_yBV7JFz_GaSDnlK1JuOTVnAmxtTHSBN4Q4oiFbelaHSQ_8dnynHz8yUo0PG1/pub?gid=1110466768%26single=true%26output=csv";

const CAT_IMGS = {
  "Vacuno":    "assets/img/cat-vacuno.png",
  "Cerdo":     "assets/img/cat-cerdo.png",
  "Pollo":     "assets/img/cat-pollo.png",
  "Achuras":   "assets/img/cat-achuras.png",
};
const IMG_DEFAULT = "assets/img/cat-vacuno.png";

const CATEGORIAS = ["Vacuno","Cerdo","Pollo","Achuras","Embutidos","Elaborados","Combos","Almacén","Fiambrería"];

let todosLosProductos = [];
let categoriaActiva = "Todos";

/* ---- CSV fetch y parse ---- */
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/["""]/g, ""));
  return lines.slice(1).map(line => {
    const cols = [];
    let cur = "", inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { cols.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    cols.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = (cols[i] || "").replace(/^"|"$/g, "").trim());
    return obj;
  }).filter(p => p.nombre);
}

async function cargarProductos() {
  const grid = document.getElementById("prod-grid");
  if (grid) grid.innerHTML = '<p class="cargando">Cargando catálogo…</p>';

  try {
    const resp = await fetch(CSV_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    todosLosProductos = parseCSV(text);
    if (todosLosProductos.length === 0) throw new Error("CSV vacío o sin datos");
    renderTabs();
    renderProductos();
  } catch (e) {
    console.error("Error cargando catálogo:", e);
    const cont = document.getElementById("prod-grid");
    if (cont) cont.innerHTML = '<p class="cargando">No se pudo cargar el catálogo. Intentá más tarde.</p>';
  }
}

/* ---- Formato precio argentino ---- */
function formatPrecio(precio) {
  if (!precio || precio.trim() === "") return null;
  const num = parseFloat(precio.replace(",", "."));
  if (isNaN(num)) return null;
  return "$ " + num.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/* ---- WhatsApp link ---- */
function linkWhatsApp(producto) {
  const texto = `Hola! Quiero hacer un pedido:\n• ${producto.nombre} (${producto.categoria})`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

/* ---- Tarjeta de producto ---- */
function tarjetaProducto(p) {
  const img = CAT_IMGS[p.categoria] || IMG_DEFAULT;
  const precioFmt = formatPrecio(p.precio);
  const precioHTML = precioFmt
    ? `<div class="prod-price"><span class="now">${precioFmt}</span><span class="kg">/ kg</span></div>`
    : `<div class="prod-price"><span class="now consultar">Consultar precio</span></div>`;
  return `
  <div class="prod-card">
    <div class="prod-thumb"><img src="${img}" alt="${p.nombre}"></div>
    <div class="prod-info">
      <div class="cat">${p.categoria}</div>
      <h4>${p.nombre}</h4>
      ${precioHTML}
      <a href="${linkWhatsApp(p)}" target="_blank" class="btn-wsp">
        <img src="assets/img/whatsapp.png" alt=""> Pedir por WhatsApp
      </a>
    </div>
  </div>`;
}

/* ---- Tabs de categoría ---- */
function renderTabs() {
  const cont = document.getElementById("cat-tabs");
  if (!cont) return;
  const cats = ["Todos", ...CATEGORIAS.filter(c => todosLosProductos.some(p => p.categoria === c))];
  cont.innerHTML = cats.map(c =>
    `<button class="cat-tab${c === categoriaActiva ? " active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");
  cont.onclick = (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    categoriaActiva = btn.dataset.cat;
    cont.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProductos();
  };
}

/* ---- Grid de productos ---- */
function renderProductos() {
  const cont = document.getElementById("prod-grid");
  if (!cont) return;
  const filtrados = categoriaActiva === "Todos"
    ? todosLosProductos
    : todosLosProductos.filter(p => p.categoria === categoriaActiva);
  if (filtrados.length === 0) {
    cont.innerHTML = '<p class="cargando">No hay productos en esta categoría.</p>';
    return;
  }
  cont.innerHTML = filtrados.map(tarjetaProducto).join("");
}

/* ---- Botón flotante WhatsApp ---- */
function setFloatWhatsApp() {
  const f = document.getElementById("wsp-float");
  if (f) {
    const texto = "Hola! Quiero hacer una consulta sobre los productos.";
    f.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
  }
}

/* ---- Carrusel de cortes ---- */
function initCorteCarousel() {
  const viewport = document.querySelector(".cortes-viewport");
  const prevBtn  = document.querySelector(".cortes-prev");
  const nextBtn  = document.querySelector(".cortes-next");
  if (!viewport || !prevBtn || !nextBtn) return;

  const STEP = 280; // 260px card + 20px gap

  /* Avanza / retrocede con scroll nativo */
  prevBtn.addEventListener("click", () => viewport.scrollBy({ left: -STEP, behavior: "smooth" }));
  nextBtn.addEventListener("click", () => viewport.scrollBy({ left:  STEP, behavior: "smooth" }));

  /* Sincroniza opacidad de botones con la posición de scroll */
  function syncBtns() {
    const sl    = Math.round(viewport.scrollLeft);
    const maxSl = viewport.scrollWidth - viewport.clientWidth;
    const atStart = sl <= 0;
    const atEnd   = sl >= maxSl - 1 || maxSl <= 0;
    prevBtn.style.opacity       = atStart ? "0.35" : "1";
    prevBtn.style.pointerEvents = atStart ? "none"  : "auto";
    nextBtn.style.opacity       = atEnd   ? "0.35" : "1";
    nextBtn.style.pointerEvents = atEnd   ? "none"  : "auto";
  }

  viewport.addEventListener("scroll", syncBtns, { passive: true });
  window.addEventListener("resize", syncBtns);
  syncBtns();
}

/* ---- Hero dots ---- */
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
  cargarProductos();
  setFloatWhatsApp();
  initHeroDots();
  initCorteCarousel();
});
