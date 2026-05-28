# Web Ganadera Panamericana — Maqueta (front-end)

Catálogo de carnes con pedido por WhatsApp. Front-end estático (HTML + CSS + JS), sin backend ni pagos online.

## Cómo verla
Opción simple: doble clic en `index.html`.
Opción recomendada en VS Code: clic derecho sobre `index.html` → **Open with Live Server** (extensión Live Server). Live Server SÍ funciona acá porque es HTML/CSS/JS puro.

## Estructura
```
web-ganadera/
├── index.html              ← página principal
├── assets/
│   ├── css/style.css       ← todos los estilos (colores y fuentes de la marca)
│   ├── js/main.js          ← catálogo de productos + links de WhatsApp
│   └── img/                ← imágenes reales (logo, cortes, banner, íconos)
└── README.md
```

## Cómo editar lo más común

### Cambiar el número de WhatsApp
En `assets/js/main.js`, primera línea de config:
```js
const WHATSAPP_NUMERO = "5491100000000";  // poné el número real
```
Formato: código de país + área + número, sin `+`, espacios ni guiones.
Ej: (11) 5555-4444 → `5491155554444`

### Agregar / editar productos
En `assets/js/main.js`, editá el array `PRODUCTOS`. Cada producto es una línea:
```js
{ cat:"Vacuno", nombre:"Bife de Chorizo", unidad:"x kg", precio:"8.990", tag:"OFERTA", img:"assets/img/cat-vacuno.png" },
```
- `tag` es opcional (poné `""` si no querés etiqueta).
- Las tarjetas se generan solas, no hay que tocar el HTML.

### Cambiar colores o fuentes
En `assets/css/style.css`, arriba de todo está el bloque `:root` con las variables:
```css
--color-store:#061c5d;   /* azul principal */
--red:#e34b00;           /* acento */
```

## Notas
- Colores, logo, tipografías e imágenes de cortes son los **reales** del sitio original.
- Los productos y precios son **placeholder** hasta cargar los datos reales de la base de datos.
- El botón "Pedir por WhatsApp" abre el chat con un mensaje pre-cargado con el producto.
