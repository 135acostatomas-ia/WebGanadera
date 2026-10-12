// Google Analytics 4 — recorrido del catálogo y consultas por WhatsApp.
(function () {
  "use strict";
  const measurementId = "G-EBHKW86KJP";
  const production = /^(www\.)?ganaderapanamericana\.com$/.test(location.hostname);
  const debug = !production;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (production) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    document.head.appendChild(script);
  }
  window.ganaderaTrack = function (event, params) {
    try {
      // Local/preview: inspect dataLayer without sending test traffic to production.
      window.gtag("event", event, Object.assign({ send_to: measurementId }, params,
        debug ? { debug_mode: true } : {}));
    } catch (_) { /* Analytics never interrupts shopping. */ }
  };
  document.addEventListener("click", function (event) {
    const link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (!["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) return;
    // Never send the phone number, URL query, or message text.
    window.ganaderaTrack("whatsapp_click", {
      source: link.id === "wsp-float" ? "floating_button" : "link",
      has_cart: false
    });
  });
})();
