/* =========================================================
   Ganadera Panamericana — lógica de catálogo + WhatsApp
   ========================================================= */

/* 👉 NÚMERO DE WHATSAPP del negocio (formato internacional, sin + ni espacios)
   Ej: Argentina 11 5555-4444  ->  5491155554444  */
const WHATSAPP_NUMERO = "5491100000000";

/* 👉 PRODUCTOS (placeholder).
   Cuando tengamos la base de datos real, se reemplazan estos por los verdaderos.
   Cada producto: categoría, nombre, unidad, precio, etiqueta (opcional), imagen */
const PRODUCTOS = [
  { cat:"Vacuno",  nombre:"Bife de Chorizo", unidad:"Corte premium · x kg", precio:"8.990", tag:"OFERTA", img:"assets/img/cat-vacuno.png" },
  { cat:"Vacuno",  nombre:"Asado de Tira",   unidad:"Tradicional · x kg",   precio:"6.490", tag:"",       img:"assets/img/cat-vacuno.png" },
  { cat:"Cerdo",   nombre:"Bondiola",        unidad:"Ideal parrilla · x kg",precio:"5.290", tag:"",       img:"assets/img/cat-cerdo.png" },
  { cat:"Pollo",   nombre:"Pechuga",         unidad:"Sin hueso · x kg",     precio:"4.190", tag:"NUEVO",  img:"assets/img/cat-pollo.png" },
];

/* Arma el link de WhatsApp con mensaje pre-cargado */
function linkWhatsApp(producto){
  const texto = `Hola! Quiero hacer un pedido:\n• ${producto.nombre} (${producto.cat})`;
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}

/* Genera el HTML de una tarjeta de producto */
function tarjetaProducto(p){
  const tag = p.tag ? `<span class="prod-tag">${p.tag}</span>` : "";
  return `
  <div class="prod-card">
    <div class="prod-thumb">${tag}<img src="${p.img}" alt="${p.nombre}"></div>
    <div class="prod-info">
      <div class="cat">${p.cat}</div>
      <h4>${p.nombre}</h4>
      <div class="unit">${p.unidad}</div>
      <div class="prod-price"><span class="now">$ ${p.precio}</span><span class="kg">/ kg</span></div>
      <a href="${linkWhatsApp(p)}" target="_blank" class="btn-wsp">
        <img src="assets/img/whatsapp.png" alt=""> Pedir por WhatsApp
      </a>
    </div>
  </div>`;
}

/* Pinta los productos en el contenedor */
function renderProductos(){
  const cont = document.getElementById("prod-grid");
  if(!cont) return;
  cont.innerHTML = PRODUCTOS.map(tarjetaProducto).join("");
}

/* Botón flotante de WhatsApp general */
function setFloatWhatsApp(){
  const f = document.getElementById("wsp-float");
  if(f){
    const texto = "Hola! Quiero hacer una consulta sobre los productos.";
    f.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
  }
}

/* Slider de la home (rotación simple de los puntos, demo) */
function initHeroDots(){
  const dots = document.querySelectorAll(".hero-dots span");
  if(!dots.length) return;
  let i = 0;
  setInterval(()=>{
    dots.forEach(d=>d.classList.remove("active"));
    i = (i+1) % dots.length;
    dots[i].classList.add("active");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderProductos();
  setFloatWhatsApp();
  initHeroDots();
});
