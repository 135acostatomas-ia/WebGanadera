const WHATSAPP_NUMERO = "5491100000000";

const MINIMO_COMPRA = 60000;

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


// Agrupa categorías del Sheet bajo los botones unificados del nav
const GRUPOS = {
  "EmbutidosAchuras": ["Embutidos", "Achuras"],
  "FiambreriaAlmacen": ["Fiambrería", "Almacén"]
};

// Carpeta real de assets/img para cada categoría del Sheet.
// Ojo: NO se deriva automáticamente del nombre (los acentos rompían la cuenta),
// así que si agregás una categoría nueva, sumala acá también.
const CARPETA_IMG = {
  "Vacuno": "vacuno",
  "Cerdo": "cerdo",
  "Pollo": "pollo",
  "Achuras": "achuras",
  "Elaborados": "elaborados",
  "Embutidos": "embutidos",
  "Almacén": "almacen-y-fiambreria",
  "Fiambrería": "almacen-y-fiambreria",
  "Combos": "combos",
};

// Productos que se venden por unidad/presentación y NO por kilo
const PRODUCTOS_POR_UNIDAD = new Set([
  "Provoletta Parrillera en cazuela",

  "Bolsa Sazón Knorr (varios)",
  "Bolsa Sazón Barbacoa",
  "Bolsa de Carbón Chico",
  "Bolsa de Carbón Grande",
  "Leña x 10kg",
  "Maderitas (iniciador de fuego)",
  "Maple de Huevos N°1",
  "Huevos cajita x 1/2 doc",
  "Pan Baguetin (cong p hornear)",
  "Miel Pura x 500",
  "Miel Pura x 250",

  "Queso Rallado Sobre x2 La Quesera",
  "Dulce de Batata Esnaola Lata",
  "Dulce Choco Esnaola Lata",
  "Dulce de Membrillo Esnaola Lata",
  "Huevos Maple 30 N°1 Especiales",
  "Huevos 1/2 Docena Cajita Estuche",
  "Aceite Girasol Leira 900",
  "Arroz Ala 500gr",
  "Puré de Tomate Marolio 520gr",
  "Puré Molto 520"
]);

