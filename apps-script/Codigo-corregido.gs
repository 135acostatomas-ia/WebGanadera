// =====================================================================
// Ganadera Panamericana — Apps Script receptor de formularios
// Recibe POSTs desde el sitio web y escribe en Google Sheets.
//
// Para desplegar: Extensiones → Apps Script → pegar este archivo →
//   Implementar → Nueva implementación → Aplicación web
//   Ejecutar como: Yo | Acceso: Cualquier usuario
// =====================================================================

var ID_PLANILLA    = '1aEl0LaYAEYcL9wgWE6CnHcSJeB5bXAdupoS8VPNZ5Jk';
var HOJA_MAYORISTA = 'Consultas Mayoristas';
var HOJA_LOCALIDAD = 'Localidades sugeridas';

// ---------------------------------------------------------------------
// limpiar(v, max)
//   Convierte a string, recorta espacios y trunca al largo máximo.
//   Si el texto empieza con = + - @ antepone ' para que Sheets no lo
//   interprete como fórmula (evita CSV/formula injection).
// ---------------------------------------------------------------------
function limpiar(v, max) {
  var s = String(v == null ? '' : v).trim();
  if (s.length > max) s = s.substring(0, max);
  if (s.length > 0 && '=+-@'.indexOf(s.charAt(0)) !== -1) s = "'" + s;
  return s;
}

// ---------------------------------------------------------------------
// doPost — punto de entrada único
// ---------------------------------------------------------------------
function doPost(e) {
  var cuerpo = (e.postData && e.postData.contents) ? e.postData.contents : '';

  // Rechazá cuerpos demasiado grandes antes de parsear
  if (cuerpo.length >= 5000) {
    return responder({ ok: false, error: 'payload_too_large' });
  }

  var datos;
  try {
    datos = JSON.parse(cuerpo);
  } catch (err) {
    return responder({ ok: false, error: 'json_invalido' });
  }

  // Solo tipos conocidos
  var tipo = String(datos.tipo || '').trim();
  if (tipo !== 'localidad' && tipo !== 'mayorista') {
    return responder({ ok: false, error: 'tipo_invalido' });
  }

  // Honeypot: si el campo "web" tiene contenido es un bot.
  // Respondemos ok:true para no revelar el filtro.
  var web = String(datos.web || '').trim();
  if (web !== '') return responder({ ok: true });

  // Adquirimos el lock solo cuando vamos a escribir
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (tipo === 'localidad') {
      guardarLocalidad(datos);
    } else {
      guardarMayorista(datos);
    }
    return responder({ ok: true });
  } catch (error) {
    return responder({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------
// doGet — verificación de que el servicio está activo
// ---------------------------------------------------------------------
function doGet() {
  return responder({ ok: true, estado: 'Servicio activo' });
}

// ---------------------------------------------------------------------
// guardarMayorista
// ---------------------------------------------------------------------
function guardarMayorista(d) {
  var nombre    = limpiar(d.nombre,    100);
  var localidad = limpiar(d.localidad, 100);
  var telefono  = limpiar(d.telefono,   30);
  var productos = limpiar(d.productos, 500);
  var otros     = limpiar(d.otros,     500);
  var info      = limpiar(d.info,      500);

  if (!nombre)   throw new Error('nombre_requerido');
  if (!telefono) throw new Error('telefono_requerido');

  var ss   = SpreadsheetApp.openById(ID_PLANILLA);
  var hoja = ss.getSheetByName(HOJA_MAYORISTA) || ss.getSheets()[0];
  var id   = 'M-' + Utilities.formatDate(new Date(), 'America/Argentina/Buenos_Aires', 'yyyyMMdd-HHmmss');

  hoja.appendRow([
    id,
    new Date(),
    nombre,
    localidad,
    "'" + telefono.replace(/^'+/, ''),  // siempre exactamente un ' de prefijo
    productos,
    otros,
    info,
    'Sin contactar',
    ''
  ]);
}

// ---------------------------------------------------------------------
// guardarLocalidad
//   Si la localidad ya existe en la hoja, actualiza fecha y contador
//   en vez de agregar una fila nueva.
// ---------------------------------------------------------------------
function guardarLocalidad(d) {
  var ss   = SpreadsheetApp.openById(ID_PLANILLA);
  var hoja = ss.getSheetByName(HOJA_LOCALIDAD);
  if (!hoja) {
    hoja = ss.insertSheet(HOJA_LOCALIDAD);
    hoja.appendRow(['Fecha y hora', 'Localidad sugerida', 'Pagina', 'Veces sugerida']);
    hoja.getRange(1, 1, 1, 4).setFontWeight('bold');
    hoja.setFrozenRows(1);
  }

  var localidad = limpiar(d.localidad, 100);
  var pagina    = limpiar(d.pagina,    100);

  if (!localidad) throw new Error('localidad_requerida');

  // Deduplicación: si ya existe, incrementa el conteo
  var valores = hoja.getDataRange().getValues();
  for (var i = 1; i < valores.length; i++) {
    if (String(valores[i][1]).trim().toLowerCase() === localidad.toLowerCase()) {
      hoja.getRange(i + 1, 1).setValue(new Date());
      hoja.getRange(i + 1, 4).setValue((Number(valores[i][3]) || 1) + 1);
      return;
    }
  }
  hoja.appendRow([new Date(), localidad, pagina, 1]);
}

// ---------------------------------------------------------------------
// responder — helper interno
// ---------------------------------------------------------------------
function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
