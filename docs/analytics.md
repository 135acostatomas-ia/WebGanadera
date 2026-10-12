# Medición del recorrido web (GA4)

Propiedad: ganadera-panamericana. Flujo: Web Ganadera Panamericana.
ID: G-EBHKW86KJP.

## Qué registra
Todas las páginas HTML cargan la etiqueta una sola vez.
- page_view: visitas (Google tag).
- view_item: apertura del detalle.
- add_to_cart / remove_from_cart: cambios reales en cantidades, desde tarjetas, detalle, ofertas y drawer.
- cart_created: carrito que pasa de vacío a tener productos.
- view_cart: apertura del carrito.
- whatsapp_click: source=cart_checkout incluye productos, cantidades, total estimado ARS y modalidad; source=floating_button/link es una consulta general.
Los kilos se expresan como cantidades decimales, las piezas como unidades y las ofertas como packs. El valor coincide con los subtotales de la web. Las recargas y cambios de precio no se cuentan como adiciones.

## Publicación y comprobación
La carga remota solo se activa en ganaderapanamericana.com y www.ganaderapanamericana.com.
En localhost/preview los eventos quedan en window.dataLayer para inspección sin contaminar las estadísticas reales.
Publicar estos archivos por el proceso habitual del sitio. Abrir el sitio público, agregar y quitar productos, abrir el carrito y finalizar un pedido válido.
Comprobar en Analytics > Informes > Tiempo real o con Tag Assistant/DebugView. Los informes habituales no son inmediatos.
Marcar whatsapp_click como evento clave. Para conversiones exclusivamente desde carrito, crear un evento whatsapp_cart_click derivado de whatsapp_click con source igual a cart_checkout y marcar ese evento como clave.
Crear una exploración de embudo: page_view → add_to_cart → view_cart → whatsapp_click (source=cart_checkout).
Crear dimensiones personalizadas de evento para source y modalidad si se necesitan en exploraciones.

## Alcance
Un clic en WhatsApp no confirma que se envió el mensaje ni una compra: no se emite purchase.
GA4 permite analizar el recorrido y productos; no es un listado persistente de cada carrito ni garantiza registrar todos los visitantes (bloqueadores/consentimiento).
Firestore no se utiliza en este cambio. Para un panel individual de carritos hace falta una integración separada con permisos de administración y configuración Firebase.
No se envían campos de formularios, nombres de clientes, teléfonos ni texto del mensaje en los eventos propios. Los enlaces externos automáticos de Medición mejorada pueden incluir URL: revisar esa opción antes de incorporar datos personales en enlaces.
Conservar la configuración de consentimiento existente y revisar su integración si se incorpora un gestor de cookies.

## Validación realizada
Parseo de ambos scripts y pruebas con mocks: kilos, incrementos, bajas, packs, cambios de precio, recarga de carrito y snapshot al ir a WhatsApp; carga solo en dominio de producción y evento de enlace sin número/texto.
No se verificó tráfico real a GA4 ni navegación completa en navegador: requiere publicar y comprobar en la propiedad.