// Recomendaciones breves para la vista de tarjetas del catálogo.
// Las claves respetan los nombres publicados en el Sheet.
const RECOMENDACIONES_PRODUCTOS = {
  "Asado": "Ideal para parrilla u horno, con cocción lenta para lograr una carne tierna.",
  "Vacío": "Excelente para parrilla u horno; conviene cocinarlo lentamente para conservar su jugosidad.",
  "Falda parrillera": "Recomendada para parrilla, horno o cocciones largas con mucho sabor.",
  "Tapa de asado": "Ideal para horno, parrilla o cacerola; queda muy bien marinada.",
  "Asado americano": "Corte fino y rápido, ideal para parrilla o plancha.",
  "Costillar": "Clásico para parrilla o asado al horno con cocción lenta.",
  "Nalga": "Corte magro, ideal para milanesas, bifes, escalopes o al horno.",
  "Bola de lomo": "Muy versátil para milanesas, bifes, horno o cacerola.",
  "Cuadrada": "Recomendada para milanesas, bifes y preparaciones al horno.",
  "Peceto": "Ideal para milanesas, vitel toné, mechado o cocción al horno.",
  "Palomita": "Buena para horno, estofados, carne mechada o cocciones lentas.",
  "Roast beef": "Perfecto para guisos, estofados, horno, hamburguesas o carne picada.",
  "Paleta": "Ideal para guisos, estofados, horno, milanesas o carne desmechada.",
  "Colita": "Excelente para horno o parrilla, entera o cortada en bifes.",
  "Matambre": "Clásico para parrilla, arrollado, pizza de matambre o cocción al horno.",
  "Osobuco del Rey": "Ideal para braseados, guisos y estofados de cocción prolongada.",
  "Tomahawk": "Corte grueso ideal para parrilla, sellado fuerte y cocción controlada.",
  "Lomo": "Muy tierno y magro; ideal para medallones, plancha, horno o con salsa.",
  "Cuadril": "Versátil para bifes, parrilla, plancha, horno o salteados.",
  "Ojo de bife": "Ideal para parrilla o plancha; se destaca por su terneza y jugosidad.",
  "Arañita": "Corte pequeño y sabroso, recomendado para parrilla o plancha.",
  "Picaña": "Excelente para parrilla u horno, aprovechando su capa de grasa para mayor sabor.",
  "Riñonada": "Ideal para bifes, plancha o parrilla por su terneza.",
  "Bife de chorizo": "Clásico para parrilla o plancha, servido en bifes gruesos.",
  "Bife ancho": "Muy sabroso para parrilla o plancha; ideal para quienes buscan jugosidad.",
  "Bife angosto": "Recomendado para parrilla, plancha o bifes a la criolla.",
  "Entraña": "Ideal para parrilla o plancha con cocción rápida.",
  "Tapa de nalga": "Buena para horno, milanesas, escalopes o carne rellena.",
  "Marucha": "Sabrosa y versátil para parrilla, plancha, horno o estofados.",
  "Tortuguita": "Ideal para guisos, estofados, horno o milanesas.",
  "Osobuco": "Perfecto para guisos, pucheros y estofados de cocción lenta.",
  "Espinazo": "Aporta mucho sabor a caldos, sopas, pucheros y guisos.",
  "Picada Especial": "Ideal para hamburguesas, albóndigas, pastel de papa, empanadas o salsas.",
  "Falda Puchero": "Especial para pucheros, caldos, sopas y guisos.",
  "Chiquizuela": "Recomendada para caldos, pucheros y cocciones largas.",
  "Carre": "Ideal para parrilla, plancha u horno, entero o cortado en chuletas.",
  "Carre americano": "Corte práctico para parrilla o plancha, de cocción rápida.",
  "Carre deshuesado": "Ideal para horno, bifes, rellenos o cocción a la cacerola.",
  "Pechito": "Excelente para parrilla u horno con cocción lenta hasta dorar.",
  "Bondiola": "Muy jugosa para parrilla, horno, braseado o sándwiches desmechados.",
  "Matambrito": "Ideal para parrilla o plancha; fino, sabroso y de cocción rápida.",
  "Churrasquito": "Perfecto para parrilla o plancha, marinado o con limón.",
  "Solomillo": "Corte tierno para medallones, plancha, horno o salsas.",
  "Ribs de cerdo": "Ideales para horno o parrilla, especialmente con salsa barbacoa.",
  "Paleta de cerdo": "Recomendada para horno, guisos, braseados o carne desmechada.",
  "Jamon": "Ideal para horno, bifes, milanesas o preparaciones rellenas.",
  "Nalga de cerdo": "Corte magro para milanesas, bifes, horno o salteados.",
  "Peceto de cerdo": "Ideal para horno, medallones, milanesas o cocciones con salsa.",
  "Bola de lomo de cerdo": "Versátil para milanesas, bifes, salteados o cacerola.",
  "Cuadril de cerdo": "Recomendado para bifes, parrilla, horno o fajitas.",
  "Colita de cuadril de cerdo": "Ideal para horno o parrilla, entera o fileteada.",
  "Cuadrada de cerdo": "Buena para milanesas, bifes, horno o salteados.",
  "Tortuguita de cerdo": "Ideal para horno, guisos, estofados o carne desmechada.",
  "Osobuco de cerdo": "Perfecto para guisos, estofados y cocciones lentas.",
  "Pollo Entero": "Ideal para horno, parrilla, spiedo, guisos o sopas.",
  "Pata y Muslo": "Jugoso y versátil para horno, parrilla, guisos o estofados.",
  "Pata y muslo deshuesado": "Ideal para plancha, parrilla, rellenos, arrollados o salteados.",
  "Suprema": "Perfecta para milanesas, plancha, horno, rellenos o salteados.",
  "Alitas": "Ideales para horno, parrilla o fritas, con salsas y marinadas.",
  "Mollejas": "Delicadas y crocantes a la parrilla o plancha, con limón.",
  "Chinchulín": "Clásico de parrilla; queda mejor bien dorado y crocante.",
  "Rueda": "Ideal para parrilla, cocida lentamente hasta quedar dorada.",
  "Riñón": "Recomendado para parrilla, plancha o preparaciones al vino.",
  "Tripa gorda": "Especial para parrilla, con cocción lenta y dorado final.",
  "Lengua": "Ideal hervida para lengua a la vinagreta, escabeche o salsas.",
  "Hígado": "Perfecto para plancha, bifes encebollados o paté casero.",
  "Corazón": "Ideal para brochettes, plancha o parrilla, previamente marinado.",
  "Centro": "Recomendado para parrilla, bien dorado por fuera.",
  "Mondongo": "Clásico para guisos, buseca y cocciones largas.",
  "Seso": "Ideal para buñuelos, frituras, tortillas o preparaciones suaves.",
  "Rabo": "Excelente para guisos, estofados y caldos de cocción prolongada.",
  "Quijada": "Ideal para guisos, braseados y carne desmechada.",
  "Rebozadas de carne": "Prácticas para horno o fritura, ideales con puré, ensalada o en sándwich.",
  "Rebozadas de pollo": "Ideales para horno o fritura, acompañadas con ensalada o papas.",
  "Hamburguesa de carne": "Ideal para plancha, parrilla o sartén, en pan o al plato.",
  "Hamburguesa de pollo": "Buena para plancha, parrilla o sartén, en pan o al plato.",
  "Hamburguesa de cerdo": "Sabrosa para parrilla o plancha, ideal con quesos y salsas.",
  "Salchichas viena con piel": "Ideales para panchos, plancha, hervor o preparaciones rápidas.",
  "Chorizos de carne": "Clásicos para parrilla, choripán, guisos o salsa.",
  "Salchichas Parrilleras": "Ideales para parrilla o plancha, como entrada o en sándwich.",
  "Chorizo Puro cerdo": "Perfecto para parrilla, choripán o para sumar sabor a guisos.",
  "Morcilla rosca": "Ideal para parrilla y picadas calientes.",
  "Morcilla atada": "Clásica para parrilla, servida sola o en tostadas.",
  "Morcilla vasca": "Ideal para parrilla, picadas y entradas de sabor intenso.",
  "Morcilla Asturiana": "Especial para guisos, fabadas, parrilla o platos de cocción lenta.",
  "Chorizo colorado": "Aporta sabor a guisos, lentejas, salsas, pizzas y picadas.",
  "Nuggets": "Prácticos para horno, air fryer o fritura, con salsas para acompañar.",
  "Provoletta Parrillera en cazuela": "Lista para parrilla u horno; ideal como entrada caliente.",
  "Panceta Salada": "Ideal para guisos, salsas, rellenos, huevos o preparaciones al horno.",
  "Panceta Ahumada": "Perfecta para hamburguesas, pastas, salsas, rellenos o desayunos.",
  "Bolsa Sazón Knorr (varios)": "Práctica para condimentar carnes, pollo, vegetales y preparaciones al horno.",
  "Bolsa Sazón Barbacoa": "Ideal para marinar y condimentar carnes, pollo, costillas y preparaciones al horno.",
  "Maple de Huevos N°1": "Rendidor para desayunos, repostería, tortillas, rebozados y comidas familiares.",
  "Huevos cajita x 1/2 doc": "Prácticos para desayunos, tortillas, repostería, ensaladas y rebozados.",
  "Miel Pura x 500": "Ideal para tostadas, infusiones, yogur, postres, marinadas y aderezos.",
  "Miel Pura x 250": "Ideal para tostadas, infusiones, yogur, postres, marinadas y aderezos.",
  "Queso Barra Punta del Agua": "Ideal para sándwiches, tostados, picadas y gratinados.",
  "Queso Cremoso Punta": "Excelente para pizzas, tartas, empanadas, tostados y postres con dulce.",
  "Queso Cremoso Clarita": "Ideal para pizzas, tartas, empanadas, tostados y preparaciones gratinadas.",
  "Queso Sardo Cremoso Fresco Itati": "Ideal para picadas, pastas, gratinados o para rallar.",
  "Muzzarella Dom Tin": "Especial para pizzas, empanadas, tartas, milanesas y gratinados.",
  "Queso de Cerdo Mangiarotti": "Ideal para picadas, sándwiches, entradas frías o acompañar con pan.",
  "Queso Roquefort La Quesera": "Perfecto para picadas, salsas, pizzas, ensaladas o pastas.",
  "Queso Sardo Est. La Quesera": "Ideal para rallar, gratinar, pastas y picadas de sabor intenso.",
  "Queso Rallado Suelto La Quesera": "Listo para pastas, sopas, risottos, salsas y gratinados.",
  "Provoletta La Quesera": "Ideal para parrilla o plancha, con o sin condimentos.",
  "Queso Sardo Fresco La Quesera": "Ideal para picadas, pastas, gratinados o rallado suave.",
  "Queso Romanito La Quesera": "Perfecto para rallar, gratinar y sumar sabor a pastas o risottos.",
  "Queso Rallado Sobre x2 La Quesera": "Práctico para pastas, sopas, salsas y gratinados.",
  "Queso Mar del Plata": "Ideal para picadas, sándwiches, tostados y gratinados.",
  "Queso Provolin": "Ideal para parrilla, picadas, pastas, pizzas o gratinados.",
  "Jamón Crudo Pino Dorado": "Ideal para picadas, bruschettas, sándwiches, ensaladas y tablas con quesos.",
  "Jamón Cocido Junior Mangiarotti": "Práctico para sándwiches, tostados, pizzas, tartas y empanadas.",
  "Jamón Cocido Natural": "Ideal para sándwiches, picadas, tostados y preparaciones rellenas.",
  "Longaniza Puro Cerdo Mangiarotti": "Perfecta para picadas, tablas de fiambres, sándwiches y aperitivos.",
  "Paleta Sandwich Mangiarotti": "Ideal para sándwiches, tostados, pizzas y preparaciones rápidas.",
  "Panceta Ahumada Cuero Mangiarotti": "Excelente para guisos, pastas, salsas, rellenos y preparaciones al horno.",
  "Panceta Salada Mangiarotti": "Ideal para guisos, salsas, rellenos, tortillas y preparaciones al horno.",
  "Chorizo Colorado": "Aporta sabor a guisos, lentejas, pizzas, salsas y picadas.",
  "Longaniza Bastón para Fetear": "Ideal para picadas, tablas de fiambres, sándwiches y aperitivos."
  ,"Espinazo 3kg": "Ideal para preparar caldos, pucheros, sopas y guisos abundantes."
  ,"Pata y Muslo 3kg": "Rinde para horno, parrilla, guisos o comidas familiares."
  ,"Rebozadas de carne 2kg": "Opción práctica y rendidora para horno o fritura."
  ,"Rebozadas de pollo 2kg": "Opción práctica y rendidora para horno o fritura."
  ,"Suprema 2kg": "Ideal para milanesas, plancha, horno o preparaciones rellenas."
  ,"Carre 2kg": "Ideal para parrilla, plancha u horno, entero o en chuletas."
  ,"Picada Especial 2kg": "Rendidora para hamburguesas, albóndigas, empanadas o pastel de papa."
  ,"Bola de lomo 2kg": "Ideal para milanesas, bifes, horno o cacerola."
  ,"Cuadrada 2kg": "Recomendada para milanesas, bifes y preparaciones al horno."
  ,"Osobuco 2kg": "Perfecto para guisos, pucheros y estofados abundantes."
  ,"Paleta 1kg": "Ideal para guisos, estofados, horno, milanesas o carne desmechada."
  ,"Cuadrada 1kg": "Recomendada para milanesas, bifes y preparaciones al horno."
  ,"Nalga 1kg": "Corte magro, ideal para milanesas, bifes, escalopes o al horno."
  ,"Bola de lomo 1kg": "Ideal para milanesas, bifes, horno o cacerola."
  ,"Roast beef 1kg": "Perfecto para guisos, estofados, horno, hamburguesas o carne picada."
  ,"Bife ancho 1kg": "Muy sabroso para parrilla o plancha; ideal para quienes buscan jugosidad."
  ,"Bife de chorizo 1kg": "Clásico para parrilla o plancha, servido en bifes gruesos."
  ,"Ojo de bife 1kg": "Ideal para parrilla o plancha; se destaca por su terneza y jugosidad."
  ,"Bife angosto 1kg": "Recomendado para parrilla, plancha o bifes a la criolla."
  ,"Cuadril 1kg": "Versátil para bifes, parrilla, plancha, horno o salteados."
  ,"Marucha 1kg": "Sabrosa y versátil para parrilla, plancha, horno o estofados."
};

