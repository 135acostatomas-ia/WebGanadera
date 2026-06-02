/* =========================================================
   Ganadera Panamericana — lógica de catálogo + WhatsApp
   ========================================================= */

const WHATSAPP_NUMERO = "5491100000000";

const SHEETS_URL = "https://api.allorigins.win/raw?url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2Fe%2F2PACX-1vROVeMldIsOVsSeIQx_yBV7JFz_GaSDnlK1JuOTVnAmxtTHSBN4Q4oiFbelaHSQ_8dnynHz8yUo0PG1%2Fpub%3Fgid%3D1110466768%26single%3Dtrue%26output%3Dcsv";

async function fetchProductos() {
  const res = await fetch(SHEETS_URL);
  const csv = await res.text();
  const filas = csv.trim().split("\n").slice(1);
  return filas
    .map(fila => {
      const partes = fila.split(",");
      return {
        nombre: partes[0]?.trim(),
        cat: partes[1]?.trim(),
        precio: partes[2]?.trim()
      };
    })
    .filter(p => p.nombre && p.cat);
}

function linkWhatsApp(producto) {
  const texto = `Hola! Quiero hacer un pedido:\n• ${producto.nombre} (${producto.cat})`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

function formatPrecio(precio) {
  if (!precio) return `<span class="consultar">Consultar precio</span>`;
  const num = parseInt(precio);
  return `<div class="prod-price"><span class="now">$ ${num.toLocaleString("es-AR")}</span><span class="kg">/ kg</span></div>`;
}

function tarjetaProducto(p) {
  return `
  <div class="prod-card">
    <div class="prod-thumb"><img src="assets/img/cat-vacuno.png" alt="${p.nombre}"></div>
    <div class="prod-info">
      <div class="cat">${p.cat}</div>
      <h4>${p.nombre}</h4>
      ${formatPrecio(p.precio)}
      <a href="${linkWhatsApp(p)}" target="_blank" class="btn-wsp">
        <img src="assets/img/whatsapp.png" alt=""> Pedir por WhatsApp
      </a>
    </div>
  </div>`;
}

function renderTabs(categorias, activa, productos) {
  const cont = document.getElementById("cat-tabs");
  if (!cont) return;
  cont.innerHTML = ["Todos", ...categorias].map(cat =>
    `<button class="cat-tab${cat === activa ? " active" : ""}" data-cat="${cat}">${cat}</button>`
  ).join("");
  cont.querySelectorAll(".cat-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const sel = btn.dataset.cat;
      const filtrados = sel === "Todos" ? productos : productos.filter(p => p.cat === sel);
      document.getElementById("prod-grid").innerHTML = filtrados.map(tarjetaProducto).join("");
      cont.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

async function renderProductos() {
  const cont = document.getElementById("prod-grid");
  if (!cont) return;
  cont.innerHTML = `<p style="padding:20px;color:#999">Cargando productos...</p>`;
  try {
    const productos = await fetchProductos();
    const categorias = [...new Set(productos.map(p => p.cat))];
    renderTabs(categorias, "Todos", productos);
    cont.innerHTML = productos.map(tarjetaProducto).join("");
  } catch (e) {
    cont.innerHTML = `<p style="padding:20px;color:#e34b00">Error al cargar productos. Intentá de nuevo.</p>`;
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
});