# Web Ganadera Panamericana — Maqueta (front-end)

Catálogo de carnes con pedido por WhatsApp. Front-end estático (HTML + CSS + JS), sin backend ni pagos online.

## Cómo verla
En VS Code: clic derecho sobre `index.html` → **Open with Live Server** (extensión Live Server). Usá un servidor HTTP local para que el navegador pueda cargar `assets/data/catalogo.csv`.

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
Editá `assets/data/catalogo.csv` mediante Codex y GitHub. Es la fuente del catálogo; Google Sheets ya no se consulta para cargar productos ni precios.
```csv
nombre,categoria,precio,imagen
```
- Conservá el encabezado, la codificación UTF-8 y el orden de las columnas. Los precios se escriben sin separadores de miles ni símbolo `$`; representan el precio por kilo, unidad o pack según las reglas actuales del producto.
- Cada fila contiene un producto. La categoría `Combos` lo publica en ofertas. Una fila sin nombre, categoría o precio no se muestra. Los campos que contienen comas deben ir entre comillas dobles.
- `imagen` contiene el nombre del archivo en la carpeta de su categoría dentro de `assets/img/`. Las asignaciones de `IMAGENES_PRODUCTOS` en `assets/js/main.js` tienen prioridad sobre esa columna.
- Los nombres también identifican imágenes, recomendaciones, preparaciones y reglas de venta por unidad/peso en `main.js`. Antes de renombrar o agregar un producto, revisá esas asociaciones. Las categorías agrupadas y carpetas se configuran en `GRUPOS` y `CARPETA_IMG`.
- Las tarjetas se generan solas, no hay que tocar el HTML. Antes de publicar, revisá el diff de datos y comprobá catálogo, buscador, imágenes, ofertas y carrito con el servidor local.

El CSV inicial es una copia exacta de la publicación de Google Sheets consultada el 11/10/2026: 164 registros, incluidos 24 combos. No se corrigieron ni actualizaron precios durante la migración. La planilla original se conserva intacta como histórico.

Los formularios de mayoristas y sugerencias de localidades siguen usando el endpoint de Google Apps Script (`FORMS_URL`); su tratamiento es independiente de la fuente del catálogo.

### Cambiar colores o fuentes
En `assets/css/style.css`, arriba de todo está el bloque `:root` con las variables:
```css
--color-store:#061c5d;   /* azul principal */
--red:#e34b00;           /* acento */
```

## Notas
- Colores, logo, tipografías e imágenes de cortes son los **reales** del sitio original.
- Los productos y precios se cargan desde `assets/data/catalogo.csv`.
- El botón "Pedir por WhatsApp" abre el chat con un mensaje pre-cargado con el producto.