function esProductoPorUnidad(nombre, categoria) {
  if (categoria === "⭐ OFERTA") return false;
  return PRODUCTOS_POR_UNIDAD.has(nombre);
}

function pasoProducto(nombre, categoria) {
  return esProductoPorUnidad(nombre, categoria) ? 1 : 0.5;
}

function mostrarCantidad(cantidad, nombre, categoria) {
  if (esProductoPorUnidad(nombre, categoria)) {
    return `${cantidad} un.`;
  }

  return `${cantidad} kg`;
}


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
  const empty = document.getElementById("carrito-empty");
  const badges = [
    document.getElementById("float-carrito-badge"),
    document.getElementById("header-carrito-badge")
  ].filter(Boolean);
  const headerTotal = document.getElementById("header-carrito-total");

  if (!cont) return;

  const totalUnidades = carrito.reduce((s, i) => s + i.cantidad, 0);
  const totalNum = carrito.reduce((s, i) => {
    if (i.categoria === "⭐ OFERTA") {
      const kg = kgDesdeNombre(i.nombre);
      return s + i.precio * Math.round(i.cantidad / kg);
    }
    return s + i.precio * i.cantidad;
  }, 0);

  badges.forEach(badge => {
    badge.textContent = totalUnidades;
    badge.style.display = totalUnidades > 0 ? "flex" : "none";
  });

  if (headerTotal) {
    headerTotal.textContent = "$ " + totalNum.toLocaleString("es-AR");
  }

  if (carrito.length === 0) {
    empty.style.display = "block";
    cont.innerHTML = "";
    total.textContent = "$ 0";
    actualizarEstadoMinimo(0);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    return;
  }

  empty.style.display = "none";

  cont.innerHTML = carrito.map((item, idx) => {
    const esOferta = item.categoria === "⭐ OFERTA";
    const esUnidad = esProductoPorUnidad(item.nombre, item.categoria);

    const step = esOferta
      ? kgDesdeNombre(item.nombre)
      : esUnidad
        ? 1
        : 0.5;

    const cantidadTexto = esUnidad
      ? `${item.cantidad} un.`
      : `${item.cantidad} kg`;

    const catLabel = esOferta
      ? `<span class="ci-cat" style="color:var(--red);font-weight:700">⭐ OFERTA</span>`
      : `<span class="ci-cat">${item.categoria}</span>`;

    let subtotal;

    if (esOferta) {
      const kg = kgDesdeNombre(item.nombre);
      const packs = Math.round(item.cantidad / kg);
      subtotal = item.precio * packs;
    } else {
      subtotal = item.precio * item.cantidad;
    }

    return `
    <div class="carrito-item">
      <div class="ci-info">
        <span class="ci-nombre">${item.nombre}</span>
        ${catLabel}
      </div>

      <div class="ci-controles">
        <button onclick="cambiarCantidad(${idx}, -${step})">−</button>
        <span>${cantidadTexto}</span>
        <button onclick="cambiarCantidad(${idx}, ${step})">+</button>
      </div>

      <div class="ci-precio">$ ${formatPrecio(subtotal)}</div>

      <button class="ci-borrar" onclick="eliminarItem(${idx})">✕</button>
    </div>`;
  }).join("");

  total.textContent = "$ " + totalNum.toLocaleString("es-AR");
  actualizarEstadoMinimo(totalNum);

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Deshabilita el botón de WhatsApp y muestra cuánto falta hasta el mínimo de compra
function actualizarEstadoMinimo(totalNum) {
  const btn = document.querySelector(".btn-finalizar");
  if (!btn) return;

  let msg = document.getElementById("carrito-minimo-msg");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "carrito-minimo-msg";
    msg.className = "carrito-minimo-msg";
    btn.parentNode.insertBefore(msg, btn);
  }

  const falta = MINIMO_COMPRA - totalNum;

  if (falta > 0) {
    btn.classList.add("disabled");
    btn.disabled = true;
    msg.style.display = "block";
    msg.textContent = `Te faltan $${falta.toLocaleString("es-AR")} para llegar al mínimo de compra ($${MINIMO_COMPRA.toLocaleString("es-AR")})`;
  } else {
    btn.classList.remove("disabled");
    btn.disabled = false;
    msg.style.display = "none";
  }
}

