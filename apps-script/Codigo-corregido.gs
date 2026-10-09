// =====================================================================
// Ganadera Panamericana — Apps Script receptor de formularios
// Recibe POSTs desde el sitio web y escribe en Google Sheets.
//
// INSTRUCCIONES:
//   1. Reemplazá ID_PLANILLA con el ID real de tu planilla.
//   2. Verificá que los nombres de las pestañas coincidan con los de
//      tu planilla (ver constantes HOJA_LOCALIDAD y HOJA_MAYORISTA).
//   3. Desplegá como "Aplicación web" → Ejecutar como: Yo,
//      Acceso: Cualquier usuario.
// =====================================================================

var ID_PLANILLA   = "TU_ID_DE_PLANILLA_AQUI"; // ← reemplazá este valor
var HOJA_LOCALIDAD = "Localidades";
var HOJA_MAYORISTA = "Mayoristas";

// ---------------------------------------------------------------------
// limpiar(v, max)
//   - Convierte a string y recorta espacios.
//   - Trunca al largo máximo para evitar celdas gigantes.
//   - Si el texto empieza con = + - @ lo prefija con ' para que Sheets
//     no lo interprete como fórmula (CSV injection).
// ---------------------------------------------------------------------
function limpiar(v, max) {
  var s = String(v == null ? "" : v).trim();
  if (s.length > max) s = s.substring(0, max);
  if (s.length > 0 && "=+-@".indexOf(s.charAt(0)) !== -1) s = "'" + s;
  return s;
}

// ---------------------------------------------------------------------
// doPost — punto de entrada único
// ---------------------------------------------------------------------
function doPost(e) {
  var respOk    = ContentService.createTextOutput(JSON.stringify({ ok: true }))
                    .setMimeType(ContentService.MimeType.JSON);
  var respError = function(msg) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: msg }))
                         .setMimeType(ContentService.MimeType.JSON);
  };

  try {
    var cuerpo = e.postData && e.postData.contents ? e.postData.contents : "";

    // Rechazá cuerpos demasiado grandes (≥ 5 000 caracteres)
    if (cuerpo.length >= 5000) return respError("payload_too_large");

    var datos = JSON.parse(cuerpo);
    var tipo  = String(datos.tipo || "").trim();

    // Solo tipos conocidos
    if (tipo !== "localidad" && tipo !== "mayorista") {
      return respError("tipo_invalido");
    }

    // Honeypot: si el campo "web" tiene contenido es un bot.
    // Devolvemos ok:true para no revelar el filtro.
    var web = String(datos.web || "").trim();
    if (web !== "") return respOk;

    var ss   = SpreadsheetApp.openById(ID_PLANILLA);
    var lock = LockService.getScriptLock();
    lock.waitLock(10000); // espera hasta 10 s para evitar escrituras simultáneas

    try {
      if (tipo === "localidad") {
        _guardarLocalidad(ss, datos);
      } else {
        _guardarMayorista(ss, datos);
      }
    } finally {
      lock.releaseLock();
    }

    return respOk;

  } catch (err) {
    return respError(err.message || "error_interno");
  }
}

// ---------------------------------------------------------------------
// _guardarLocalidad
// ---------------------------------------------------------------------
function _guardarLocalidad(ss, datos) {
  var localidad = limpiar(datos.localidad, 100);
  var pagina    = limpiar(datos.pagina,    100);

  if (!localidad) throw new Error("localidad_requerida");

  var hoja  = ss.getSheetByName(HOJA_LOCALIDAD);
  var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  hoja.appendRow([fecha, localidad, pagina]);
}

// ---------------------------------------------------------------------
// _guardarMayorista
// ---------------------------------------------------------------------
function _guardarMayorista(ss, datos) {
  var nombre    = limpiar(datos.nombre,    100);
  var localidad = limpiar(datos.localidad, 100);
  var telefono  = limpiar(datos.telefono,   30);
  var productos = limpiar(datos.productos, 500);
  var otros     = limpiar(datos.otros,     500);
  var info      = limpiar(datos.info,      500);

  if (!nombre)    throw new Error("nombre_requerido");
  if (!telefono)  throw new Error("telefono_requerido");

  // Prefijo apóstrofe para que Sheets no interprete el teléfono como número
  var telefonoSheet = "'" + telefono.replace(/^'+/, "");

  var hoja  = ss.getSheetByName(HOJA_MAYORISTA);
  var fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  hoja.appendRow([fecha, nombre, localidad, telefonoSheet, productos, otros, info]);
}
