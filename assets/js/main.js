/* =========================================================
   Ganadera Panamericana — lógica de catálogo + WhatsApp
   ========================================================= */

const WHATSAPP_NUMERO = "5491100000000";

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vROVeMldIsOVsSeIQx_yBV7JFz_GaSDnlK1JuOTVnAmxtTHSBPN4Q4oiFbelaHSQ_8dnynHz8yUo0PG1/pub?gid=1110466768&single=true&output=csv";

const CAT_IMGS = {
  "Vacuno":     "assets/img/cat-vacuno.png",
  "Cerdo":      "assets/img/cat-cerdo.png",
  "Pollo":      "assets/img/cat-pollo.png",
  "Achuras":    "assets/img/cat-achuras.png",
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
    // soporte básico para campos con comas dentro de comillas
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
  try {
    const resp = await fetch(CSV_URL);
    const text = await resp.text();
    todosLosProductos = parseCSV(text);
    renderTabs();
    renderProductos();
  } catch (e) {
    const cont = document.getElementById("prod-grid");
    if (cont) cont.innerHTML = '<p style="text-align:center;color:#999;padding:40px 0">No se pudo cargar el catálogo. Intentá más tarde.</p>';
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
  cont.querySelectorAll(".cat-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      categoriaActiva = btn.dataset.cat;
      cont.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProductos();
    });
  });
}

/* ---- Grid de productos ---- */
function renderProductos() {
  const cont = document.getElementById("prod-grid");
  if (!cont) return;
  const filtrados = categoriaActiva === "Todos"
    ? todosLosProductos
    : todosLosProductos.filter(p => p.categoria === categoriaActiva);
  if (filtrados.length === 0) {
    cont.innerHTML = '<p style="text-align:center;color:#999;padding:40px 0">No hay productos en esta categoría.</p>';
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
  const track = document.querySelector(".cortes");
  const prevBtn = document.querySelector(".cortes-prev");
  const nextBtn = document.querySelector(".cortes-next");
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll(".corte-card");
  let pos = 0;

  function visibleCount() {
    return window.innerWidth <= 560 ? 1 : window.innerWidth <= 980 ? 2 : 4;
  }

  function update() {
    const vis = visibleCount();
    const max = Math.max(0, cards.length - vis);
    pos = Math.max(0, Math.min(pos, max));
    track.style.transform = `translateX(-${(100 / vis) * pos}%)`;
    prevBtn.style.opacity = pos === 0 ? "0.3" : "1";
    prevBtn.style.pointerEvents = pos === 0 ? "none" : "auto";
    nextBtn.style.opacity = pos >= max ? "0.3" : "1";
    nextBtn.style.pointerEvents = pos >= max ? "none" : "auto";
  }

  prevBtn.addEventListener("click", () => { pos--; update(); });
  nextBtn.addEventListener("click", () => { pos++; update(); });
  window.addEventListener("resize", update);

  let startX = 0;
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { pos += diff > 0 ? 1 : -1; update(); }
  });

  update();
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