function agregarAlCarrito(btn, nombre, categoria, precio) {
  const step = pasoProducto(nombre, categoria);
  const existente = carrito.find(i => i.nombre === nombre);

  if (existente) {
    existente.cantidad = Math.round((existente.cantidad + step) * 10) / 10;
  } else {
    carrito.push({
      nombre,
      categoria,
      precio: Number(precio),
      cantidad: step
    });
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

  const cantidadTexto = mostrarCantidad(item.cantidad, nombre, categoria);

  cont.innerHTML = `
    <div class="prod-controles">
      <button onclick="restarEnTarjeta('${nombreEscapado}', '${categoria}', '${precio}')">−</button>
      <span>${cantidadTexto}</span>
      <button onclick="sumarEnTarjeta('${nombreEscapado}', '${categoria}', '${precio}')">+</button>
    </div>`;
}

function sumarEnTarjeta(nombre, categoria, precio) {
  const step = pasoProducto(nombre, categoria);
  const existente = carrito.find(i => i.nombre === nombre);

  if (existente) {
    existente.cantidad = Math.round((existente.cantidad + step) * 10) / 10;
  } else {
    carrito.push({
      nombre,
      categoria,
      precio: Number(precio),
      cantidad: step
    });
  }

  actualizarCarrito();
  animarBadge();
  actualizarControlTarjeta(nombre, categoria, precio);
}

function restarEnTarjeta(nombre, categoria, precio) {
  const step = pasoProducto(nombre, categoria);
  const idx = carrito.findIndex(i => i.nombre === nombre);
  if (idx === -1) return;

  carrito[idx].cantidad = Math.round((carrito[idx].cantidad - step) * 10) / 10;

  if (carrito[idx].cantidad <= 0) {
    carrito.splice(idx, 1);
  }

  actualizarCarrito();
  actualizarControlTarjeta(nombre, categoria, precio);
}

function animarBadge() {
  [
    document.getElementById("float-carrito-badge"),
    document.getElementById("header-carrito-badge")
  ].filter(Boolean).forEach(badge => {
    badge.classList.remove("badge-bump");
    void badge.offsetWidth;
    badge.classList.add("badge-bump");
  });
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

  const totalActual = carrito.reduce((s, i) => {
    if (i.categoria === "⭐ OFERTA") {
      const kg = kgDesdeNombre(i.nombre);
      return s + i.precio * Math.round(i.cantidad / kg);
    }
    return s + i.precio * i.cantidad;
  }, 0);

  if (totalActual < MINIMO_COMPRA) return;

  const lineas = carrito.map(i => {
    if (i.categoria === "⭐ OFERTA") {
      const kg = kgDesdeNombre(i.nombre);
      const packs = Math.round(i.cantidad / kg);
      return `• [OFERTA] ${i.nombre} x${packs} — $${formatPrecio(i.precio * packs)}`;
    }

    if (esProductoPorUnidad(i.nombre, i.categoria)) {
      const textoUnidad = i.cantidad === 1
        ? "1 unidad"
        : `${i.cantidad} unidades`;

      return `• ${i.nombre}: ${textoUnidad} — $${formatPrecio(i.precio * i.cantidad)}`;
    }

    return `• ${i.nombre}: ${i.cantidad} kg — $${formatPrecio(i.precio * i.cantidad)}`;
  }).join("\n");

  const totalNum = carrito.reduce((s, i) => {
    if (i.categoria === "⭐ OFERTA") {
      const kg = kgDesdeNombre(i.nombre);
      return s + i.precio * Math.round(i.cantidad / kg);
    }
    return s + i.precio * i.cantidad;
  }, 0);

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
  if (!todosLosProductos.length) return;
  const categorias = [...new Set(todosLosProductos.map(p => p.categoriaFiltro))];
  const urlCat = new URLSearchParams(window.location.search).get("cat");
  const cat = (urlCat && categorias.includes(urlCat)) ? urlCat : categorias[0];
  const filtrados = todosLosProductos.filter(p => p.categoriaFiltro === cat);
  document.getElementById("prod-grid").innerHTML = filtrados.map(tarjetaProducto).join("");
  carrito.forEach(item => actualizarControlTarjeta(item.nombre, item.categoria, item.precio));
}

// ---- PRODUCTOS ----

function tarjetaProducto(p) {
  const carpeta = CARPETA_IMG[p.categoria] || p.categoria.toLowerCase().replace(/[^a-z]/g, "");
  const imgProducto = p.imagen
    ? `assets/img/${carpeta}/${p.imagen}`
    : (IMG_CAT[p.categoria] || "assets/img/cat-vacuno.png");

  const nombreEscapado = p.nombre.replace(/'/g, "\\'");
  const id = "prod-" + p.nombre.replace(/[^a-zA-Z0-9]/g, "-");
  const unidadPrecio = esProductoPorUnidad(p.nombre, p.categoria) ? "/ unidad" : "/ kg";
  const recomendacion = vistaActual !== "list" ? RECOMENDACIONES_PRODUCTOS[p.nombre] : "";
  const recomendacionHtml = recomendacion
    ? `<p class="prod-recomendacion">${recomendacion}</p>`
    : "";

  return `
  <div class="prod-card">
    <div class="prod-thumb"><img src="${imgProducto}" alt="${p.nombre}"></div>
    <div class="prod-info">
      <div class="cat">${p.categoria}</div>
      <h4>${p.nombre}</h4>
      ${recomendacionHtml}
      <div class="prod-price"><span class="now">$ ${formatPrecio(p.precio)}</span><span class="kg">${unidadPrecio}</span></div>
      <div class="prod-cantidad" id="${id}">
        <button class="btn-agregar" onclick="agregarAlCarrito(this, '${nombreEscapado}', '${p.categoria}', '${p.precio}')">
          + Agregar al carrito
        </button>
      </div>
    </div>
  </div>`;
}

function renderFiltros(categorias, todos) {
  const grid = document.getElementById("prod-grid");
  if (!grid) return;

  const urlCat = new URLSearchParams(window.location.search).get("cat");
  const catActual = (urlCat && categorias.includes(urlCat)) ? urlCat : categorias[0];

  const selector = document.getElementById("vista-selector");

  if (vistaActual) {
    // Ya eligió antes — mostrar productos directamente
    if (selector) selector.style.display = "none";
    const filtrados = todos.filter(p => p.categoriaFiltro === catActual);
    grid.innerHTML = filtrados.map(tarjetaProducto).join("");
    aplicarVista(vistaActual);
    carrito.forEach(item => actualizarControlTarjeta(item.nombre, item.categoria, item.precio));
  } else {
    // Primera vez — mostrar selector, ocultar grid
    if (selector) selector.style.display = "flex";
    grid.innerHTML = "";
  }
}

function renderCarrusel(productos) {
  const track = document.getElementById("carrusel-track");
  if (!track) return;

  const urlCat = new URLSearchParams(window.location.search).get("cat");
  const categorias = [...new Set(productos.map(p => p.categoriaFiltro))];
  const categoriaActiva = window.location.pathname.includes("catalogo.html")
    ? ((urlCat && categorias.includes(urlCat)) ? urlCat : categorias[0])
    : null;

  const seleccionados = barajarProductos(
    categoriaActiva
      ? productos.filter(p => p.categoriaFiltro === categoriaActiva)
      : productos
  );

  pintarCarrusel(track, seleccionados, p => `abrirCategoria('${encodeURIComponent(p.categoriaFiltro)}')`);
}

function barajarProductos(productos) {
  const resultado = [...productos];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

function renderCarruselOfertas(combos) {
  const track = document.getElementById("carrusel-ofertas-track");
  if (!track) return;
  const seleccionados = [...combos].sort(() => Math.random() - 0.5);

  pintarCarrusel(track, seleccionados, () => `abrirOfertas()`, true);
}

// Pinta un carrusel infinito a partir de una lista de productos.
// onclickFn(p) debe devolver el string del atributo onclick para cada tarjeta.
// esOferta=true muestra badge "OFERTA" y precio del pack en vez de categoría.
function pintarCarrusel(track, productos, onclickFn, esOferta) {
  if (!productos.length) return;

  const items = [...productos, ...productos];
  const mostrarCategoria = !window.location.pathname.includes("catalogo.html");

  track.innerHTML = items.map(p => {
    const carpeta = CARPETA_IMG[p.categoria] || p.categoria.toLowerCase().replace(/[^a-z]/g, "");
    const img = p.imagen ? `assets/img/${carpeta}/${p.imagen}` : (IMG_CAT[p.categoria] || "assets/img/cat-vacuno.png");
    const catLabel = esOferta
      ? `<span class="carrusel-badge-oferta">🔥 OFERTA</span>`
      : (mostrarCategoria ? `<div class="carrusel-card-cat">${p.categoria}</div>` : "");
    const recomendacion = RECOMENDACIONES_PRODUCTOS[p.nombre];
    const recomendacionHtml = recomendacion
      ? `<p class="carrusel-card-recomendacion">${recomendacion}</p>`
      : "";

    return `
      <div class="carrusel-card" onclick="${onclickFn(p)}">
        <img class="carrusel-card-img" src="${img}" alt="${p.nombre}" onerror="this.onerror=null;this.src='assets/img/ganadera-logo.png'">
        <div class="carrusel-card-body">
          ${catLabel}
          <div class="carrusel-card-nombre">${p.nombre}</div>
          ${recomendacionHtml}
          ${esOferta ? `<div class="carrusel-card-precio">$ ${formatPrecio(p.precio)}</div>` : ""}
        </div>
      </div>`;
  }).join("");

  iniciarCarruselInteractivo(track);

  const section = track.closest(".carrusel-section");
  if (section) section.classList.add("loaded");
}

function iniciarCarruselInteractivo(track) {
  const wrap = track.parentElement;
  const section = track.closest(".carrusel-section");
  if (!wrap || !section || wrap.dataset.carruselListo) return;

  wrap.dataset.carruselListo = "true";
  wrap.tabIndex = 0;
  wrap.setAttribute("aria-label", "Carrusel de productos");

  const anterior = document.createElement("button");
  anterior.type = "button";
  anterior.className = "carrusel-nav-btn carrusel-nav-prev";
  anterior.setAttribute("aria-label", "Productos anteriores");
  anterior.innerHTML = "&#10094;";

  const siguiente = document.createElement("button");
  siguiente.type = "button";
  siguiente.className = "carrusel-nav-btn carrusel-nav-next";
  siguiente.setAttribute("aria-label", "Productos siguientes");
  siguiente.innerHTML = "&#10095;";

  section.append(anterior, siguiente);

  let autoplayTimer;
  let resumeTimer;
  let normalizarTimer;
  let arrastrando = false;
  let arrastreInicioX = 0;
  let scrollInicio = 0;
  let bloqueoClickHasta = 0;

  const mitadCarrusel = () => track.scrollWidth / 2;
  const distanciaPaso = () => {
    const visibles = Math.max(1, Math.floor(wrap.clientWidth / 280));
    return Math.min(visibles, 3) * 280;
  };

  function normalizarPosicion() {
    const mitad = mitadCarrusel();
    if (!mitad) return;
    if (wrap.scrollLeft >= mitad) wrap.scrollLeft -= mitad;
  }

  function moverCarrusel(direccion) {
    const mitad = mitadCarrusel();
    const distancia = distanciaPaso();

    if (direccion < 0 && wrap.scrollLeft < distancia) {
      wrap.scrollLeft += mitad;
    } else if (direccion > 0 && wrap.scrollLeft >= mitad - distancia) {
      wrap.scrollLeft -= mitad;
    }

    wrap.scrollBy({ left: direccion * distancia, behavior: "smooth" });
  }

  function pausarAutoplay() {
    clearInterval(autoplayTimer);
    clearTimeout(resumeTimer);
  }

  function iniciarAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => moverCarrusel(1), 4500);
  }

  function reanudarAutoplay() {
    pausarAutoplay();
    resumeTimer = setTimeout(iniciarAutoplay, 3500);
  }

  anterior.addEventListener("click", () => {
    pausarAutoplay();
    moverCarrusel(-1);
    reanudarAutoplay();
  });

  siguiente.addEventListener("click", () => {
    pausarAutoplay();
    moverCarrusel(1);
    reanudarAutoplay();
  });

  wrap.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      pausarAutoplay();
      moverCarrusel(e.key === "ArrowLeft" ? -1 : 1);
      reanudarAutoplay();
    }
  });

  wrap.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    arrastrando = true;
    arrastreInicioX = e.clientX;
    scrollInicio = wrap.scrollLeft;
    wrap.classList.add("is-dragging");
    wrap.setPointerCapture(e.pointerId);
    pausarAutoplay();
  });

  wrap.addEventListener("pointermove", e => {
    if (!arrastrando) return;
    const desplazamiento = e.clientX - arrastreInicioX;
    if (Math.abs(desplazamiento) > 5) {
      bloqueoClickHasta = Date.now() + 250;
    }
    wrap.scrollLeft = scrollInicio - desplazamiento;
    e.preventDefault();
  });

  const terminarArrastre = e => {
    if (!arrastrando) return;
    arrastrando = false;
    wrap.classList.remove("is-dragging");
    if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
    reanudarAutoplay();
  };

  wrap.addEventListener("pointerup", terminarArrastre);
  wrap.addEventListener("pointercancel", terminarArrastre);

  wrap.addEventListener("click", e => {
    if (Date.now() < bloqueoClickHasta) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  wrap.addEventListener("touchstart", pausarAutoplay, { passive: true });
  wrap.addEventListener("touchend", reanudarAutoplay, { passive: true });
  wrap.addEventListener("touchcancel", reanudarAutoplay, { passive: true });

  section.addEventListener("mouseenter", pausarAutoplay);
  section.addEventListener("mouseleave", reanudarAutoplay);

  wrap.addEventListener("scroll", () => {
    clearTimeout(normalizarTimer);
    normalizarTimer = setTimeout(normalizarPosicion, 140);
  }, { passive: true });

  iniciarAutoplay();
}

function abrirOfertas() {
  document.getElementById("ofertas-cols")?.scrollIntoView({ behavior: "smooth" });
}

function abrirCategoria(cat) {
  const decoded = decodeURIComponent(cat);
  const urlCat = new URLSearchParams(window.location.search).get("cat");
  if (urlCat === decoded) {
    document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = `catalogo.html?cat=${encodeURIComponent(decoded)}#productos`;
  }
}

// ---- OFERTAS (combos por columna de categoría origen) ----

// Mapa: nombre de combo → categoría a la que pertenece para agrupar en columnas
// Detecta por palabras clave en el nombre del producto
function categoriaCombo(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes("pollo") || n.includes("pata") || n.includes("muslo") || n.includes("suprema") || n.includes("alita")) return "Pollo";
  if (n.includes("cerdo") || n.includes("carre") || n.includes("bondiola") || n.includes("matambrito")) return "Cerdo";
  if (n.includes("milanesa") || n.includes("rebozada") || n.includes("hamburguesa") || n.includes("nugget")) return "Elaborados";
  return "Vacuno"; // default: vacuno
}

// Extrae el gramaje del nombre (ej "3kg", "2kg", "1kg") → devuelve número
function kgDesdeNombre(nombre) {
  const match = nombre.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  return match ? parseFloat(match[1].replace(",", ".")) : 1;
}

function tarjetaOferta(p) {
  const kg = kgDesdeNombre(p.nombre);
  const nombreEscapado = p.nombre.replace(/'/g, "\\'");
  const id = "oferta-" + p.nombre.replace(/[^a-zA-Z0-9]/g, "-");
  const item = carrito.find(i => i.nombre === p.nombre);

  const btnHtml = item
    ? `<div class="oferta-controles" id="${id}">
        <button onclick="restarOferta('${nombreEscapado}', '${p.precio}', ${kg})">−</button>
        <span>${item.cantidad} kg</span>
        <button onclick="sumarOferta('${nombreEscapado}', '${p.precio}', ${kg})">+</button>
       </div>`
    : `<button class="btn-oferta" id="${id}" onclick="agregarOferta('${nombreEscapado}', '${p.precio}', ${kg})">+ Agregar al carrito</button>`;

  return `
  <div class="oferta-item">
    <span class="oferta-badge">🔥 OFERTA</span>
    <div class="oferta-nombre">${p.nombre}</div>
    <div class="oferta-detalle">Pack de ${kg} kg</div>
    <div class="oferta-precio">$ ${formatPrecio(p.precio)} <span>/ pack</span></div>
    ${btnHtml}
  </div>`;
}

function agregarOferta(nombre, precio, kg) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad = Math.round((existente.cantidad + kg) * 10) / 10;
  } else {
    carrito.push({ nombre, categoria: "⭐ OFERTA", precio: Number(precio), cantidad: kg });
  }
  actualizarCarrito();
  animarBadge();
  actualizarControlOferta(nombre, precio, kg);
}

function sumarOferta(nombre, precio, kg) { agregarOferta(nombre, precio, kg); }

function restarOferta(nombre, precio, kg) {
  const idx = carrito.findIndex(i => i.nombre === nombre);
  if (idx === -1) return;
  carrito[idx].cantidad = Math.round((carrito[idx].cantidad - kg) * 10) / 10;
  if (carrito[idx].cantidad <= 0) carrito.splice(idx, 1);
  actualizarCarrito();
  actualizarControlOferta(nombre, precio, kg);
}

function actualizarControlOferta(nombre, precio, kg) {
  const id = "oferta-" + nombre.replace(/[^a-zA-Z0-9]/g, "-");
  const cont = document.getElementById(id);
  if (!cont) return;
  const nombreEscapado = nombre.replace(/'/g, "\\'");
  const item = carrito.find(i => i.nombre === nombre);
  if (!item) {
    cont.outerHTML = `<button class="btn-oferta" id="${id}" onclick="agregarOferta('${nombreEscapado}', '${precio}', ${kg})">+ Agregar al carrito</button>`;
  } else {
    cont.outerHTML = `<div class="oferta-controles" id="${id}">
      <button onclick="restarOferta('${nombreEscapado}', '${precio}', ${kg})">−</button>
      <span>${item.cantidad} kg</span>
      <button onclick="sumarOferta('${nombreEscapado}', '${precio}', ${kg})">+</button>
    </div>`;
  }
}

function renderOfertas(combos) {
  const cont = document.getElementById("ofertas-cols");
  if (!cont) return;

  const grupos = {};
  combos.forEach(p => {
    const cat = categoriaCombo(p.nombre);
    if (!grupos[cat]) grupos[cat] = [];
    grupos[cat].push(p);
  });

  const orden = ["Vacuno", "Pollo", "Cerdo", "Elaborados"];
  const cats = orden.filter(c => grupos[c]);
  Object.keys(grupos).forEach(c => { if (!cats.includes(c)) cats.push(c); });

  cont.innerHTML = cats.map(cat => `
    <div>
      <div class="oferta-col-titulo" onclick="toggleOfertaCol(this)">
        ${cat}
        <span class="acord-arrow">▼</span>
      </div>
      <div class="oferta-col-body">
        ${grupos[cat].map(tarjetaOferta).join("")}
      </div>
    </div>
  `).join("");
}

function toggleOfertaCol(titulo) {
  titulo.classList.toggle("open");
  titulo.nextElementSibling.classList.toggle("open");
}

async function renderProductos() {
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    todosLosProductos = parseCSV(text);

    // Separo combos (van a ofertas) del resto (van al catálogo)
    const combos = todosLosProductos.filter(p => p.categoria === "Combos");
    const sinCombos = todosLosProductos.filter(p => p.categoria !== "Combos");

    // Calculo a qué botón de filtro (categoriaFiltro) pertenece cada producto,
    // agrupando según GRUPOS donde corresponda
    sinCombos.forEach(p => {
      let filtro = p.categoria;
      for (const [grupo, miembros] of Object.entries(GRUPOS)) {
        if (miembros.includes(p.categoria)) { filtro = grupo; break; }
      }
      p.categoriaFiltro = filtro;
    });

    // Orden fijo del nav para los botones de filtro
    const ORDEN_CATS = ["Vacuno", "Cerdo", "Pollo", "Elaborados", "EmbutidosAchuras", "FiambreriaAlmacen"];
    const presentes = new Set(sinCombos.map(p => p.categoriaFiltro));
    const categorias = ORDEN_CATS.filter(c => presentes.has(c));
    // Por si aparece alguna categoría nueva no contemplada en ORDEN_CATS
    presentes.forEach(c => { if (!categorias.includes(c)) categorias.push(c); });

    const cont = document.getElementById("prod-grid");
    if (cont) renderFiltros(categorias, sinCombos);
    
    initBuscador([...sinCombos, ...combos]);
    renderCarrusel(sinCombos);
    renderCarruselOfertas(combos);
    renderOfertas(combos);
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


function toggleMenu() {
  const nav = document.getElementById("main-nav");
  if (nav) nav.classList.toggle("nav-open");
}

// ---- BANNER SLIDER ----
const bannerState = {};

function initBanner(id) {
  const el = document.getElementById(id);
  if (!el) return;
  bannerState[id] = { current: 0, total: el.querySelectorAll('.banner-slide').length };
  let startX = 0;
  el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) moverBanner(id, dx < 0 ? 1 : -1);
  });
  setInterval(() => moverBanner(id, 1), 4500);
}

function moverBanner(id, dir) {
  const s = bannerState[id];
  if (!s) return;
  s.current = (s.current + dir + s.total) % s.total;
  irASlide(id, s.current);
}

function irASlide(id, idx) {
  const s = bannerState[id];
  if (!s) return;
  s.current = idx;
  document.getElementById(id + '-track').style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('#' + id + '-dots span').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ---- BUSCADOR ----
let fuseBuscador = null;

function initBuscador(productos) {
  const Fuse = window.Fuse;
  if (!Fuse) return;
  fuseBuscador = new Fuse(productos, {
    keys: ["nombre", "categoria"],
    threshold: 0.35,
    minMatchCharLength: 2,
  });

  document.querySelectorAll(".search input").forEach(input => {
    const wrapper = input.closest(".search");
    let dropdown = wrapper.querySelector(".search-dropdown");
    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.className = "search-dropdown";
      wrapper.appendChild(dropdown);
    }

    input.addEventListener("input", () => {
      const q = input.value.trim();
      if (q.length < 2) { dropdown.innerHTML = ""; dropdown.style.display = "none"; return; }
      const resultados = fuseBuscador.search(q).slice(0, 8);
      if (!resultados.length) {
        dropdown.innerHTML = `<div class="search-noresult">Sin resultados para "${q}"</div>`;
        dropdown.style.display = "block";
        return;
      }
      dropdown.innerHTML = resultados.map(r => {
        const p = r.item;
        const esCombo = p.categoria === "Combos";
        const label = esCombo ? "Oferta" : ({ "EmbutidosAchuras": "Embutidos y Achuras", "FiambreriaAlmacen": "Fiambrería y Almacén" }[p.categoriaFiltro] || p.categoriaFiltro || p.categoria);
        return `<div class="search-item" onclick="irAProducto('${encodeURIComponent(p.nombre)}','${encodeURIComponent(p.categoriaFiltro || p.categoria)}',${esCombo})">
          <span class="search-item-nombre">${p.nombre}</span>
          <span class="search-item-cat">${label}</span>
        </div>`;
      }).join("");
      dropdown.style.display = "block";
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const q = input.value.trim();
        if (!q) return;
        const res = fuseBuscador ? fuseBuscador.search(q) : [];
        if (res.length) {
          const p = res[0].item;
          irAProducto(encodeURIComponent(p.nombre), encodeURIComponent(p.categoriaFiltro || p.categoria), p.categoria === "Combos");
        }
        dropdown.innerHTML = ""; dropdown.style.display = "none";
      }
      if (e.key === "Escape") { dropdown.innerHTML = ""; dropdown.style.display = "none"; }
    });

    document.addEventListener("click", e => {
      if (!wrapper.contains(e.target)) { dropdown.innerHTML = ""; dropdown.style.display = "none"; }
    });
  });

  document.querySelectorAll(".search button").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.closest(".search").querySelector("input");
      const q = input?.value.trim();
      if (!q || !fuseBuscador) return;
      const res = fuseBuscador.search(q);
      if (res.length) {
        const p = res[0].item;
        irAProducto(encodeURIComponent(p.nombre), encodeURIComponent(p.categoriaFiltro || p.categoria), p.categoria === "Combos");
      }
    });
  });
}

function irAProducto(nombreEnc, catEnc, esCombo) {
  const nombre = decodeURIComponent(nombreEnc);
  const cat = decodeURIComponent(catEnc);

  document.querySelectorAll(".search input").forEach(i => i.value = "");
  document.querySelectorAll(".search-dropdown").forEach(d => { d.innerHTML = ""; d.style.display = "none"; });

  // Los combos/ofertas viven en ofertas.html, no en catalogo.html
  if (esCombo) {
    const estaEnOfertas = window.location.pathname.includes("ofertas.html");
    if (estaEnOfertas) {
      highlightProducto(nombre, true);
    } else {
      window.location.href = `ofertas.html?producto=${encodeURIComponent(nombre)}`;
    }
    return;
  }

  const estaEnCatalogo = window.location.pathname.includes("catalogo.html");
  const urlCatActual = new URLSearchParams(window.location.search).get("cat");

  if (estaEnCatalogo && urlCatActual === cat) {
    highlightProducto(nombre);
  } else {
    window.location.href = `catalogo.html?cat=${encodeURIComponent(cat)}&producto=${encodeURIComponent(nombre)}`;
  }
}

function highlightProducto(nombre, esCombo) {
  setTimeout(() => {
    const prefix = esCombo ? "oferta-" : "prod-";
    const claseCard = esCombo ? ".oferta-item" : ".prod-card";
    const id = prefix + nombre.replace(/[^a-zA-Z0-9]/g, "-");
    const card = document.getElementById(id)?.closest(claseCard) || document.getElementById(id);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    const info = esCombo ? card : card.querySelector(".prod-info");
    if (!info) return;
    info.style.transition = "background 0.3s ease, border-top 0.3s ease";
    info.style.background = "#fff8f5";
    info.style.borderTop = "2px solid #e34b00";
    setTimeout(() => {
      info.style.transition = "background 1.5s ease, border-top 1.5s ease";
      info.style.background = "";
      info.style.borderTop = "";
    }, 2500);
  }, 600);
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  renderProductos();
  setFloatWhatsApp();
  initHeroDots();
  document.getElementById("carrito-overlay").addEventListener("click", cerrarCarrito);
  ['banner-home','banner-mayorista'].forEach(initBanner);

  // ---- NAV ACTIVO ----
  const urlCat = new URLSearchParams(window.location.search).get("cat");
  const pagina = window.location.pathname.split("/").pop();
  document.querySelectorAll(".main-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;
    if (urlCat && href.includes(`cat=${urlCat}`)) {
      a.classList.add("nav-active");
    } else if (!urlCat && href === pagina) {
      a.classList.add("nav-active");
    }
  });

  // ---- TÍTULO CATEGORÍA ----
  const tituloCat = document.getElementById("catalogo-titulo-texto");
  if (tituloCat && urlCat) {
    const label = {
      "EmbutidosAchuras": "Embutidos y Achuras",
      "FiambreriaAlmacen": "Fiambrería y Almacén"
    }[urlCat] || urlCat;
    tituloCat.textContent = label;
  }

  // ---- HIGHLIGHT PRODUCTO ----
  const urlProd = new URLSearchParams(window.location.search).get("producto");
  if (urlProd) highlightProducto(decodeURIComponent(urlProd), window.location.pathname.includes("ofertas.html"));
});

(function initSteps(){
  const steps = [0,1,2,3].map(i => document.getElementById('env-step-'+i));
  if(!steps[0]) return;
  let cur = 0;
  function activate(i){
    steps.forEach((s,j)=>{
      s.classList.remove('active','done');
      if(j<i) s.classList.add('done');
      if(j===i) s.classList.add('active');
    });
  }
  activate(0);
  setInterval(()=>{ cur=(cur+1)%steps.length; activate(cur); },2200);
})();

